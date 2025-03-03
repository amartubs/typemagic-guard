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

// Subscription types
export type UserType = 'individual' | 'company' | 'charity';

export type SubscriptionTier = 'free' | 'basic' | 'professional' | 'enterprise';

export type SocialProvider = 'google' | 'github' | 'microsoft' | 'apple' | null;

export interface SubscriptionDetails {
  type: UserType;
  tier: SubscriptionTier;
  startDate: number;
  endDate: number | null; // null means unlimited
  autoRenew: boolean;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  paymentMethod?: string;
  lastPayment?: number;
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
  subscription?: SubscriptionDetails;
  organizationName?: string; // For companies and charities
  organizationSize?: number; // For companies (number of employees)
  socialProvider?: SocialProvider; // For users who sign in with social providers
}

// Visualization data
export interface VisualizationData {
  typingSpeed: number[]; // WPM over time
  keyPressHeatmap: Record<string, number>; // Key usage frequency
  rhythmPatterns: number[][]; // Inter-key timing patterns
  confidenceHistory: {timestamp: number, score: number}[];
}

// Subscription plans
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  tier: SubscriptionTier;
  userTypes: UserType[];
  price: {
    individual: number;
    company: number;
    charity: number;
  };
  features: string[];
  limits: {
    users: number;
    biometricProfiles: number;
    advancedAnalytics: boolean;
    customSecuritySettings: boolean;
    prioritySupport: boolean;
  };
}
