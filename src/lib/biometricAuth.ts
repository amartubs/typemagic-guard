
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
 * This is a simplified version for demonstration purposes
 * A real implementation would use more sophisticated statistical models
 */
export class BiometricAnalyzer {
  // In a real implementation this would use more sophisticated algorithms
  // such as statistical pattern recognition or machine learning models
  static comparePatterns(profile: BiometricProfile, newPattern: KeystrokePattern): number {
    if (!profile.keystrokePatterns.length) return 0;
    
    // Simplified confidence calculation for demo
    // In a real system, this would involve statistical analysis of typing rhythm,
    // key hold times, transition times between specific key pairs, etc.
    let confidence = 50; // Start at neutral
    
    // Compare typing speed
    const profileTypingSpeed = this.calculateTypingSpeed(profile.keystrokePatterns);
    const newTypingSpeed = this.calculateTypingSpeed([newPattern]);
    
    const speedDifference = Math.abs(profileTypingSpeed - newTypingSpeed);
    // Adjust confidence based on typing speed similarity
    if (speedDifference < 5) confidence += 15;
    else if (speedDifference < 15) confidence += 5;
    else confidence -= 10;
    
    // Compare key hold durations
    const durationSimilarity = this.compareKeyDurations(profile.keystrokePatterns, newPattern);
    confidence += durationSimilarity * 25; // Scale to have meaningful impact
    
    // Compare transition times between keys
    const transitionSimilarity = this.compareTransitionTimes(profile.keystrokePatterns, newPattern);
    confidence += transitionSimilarity * 25;
    
    // Clamp to 0-100 range
    return Math.max(0, Math.min(100, confidence));
  }
  
  private static calculateTypingSpeed(patterns: KeystrokePattern[]): number {
    if (!patterns.length) return 0;
    
    // Calculate average WPM across patterns
    const speeds = patterns.map(pattern => {
      const chars = pattern.timings.length;
      const timeSpan = (pattern.timings[chars - 1]?.releaseTime || 0) - pattern.timings[0]?.pressTime;
      if (!timeSpan) return 0;
      
      // Average English word is ~5 characters
      const words = chars / 5;
      // Convert milliseconds to minutes
      const minutes = timeSpan / 60000;
      return words / minutes;
    });
    
    return speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length;
  }
  
  private static compareKeyDurations(patterns: KeystrokePattern[], newPattern: KeystrokePattern): number {
    // Extract average key hold durations from existing patterns
    const existingDurations: Record<string, number[]> = {};
    
    patterns.forEach(pattern => {
      pattern.timings.forEach(timing => {
        if (timing.duration) {
          if (!existingDurations[timing.key]) {
            existingDurations[timing.key] = [];
          }
          existingDurations[timing.key].push(timing.duration);
        }
      });
    });
    
    // Calculate averages
    const avgDurations: Record<string, number> = {};
    for (const key in existingDurations) {
      const durations = existingDurations[key];
      avgDurations[key] = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    }
    
    // Compare with new pattern
    let totalDiff = 0;
    let comparisons = 0;
    
    newPattern.timings.forEach(timing => {
      if (timing.duration && avgDurations[timing.key]) {
        const diff = Math.abs(timing.duration - avgDurations[timing.key]) / avgDurations[timing.key];
        totalDiff += diff;
        comparisons++;
      }
    });
    
    if (comparisons === 0) return 0;
    // Convert to similarity (0-1 where 1 is identical)
    const avgDiff = totalDiff / comparisons;
    return Math.max(0, 1 - avgDiff);
  }
  
  private static compareTransitionTimes(patterns: KeystrokePattern[], newPattern: KeystrokePattern): number {
    // This would analyze the time between consecutive keypresses
    // Simplified implementation for demo
    return 0.75; // Placeholder value
  }
  
  static authenticate(profile: BiometricProfile, newPattern: KeystrokePattern): AuthenticationResult {
    const confidenceScore = this.comparePatterns(profile, newPattern);
    const threshold = 65; // This would be configurable in a real system
    
    return {
      success: confidenceScore >= threshold,
      confidenceScore,
      timestamp: Date.now(),
      userId: profile.userId,
      patternId: newPattern.patternId,
      anomalyDetails: confidenceScore < threshold ? {
        fields: ['typing_rhythm', 'key_duration'],
        severity: confidenceScore < 40 ? 'high' : confidenceScore < 55 ? 'medium' : 'low',
        description: 'Typing pattern differs from established profile'
      } : undefined
    };
  }
  
  static updateProfile(profile: BiometricProfile, newPattern: KeystrokePattern): BiometricProfile {
    // Add new pattern to the profile
    const updatedPatterns = [...profile.keystrokePatterns, newPattern];
    
    // In a real system, we might limit the number of patterns stored
    // or implement a more sophisticated algorithm for profile updates
    const maxPatterns = 20;
    const trimmedPatterns = updatedPatterns.length > maxPatterns
      ? updatedPatterns.slice(updatedPatterns.length - maxPatterns)
      : updatedPatterns;
    
    return {
      ...profile,
      keystrokePatterns: trimmedPatterns,
      lastUpdated: Date.now(),
      status: trimmedPatterns.length >= 5 ? 'active' : 'learning'
    };
  }
  
  static getVisualizationData(profile: BiometricProfile): VisualizationData {
    // Generate data for visualizations
    // This would be more sophisticated in a real implementation
    
    // Typing speed over time
    const typingSpeed = profile.keystrokePatterns.map(() => 
      Math.floor(40 + Math.random() * 30)
    );
    
    // Key heatmap
    const keyPressHeatmap: Record<string, number> = {};
    profile.keystrokePatterns.forEach(pattern => {
      pattern.timings.forEach(timing => {
        keyPressHeatmap[timing.key] = (keyPressHeatmap[timing.key] || 0) + 1;
      });
    });
    
    // Rhythm patterns (simplified)
    const rhythmPatterns = Array(5).fill(0).map(() => 
      Array(10).fill(0).map(() => Math.random() * 100)
    );
    
    // Confidence history
    const confidenceHistory = profile.keystrokePatterns.map((pattern, index) => ({
      timestamp: pattern.timestamp,
      score: 50 + (index * 50 / profile.keystrokePatterns.length) 
    }));
    
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
