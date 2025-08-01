import { supabase } from '@/integrations/supabase/client';
import { BiometricProfile, KeystrokePattern } from '@/lib/types';
import { LegalGradeAuditLogger } from '@/lib/security/legalGradeAuditLogger';
import { ComplianceStandard } from '@/types/compliance';

export interface SessionBehavior {
  typing_speed: number;
  typing_rhythm: number[];
  pause_patterns: number[];
  error_rate: number;
  backspace_frequency: number;
  session_duration: number;
  active_periods: number[];
  idle_periods: number[];
}

export interface BehavioralDeviation {
  type: 'speed_deviation' | 'rhythm_change' | 'error_spike' | 'session_sharing' | 'coercion_indicator';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  description: string;
  evidence: any;
  timestamp: string;
}

export interface TrustScore {
  current_score: number;
  baseline_score: number;
  factors: {
    behavioral_consistency: number;
    session_legitimacy: number;
    device_trust: number;
    time_context: number;
  };
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

export class AdvancedSessionMonitor {
  private static sessionData: Map<string, SessionBehavior> = new Map();
  private static baselineProfiles: Map<string, BiometricProfile> = new Map();
  
  static async initializeSession(userId: string): Promise<void> {
    try {
      // Get user's baseline biometric profile
      const { data: profile, error } = await supabase
        .from('biometric_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!error && profile) {
        // Transform database profile to BiometricProfile format
        const biometricProfile: BiometricProfile = {
          userId: profile.user_id,
          keystrokePatterns: [], // Would be loaded separately
          confidenceScore: profile.confidence_score,
          status: profile.status,
          lastUpdated: new Date(profile.last_updated).getTime()
        };
        this.baselineProfiles.set(userId, biometricProfile);
      }

      // Initialize session behavior tracking
      this.sessionData.set(userId, {
        typing_speed: 0,
        typing_rhythm: [],
        pause_patterns: [],
        error_rate: 0,
        backspace_frequency: 0,
        session_duration: 0,
        active_periods: [],
        idle_periods: []
      });

      await LegalGradeAuditLogger.logLegalEvent({
        userId,
        action: 'session_initiated',
        resourceType: 'session',
        compliance_standards: ['GDPR'],
        legal_significance: 'low',
        details: {
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent
        }
      });
    } catch (error) {
      console.error('Error initializing session:', error);
    }
  }

  static updateSessionBehavior(userId: string, keystrokeData: KeystrokePattern): void {
    const session = this.sessionData.get(userId);
    if (!session) return;

    // Update typing metrics
    session.typing_speed = this.calculateTypingSpeed(keystrokeData);
    session.typing_rhythm.push(...this.extractRhythmPattern(keystrokeData));
    session.pause_patterns.push(...this.extractPausePattern(keystrokeData));
    
    // Keep only recent data (last 100 entries)
    if (session.typing_rhythm.length > 100) {
      session.typing_rhythm = session.typing_rhythm.slice(-100);
    }
    if (session.pause_patterns.length > 100) {
      session.pause_patterns = session.pause_patterns.slice(-100);
    }

    this.sessionData.set(userId, session);
  }

  static async detectBehavioralDeviations(
    userId: string,
    complianceStandards: ComplianceStandard[]
  ): Promise<BehavioralDeviation[]> {
    const session = this.sessionData.get(userId);
    const baseline = this.baselineProfiles.get(userId);
    
    if (!session || !baseline) return [];

    const deviations: BehavioralDeviation[] = [];

    // Detect typing speed deviations
    const speedDeviation = this.detectSpeedDeviation(session, baseline);
    if (speedDeviation) deviations.push(speedDeviation);

    // Detect rhythm changes
    const rhythmDeviation = this.detectRhythmDeviation(session, baseline);
    if (rhythmDeviation) deviations.push(rhythmDeviation);

    // Detect potential session sharing
    const sessionSharingIndicator = this.detectSessionSharing(session);
    if (sessionSharingIndicator) deviations.push(sessionSharingIndicator);

    // Detect coercion indicators
    const coercionIndicator = this.detectCoercionIndicators(session);
    if (coercionIndicator) deviations.push(coercionIndicator);

    // Log significant deviations
    for (const deviation of deviations) {
      if (deviation.severity === 'high' || deviation.severity === 'critical') {
        await LegalGradeAuditLogger.logLegalEvent({
          userId,
          action: 'behavioral_deviation_detected',
          resourceType: 'security',
          compliance_standards: complianceStandards,
          legal_significance: deviation.severity === 'critical' ? 'critical' : 'high',
          details: deviation
        });
      }
    }

    return deviations;
  }

