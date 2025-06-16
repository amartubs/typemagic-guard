
import { AuthenticationResult, KeystrokePattern, KeyTiming } from './types';

// Demo keystroke patterns for testing
export const generateDemoKeystrokePattern = (userId: string, context: string = 'demo'): KeystrokePattern => {
  const timings: KeyTiming[] = [];
  const phrase = "My voice is my passport, verify me.";
  
  let currentTime = 0;
  for (let i = 0; i < phrase.length; i++) {
    const pressTime = currentTime;
    const duration = 80 + Math.random() * 40; // 80-120ms
    const releaseTime = pressTime + duration;
    const flightTime = 50 + Math.random() * 30; // 50-80ms
    
    timings.push({
      key: phrase[i],
      pressTime,
      releaseTime,
      duration
    });
    
    currentTime += duration + flightTime;
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
export const generateDemoAuthResult = (userId: string, success: boolean = true): AuthenticationResult => {
  return {
    success,
    confidenceScore: success ? 75 + Math.random() * 20 : 30 + Math.random() * 30,
    timestamp: Date.now(),
    userId,
    patternId: success ? `${userId}-pattern-${Date.now()}` : null,
    anomalyDetails: success ? undefined : {
      fields: ['timing', 'rhythm'],
      severity: 'medium',
      description: 'Unusual typing rhythm detected'
    }
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
    let baseDuration = isSpace ? 60 : isCommon ? 85 : 95;
    let baseFlight = isSpace ? 40 : isCommon ? 55 : 65;
    
    // Add some natural variation
    const duration = Math.max(20, baseDuration + (Math.random() - 0.5) * 20);
    const flightTime = Math.max(10, baseFlight + (Math.random() - 0.5) * 15);
    
    const pressTime = currentTime;
    const releaseTime = pressTime + duration;
    
    timings.push({
      key: char,
      pressTime,
      releaseTime,
      duration
    });
    
    currentTime += duration + flightTime;
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
