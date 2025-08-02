import { supabase } from '@/integrations/supabase/client';
import { 
  RiskAssessment, 
  SecurityContext, 
  AdaptiveSecurityConfig, 
  AuthenticationLevel,
  RiskFactor,
  BiometricSample,
  BiometricModality
} from '@/types/advancedAuth';

export class AdaptiveSecurityEngine {
  private static readonly RISK_WEIGHTS = {
    time_anomaly: 15,
    location_anomaly: 25,
    device_change: 30,
    behavior_deviation: 20,
    failed_attempts: 40
  };

  private static readonly AUTHENTICATION_THRESHOLDS = {
    low: 30,
    medium: 50,
    high: 70,
    critical: 85
  };

  static async assessRisk(
    userId: string,
    sessionId: string,
    context: SecurityContext,
    biometricSamples: BiometricSample[]
  ): Promise<RiskAssessment> {
    try {
      const config = await this.getSecurityConfig(userId);
      const riskFactors: RiskFactor[] = [];
      let riskScore = 0;

      // Analyze time patterns
      const timeRisk = await this.analyzeTimeAnomaly(userId, context.time_of_day, context.day_of_week);
      if (timeRisk > 0.3) {
        riskFactors.push('time_anomaly');
        riskScore += this.RISK_WEIGHTS.time_anomaly * timeRisk;
      }

      // Analyze location
      if (!context.is_known_location) {
        riskFactors.push('location_anomaly');
        riskScore += this.RISK_WEIGHTS.location_anomaly * 0.8;
      }

      // Analyze device
      if (!context.is_known_device) {
        riskFactors.push('device_change');
        riskScore += this.RISK_WEIGHTS.device_change * 0.9;
      }

      // Analyze biometric behavior
      const behaviorRisk = await this.analyzeBehaviorDeviation(userId, biometricSamples);
      if (behaviorRisk > 0.4) {
        riskFactors.push('behavior_deviation');
        riskScore += this.RISK_WEIGHTS.behavior_deviation * behaviorRisk;
      }

      // Check recent failed attempts
      const failedAttempts = await this.getRecentFailedAttempts(userId);
      if (failedAttempts > 2) {
        riskFactors.push('failed_attempts');
        riskScore += this.RISK_WEIGHTS.failed_attempts * Math.min(failedAttempts / 5, 1);
      }

      // Calculate overall confidence from biometric samples
      const confidence = this.calculateConfidence(biometricSamples);
      
      // Adjust risk based on confidence
      riskScore = riskScore * (1 - confidence / 100);
      riskScore = Math.min(100, Math.max(0, riskScore));

      const authLevel = this.determineAuthenticationLevel(riskScore);
      const actionRequired = this.determineRequiredAction(riskScore, config);

      const assessment: RiskAssessment = {
        id: crypto.randomUUID(),
        user_id: userId,
        session_id: sessionId,
        risk_score: Math.round(riskScore),
        risk_factors: riskFactors,
        confidence_score: Math.round(confidence),
        authentication_level: authLevel,
        action_required: actionRequired,
        timestamp: new Date().toISOString(),
        context: context as any
      };

      // Store assessment
      await this.storeRiskAssessment(assessment);

      return assessment;
    } catch (error) {
      console.error('Error assessing risk:', error);
      throw error;
    }
  }