  static calculateAdaptiveTrustScore(
    userId: string,
    contextSensitivity: 'low' | 'medium' | 'high' | 'critical'
  ): TrustScore {
    const session = this.sessionData.get(userId);
    const baseline = this.baselineProfiles.get(userId);
    
    if (!session || !baseline) {
      return {
        current_score: 0,
        baseline_score: 0,
        factors: {
          behavioral_consistency: 0,
          session_legitimacy: 0,
          device_trust: 0,
          time_context: 0
        },
        risk_level: 'critical',
        recommendations: ['Unable to calculate trust score - insufficient data']
      };
    }

    // Calculate individual factors
    const behavioralConsistency = this.calculateBehavioralConsistency(session, baseline);
    const sessionLegitimacy = this.calculateSessionLegitimacy(session);
    const deviceTrust = this.calculateDeviceTrust(userId);
    const timeContext = this.calculateTimeContext();

    // Weight factors based on context sensitivity
    const weights = this.getContextWeights(contextSensitivity);
    
    const currentScore = Math.round(
      behavioralConsistency * weights.behavioral +
      sessionLegitimacy * weights.session +
      deviceTrust * weights.device +
      timeContext * weights.time
    );

    const riskLevel = this.determineRiskLevel(currentScore, contextSensitivity);
    
    return {
      current_score: currentScore,
      baseline_score: baseline.confidenceScore,
      factors: {
        behavioral_consistency: Math.round(behavioralConsistency),
        session_legitimacy: Math.round(sessionLegitimacy),
        device_trust: Math.round(deviceTrust),
        time_context: Math.round(timeContext)
      },
      risk_level: riskLevel,
      recommendations: this.generateRecommendations(currentScore, riskLevel)
    };
  }

  private static calculateTypingSpeed(pattern: KeystrokePattern): number {
    if (!pattern.timings || pattern.timings.length === 0) return 0;
    
    const totalTime = pattern.timings.reduce((sum, timing) => {
      const duration = timing.duration || 0;
      return sum + duration;
    }, 0);
    const charactersPerMinute = totalTime > 0 ? (pattern.timings.length / totalTime) * 60000 : 0;
    return Math.round(charactersPerMinute);
  }

  private static extractRhythmPattern(pattern: KeystrokePattern): number[] {
    if (!pattern.timings) return [];
    return pattern.timings.map(t => t.duration || 0);
  }

  private static extractPausePattern(pattern: KeystrokePattern): number[] {
    if (!pattern.timings) return [];
    // Calculate pauses between keystrokes
    const pauses: number[] = [];
    for (let i = 1; i < pattern.timings.length; i++) {
      const pause = pattern.timings[i].pressTime - (pattern.timings[i-1].releaseTime || pattern.timings[i-1].pressTime);
      if (pause > 200) pauses.push(pause); // Pauses > 200ms
    }
    return pauses;
  }

  private static detectSpeedDeviation(session: SessionBehavior, baseline: BiometricProfile): BehavioralDeviation | null {
    // Simple baseline comparison - in production, this would be more sophisticated
    const expectedSpeed = 150; // Average WPM baseline
    const deviation = Math.abs(session.typing_speed - expectedSpeed) / expectedSpeed;
    
    if (deviation > 0.5) {
      return {
        type: 'speed_deviation',
        severity: deviation > 0.8 ? 'critical' : 'high',
        confidence: Math.min(90, deviation * 100),
        description: `Typing speed deviation detected: ${session.typing_speed} WPM vs expected ${expectedSpeed} WPM`,
        evidence: { current_speed: session.typing_speed, expected_speed: expectedSpeed },
        timestamp: new Date().toISOString()
      };
    }
    
    return null;
  }

  private static detectRhythmDeviation(session: SessionBehavior, baseline: BiometricProfile): BehavioralDeviation | null {
    if (session.typing_rhythm.length < 10) return null;
    
    // Calculate rhythm variance
    const avg = session.typing_rhythm.reduce((a, b) => a + b, 0) / session.typing_rhythm.length;
    const variance = session.typing_rhythm.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / session.typing_rhythm.length;
    
    if (variance > 10000) { // High variance threshold
      return {
        type: 'rhythm_change',
        severity: 'medium',
        confidence: 75,
        description: 'Significant change in typing rhythm detected',
        evidence: { variance, average: avg },
        timestamp: new Date().toISOString()
      };
    }
    
    return null;
  }

