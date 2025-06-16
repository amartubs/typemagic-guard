
export interface SecuritySettings {
  id: string;
  user_id: string;
  min_confidence_threshold: number;
  learning_period: number;
  anomaly_detection_sensitivity: number;
  max_failed_attempts: number;
  security_level: 'low' | 'medium' | 'high' | 'very-high';
  enforce_two_factor: boolean;
  created_at: string;
  updated_at: string;
}
