
import { KeyTiming, KeystrokePattern, BiometricProfile, AuthenticationResult, VisualizationData } from './types';

/**
 * Captures and processes keyboard events
 */
export class KeystrokeCapture {
  private activeKeys: Map<string, KeyTiming> = new Map();
  private capturedKeys: KeyTiming[] = [];
  private sessionStartTime: number = Date.now();
  private context: string;
  private isActive: boolean = false;

  constructor(context: string = 'default') {
    this.context = context;
  }

  startCapture() {
    this.isActive = true;
    this.sessionStartTime = Date.now();
    this.capturedKeys = [];
    this.activeKeys = new Map();
    return this;
  }

  stopCapture() {
    this.isActive = false;
    // Ensure all keys are considered released
    this.activeKeys.forEach((key) => {
      if (!key.releaseTime) {
        key.releaseTime = Date.now();
        key.duration = key.releaseTime - key.pressTime;
        this.capturedKeys.push(key);
      }
    });
    this.activeKeys.clear();
    return this.capturedKeys;
  }

  handleKeyDown(event: KeyboardEvent) {
    if (!this.isActive) return;
    
    const key = event.key;
    if (!this.activeKeys.has(key)) {
      this.activeKeys.set(key, {
        key,
        pressTime: Date.now(),
        releaseTime: null,
        duration: null
      });
    }
  }

  handleKeyUp(event: KeyboardEvent) {
    if (!this.isActive) return;
    
    const key = event.key;
    const keyData = this.activeKeys.get(key);
    
    if (keyData) {
      keyData.releaseTime = Date.now();
      keyData.duration = keyData.releaseTime - keyData.pressTime;
      this.capturedKeys.push(keyData);
      this.activeKeys.delete(key);
    }
  }

  createPattern(userId: string): KeystrokePattern {
    return {
      userId,
      patternId: `${userId}-${Date.now()}`,
      timings: [...this.capturedKeys],
      timestamp: Date.now(),
      context: this.context
    };
  }
}

/**
 * Analyzes and compares keystroke patterns
 * Enhanced version with more sophisticated algorithms
 */
export class BiometricAnalyzer {
  /**
   * Compares a new keystroke pattern against a user's biometric profile
   * Uses multiple factors for analysis
   */
  static comparePatterns(profile: BiometricProfile, newPattern: KeystrokePattern): number {
    if (!profile.keystrokePatterns.length) return 0;
    
    // Start with a neutral baseline
    let confidence = 50;
    
    // Factor 1: Flight time (time between key presses)
    const flightTimeSimilarity = this.compareFlightTimes(profile.keystrokePatterns, newPattern);
    confidence += flightTimeSimilarity * 15;
    
    // Factor 2: Dwell time (key hold duration)
    const dwellTimeSimilarity = this.compareKeyDurations(profile.keystrokePatterns, newPattern);
    confidence += dwellTimeSimilarity * 25;
    
    // Factor 3: Rhythm consistency 
    const rhythmConsistency = this.analyzeRhythm(profile.keystrokePatterns, newPattern);
    confidence += rhythmConsistency * 15;
    
    // Factor 4: Error patterns (backspace usage, corrections)
    const errorPatternSimilarity = this.compareErrorPatterns(profile.keystrokePatterns, newPattern);
    confidence += errorPatternSimilarity * 10;
    
    // Factor 5: Typing speed
    const speedSimilarity = this.compareTypingSpeed(profile.keystrokePatterns, newPattern);
    confidence += speedSimilarity * 15;
    
    // Clamp to 0-100 range
    return Math.max(0, Math.min(100, confidence));
  }
  
