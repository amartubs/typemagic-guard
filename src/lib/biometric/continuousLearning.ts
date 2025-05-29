import { BiometricProfile, KeystrokePattern, AuthenticationResult } from '@/lib/types';
import { BiometricEncryption } from '@/lib/security/encryption';
import { supabase } from '@/integrations/supabase/client';

export interface LearningMetrics {
  adaptationRate: number;
  stabilityScore: number;
  improvementTrend: number;
  confidenceGrowth: number;
}

export class ContinuousLearningEngine {
  private static readonly MAX_PATTERNS_STORED = 50;
  private static readonly LEARNING_RATE = 0.1;
  private static readonly STABILITY_THRESHOLD = 0.85;
  private static readonly MIN_PATTERNS_FOR_STABILITY = 10;

  static async updateProfileWithLearning(
    profile: BiometricProfile,
    newPattern: KeystrokePattern,
    authResult: AuthenticationResult
  ): Promise<BiometricProfile> {
    // Only learn from successful authentications or high-confidence attempts
    if (!authResult.success && authResult.confidenceScore < 70) {
      return profile;
    }

    // Add new pattern to the profile
    const updatedPatterns = [...profile.keystrokePatterns, newPattern];
    
    // Apply pattern pruning to maintain optimal dataset size
    const prunedPatterns = this.prunePatterns(updatedPatterns);
    
    // Calculate new confidence score using adaptive learning
    const newConfidenceScore = this.calculateAdaptiveConfidence(prunedPatterns, profile);
    
    // Determine profile status based on learning progress
    const newStatus = this.determineProfileStatus(prunedPatterns, newConfidenceScore);
    
    // Store encrypted patterns in database (if we have the biometric_profile_id)
    const biometricProfileId = await this.getBiometricProfileId(newPattern.userId);
    if (biometricProfileId) {
      await this.storeEncryptedPattern(newPattern, biometricProfileId);
    }
    
    const updatedProfile: BiometricProfile = {
      ...profile,
      keystrokePatterns: prunedPatterns,
      confidenceScore: newConfidenceScore,
      status: newStatus,
      lastUpdated: Date.now()
    };

    // Update database
    await this.updateProfileInDatabase(updatedProfile);
    
    return updatedProfile;
  }

