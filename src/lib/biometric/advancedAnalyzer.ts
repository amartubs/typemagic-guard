
import { KeyTiming, KeystrokePattern, BiometricProfile, AuthenticationResult } from '@/lib/types';

export interface FraudIndicators {
  suspiciousTimingPatterns: boolean;
  unusualKeySequences: boolean;
  machineGeneratedPattern: boolean;
  copyPasteDetected: boolean;
  multipleSessionsDetected: boolean;
  deviceMismatch: boolean;
}

export interface AnalysisMetrics {
  dwellTimeConsistency: number;
  flightTimeConsistency: number;
  rhythmVariability: number;
  errorPatternMatch: number;
  speedConsistency: number;
  overallConfidence: number;
}

export class AdvancedBiometricAnalyzer {
  private static readonly MACHINE_TYPING_THRESHOLD = 5; // ms
  private static readonly HUMAN_MIN_VARIATION = 15; // ms
  private static readonly COPY_PASTE_SPEED_THRESHOLD = 300; // WPM

  static analyzePatternWithFraudDetection(
    profile: BiometricProfile, 
    newPattern: KeystrokePattern,
    deviceFingerprint?: string
  ): AuthenticationResult & { fraudIndicators: FraudIndicators; metrics: AnalysisMetrics } {
    const metrics = this.calculateDetailedMetrics(profile, newPattern);
    const fraudIndicators = this.detectFraudIndicators(newPattern, deviceFingerprint);
    
    // Base confidence from pattern matching
    let confidence = this.calculateAdvancedConfidence(profile, newPattern, metrics);
    
    // Apply fraud detection penalties
    confidence = this.applyFraudPenalties(confidence, fraudIndicators);
    
    // Apply continuous learning adjustments
    confidence = this.applyContinuousLearning(profile, newPattern, confidence);

    const result: AuthenticationResult = {
      success: confidence >= profile.confidenceScore && !this.hasCriticalFraudIndicators(fraudIndicators),
      confidenceScore: Math.round(confidence),
      timestamp: Date.now(),
      userId: profile.userId,
      patternId: newPattern.patternId,
      anomalyDetails: confidence < profile.confidenceScore * 0.8 ? this.generateAnomalyDetails(metrics, fraudIndicators) : undefined
    };

    return {
      ...result,
      fraudIndicators,
      metrics
    };
  }

  private static calculateDetailedMetrics(profile: BiometricProfile, newPattern: KeystrokePattern): AnalysisMetrics {
    if (profile.keystrokePatterns.length === 0) {
      return {
        dwellTimeConsistency: 0.5,
        flightTimeConsistency: 0.5,
        rhythmVariability: 0.5,
        errorPatternMatch: 0.5,
        speedConsistency: 0.5,
        overallConfidence: 0.5
      };
    }

    const dwellTimeConsistency = this.analyzeDwellTimeConsistency(profile, newPattern);
    const flightTimeConsistency = this.analyzeFlightTimeConsistency(profile, newPattern);
    const rhythmVariability = this.analyzeRhythmVariability(profile, newPattern);
    const errorPatternMatch = this.analyzeErrorPatterns(profile, newPattern);
    const speedConsistency = this.analyzeSpeedConsistency(profile, newPattern);

    const overallConfidence = (
      dwellTimeConsistency * 0.25 +
      flightTimeConsistency * 0.25 +
      rhythmVariability * 0.20 +
      errorPatternMatch * 0.15 +
      speedConsistency * 0.15
    );

    return {
      dwellTimeConsistency,
      flightTimeConsistency,
      rhythmVariability,
      errorPatternMatch,
      speedConsistency,
      overallConfidence
    };
  }