  /**
   * Compare flight times (time between consecutive keypresses)
   */
  private static compareFlightTimes(existingPatterns: KeystrokePattern[], newPattern: KeystrokePattern): number {
    // Extract flight times from patterns
    const getFlightTimes = (pattern: KeystrokePattern) => {
      const times: number[] = [];
      for (let i = 1; i < pattern.timings.length; i++) {
        const current = pattern.timings[i];
        const previous = pattern.timings[i - 1];
        if (previous.releaseTime && current.pressTime) {
          times.push(current.pressTime - previous.releaseTime);
        }
      }
      return times;
    };
    
    // Get average flight times for specific key pairs
    const getKeyPairFlightTimes = (patterns: KeystrokePattern[]) => {
      const pairTimes: Record<string, number[]> = {};
      
      patterns.forEach(pattern => {
        for (let i = 1; i < pattern.timings.length; i++) {
          const current = pattern.timings[i];
          const previous = pattern.timings[i - 1];
          
          if (previous.releaseTime && current.pressTime) {
            const pairKey = `${previous.key}-${current.key}`;
            if (!pairTimes[pairKey]) {
              pairTimes[pairKey] = [];
            }
            pairTimes[pairKey].push(current.pressTime - previous.releaseTime);
          }
        }
      });
      
      // Calculate averages
      const averages: Record<string, number> = {};
      for (const [pair, times] of Object.entries(pairTimes)) {
        if (times.length >= 2) { // Only consider pairs with enough samples
          averages[pair] = times.reduce((sum, time) => sum + time, 0) / times.length;
        }
      }
      
      return averages;
    };
    
    // Get key pair flight times from the profile and new pattern
    const profilePairTimes = getKeyPairFlightTimes(existingPatterns);
    const newPatternPairs = new Map<string, number>();
    
    // Calculate flight times for new pattern
    for (let i = 1; i < newPattern.timings.length; i++) {
      const current = newPattern.timings[i];
      const previous = newPattern.timings[i - 1];
      
      if (previous.releaseTime && current.pressTime) {
        const pairKey = `${previous.key}-${current.key}`;
        newPatternPairs.set(pairKey, current.pressTime - previous.releaseTime);
      }
    }
    
    // Compare key-pair flight times
    let totalDiff = 0;
    let comparisons = 0;
    
    for (const [pair, newTime] of newPatternPairs.entries()) {
      if (profilePairTimes[pair]) {
        const profileTime = profilePairTimes[pair];
        // Calculate normalized difference (0-1 where 0 is identical)
        const normalizedDiff = Math.min(1, Math.abs(newTime - profileTime) / Math.max(profileTime, 100));
        totalDiff += normalizedDiff;
        comparisons++;
      }
    }
    
    if (comparisons < 3) {
      // Not enough key pairs for reliable comparison
      return 0.5; // Neutral score
    }
    
    // Convert to similarity (0-1 where 1 is identical)
    const avgDiff = totalDiff / comparisons;
    return Math.max(0, 1 - avgDiff);
  }
  
  /**
   * Compare key press durations (dwell time)
   */
  private static compareKeyDurations(patterns: KeystrokePattern[], newPattern: KeystrokePattern): number {
    // Extract average key hold durations from existing patterns
    const keyDurations: Record<string, number[]> = {};
    
    patterns.forEach(pattern => {
      pattern.timings.forEach(timing => {
        if (timing.duration) {
          if (!keyDurations[timing.key]) {
            keyDurations[timing.key] = [];
          }
          keyDurations[timing.key].push(timing.duration);
        }
      });
    });
    
    // Calculate averages and standard deviations
    const keyStats: Record<string, { avg: number, stdDev: number }> = {};
    for (const [key, durations] of Object.entries(keyDurations)) {
      if (durations.length >= 3) { // Only consider keys with enough samples
        const avg = durations.reduce((sum, d) => sum + d, 0) / durations.length;
        const variance = durations.reduce((sum, d) => sum + Math.pow(d - avg, 2), 0) / durations.length;
        const stdDev = Math.sqrt(variance);
        keyStats[key] = { avg, stdDev };
      }
    }
    
    // Compare new pattern against the profile
    let totalSimilarity = 0;
    let comparisons = 0;
    
    newPattern.timings.forEach(timing => {
      if (timing.duration && keyStats[timing.key]) {
        const { avg, stdDev } = keyStats[timing.key];
        
        // Calculate Z-score (number of standard deviations from the mean)
        const zScore = Math.abs(timing.duration - avg) / Math.max(stdDev, 10); // Min stdDev to avoid division by near-zero
        
        // Convert Z-score to similarity (0-1 where 1 is identical)
        // Z-score of 0 means exact match, higher values mean more deviation
        const similarity = Math.max(0, 1 - Math.min(1, zScore / 3)); // Beyond 3 stdDevs is considered dissimilar
        
        totalSimilarity += similarity;
        comparisons++;
      }
    });
    
    if (comparisons < 5) {
      // Not enough key durations for reliable comparison
      return 0.6; // Slightly positive baseline
    }
    
    return totalSimilarity / comparisons;
  }
  
