
import { User, BiometricProfile, KeystrokePattern, AuthenticationResult, SecuritySettings } from './types';
import { createBiometricProfile } from './biometricAuth';

// Create demo keystroke pattern
function createDemoKeystrokePattern(userId: string, text: string, context: string): KeystrokePattern {
  const now = Date.now();
  const baseTime = now - (text.length * 150); // Start time for first keypress
  
  const timings = text.split('').map((char, index) => {
    const pressTime = baseTime + (index * 150); // Each key 150ms apart
    const holdTime = 80 + Math.floor(Math.random() * 40); // 80-120ms hold time
    
    return {
      key: char,
      pressTime,
      releaseTime: pressTime + holdTime,
      duration: holdTime
    };
  });
  
  return {
    userId,
    patternId: `${userId}-${context}-${now}`,
    timings,
    timestamp: now,
    context
  };
}

// Create demo security settings
function createDemoSecuritySettings(securityLevel: 'low' | 'medium' | 'high' | 'very-high'): SecuritySettings {
  const settings: Record<string, SecuritySettings> = {
    'low': {
      minConfidenceThreshold: 50,
      learningPeriod: 7,
      anomalyDetectionSensitivity: 30,
      securityLevel: 'low',
      enforceTwoFactor: false,
      maxFailedAttempts: 10
    },
    'medium': {
      minConfidenceThreshold: 65,
      learningPeriod: 14,
      anomalyDetectionSensitivity: 50,
      securityLevel: 'medium',
      enforceTwoFactor: false,
      maxFailedAttempts: 5
    },
    'high': {
      minConfidenceThreshold: 75,
      learningPeriod: 21,
      anomalyDetectionSensitivity: 70,
      securityLevel: 'high',
      enforceTwoFactor: true,
      maxFailedAttempts: 3
    },
    'very-high': {
      minConfidenceThreshold: 85,
      learningPeriod: 30,
      anomalyDetectionSensitivity: 90,
      securityLevel: 'very-high',
      enforceTwoFactor: true,
      maxFailedAttempts: 2
    }
  };
  
  return settings[securityLevel];
}

// Create a demo profile with some patterns
export function createDemoProfile(userId: string): BiometricProfile {
  const profile = createBiometricProfile(userId);
  
  // Add some sample patterns
  const sampleTexts = [
    "hello world",
    "secure password",
    "biometric authentication",
    "keyboard dynamics are unique",
    "typing patterns reveal identity"
  ];
  
  const contexts = ['login', 'chat', 'form'];
  
  sampleTexts.forEach((text, index) => {
    const context = contexts[index % contexts.length];
    const pattern = createDemoKeystrokePattern(userId, text, context);
    profile.keystrokePatterns.push(pattern);
  });
  
  profile.status = 'active';
  profile.confidenceScore = 75;
  
  return profile;
}

// Create a demo user
export function createDemoUser(id: string, role: 'admin' | 'user' = 'user'): User {
  return {
    id,
    email: `${id}@example.com`,
    name: id === 'admin' ? 'Admin User' : `User ${id.charAt(0).toUpperCase()}${id.slice(1)}`,
    role,
    biometricProfile: createDemoProfile(id),
    securitySettings: createDemoSecuritySettings(role === 'admin' ? 'very-high' : 'medium'),
    lastLogin: Date.now() - (1000 * 60 * 60 * 24 * Math.floor(Math.random() * 7)), // Within the last week
    status: 'active'
  };
}

// Create demo authentication results
export function createDemoAuthResults(userId: string, successful: boolean = true): AuthenticationResult {
  return {
    success: successful,
    confidenceScore: successful ? 75 + Math.floor(Math.random() * 20) : 30 + Math.floor(Math.random() * 30),
    timestamp: Date.now(),
    userId,
    patternId: `${userId}-login-${Date.now()}`,
    anomalyDetails: successful ? undefined : {
      fields: ['typing_rhythm', 'key_duration'],
      severity: 'medium',
      description: 'Unusual typing pattern detected'
    }
  };
}

// Demo users
export const demoUsers: User[] = [
  createDemoUser('admin', 'admin'),
  createDemoUser('john'),
  createDemoUser('alice'),
  createDemoUser('bob')
];

// Demo auth results
export const demoAuthResults: AuthenticationResult[] = [
  createDemoAuthResults('john', true),
  createDemoAuthResults('alice', true),
  createDemoAuthResults('bob', false),
  createDemoAuthResults('admin', true)
];
