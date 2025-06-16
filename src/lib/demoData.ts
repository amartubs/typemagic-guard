
import { AuthenticationResult, KeystrokePattern, KeyTiming } from './types';

// Demo keystroke patterns for testing
export const generateDemoKeystrokePattern = (userId: string, context: string = 'demo'): KeystrokePattern => {
  const timings: KeyTiming[] = [];
  const phrase = "My voice is my passport, verify me.";
  
  let currentTime = 0;
  for (let i = 0; i < phrase.length; i++) {
    const dwellTime = 80 + Math.random() * 40; // 80-120ms
    const flightTime = 50 + Math.random() * 30; // 50-80ms
    
    timings.push({
      key: phrase[i],
      keyCode: phrase.charCodeAt(i),
      dwellTime,
      flightTime,
      timestamp: currentTime,
      pressure: 0.5 + Math.random() * 0.3 // 0.5-0.8
    });
    
    currentTime += dwellTime + flightTime;
  }
  
  return {
    userId,
    patternId: `${userId}-${Date.now()}`,
    timings,
    timestamp: Date.now(),
    context
  };
};

// Generate demo authentication results for testing
export const generateDemoAuthResult = (success: boolean = true): AuthenticationResult => {
  return {
    success,
    confidenceScore: success ? 75 + Math.random() * 20 : 30 + Math.random() * 30,
    patterns: [],
    anomalies: success ? [] : ['Unusual typing rhythm detected'],
    riskFactors: success ? [] : ['Timing deviation above threshold'],
    timestamp: Date.now()
  };
};

// Demo configuration for testing environments
export const demoConfig = {
  confidenceThreshold: 65,
  learningPeriod: 5,
  maxFailedAttempts: 3,
  securityLevel: 'medium' as const,
};

// Helper function to generate realistic demo timings
export const generateRealisticTimings = (text: string): KeyTiming[] => {
  const timings: KeyTiming[] = [];
  let currentTime = 0;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const isSpace = char === ' ';
    const isCommon = 'etaoinshrdlu'.includes(char.toLowerCase());
    
    // Adjust timing based on character type
    let baseDwell = isSpace ? 60 : isCommon ? 85 : 95;
    let baseFlight = isSpace ? 40 : isCommon ? 55 : 65;
    
    // Add some natural variation
    const dwellTime = baseDwell + (Math.random() - 0.5) * 20;
    const flightTime = baseFlight + (Math.random() - 0.5) * 15;
    
    timings.push({
      key: char,
      keyCode: char.charCodeAt(0),
      dwellTime: Math.max(20, dwellTime),
      flightTime: Math.max(10, flightTime),
      timestamp: currentTime,
      pressure: 0.4 + Math.random() * 0.4
    });
    
    currentTime += dwellTime + flightTime;
  }
  
  return timings;
};

// Export demo phrases for testing
export const demoVerificationPhrases = [
  "My voice is my passport, verify me.",
  "The quick brown fox jumps over the lazy dog.",
  "Pack my box with five dozen liquor jugs.",
  "How vexingly quick daft zebras jump!"
];