  /**
   * Analyze typing rhythm patterns and consistency
   */
  private static analyzeRhythm(patterns: KeystrokePattern[], newPattern: KeystrokePattern): number {
    // Calculate inter-key intervals for recurring n-grams (sequences of n keys)
    const getNGramRhythms = (pattern: KeystrokePattern, n: number = 3) => {
      const rhythms: Record<string, number[]> = {};
      
      for (let i = 0; i <= pattern.timings.length - n; i++) {
        const ngram = pattern.timings.slice(i, i + n).map(t => t.key).join('');
        const startTime = pattern.timings[i].pressTime;
        const endTime = pattern.timings[i + n - 1].pressTime;
        
        if (!rhythms[ngram]) {
          rhythms[ngram] = [];
        }
        
        rhythms[ngram].push(endTime - startTime);
      }
      
      return rhythms;
    };
    
    // Get n-gram rhythms from all patterns
    const profileRhythms: Record<string, number[]> = {};
    patterns.forEach(pattern => {
      const rhythms = getNGramRhythms(pattern);
      
      for (const [ngram, times] of Object.entries(rhythms)) {
        if (!profileRhythms[ngram]) {
          profileRhythms[ngram] = [];
        }
        profileRhythms[ngram].push(...times);
      }
    });
    
    // Calculate average rhythm for each n-gram
    const avgRhythms: Record<string, number> = {};
    for (const [ngram, times] of Object.entries(profileRhythms)) {
      if (times.length >= 2) { // Only consider n-grams with enough samples
        avgRhythms[ngram] = times.reduce((sum, time) => sum + time, 0) / times.length;
      }
    }
    
    // Compare new pattern's rhythms against the profile
    const newRhythms = getNGramRhythms(newPattern);
    let totalSimilarity = 0;
    let comparisons = 0;
    
    for (const [ngram, times] of Object.entries(newRhythms)) {
      if (avgRhythms[ngram]) {
        const avgProfileTime = avgRhythms[ngram];
        
        times.forEach(time => {
          const normalizedDiff = Math.min(1, Math.abs(time - avgProfileTime) / Math.max(avgProfileTime, 100));
          totalSimilarity += (1 - normalizedDiff);
          comparisons++;
        });
      }
    }
    
    if (comparisons === 0) {
      return 0.5; // Neutral score if no comparable n-grams
    }
    
    return totalSimilarity / comparisons;
  }
  
  /**
   * Compare error patterns (backspace usage, corrections)
   */
  private static compareErrorPatterns(patterns: KeystrokePattern[], newPattern: KeystrokePattern): number {
    // Calculate backspace frequency
    const getBackspaceFrequency = (pattern: KeystrokePattern) => {
      const backspaceCount = pattern.timings.filter(t => t.key === 'Backspace').length;
      return backspaceCount / Math.max(pattern.timings.length, 1);
    };
    
    // Calculate average backspace frequency from profile
    const profileFrequencies = patterns.map(getBackspaceFrequency);
    const avgProfileFrequency = profileFrequencies.reduce((sum, freq) => sum + freq, 0) / Math.max(profileFrequencies.length, 1);
    
    // Calculate backspace frequency for new pattern
    const newFrequency = getBackspaceFrequency(newPattern);
    
    // Compare frequencies (0-1 where 1 is identical)
    const similarity = 1 - Math.min(1, Math.abs(newFrequency - avgProfileFrequency) / Math.max(avgProfileFrequency, 0.01));
    
    return similarity;
  }
  
