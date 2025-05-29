import { KeystrokePattern } from '@/lib/types';

export class PatternPruner {
  static prunePatterns(patterns: KeystrokePattern[], maxPatterns: number): KeystrokePattern[] {
    if (patterns.length <= maxPatterns) {
      return patterns;
    }

    // Use intelligent pruning strategy
    return this.intelligentPruning(patterns, maxPatterns);
  }

  private static intelligentPruning(patterns: KeystrokePattern[], maxPatterns: number): KeystrokePattern[] {
    // Sort patterns by timestamp (newest first)
    const sortedPatterns = patterns.sort((a, b) => b.timestamp - a.timestamp);
    
    // Always keep the most recent patterns
    const recentPatterns = sortedPatterns.slice(0, Math.floor(maxPatterns * 0.7));
    
    // Keep representative older patterns based on diversity
    const olderPatterns = sortedPatterns.slice(Math.floor(maxPatterns * 0.7));
    const diverseOlderPatterns = this.selectDiversePatterns(
      olderPatterns, 
      maxPatterns - recentPatterns.length
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
}
