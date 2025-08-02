// Advanced security features for specialized environments

export type SecurityEnvironment = 'remote_work' | 'education' | 'government' | 'critical_infrastructure';

export type ThreatLevel = 'minimal' | 'low' | 'medium' | 'high' | 'critical' | 'imminent';

export type DeviceTrustLevel = 'untrusted' | 'limited' | 'verified' | 'trusted' | 'highly_trusted';

// Remote Work & VDI Enhancement Types
export interface VDISessionMonitor {
  id: string;
  user_id: string;
  session_id: string;
  vdi_instance_id: string;
  connection_quality: number;
  bandwidth_usage: number;
  latency_ms: number;
  screen_sharing_detected: boolean;
  shoulder_surfing_risk: number; // 0-100
  simultaneous_sessions: number;
  vpn_verified: boolean;
  device_trust_level: DeviceTrustLevel;
  zero_trust_score: number;
  created_at: string;
  updated_at: string;
}

export interface BYODTrustVerification {
  id: string;
  user_id: string;
  device_fingerprint: string;
  device_type: string;
  os_version: string;
  security_patches_up_to_date: boolean;
  antivirus_status: 'unknown' | 'disabled' | 'outdated' | 'active';
  firewall_enabled: boolean;
  encryption_enabled: boolean;
  trust_level: DeviceTrustLevel;
  compliance_score: number;
  last_verification: string;
  expiry_date: string;
}

export interface VPNSessionAuth {
  id: string;
  user_id: string;
  vpn_server: string;
  connection_start: string;
  last_heartbeat: string;
  continuous_auth_score: number;
  behavioral_anomalies: string[];
  geo_compliance: boolean;
  bandwidth_pattern_normal: boolean;
  session_hijack_risk: number;
}

// Education & Testing Security Types
export interface ExamProctoring {
  id: string;
  student_id: string;
  exam_id: string;
  exam_start: string;
  exam_end?: string;
  keystroke_pattern_consistency: number;
  timing_anomalies: number;
  copy_paste_attempts: number;
  window_focus_violations: number;
  typing_speed_deviation: number;
  pause_pattern_analysis: number;
  cheating_probability: number;
  integrity_score: number;
  behavioral_flags: string[];
}

export interface StudentIdentityVerification {
  id: string;
  student_id: string;
  verification_session: string;
  enrollment_biometric_match: number;
  writing_style_consistency: number;
  knowledge_baseline_score: number;
  behavioral_authentication: number;
  identity_confidence: number;
  verification_status: 'pending' | 'verified' | 'flagged' | 'failed';
  created_at: string;
}

export interface AcademicIntegrityMonitor {
  id: string;
  student_id: string;
  course_id: string;
  assignment_type: 'exam' | 'quiz' | 'assignment' | 'project';
  behavioral_baseline: Record<string, number>;
  current_behavior: Record<string, number>;
  deviation_score: number;
  integrity_flags: string[];
  risk_assessment: ThreatLevel;
  privacy_compliant: boolean;
  created_at: string;
}

// Government & Critical Infrastructure Types
export interface InsiderThreatDetection {
  id: string;
  employee_id: string;
  access_level: string;
  behavioral_baseline: Record<string, number>;
  recent_activity: Record<string, any>;
  anomaly_score: number;
  threat_indicators: string[];
  risk_level: ThreatLevel;
  escalation_required: boolean;
  investigation_priority: number;
  last_assessment: string;
}

export interface CoercionDetection {
  id: string;
  user_id: string;
  session_id: string;
  stress_indicators: Record<string, number>;
  typing_pressure_anomalies: number;
  hesitation_patterns: number;
  duress_probability: number;
  behavioral_distress_score: number;
  emergency_protocol_triggered: boolean;
  verification_challenges_failed: number;
  created_at: string;
}

export interface CommandControlVerification {
  id: string;
  operator_id: string;
  command_type: string;
  authorization_level: string;
  dual_person_integrity: boolean;
  biometric_verification: number;
  command_sequence_valid: boolean;
  timing_verification: boolean;
  stress_analysis: number;
  verification_status: 'pending' | 'authorized' | 'denied' | 'escalated';
  created_at: string;
}

export interface CriticalSystemAccess {
  id: string;
  user_id: string;
  system_id: string;
  access_level: 'read' | 'write' | 'admin' | 'emergency';
  continuous_verification: boolean;
  multi_factor_status: boolean;
  behavioral_trust_score: number;
  session_integrity: number;
  threat_assessment: ThreatLevel;
  access_granted: boolean;
  monitoring_active: boolean;
  created_at: string;
}

export interface SecurityIncident {
  id: string;
  user_id?: string;
  incident_type: string;
  severity: ThreatLevel;
  environment: SecurityEnvironment;
  detection_method: string;
  details: Record<string, any>;
  status: 'open' | 'investigating' | 'contained' | 'resolved' | 'false_positive';
  assigned_analyst?: string;
  resolution_time?: string;
  created_at: string;
  updated_at: string;
}

export interface SecurityPolicy {
  id: string;
  environment: SecurityEnvironment;
  policy_name: string;
  threat_tolerance: number;
  monitoring_intensity: 'minimal' | 'standard' | 'enhanced' | 'maximum';
  auto_response_enabled: boolean;
  escalation_rules: Record<string, any>;
  compliance_requirements: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}