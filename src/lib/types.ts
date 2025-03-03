
// Keystroke data
export interface KeyTiming {
  key: string;
  pressTime: number;
  releaseTime: number | null;
  duration: number | null;
}

export interface KeystrokePattern {
  userId: string;
  patternId: string;
  timings: KeyTiming[];
  timestamp: number;
  context: string; // e.g., "login", "form", "chat"
}

// User profiles
export interface BiometricProfile {
  userId: string;
  keystrokePatterns: KeystrokePattern[];
  confidenceScore: number; // 0-100
  lastUpdated: number;
  status: 'learning' | 'active' | 'locked';
  // Statistical models would be stored here in a real implementation
}

// Authentication
export interface AuthenticationResult {
  success: boolean;
  confidenceScore: number;
  timestamp: number;
  userId: string;
  patternId: string | null;
  anomalyDetails?: {
    fields: string[];
    severity: 'low' | 'medium' | 'high';
    description: string;
  };
}

// Security levels
export type SecurityLevel = 'low' | 'medium' | 'high' | 'very-high';

export interface SecuritySettings {
  minConfidenceThreshold: number; // 0-100
  learningPeriod: number; // in days
  anomalyDetectionSensitivity: number; // 0-100
  securityLevel: SecurityLevel;
  enforceTwoFactor: boolean;
  maxFailedAttempts: number;
}

// Application user
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  biometricProfile?: BiometricProfile;
  securitySettings: SecuritySettings;
  lastLogin: number | null;
  status: 'active' | 'locked' | 'pending';
}

// Visualization data
export interface VisualizationData {
  typingSpeed: number[]; // WPM over time
  keyPressHeatmap: Record<string, number>; // Key usage frequency
  rhythmPatterns: number[][]; // Inter-key timing patterns
  confidenceHistory: {timestamp: number, score: number}[];
}
