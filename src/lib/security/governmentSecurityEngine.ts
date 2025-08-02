// Government & Critical Infrastructure Security Engine
import { supabase } from '@/integrations/supabase/client';
import { 
  InsiderThreatDetection, 
  CoercionDetection, 
  CommandControlVerification, 
  CriticalSystemAccess, 
  SecurityIncident,
  ThreatLevel 
} from '@/types/advancedSecurity';

export class GovernmentSecurityEngine {
  private static insiderThreats = new Map<string, InsiderThreatDetection>();
  private static coercionDetections = new Map<string, CoercionDetection>();
  private static commandVerifications = new Map<string, CommandControlVerification>();
  private static systemAccess = new Map<string, CriticalSystemAccess>();
  private static securityIncidents: SecurityIncident[] = [];

  // Insider Threat Detection
  static async initializeInsiderThreatMonitoring(employeeId: string, accessLevel: string): Promise<InsiderThreatDetection> {
    const threat: InsiderThreatDetection = {
      id: crypto.randomUUID(),
      employee_id: employeeId,
      access_level: accessLevel,
      behavioral_baseline: this.generateBehavioralBaseline(),
      recent_activity: {},
      anomaly_score: 0,
      threat_indicators: [],
      risk_level: 'minimal',
      escalation_required: false,
      investigation_priority: 1,
      last_assessment: new Date().toISOString()
    };

    this.insiderThreats.set(employeeId, threat);
    this.startInsiderThreatMonitoring(employeeId);
    
    return threat;
  }

  private static generateBehavioralBaseline(): Record<string, number> {
    return {
      login_frequency: Math.random() * 5 + 5, // 5-10 logins per day
      access_pattern_regularity: Math.random() * 0.3 + 0.7, // 70-100% regularity
      data_access_volume: Math.random() * 100 + 50, // 50-150 files per day
      working_hours_compliance: Math.random() * 0.2 + 0.8, // 80-100% compliance
      privilege_usage: Math.random() * 0.3 + 0.2, // 20-50% of available privileges
      network_behavior: Math.random() * 0.2 + 0.8 // 80-100% normal behavior
    };
  }

  private static startInsiderThreatMonitoring(employeeId: string): void {
    const interval = setInterval(() => {
      const threat = this.insiderThreats.get(employeeId);
      if (!threat) {
        clearInterval(interval);
        return;
      }

      this.updateRecentActivity(threat);
      this.calculateAnomalyScore(threat);
      this.assessThreatLevel(threat);
      this.checkEscalationCriteria(threat);
    }, 60000); // Every minute
  }

  private static updateRecentActivity(threat: InsiderThreatDetection): void {
    threat.recent_activity = {
      login_frequency: Math.random() * 10 + 2,
      access_pattern_regularity: Math.random(),
      data_access_volume: Math.random() * 200 + 10,
      working_hours_compliance: Math.random(),
      privilege_usage: Math.random() * 0.8,
      network_behavior: Math.random(),
      unusual_file_access: Math.random() > 0.9,
      after_hours_activity: Math.random() > 0.85,
      privilege_escalation_attempts: Math.random() > 0.95
    };

    threat.last_assessment = new Date().toISOString();
  }

  private static calculateAnomalyScore(threat: InsiderThreatDetection): void {
    let score = 0;
    const baseline = threat.behavioral_baseline;
    const recent = threat.recent_activity;

    // Compare each metric
    for (const [key, recentValue] of Object.entries(recent)) {
      const baselineValue = baseline[key];
      if (typeof recentValue === 'number' && baselineValue !== undefined) {
        const deviation = Math.abs(recentValue - baselineValue) / baselineValue;
        score += deviation * 10; // Weight each deviation
      } else if (typeof recentValue === 'boolean' && recentValue) {
        score += 20; // High weight for suspicious boolean flags
      }
    }

    threat.anomaly_score = Math.min(100, score);
  }

  private static assessThreatLevel(threat: InsiderThreatDetection): void {
    const score = threat.anomaly_score;
    threat.threat_indicators = [];

    if (score > 80) {
      threat.risk_level = 'critical';
      threat.threat_indicators.push('Extreme behavioral deviation');
    } else if (score > 60) {
      threat.risk_level = 'high';
      threat.threat_indicators.push('Significant behavioral anomalies');
    } else if (score > 40) {
      threat.risk_level = 'medium';
      threat.threat_indicators.push('Moderate behavioral changes');
    } else if (score > 20) {
      threat.risk_level = 'low';
      threat.threat_indicators.push('Minor behavioral variations');
    } else {
      threat.risk_level = 'minimal';
    }

    // Add specific indicators
    if (threat.recent_activity.unusual_file_access) {
      threat.threat_indicators.push('Unusual file access patterns');
    }
    if (threat.recent_activity.after_hours_activity) {
      threat.threat_indicators.push('After-hours system access');
    }
    if (threat.recent_activity.privilege_escalation_attempts) {
      threat.threat_indicators.push('Privilege escalation attempts detected');
    }
  }

