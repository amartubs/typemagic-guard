
import { BiometricProfile, KeystrokePattern } from '@/lib/types';

export class ConfidenceCalculator {
  static calculateAdaptiveConfidence(
    patterns: KeystrokePattern[], 
    profile: BiometricProfile, 
    minPatternsForStability: number
  ): number {
    if (patterns.length === 0) return 0;
    
    // Base confidence calculation
    let confidence = 50 + (patterns.length * 2); // Gradual increase with more data
    
    // Apply learning rate adjustments
    if (patterns.length >= minPatternsForStability) {
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

  static calculateStabilityScore(patterns: KeystrokePattern[]): number {
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

  static calculateTypingSpeed(pattern: KeystrokePattern): number {
    if (pattern.timings.length < 2) return 0;
    
    const timeSpan = pattern.timings[pattern.timings.length - 1].pressTime - pattern.timings[0].pressTime;
    return timeSpan > 0 ? (pattern.timings.length / timeSpan) * 60000 : 0; // CPM
  }
}