  private static analyzeDwellTimeConsistency(profile: BiometricProfile, newPattern: KeystrokePattern): number {
    const keyStats = this.buildKeyStatistics(profile.keystrokePatterns);
    let totalScore = 0;
    let scoredKeys = 0;

    newPattern.timings.forEach(timing => {
      if (timing.duration && keyStats[timing.key]) {
        const { mean, stdDev, samples } = keyStats[timing.key];
        if (samples >= 3) {
          const zScore = Math.abs(timing.duration - mean) / Math.max(stdDev, 10);
          const keyScore = Math.max(0, 1 - (zScore / 2.5)); // More lenient than before
          totalScore += keyScore;
          scoredKeys++;
        }
      }
    });

    return scoredKeys > 0 ? totalScore / scoredKeys : 0.5;
  }

  private static analyzeFlightTimeConsistency(profile: BiometricProfile, newPattern: KeystrokePattern): number {
    const digramStats = this.buildDigramStatistics(profile.keystrokePatterns);
    let totalScore = 0;
    let scoredDigrams = 0;

    for (let i = 1; i < newPattern.timings.length; i++) {
      const current = newPattern.timings[i];
      const previous = newPattern.timings[i - 1];
      
      if (previous.releaseTime && current.pressTime) {
        const digram = `${previous.key}-${current.key}`;
        const flightTime = current.pressTime - previous.releaseTime;
        
        if (digramStats[digram]) {
          const { mean, stdDev, samples } = digramStats[digram];
          if (samples >= 2) {
            const zScore = Math.abs(flightTime - mean) / Math.max(stdDev, 20);
            const digramScore = Math.max(0, 1 - (zScore / 2));
            totalScore += digramScore;
            scoredDigrams++;
          }
        }
      }
    }

    return scoredDigrams > 0 ? totalScore / scoredDigrams : 0.5;
  }

  private static analyzeRhythmVariability(profile: BiometricProfile, newPattern: KeystrokePattern): number {
    const profileRhythm = this.calculateAverageRhythm(profile.keystrokePatterns);
    const newRhythm = this.calculatePatternRhythm(newPattern);
    
    if (profileRhythm.length === 0 || newRhythm.length === 0) return 0.5;
    
    const rhythmSimilarity = this.compareRhythmArrays(profileRhythm, newRhythm);
    return Math.max(0, Math.min(1, rhythmSimilarity));
  }

  private static analyzeErrorPatterns(profile: BiometricProfile, newPattern: KeystrokePattern): number {
    const profileErrorRate = this.calculateErrorRate(profile.keystrokePatterns);
    const newErrorRate = this.calculatePatternErrorRate(newPattern);
    
    const errorDifference = Math.abs(profileErrorRate - newErrorRate);
    return Math.max(0, 1 - (errorDifference / 0.2)); // Allow up to 20% difference
  }

  private static analyzeSpeedConsistency(profile: BiometricProfile, newPattern: KeystrokePattern): number {
    const profileSpeed = this.calculateAverageSpeed(profile.keystrokePatterns);
    const newSpeed = this.calculatePatternSpeed(newPattern);
    
    if (profileSpeed === 0 || newSpeed === 0) return 0.5;
    
    const speedRatio = newSpeed / profileSpeed;
    // Allow 40% speed variation
    const similarity = speedRatio > 1 
      ? Math.max(0, 1 - (speedRatio - 1) / 0.4)
      : Math.max(0, 1 - (1 - speedRatio) / 0.4);
    
    return similarity;
  }

  private static detectFraudIndicators(pattern: KeystrokePattern, deviceFingerprint?: string): FraudIndicators {
    return {
      suspiciousTimingPatterns: this.detectSuspiciousTimings(pattern),
      unusualKeySequences: this.detectUnusualSequences(pattern),
      machineGeneratedPattern: this.detectMachineGenerated(pattern),
      copyPasteDetected: this.detectCopyPaste(pattern),
      multipleSessionsDetected: false, // Would require session tracking
      deviceMismatch: deviceFingerprint ? this.detectDeviceMismatch(deviceFingerprint) : false
    };
  }