  /**
   * Compare typing speed
   */
  private static compareTypingSpeed(patterns: KeystrokePattern[], newPattern: KeystrokePattern): number {
    // Calculate typing speed in characters per minute
    const calculateSpeed = (pattern: KeystrokePattern): number => {
      if (pattern.timings.length < 2) return 0;
      
      const firstKeyTime = pattern.timings[0].pressTime;
      const lastKeyTime = pattern.timings[pattern.timings.length - 1].pressTime;
      const timeSpanMinutes = (lastKeyTime - firstKeyTime) / 60000; // Convert ms to minutes
      
      if (timeSpanMinutes <= 0) return 0;
      
      // CPM = character count / time in minutes
      return pattern.timings.length / timeSpanMinutes;
    };
    
    // Calculate average speed from profile
    const profileSpeeds = patterns.map(calculateSpeed).filter(s => s > 0);
    if (profileSpeeds.length === 0) return 0.5; // Neutral if no valid speeds
    
    const avgProfileSpeed = profileSpeeds.reduce((sum, speed) => sum + speed, 0) / profileSpeeds.length;
    
    // Calculate new pattern speed
    const newSpeed = calculateSpeed(newPattern);
    if (newSpeed <= 0) return 0.5; // Neutral if invalid speed
    
    // Compare speeds (0-1 where 1 is identical)
    // Allow for some natural speed variation (within 30%)
    const speedRatio = newSpeed / avgProfileSpeed;
    const similarity = speedRatio > 1 
      ? Math.max(0, 1 - (speedRatio - 1) / 0.3)
      : Math.max(0, 1 - (1 - speedRatio) / 0.3);
    
    return Math.min(1, similarity);
  }
  
  static authenticate(profile: BiometricProfile, newPattern: KeystrokePattern): AuthenticationResult {
    const confidenceScore = this.comparePatterns(profile, newPattern);
    
    // Determine anomaly details if confidence is low
    let anomalyDetails;
    if (confidenceScore < profile.confidenceScore * 0.8) {
      const fields = [];
      
      // Check different factors to identify what aspects are suspicious
      const flightTimeSimilarity = this.compareFlightTimes(profile.keystrokePatterns, newPattern);
      const dwellTimeSimilarity = this.compareKeyDurations(profile.keystrokePatterns, newPattern);
      const rhythmConsistency = this.analyzeRhythm(profile.keystrokePatterns, newPattern);
      const speedSimilarity = this.compareTypingSpeed(profile.keystrokePatterns, newPattern);
      
      if (flightTimeSimilarity < 0.6) fields.push('typing_rhythm');
      if (dwellTimeSimilarity < 0.6) fields.push('key_duration');
      if (rhythmConsistency < 0.5) fields.push('pattern_consistency');
      if (speedSimilarity < 0.5) fields.push('typing_speed');
      
      if (fields.length === 0) fields.push('overall_pattern');
      
      // Determine severity based on how far below threshold
      const threshold = profile.confidenceScore;
      let severity: 'low' | 'medium' | 'high' = 'low';
      
      if (confidenceScore < threshold * 0.5) {
        severity = 'high';
      } else if (confidenceScore < threshold * 0.7) {
        severity = 'medium';
      }
      
      anomalyDetails = {
        fields,
        severity,
        description: 'Typing pattern significantly differs from established profile'
      };
    }
    
    return {
      success: confidenceScore >= profile.confidenceScore,
      confidenceScore,
      timestamp: Date.now(),
      userId: profile.userId,
      patternId: newPattern.patternId,
      anomalyDetails
    };
  }
  