  private static detectSessionSharing(session: SessionBehavior): BehavioralDeviation | null {
    // Look for rapid alternations in typing patterns that might indicate multiple users
    if (session.typing_rhythm.length < 20) return null;
    
    const recentRhythm = session.typing_rhythm.slice(-20);
    const segments = this.segmentRhythm(recentRhythm);
    
    if (segments.length > 2) {
      return {
        type: 'session_sharing',
        severity: 'critical',
        confidence: 85,
        description: 'Multiple distinct typing patterns detected within session',
        evidence: { segments: segments.length, patterns: segments },
        timestamp: new Date().toISOString()
      };
    }
    
    return null;
  }

  private static detectCoercionIndicators(session: SessionBehavior): BehavioralDeviation | null {
    // Look for stress indicators in typing patterns
    const avgPause = session.pause_patterns.length > 0 
      ? session.pause_patterns.reduce((a, b) => a + b, 0) / session.pause_patterns.length 
      : 0;
    
    if (avgPause > 1000) { // Very long pauses might indicate stress/coercion
      return {
        type: 'coercion_indicator',
        severity: 'high',
        confidence: 70,
        description: 'Unusual hesitation patterns detected, possible coercion indicator',
        evidence: { average_pause: avgPause, pause_count: session.pause_patterns.length },
        timestamp: new Date().toISOString()
      };
    }
    
    return null;
  }

  private static segmentRhythm(rhythm: number[]): number[][] {
    // Simple clustering to detect different typing patterns
    const segments: number[][] = [];
    let currentSegment: number[] = [];
    let lastValue = rhythm[0];
    
    for (const value of rhythm) {
      if (Math.abs(value - lastValue) > 100) { // Threshold for pattern change
        if (currentSegment.length > 0) {
          segments.push([...currentSegment]);
        }
        currentSegment = [value];
      } else {
        currentSegment.push(value);
      }
      lastValue = value;
    }
    
    if (currentSegment.length > 0) {
      segments.push(currentSegment);
    }
    
    return segments;
  }

  private static calculateBehavioralConsistency(session: SessionBehavior, baseline: BiometricProfile): number {
    // Compare current session against baseline patterns
    return Math.max(0, 100 - Math.abs(session.typing_speed - 150) / 2); // Simplified
  }

  private static calculateSessionLegitimacy(session: SessionBehavior): number {
    // Assess if session appears legitimate based on natural patterns
    return session.session_duration > 300000 ? 90 : 70; // Simplified
  }

  private static calculateDeviceTrust(userId: string): number {
    // Assess device trustworthiness
    return 85; // Simplified - would check device fingerprint, history, etc.
  }

  private static calculateTimeContext(): number {
    // Assess if access time is appropriate
    const hour = new Date().getHours();
    return hour >= 6 && hour <= 22 ? 90 : 70; // Business hours
  }

  private static getContextWeights(sensitivity: string) {
    const weights = {
      low: { behavioral: 0.3, session: 0.3, device: 0.2, time: 0.2 },
      medium: { behavioral: 0.4, session: 0.3, device: 0.2, time: 0.1 },
      high: { behavioral: 0.5, session: 0.3, device: 0.15, time: 0.05 },
      critical: { behavioral: 0.6, session: 0.25, device: 0.1, time: 0.05 }
    };
    return weights[sensitivity as keyof typeof weights] || weights.medium;
  }

  private static determineRiskLevel(score: number, sensitivity: string): 'low' | 'medium' | 'high' | 'critical' {
    const thresholds = {
      low: { low: 60, medium: 40, high: 20 },
      medium: { low: 70, medium: 50, high: 30 },
      high: { low: 80, medium: 60, high: 40 },
      critical: { low: 90, medium: 75, high: 60 }
    };
    
    const t = thresholds[sensitivity as keyof typeof thresholds] || thresholds.medium;
    
    if (score >= t.low) return 'low';
    if (score >= t.medium) return 'medium';
    if (score >= t.high) return 'high';
    return 'critical';
  }

  private static generateRecommendations(score: number, riskLevel: string): string[] {
    const recommendations: string[] = [];
    
    if (riskLevel === 'critical') {
      recommendations.push('Immediate additional authentication required');
      recommendations.push('Consider terminating session');
    } else if (riskLevel === 'high') {
      recommendations.push('Enhanced monitoring recommended');
      recommendations.push('Consider step-up authentication');
    } else if (riskLevel === 'medium') {
      recommendations.push('Continued monitoring');
    } else {
      recommendations.push('Normal operation');
    }
    
    return recommendations;
  }
}