  private static checkEscalationCriteria(threat: InsiderThreatDetection): void {
    threat.escalation_required = 
      threat.risk_level === 'critical' || 
      threat.anomaly_score > 75 ||
      threat.threat_indicators.length > 3;

    if (threat.escalation_required) {
      threat.investigation_priority = threat.risk_level === 'critical' ? 1 : 2;
      this.createSecurityIncident('insider_threat', threat.risk_level, threat.employee_id);
    }
  }

  // Coercion Detection
  static async initializeCoercionDetection(userId: string, sessionId: string): Promise<CoercionDetection> {
    const detection: CoercionDetection = {
      id: crypto.randomUUID(),
      user_id: userId,
      session_id: sessionId,
      stress_indicators: {},
      typing_pressure_anomalies: 0,
      hesitation_patterns: 0,
      duress_probability: 0,
      behavioral_distress_score: 0,
      emergency_protocol_triggered: false,
      verification_challenges_failed: 0,
      created_at: new Date().toISOString()
    };

    this.coercionDetections.set(sessionId, detection);
    this.startCoercionMonitoring(sessionId);
    
    return detection;
  }

  private static startCoercionMonitoring(sessionId: string): void {
    const interval = setInterval(() => {
      const detection = this.coercionDetections.get(sessionId);
      if (!detection) {
        clearInterval(interval);
        return;
      }

      this.analyzeStressIndicators(detection);
      this.detectTypingPressureAnomalies(detection);
      this.analyzeHesitationPatterns(detection);
      this.calculateDuressLikelihood(detection);
    }, 5000); // Every 5 seconds
  }

  private static analyzeStressIndicators(detection: CoercionDetection): void {
    detection.stress_indicators = {
      keystroke_intensity_variance: Math.random() * 0.4,
      typing_rhythm_disruption: Math.random() * 0.3,
      mouse_movement_jitter: Math.random() * 0.5,
      response_time_delays: Math.random() * 0.6,
      error_rate_increase: Math.random() * 0.3
    };
  }

  private static detectTypingPressureAnomalies(detection: CoercionDetection): void {
    // Simulate pressure sensor data analysis
    const pressureVariance = Math.random() * 0.8;
    if (pressureVariance > 0.6) {
      detection.typing_pressure_anomalies++;
    }
  }

  private static analyzeHesitationPatterns(detection: CoercionDetection): void {
    // Detect unusual hesitation patterns
    if (Math.random() > 0.8) {
      detection.hesitation_patterns++;
    }
  }

  private static calculateDuressLikelihood(detection: CoercionDetection): void {
    let duressScore = 0;

    // Factor in all stress indicators
    for (const indicator of Object.values(detection.stress_indicators)) {
      duressScore += indicator * 20;
    }

    duressScore += detection.typing_pressure_anomalies * 5;
    duressScore += detection.hesitation_patterns * 10;
    duressScore += detection.verification_challenges_failed * 15;

    detection.duress_probability = Math.min(100, duressScore);
    detection.behavioral_distress_score = detection.duress_probability;

    // Trigger emergency protocol if high duress detected
    if (detection.duress_probability > 75) {
      detection.emergency_protocol_triggered = true;
      this.createSecurityIncident('coercion_detected', 'critical', detection.user_id);
    }
  }

  // Command & Control Verification
  static async verifyCommandControl(
    operatorId: string, 
    commandType: string, 
    authorizationLevel: string
  ): Promise<CommandControlVerification> {
    const verification: CommandControlVerification = {
      id: crypto.randomUUID(),
      operator_id: operatorId,
      command_type: commandType,
      authorization_level: authorizationLevel,
      dual_person_integrity: false,
      biometric_verification: 0,
      command_sequence_valid: false,
      timing_verification: false,
      stress_analysis: 0,
      verification_status: 'pending',
      created_at: new Date().toISOString()
    };

    this.commandVerifications.set(verification.id, verification);
    await this.performCommandVerification(verification);
    
    return verification;
  }

  private static async performCommandVerification(verification: CommandControlVerification): Promise<void> {
    // Dual person integrity check
    verification.dual_person_integrity = Math.random() > 0.1; // 90% success rate

    // Biometric verification
    verification.biometric_verification = Math.random() * 30 + 70; // 70-100%

    // Command sequence validation
    verification.command_sequence_valid = Math.random() > 0.05; // 95% success rate

    // Timing verification (not too fast, not too slow)
    verification.timing_verification = Math.random() > 0.1; // 90% success rate

    // Stress analysis
    verification.stress_analysis = Math.random() * 40; // 0-40% stress level

    // Determine verification status
    const passThreshold = 
      verification.dual_person_integrity &&
      verification.biometric_verification > 85 &&
      verification.command_sequence_valid &&
      verification.timing_verification &&
      verification.stress_analysis < 30;

    if (passThreshold) {
      verification.verification_status = 'authorized';
    } else if (verification.stress_analysis > 60 || verification.biometric_verification < 60) {
      verification.verification_status = 'denied';
      this.createSecurityIncident('command_verification_failed', 'high', verification.operator_id);
    } else {
      verification.verification_status = 'escalated';
    }
  }