  private static detectSuspiciousTimings(pattern: KeystrokePattern): boolean {
    let perfectTimings = 0;
    let totalTimings = 0;

    pattern.timings.forEach(timing => {
      if (timing.duration) {
        totalTimings++;
        // Check for suspiciously consistent timings
        if (timing.duration % 10 === 0 && timing.duration < this.MACHINE_TYPING_THRESHOLD) {
          perfectTimings++;
        }
      }
    });

    return totalTimings > 5 && (perfectTimings / totalTimings) > 0.7;
  }

  private static detectUnusualSequences(pattern: KeystrokePattern): boolean {
    const keys = pattern.timings.map(t => t.key);
    const keyString = keys.join('');
    
    // Check for repetitive patterns
    const repeatingPattern = /(.{2,})\1{3,}/.test(keyString);
    
    // Check for alphabetical sequences
    const alphabeticalPattern = /abcdefg|qwerty|asdfgh|zxcvbn/.test(keyString.toLowerCase());
    
    return repeatingPattern || alphabeticalPattern;
  }

  private static detectMachineGenerated(pattern: KeystrokePattern): boolean {
    if (pattern.timings.length < 5) return false;

    let consistentTimings = 0;
    const durations = pattern.timings.filter(t => t.duration).map(t => t.duration!);
    
    for (let i = 1; i < durations.length; i++) {
      const diff = Math.abs(durations[i] - durations[i - 1]);
      if (diff < this.HUMAN_MIN_VARIATION) {
        consistentTimings++;
      }
    }

    return (consistentTimings / durations.length) > 0.8;
  }

  private static detectCopyPaste(pattern: KeystrokePattern): boolean {
    if (pattern.timings.length < 10) return false;

    const speed = this.calculatePatternSpeed(pattern);
    return speed > this.COPY_PASTE_SPEED_THRESHOLD;
  }

  private static detectDeviceMismatch(deviceFingerprint: string): boolean {
    // Simple device fingerprint check - in production, this would be more sophisticated
    return false; // Placeholder implementation
  }

  private static calculateAdvancedConfidence(
    profile: BiometricProfile, 
    newPattern: KeystrokePattern, 
    metrics: AnalysisMetrics
  ): number {
    // Start with a base confidence
    let confidence = 50;
    
    // Weight the metrics based on their reliability
    confidence += metrics.dwellTimeConsistency * 25;
    confidence += metrics.flightTimeConsistency * 20;
    confidence += metrics.rhythmVariability * 15;
    confidence += metrics.errorPatternMatch * 10;
    confidence += metrics.speedConsistency * 10;
    
    // Apply learning curve bonus for established profiles
    if (profile.keystrokePatterns.length >= 10) {
      confidence += 5; // Bonus for well-established profiles
    }
    
    return Math.max(0, Math.min(100, confidence));
  }

  private static applyFraudPenalties(confidence: number, fraudIndicators: FraudIndicators): number {
    let penalty = 0;
    
    if (fraudIndicators.machineGeneratedPattern) penalty += 30;
    if (fraudIndicators.copyPasteDetected) penalty += 25;
    if (fraudIndicators.suspiciousTimingPatterns) penalty += 20;
    if (fraudIndicators.unusualKeySequences) penalty += 15;
    if (fraudIndicators.deviceMismatch) penalty += 10;
    if (fraudIndicators.multipleSessionsDetected) penalty += 5;
    
    return Math.max(0, confidence - penalty);
  }

  private static applyContinuousLearning(
    profile: BiometricProfile, 
    newPattern: KeystrokePattern, 
    confidence: number
  ): number {
    // If this is a learning profile, be more lenient
    if (profile.status === 'learning' && profile.keystrokePatterns.length < 5) {
      return Math.max(confidence, profile.confidenceScore * 0.7);
    }
    
    // For established profiles, apply adaptive thresholds
    if (profile.keystrokePatterns.length >= 20) {
      const recentPatterns = profile.keystrokePatterns.slice(-10);
      const recentVariability = this.calculatePatternVariability(recentPatterns);
      
      // If user has been consistent recently, be slightly more lenient
      if (recentVariability < 0.15) {
        confidence += 2;
      }
    }
    
    return confidence;
  }