  static updateProfile(profile: BiometricProfile, newPattern: KeystrokePattern): BiometricProfile {
    // Add new pattern to the profile
    const updatedPatterns = [...profile.keystrokePatterns, newPattern];
    
    // Limit the number of patterns stored
    const maxPatterns = 20;
    const trimmedPatterns = updatedPatterns.length > maxPatterns
      ? updatedPatterns.slice(updatedPatterns.length - maxPatterns)
      : updatedPatterns;
    
    // Recalculate confidence score based on pattern variability
    let confidenceScore = 75; // Start with a reasonable baseline
    
    if (trimmedPatterns.length >= 3) {
      // Analyze pattern consistency
      const consistencyScores = [];
      
      for (let i = 0; i < trimmedPatterns.length; i++) {
        // Compare each pattern with all others
        for (let j = i + 1; j < trimmedPatterns.length; j++) {
          const pattern1 = trimmedPatterns[i];
          const pattern2 = trimmedPatterns[j];
          
          // Create a mini-profile with just pattern1
          const singlePatternProfile: BiometricProfile = {
            userId: profile.userId,
            keystrokePatterns: [pattern1],
            confidenceScore: 50,
            lastUpdated: Date.now(),
            status: 'learning'
          };
          
          const similarity = this.comparePatterns(singlePatternProfile, pattern2);
          consistencyScores.push(similarity);
        }
      }
      
      // Calculate average consistency
      if (consistencyScores.length > 0) {
        const avgConsistency = consistencyScores.reduce((sum, score) => sum + score, 0) / consistencyScores.length;
        
        // Adjust confidence based on consistency and number of samples
        confidenceScore = Math.min(95, 50 + (avgConsistency * 0.3) + Math.min(20, trimmedPatterns.length * 2));
      }
    } else {
      // Few samples, increase gradually based on count
      confidenceScore = 50 + (trimmedPatterns.length * 8);
    }
    
    return {
      ...profile,
      keystrokePatterns: trimmedPatterns,
      confidenceScore: Math.round(confidenceScore),
      lastUpdated: Date.now(),
      status: trimmedPatterns.length >= 5 ? 'active' : 'learning'
    };
  }
  
  static getVisualizationData(profile: BiometricProfile): VisualizationData {
    // Generate visualization data based on the user's actual patterns
    
    // 1. Typing speed over time (WPM)
    const typingSpeed = profile.keystrokePatterns.map(pattern => {
      const charCount = pattern.timings.length;
      if (charCount < 2) return 40; // Default fallback
      
      const timeSpanMs = pattern.timings[charCount - 1].pressTime - pattern.timings[0].pressTime;
      if (timeSpanMs <= 0) return 40; // Default fallback
      
      const minutes = timeSpanMs / 60000;
      // Assuming 5 characters per word (standard for WPM calculation)
      return Math.round((charCount / 5) / minutes);
    });
    
    // 2. Key press heatmap
    const keyPressHeatmap: Record<string, number> = {};
    profile.keystrokePatterns.forEach(pattern => {
      pattern.timings.forEach(timing => {
        keyPressHeatmap[timing.key] = (keyPressHeatmap[timing.key] || 0) + 1;
      });
    });
    
    // 3. Rhythm patterns (inter-key timing)
    const rhythmPatterns: number[][] = [];
    
    // Extract the three most recent patterns for visualization
    const recentPatterns = profile.keystrokePatterns.slice(-3);
    
    recentPatterns.forEach(pattern => {
      const intervals: number[] = [];
      
      for (let i = 1; i < pattern.timings.length && intervals.length < 10; i++) {
        const current = pattern.timings[i];
        const previous = pattern.timings[i - 1];
        
        if (previous.releaseTime && current.pressTime) {
          intervals.push(current.pressTime - previous.releaseTime);
        }
      }
      
      // Pad with zeros if needed to ensure consistent length
      while (intervals.length < 10) {
        intervals.push(0);
      }
      
      rhythmPatterns.push(intervals);
    });
    
    // Pad with empty patterns if needed
    while (rhythmPatterns.length < 3) {
      rhythmPatterns.push(Array(10).fill(0));
    }
    
    // 4. Confidence history
    // Simulate confidence progression based on pattern count
    const confidenceHistory = profile.keystrokePatterns.map((pattern, index) => {
      // Simulate confidence growth with each additional pattern
      let score = 50;
      if (index > 0) {
        score = Math.min(95, 50 + (index * 45 / profile.keystrokePatterns.length));
      }
      
      return {
        timestamp: pattern.timestamp,
        score: Math.round(score)
      };
    });
    
    return {
      typingSpeed,
      keyPressHeatmap,
      rhythmPatterns,
      confidenceHistory
    };
  }
}

// Create a new biometric profile for a user
export function createBiometricProfile(userId: string): BiometricProfile {
  return {
    userId,
    keystrokePatterns: [],
    confidenceScore: 0,
    lastUpdated: Date.now(),
    status: 'learning'
  };
}
