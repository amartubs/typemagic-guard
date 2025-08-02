// Advanced authentication and biometric types

export type BiometricModality = 'keystroke' | 'mouse' | 'touch' | 'behavioral' | 'device';

export type AuthenticationLevel = 'low' | 'medium' | 'high' | 'critical';

export type RiskFactor = 'time_anomaly' | 'location_anomaly' | 'device_change' | 'behavior_deviation' | 'failed_attempts';

export interface MultiModalProfile {
  id: string;
  user_id: string;
  modalities: BiometricModality[];
  confidence_weights: Record<BiometricModality, number>;
  baseline_established: boolean;
  learning_progress: number;
  last_adaptation: string;
  created_at: string;
  updated_at: string;
}

export interface AdaptiveSecurityConfig {
  id: string;
  user_id: string;
  min_authentication_level: AuthenticationLevel;
  risk_tolerance: number; // 0-100
  adaptive_learning: boolean;
  challenge_escalation: boolean;
  session_timeout_minutes: number;
  max_risk_score: number;
  created_at: string;
  updated_at: string;
}

export interface RiskAssessment {
  id: string;
  user_id: string;
  session_id: string;
  risk_score: number; // 0-100
  risk_factors: RiskFactor[];
  confidence_score: number;
  authentication_level: AuthenticationLevel;
  action_required: 'none' | 'challenge' | 'block' | 'logout';
  timestamp: string;
  context: Record<string, any>;
}

export interface AuthenticationChallenge {
  id: string;
  user_id: string;
  challenge_type: 'biometric_rescan' | 'additional_factor' | 'security_questions' | 'admin_approval';
  difficulty_level: AuthenticationLevel;
  time_limit_seconds: number;
  attempts_allowed: number;
  status: 'pending' | 'completed' | 'failed' | 'expired';
  created_at: string;
  completed_at?: string;
}

export interface BiometricSample {
  modality: BiometricModality;
  data: Record<string, any>;
  confidence: number;
  quality_score: number;
  timestamp: string;
  context: string;
}

export interface AdaptiveLearningResult {
  user_id: string;
  modality: BiometricModality;
  improvement_score: number;
  pattern_stability: number;
  recommended_weight: number;
  learning_rate: number;
  next_adaptation_due: string;
}

export interface SecurityContext {
  device_fingerprint: string;
  ip_address: string;
  location: {
    country?: string;
    region?: string;
    city?: string;
  };
  time_of_day: number; // 0-23
  day_of_week: number; // 0-6
  is_known_device: boolean;
  is_known_location: boolean;
  session_duration: number;
  user_agent: string;
}