  private static hasCriticalFraudIndicators(fraudIndicators: FraudIndicators): boolean {
    return fraudIndicators.machineGeneratedPattern || 
           fraudIndicators.copyPasteDetected ||
           (fraudIndicators.suspiciousTimingPatterns && fraudIndicators.unusualKeySequences);
  }

  private static generateAnomalyDetails(metrics: AnalysisMetrics, fraudIndicators: FraudIndicators) {
    const fields = [];
    const issues = [];
    
    if (metrics.dwellTimeConsistency < 0.6) {
      fields.push('key_press_duration');
      issues.push('Unusual key press durations detected');
    }
    
    if (metrics.flightTimeConsistency < 0.6) {
      fields.push('typing_rhythm');
      issues.push('Irregular typing rhythm observed');
    }
    
    if (fraudIndicators.machineGeneratedPattern) {
      fields.push('authenticity');
      issues.push('Potential automated input detected');
    }
    
    if (fraudIndicators.copyPasteDetected) {
      fields.push('input_method');
      issues.push('Copy-paste behavior detected');
    }

    let severity: 'low' | 'medium' | 'high' = 'low';
    if (fraudIndicators.machineGeneratedPattern || fraudIndicators.copyPasteDetected) {
      severity = 'high';
    } else if (metrics.overallConfidence < 0.4) {
      severity = 'medium';
    }

    return {
      fields: fields.length > 0 ? fields : ['overall_pattern'],
      severity,
      description: issues.length > 0 ? issues.join('; ') : 'Typing pattern differs from established profile'
    };
  }

  // Helper methods for calculations
  private static buildKeyStatistics(patterns: KeystrokePattern[]) {
    const keyData: Record<string, number[]> = {};
    
    patterns.forEach(pattern => {
      pattern.timings.forEach(timing => {
        if (timing.duration) {
          if (!keyData[timing.key]) keyData[timing.key] = [];
          keyData[timing.key].push(timing.duration);
        }
      });
    });
    
    const stats: Record<string, { mean: number; stdDev: number; samples: number }> = {};
    
    Object.entries(keyData).forEach(([key, durations]) => {
      if (durations.length >= 2) {
        const mean = durations.reduce((sum, d) => sum + d, 0) / durations.length;
        const variance = durations.reduce((sum, d) => sum + Math.pow(d - mean, 2), 0) / durations.length;
        const stdDev = Math.sqrt(variance);
        
        stats[key] = { mean, stdDev, samples: durations.length };
      }
    });
    
    return stats;
  }

  private static buildDigramStatistics(patterns: KeystrokePattern[]) {
    const digramData: Record<string, number[]> = {};
    
    patterns.forEach(pattern => {
      for (let i = 1; i < pattern.timings.length; i++) {
        const current = pattern.timings[i];
        const previous = pattern.timings[i - 1];
        
        if (previous.releaseTime && current.pressTime) {
          const digram = `${previous.key}-${current.key}`;
          const flightTime = current.pressTime - previous.releaseTime;
          
          if (!digramData[digram]) digramData[digram] = [];
          digramData[digram].push(flightTime);
        }
      }
    });
    
    const stats: Record<string, { mean: number; stdDev: number; samples: number }> = {};
    
    Object.entries(digramData).forEach(([digram, times]) => {
      if (times.length >= 2) {
        const mean = times.reduce((sum, t) => sum + t, 0) / times.length;
        const variance = times.reduce((sum, t) => sum + Math.pow(t - mean, 2), 0) / times.length;
        const stdDev = Math.sqrt(variance);
        
        stats[digram] = { mean, stdDev, samples: times.length };
      }
    });
    
    return stats;
  }

