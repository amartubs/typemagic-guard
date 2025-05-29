
import { BiometricProfile, KeystrokePattern, AuthenticationResult } from '@/lib/types';
import { PatternPruner } from './patternPruner';
import { ConfidenceCalculator } from './confidenceCalculator';
import { DatabaseManager } from './databaseManager';
import { LearningMetrics } from './types';

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
    const prunedPatterns = PatternPruner.prunePatterns(updatedPatterns, this.MAX_PATTERNS_STORED);
    
    // Calculate new confidence score using adaptive learning
    const newConfidenceScore = ConfidenceCalculator.calculateAdaptiveConfidence(
      prunedPatterns, 
      profile, 
      this.MIN_PATTERNS_FOR_STABILITY
    );
    
    // Determine profile status based on learning progress
    const newStatus = this.determineProfileStatus(prunedPatterns, newConfidenceScore);
    
    // Store encrypted patterns in database
    await DatabaseManager.storePatternAndUpdateProfile(newPattern, profile.userId);
    
    const updatedProfile: BiometricProfile = {
      ...profile,
      keystrokePatterns: prunedPatterns,
      confidenceScore: newConfidenceScore,
      status: newStatus,
      lastUpdated: Date.now()
    };

    // Update database
    await DatabaseManager.updateProfileInDatabase(updatedProfile);
    
    return updatedProfile;
  }

  private static determineProfileStatus(patterns: KeystrokePattern[], confidenceScore: number): 'learning' | 'active' | 'locked' {
    if (patterns.length < 3) return 'learning';
    
    if (patterns.length >= this.MIN_PATTERNS_FOR_STABILITY && confidenceScore >= 70) {
      const stability = ConfidenceCalculator.calculateStabilityScore(patterns);
      return stability >= this.STABILITY_THRESHOLD ? 'active' : 'learning';
    }
    
    return 'learning';
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
    const stabilityScore = ConfidenceCalculator.calculateStabilityScore(patterns);
    
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
    const speeds = patterns.map(p => ConfidenceCalculator.calculateTypingSpeed(p));
    const avgSpeed = speeds.reduce((sum, s) => sum + s, 0) / speeds.length;
    
    const variance = speeds.reduce((sum, s) => sum + Math.pow(s - avgSpeed, 2), 0) / speeds.length;
    return variance;
  }

  private static calculateImprovementTrend(patterns: KeystrokePattern[]): number {
    // Simple trend calculation based on chronological consistency
    if (patterns.length < 3) return 0;
    
    const sortedPatterns = patterns.sort((a, b) => a.timestamp - b.timestamp);
    const recentConsistency = ConfidenceCalculator.calculateStabilityScore(sortedPatterns.slice(-5));
    const overallConsistency = ConfidenceCalculator.calculateStabilityScore(sortedPatterns);
    
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