  private static async getBiometricProfileId(userId: string): Promise<string | null> {
    try {
      const { data } = await supabase
        .from('biometric_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      return data?.id || null;
    } catch (error) {
      console.error('Failed to get biometric profile ID:', error);
      return null;
    }
  }

  private static prunePatterns(patterns: KeystrokePattern[]): KeystrokePattern[] {
    if (patterns.length <= this.MAX_PATTERNS_STORED) {
      return patterns;
    }

    // Use intelligent pruning strategy
    return this.intelligentPruning(patterns);
  }

  private static intelligentPruning(patterns: KeystrokePattern[]): KeystrokePattern[] {
    // Sort patterns by timestamp (newest first)
    const sortedPatterns = patterns.sort((a, b) => b.timestamp - a.timestamp);
    
    // Always keep the most recent patterns
    const recentPatterns = sortedPatterns.slice(0, Math.floor(this.MAX_PATTERNS_STORED * 0.7));
    
    // Keep representative older patterns based on diversity
    const olderPatterns = sortedPatterns.slice(Math.floor(this.MAX_PATTERNS_STORED * 0.7));
    const diverseOlderPatterns = this.selectDiversePatterns(
      olderPatterns, 
      this.MAX_PATTERNS_STORED - recentPatterns.length
    );
    
    return [...recentPatterns, ...diverseOlderPatterns];
  }

  private static selectDiversePatterns(patterns: KeystrokePattern[], count: number): KeystrokePattern[] {
    if (patterns.length <= count) return patterns;
    
    const selected: KeystrokePattern[] = [];
    const remaining = [...patterns];
    
    // Select first pattern randomly
    const firstIndex = Math.floor(Math.random() * remaining.length);
    selected.push(remaining.splice(firstIndex, 1)[0]);
    
    // Select remaining patterns to maximize diversity
    while (selected.length < count && remaining.length > 0) {
      let maxDiversityIndex = 0;
      let maxDiversityScore = 0;
      
      remaining.forEach((pattern, index) => {
        const diversityScore = this.calculateDiversityScore(pattern, selected);
        if (diversityScore > maxDiversityScore) {
          maxDiversityScore = diversityScore;
          maxDiversityIndex = index;
        }
      });
      
      selected.push(remaining.splice(maxDiversityIndex, 1)[0]);
    }
    
    return selected;
  }

  private static calculateDiversityScore(pattern: KeystrokePattern, existingPatterns: KeystrokePattern[]): number {
    if (existingPatterns.length === 0) return 1;
    
    let totalDistance = 0;
    
    existingPatterns.forEach(existing => {
      // Calculate "distance" based on typing speed and timing patterns
      const speedDiff = Math.abs(this.calculateTypingSpeed(pattern) - this.calculateTypingSpeed(existing));
      const timingDiff = this.calculateTimingDifference(pattern, existing);
      
      totalDistance += speedDiff + timingDiff;
    });
    
    return totalDistance / existingPatterns.length;
  }

  private static calculateTypingSpeed(pattern: KeystrokePattern): number {
    if (pattern.timings.length < 2) return 0;
    
    const timeSpan = pattern.timings[pattern.timings.length - 1].pressTime - pattern.timings[0].pressTime;
    return timeSpan > 0 ? (pattern.timings.length / timeSpan) * 60000 : 0; // CPM
  }

  private static calculateTimingDifference(pattern1: KeystrokePattern, pattern2: KeystrokePattern): number {
    const rhythm1 = this.extractRhythm(pattern1);
    const rhythm2 = this.extractRhythm(pattern2);
    
    const minLength = Math.min(rhythm1.length, rhythm2.length);
    if (minLength === 0) return 1;
    
    let totalDiff = 0;
    for (let i = 0; i < minLength; i++) {
      totalDiff += Math.abs(rhythm1[i] - rhythm2[i]);
    }
    
    return totalDiff / minLength;
  }

  private static extractRhythm(pattern: KeystrokePattern): number[] {
    const rhythm: number[] = [];
    
    for (let i = 1; i < pattern.timings.length; i++) {
      const interval = pattern.timings[i].pressTime - pattern.timings[i - 1].pressTime;
      rhythm.push(interval);
    }
    
    return rhythm;
  }

  private static calculateAdaptiveConfidence(patterns: KeystrokePattern[], profile: BiometricProfile): number {
    if (patterns.length === 0) return 0;
    
    // Base confidence calculation
    let confidence = 50 + (patterns.length * 2); // Gradual increase with more data
    
    // Apply learning rate adjustments
    if (patterns.length >= this.MIN_PATTERNS_FOR_STABILITY) {
      const stability = this.calculateStabilityScore(patterns);
      confidence += stability * 30; // Up to 30 points for stability
      
      // Recent performance bonus
      const recentPatterns = patterns.slice(-5);
      const recentStability = this.calculateStabilityScore(recentPatterns);
      confidence += recentStability * 10; // Up to 10 points for recent stability
    }
    
    // Experience bonus for well-established profiles
    if (patterns.length >= 20) {
      confidence += 5;
    }
    
    return Math.max(0, Math.min(95, confidence)); // Cap at 95% to allow for natural variation
  }

  private static calculateStabilityScore(patterns: KeystrokePattern[]): number {
    if (patterns.length < 3) return 0;
    
    const speeds = patterns.map(p => this.calculateTypingSpeed(p));
    const avgSpeed = speeds.reduce((sum, s) => sum + s, 0) / speeds.length;
    
    if (avgSpeed === 0) return 0;
    
    // Calculate coefficient of variation
    const variance = speeds.reduce((sum, s) => sum + Math.pow(s - avgSpeed, 2), 0) / speeds.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = stdDev / avgSpeed;
    
    // Stability score: lower variation = higher stability
    return Math.max(0, 1 - coefficientOfVariation);
  }

  private static determineProfileStatus(patterns: KeystrokePattern[], confidenceScore: number): 'learning' | 'active' | 'locked' {
    if (patterns.length < 3) return 'learning';
    
    if (patterns.length >= this.MIN_PATTERNS_FOR_STABILITY && confidenceScore >= 70) {
      const stability = this.calculateStabilityScore(patterns);
      return stability >= this.STABILITY_THRESHOLD ? 'active' : 'learning';
    }
    
    return 'learning';
  }

  private static async storeEncryptedPattern(pattern: KeystrokePattern, biometricProfileId: string): Promise<void> {
    try {
      // Encrypt the pattern data
      const encryptedData = await BiometricEncryption.encryptBiometricData(pattern.timings);
      
      // Check if keystroke_patterns table exists and store accordingly
      const { error } = await supabase
        .from('keystroke_patterns')
        .insert({
          biometric_profile_id: biometricProfileId,
          pattern_data: { encrypted: encryptedData },
          context: pattern.context,
          confidence_score: null // Will be calculated by the analysis
        });

      if (error) {
        console.warn('Failed to store pattern in database (table may not exist):', error.message);
      }
    } catch (error) {
      console.error('Failed to store encrypted pattern:', error);
      // Don't throw - this shouldn't block the authentication process
    }
  }

  private static async updateProfileInDatabase(profile: BiometricProfile): Promise<void> {
    try {
      await supabase
        .from('biometric_profiles')
        .update({
          confidence_score: profile.confidenceScore,
          status: profile.status,
          pattern_count: profile.keystrokePatterns.length,
          last_updated: new Date().toISOString()
        })
        .eq('user_id', profile.userId);
    } catch (error) {
      console.error('Failed to update profile in database:', error);
      // Don't throw - this shouldn't block the authentication process
    }
  }

  static calculateLearningMetrics(profile: BiometricProfile): LearningMetrics {
    const patterns = profile.keystrokePatterns;
    
    if (patterns.length < 2) {
      return {
        adaptationRate: 0,
        stabilityScore: 0,
        improvementTrend: 0,
        confidenceGrowth: 0
      };
    }
    
    // Calculate adaptation rate (how quickly the user's pattern stabilizes)
    const adaptationRate = this.calculateAdaptationRate(patterns);
    
    // Calculate stability score
    const stabilityScore = this.calculateStabilityScore(patterns);
    
    // Calculate improvement trend (confidence score progression)
    const improvementTrend = this.calculateImprovementTrend(patterns);
    
    // Calculate confidence growth rate
    const confidenceGrowth = this.calculateConfidenceGrowth(profile);
    
    return {
      adaptationRate,
      stabilityScore,
      improvementTrend,
      confidenceGrowth
    };
  }

  private static calculateAdaptationRate(patterns: KeystrokePattern[]): number {
    if (patterns.length < 5) return 0;
    
    // Analyze how much variance decreases over time
    const earlyPatterns = patterns.slice(0, Math.floor(patterns.length / 2));
    const laterPatterns = patterns.slice(Math.floor(patterns.length / 2));
    
    const earlyVariance = this.calculatePatternVariance(earlyPatterns);
    const laterVariance = this.calculatePatternVariance(laterPatterns);
    
    if (earlyVariance === 0) return 1;
    
    const improvement = (earlyVariance - laterVariance) / earlyVariance;
    return Math.max(0, Math.min(1, improvement));
  }

  private static calculatePatternVariance(patterns: KeystrokePattern[]): number {
    const speeds = patterns.map(p => this.calculateTypingSpeed(p));
    const avgSpeed = speeds.reduce((sum, s) => sum + s, 0) / speeds.length;
    
    const variance = speeds.reduce((sum, s) => sum + Math.pow(s - avgSpeed, 2), 0) / speeds.length;
    return variance;
  }

  private static calculateImprovementTrend(patterns: KeystrokePattern[]): number {
    // Simple trend calculation based on chronological consistency
    if (patterns.length < 3) return 0;
    
    const sortedPatterns = patterns.sort((a, b) => a.timestamp - b.timestamp);
    const recentConsistency = this.calculateStabilityScore(sortedPatterns.slice(-5));
    const overallConsistency = this.calculateStabilityScore(sortedPatterns);
    
    return Math.max(-1, Math.min(1, recentConsistency - overallConsistency));
  }

  private static calculateConfidenceGrowth(profile: BiometricProfile): number {
    const patternCount = profile.keystrokePatterns.length;
    
    if (patternCount < 3) return 0;
    
    // Simulate confidence growth based on pattern count and status
    const maxGrowth = profile.status === 'active' ? 1 : 0.7;
    const growthRate = Math.min(maxGrowth, patternCount / 20);
    
    return growthRate;
  }
}