  private static calculateAverageRhythm(patterns: KeystrokePattern[]): number[] {
    if (patterns.length === 0) return [];
    
    const rhythms = patterns.map(pattern => this.calculatePatternRhythm(pattern));
    const maxLength = Math.max(...rhythms.map(r => r.length));
    
    const avgRhythm: number[] = [];
    for (let i = 0; i < maxLength; i++) {
      const values = rhythms.map(r => r[i]).filter(v => v !== undefined);
      if (values.length > 0) {
        avgRhythm[i] = values.reduce((sum, v) => sum + v, 0) / values.length;
      }
    }
    
    return avgRhythm;
  }

  private static calculatePatternRhythm(pattern: KeystrokePattern): number[] {
    const rhythm: number[] = [];
    
    for (let i = 1; i < pattern.timings.length; i++) {
      const current = pattern.timings[i];
      const previous = pattern.timings[i - 1];
      
      if (previous.pressTime && current.pressTime) {
        rhythm.push(current.pressTime - previous.pressTime);
      }
    }
    
    return rhythm;
  }

  private static compareRhythmArrays(rhythm1: number[], rhythm2: number[]): number {
    const minLength = Math.min(rhythm1.length, rhythm2.length);
    if (minLength === 0) return 0;
    
    let totalSimilarity = 0;
    
    for (let i = 0; i < minLength; i++) {
      const diff = Math.abs(rhythm1[i] - rhythm2[i]);
      const maxVal = Math.max(rhythm1[i], rhythm2[i]);
      const similarity = maxVal > 0 ? Math.max(0, 1 - (diff / maxVal)) : 1;
      totalSimilarity += similarity;
    }
    
    return totalSimilarity / minLength;
  }

  private static calculateErrorRate(patterns: KeystrokePattern[]): number {
    let totalKeys = 0;
    let backspaceCount = 0;
    
    patterns.forEach(pattern => {
      pattern.timings.forEach(timing => {
        totalKeys++;
        if (timing.key === 'Backspace') {
          backspaceCount++;
        }
      });
    });
    
    return totalKeys > 0 ? backspaceCount / totalKeys : 0;
  }

  private static calculatePatternErrorRate(pattern: KeystrokePattern): number {
    const backspaceCount = pattern.timings.filter(t => t.key === 'Backspace').length;
    return pattern.timings.length > 0 ? backspaceCount / pattern.timings.length : 0;
  }

  private static calculateAverageSpeed(patterns: KeystrokePattern[]): number {
    if (patterns.length === 0) return 0;
    
    const speeds = patterns.map(pattern => this.calculatePatternSpeed(pattern)).filter(s => s > 0);
    return speeds.length > 0 ? speeds.reduce((sum, s) => sum + s, 0) / speeds.length : 0;
  }

  private static calculatePatternSpeed(pattern: KeystrokePattern): number {
    if (pattern.timings.length < 2) return 0;
    
    const startTime = pattern.timings[0].pressTime;
    const endTime = pattern.timings[pattern.timings.length - 1].pressTime;
    const timeSpanMinutes = (endTime - startTime) / 60000;
    
    if (timeSpanMinutes <= 0) return 0;
    
    // Calculate WPM (assuming 5 characters per word)
    return (pattern.timings.length / 5) / timeSpanMinutes;
  }

  private static calculatePatternVariability(patterns: KeystrokePattern[]): number {
    if (patterns.length < 2) return 0;
    
    const speeds = patterns.map(p => this.calculatePatternSpeed(p)).filter(s => s > 0);
    if (speeds.length < 2) return 0;
    
    const avgSpeed = speeds.reduce((sum, s) => sum + s, 0) / speeds.length;
    const variance = speeds.reduce((sum, s) => sum + Math.pow(s - avgSpeed, 2), 0) / speeds.length;
    const stdDev = Math.sqrt(variance);
    
    return avgSpeed > 0 ? stdDev / avgSpeed : 0; // Coefficient of variation
  }
}