  // Critical System Access
  static async authorizeCriticalSystemAccess(
    userId: string, 
    systemId: string, 
    accessLevel: 'read' | 'write' | 'admin' | 'emergency'
  ): Promise<CriticalSystemAccess> {
    const access: CriticalSystemAccess = {
      id: crypto.randomUUID(),
      user_id: userId,
      system_id: systemId,
      access_level: accessLevel,
      continuous_verification: true,
      multi_factor_status: false,
      behavioral_trust_score: 0,
      session_integrity: 0,
      threat_assessment: 'minimal',
      access_granted: false,
      monitoring_active: false,
      created_at: new Date().toISOString()
    };

    this.systemAccess.set(access.id, access);
    await this.evaluateSystemAccess(access);
    
    return access;
  }

  private static async evaluateSystemAccess(access: CriticalSystemAccess): Promise<void> {
    // Multi-factor authentication check
    access.multi_factor_status = Math.random() > 0.05; // 95% success rate

    // Behavioral trust score
    access.behavioral_trust_score = Math.random() * 30 + 70; // 70-100%

    // Session integrity
    access.session_integrity = Math.random() * 25 + 75; // 75-100%

    // Threat assessment
    const threatScore = (100 - access.behavioral_trust_score) + (100 - access.session_integrity);
    
    if (threatScore > 50) {
      access.threat_assessment = 'critical';
    } else if (threatScore > 35) {
      access.threat_assessment = 'high';
    } else if (threatScore > 20) {
      access.threat_assessment = 'medium';
    } else if (threatScore > 10) {
      access.threat_assessment = 'low';
    } else {
      access.threat_assessment = 'minimal';
    }

    // Grant access based on all factors
    access.access_granted = 
      access.multi_factor_status &&
      access.behavioral_trust_score > 80 &&
      access.session_integrity > 85 &&
      ['minimal', 'low'].includes(access.threat_assessment);

    if (access.access_granted) {
      access.monitoring_active = true;
      this.startCriticalSystemMonitoring(access.id);
    } else {
      this.createSecurityIncident('critical_access_denied', access.threat_assessment, access.user_id);
    }
  }

  private static startCriticalSystemMonitoring(accessId: string): void {
    const interval = setInterval(() => {
      const access = this.systemAccess.get(accessId);
      if (!access || !access.monitoring_active) {
        clearInterval(interval);
        return;
      }

      // Continuous verification
      access.behavioral_trust_score = Math.max(0, access.behavioral_trust_score + (Math.random() - 0.5) * 10);
      access.session_integrity = Math.max(0, access.session_integrity + (Math.random() - 0.5) * 5);

      // Revoke access if scores drop too low
      if (access.behavioral_trust_score < 70 || access.session_integrity < 75) {
        access.access_granted = false;
        access.monitoring_active = false;
        this.createSecurityIncident('critical_access_revoked', 'high', access.user_id);
      }
    }, 30000); // Every 30 seconds
  }

  // Security Incident Management
  private static createSecurityIncident(
    incidentType: string, 
    severity: ThreatLevel, 
    userId?: string
  ): SecurityIncident {
    const incident: SecurityIncident = {
      id: crypto.randomUUID(),
      user_id: userId,
      incident_type: incidentType,
      severity,
      environment: 'government',
      detection_method: 'automated_monitoring',
      details: { timestamp: new Date().toISOString() },
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.securityIncidents.push(incident);
    return incident;
  }

  // Getter methods
  static getInsiderThreat(employeeId: string): InsiderThreatDetection | undefined {
    return this.insiderThreats.get(employeeId);
  }

  static getCoercionDetection(sessionId: string): CoercionDetection | undefined {
    return this.coercionDetections.get(sessionId);
  }

  static getCommandVerification(verificationId: string): CommandControlVerification | undefined {
    return this.commandVerifications.get(verificationId);
  }

  static getCriticalSystemAccess(accessId: string): CriticalSystemAccess | undefined {
    return this.systemAccess.get(accessId);
  }

  static getAllInsiderThreats(): InsiderThreatDetection[] {
    return Array.from(this.insiderThreats.values());
  }

  static getAllCoercionDetections(): CoercionDetection[] {
    return Array.from(this.coercionDetections.values());
  }

  static getAllCommandVerifications(): CommandControlVerification[] {
    return Array.from(this.commandVerifications.values());
  }

  static getAllCriticalAccess(): CriticalSystemAccess[] {
    return Array.from(this.systemAccess.values());
  }

  static getAllSecurityIncidents(): SecurityIncident[] {
    return this.securityIncidents;
  }
}