  private static async getSecurityConfig(userId: string): Promise<AdaptiveSecurityConfig> {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('setting_value')
      .eq('user_id', userId)
      .eq('setting_key', 'adaptive_security_config')
      .maybeSingle();

    if (error) throw error;

    if (data?.setting_value) {
      return data.setting_value as any as AdaptiveSecurityConfig;
    }

    // Return default config
    return {
      id: crypto.randomUUID(),
      user_id: userId,
      min_authentication_level: 'medium',
      risk_tolerance: 50,
      adaptive_learning: true,
      challenge_escalation: true,
      session_timeout_minutes: 30,
      max_risk_score: 70,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  private static async analyzeTimeAnomaly(
    userId: string, 
    currentHour: number, 
    currentDay: number
  ): Promise<number> {
    try {
      // Get user's typical usage patterns
      const { data: patterns } = await supabase
        .from('usage_analytics')
        .select('event_data, created_at')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(1000);

      if (!patterns || patterns.length < 10) return 0;

      const hourCounts = new Array(24).fill(0);
      const dayCounts = new Array(7).fill(0);

      patterns.forEach(pattern => {
        const date = new Date(pattern.created_at);
        hourCounts[date.getHours()]++;
        dayCounts[date.getDay()]++;
      });

      const totalSessions = patterns.length;
      const currentHourFreq = hourCounts[currentHour] / totalSessions;
      const currentDayFreq = dayCounts[currentDay] / totalSessions;

      // Calculate anomaly score (lower frequency = higher risk)
      const hourAnomaly = Math.max(0, 1 - currentHourFreq * 10);
      const dayAnomaly = Math.max(0, 1 - currentDayFreq * 7);

      return (hourAnomaly + dayAnomaly) / 2;
    } catch (error) {
      console.error('Error analyzing time anomaly:', error);
      return 0;
    }
  }

  private static async analyzeBehaviorDeviation(
    userId: string,
    samples: BiometricSample[]
  ): Promise<number> {
    try {
      const modalityDeviations: number[] = [];

      for (const sample of samples) {
        const baseline = await this.getModalityBaseline(userId, sample.modality);
        if (baseline) {
          const deviation = this.calculateDeviation(sample, baseline);
          modalityDeviations.push(deviation);
        }
      }

      return modalityDeviations.length > 0 
        ? modalityDeviations.reduce((a, b) => a + b, 0) / modalityDeviations.length
        : 0;
    } catch (error) {
      console.error('Error analyzing behavior deviation:', error);
      return 0;
    }
  }

  private static async getModalityBaseline(userId: string, modality: BiometricModality) {
    try {
      let data: any[] = [];
      
      if (modality === 'keystroke') {
        const result = await supabase
          .from('keystroke_patterns')
          .select('pattern_data, confidence_score')
          .eq('user_id', userId)
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false })
          .limit(50);
        data = result.data || [];
      } else if (modality === 'mouse') {
        const result = await supabase
          .from('mouse_patterns')
          .select('pattern_data, confidence_score')
          .eq('user_id', userId)
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false })
          .limit(50);
        data = result.data || [];
      } else if (modality === 'behavioral') {
        const result = await supabase
          .from('behavioral_patterns')
          .select('pattern_data, confidence_score')
          .eq('user_id', userId)
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false })
          .limit(50);
        data = result.data || [];
      }

      return data && data.length > 10 ? data : null;
    } catch (error) {
      console.error(`Error getting ${modality} baseline:`, error);
      return null;
    }
  }

  private static calculateDeviation(sample: BiometricSample, baseline: any[]): number {
    // Simplified deviation calculation
    const avgConfidence = baseline.reduce((sum, b) => sum + (b.confidence_score || 0), 0) / baseline.length;
    return Math.abs(sample.confidence - avgConfidence) / 100;
  }

  private static async getRecentFailedAttempts(userId: string): Promise<number> {
    const { data } = await supabase
      .from('authentication_attempts')
      .select('id')
      .eq('user_id', userId)
      .eq('success', false)
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()); // Last hour

    return data?.length || 0;
  }

  private static calculateConfidence(samples: BiometricSample[]): number {
    if (samples.length === 0) return 0;
    
    const totalConfidence = samples.reduce((sum, sample) => sum + sample.confidence, 0);
    return totalConfidence / samples.length;
  }

  private static determineAuthenticationLevel(riskScore: number): AuthenticationLevel {
    if (riskScore >= this.AUTHENTICATION_THRESHOLDS.critical) return 'critical';
    if (riskScore >= this.AUTHENTICATION_THRESHOLDS.high) return 'high';
    if (riskScore >= this.AUTHENTICATION_THRESHOLDS.medium) return 'medium';
    return 'low';
  }

  private static determineRequiredAction(
    riskScore: number, 
    config: AdaptiveSecurityConfig
  ): RiskAssessment['action_required'] {
    if (riskScore >= config.max_risk_score) return 'block';
    if (riskScore >= this.AUTHENTICATION_THRESHOLDS.high) return 'challenge';
    if (riskScore >= this.AUTHENTICATION_THRESHOLDS.medium && config.challenge_escalation) return 'challenge';
    return 'none';
  }

  private static async storeRiskAssessment(assessment: RiskAssessment): Promise<void> {
    await supabase
      .from('admin_settings')
      .insert({
        user_id: assessment.user_id,
        setting_key: `risk_assessment_${assessment.id}`,
        setting_value: assessment as any
      });
  }

  static async getSecurityConfigForUser(userId: string): Promise<AdaptiveSecurityConfig> {
    return this.getSecurityConfig(userId);
  }

  static async updateSecurityConfig(
    userId: string, 
    config: Partial<AdaptiveSecurityConfig>
  ): Promise<AdaptiveSecurityConfig> {
    const existing = await this.getSecurityConfig(userId);
    const updated = { ...existing, ...config, updated_at: new Date().toISOString() };

    await supabase
      .from('admin_settings')
      .upsert({
        user_id: userId,
        setting_key: 'adaptive_security_config',
        setting_value: updated as any
      });

    return updated;
  }
}