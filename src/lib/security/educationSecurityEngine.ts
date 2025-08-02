// Education & Testing Security Engine
import { supabase } from '@/integrations/supabase/client';
import { ExamProctoring, StudentIdentityVerification, AcademicIntegrityMonitor, ThreatLevel } from '@/types/advancedSecurity';

export class EducationSecurityEngine {
  private static examSessions = new Map<string, ExamProctoring>();
  private static identityVerifications = new Map<string, StudentIdentityVerification>();
  private static integrityMonitors = new Map<string, AcademicIntegrityMonitor>();

  // Exam Proctoring without Cameras
  static async startExamProctoring(studentId: string, examId: string): Promise<ExamProctoring> {
    const proctoring: ExamProctoring = {
      id: crypto.randomUUID(),
      student_id: studentId,
      exam_id: examId,
      exam_start: new Date().toISOString(),
      keystroke_pattern_consistency: 100,
      timing_anomalies: 0,
      copy_paste_attempts: 0,
      window_focus_violations: 0,
      typing_speed_deviation: 0,
      pause_pattern_analysis: 100,
      cheating_probability: 0,
      integrity_score: 100,
      behavioral_flags: []
    };

    this.examSessions.set(examId, proctoring);
    this.initializeExamMonitoring(examId);
    
    return proctoring;
  }

  private static initializeExamMonitoring(examId: string): void {
    const interval = setInterval(() => {
      const exam = this.examSessions.get(examId);
      if (!exam || exam.exam_end) {
        clearInterval(interval);
        return;
      }

      this.analyzeKeystrokePatterns(examId);
      this.detectTimingAnomalies(examId);
      this.monitorWindowFocus(examId);
      this.analyzePausePatterns(examId);
      this.calculateCheatingProbability(examId);
    }, 2000); // Every 2 seconds
  }

  private static analyzeKeystrokePatterns(examId: string): void {
    const exam = this.examSessions.get(examId);
    if (!exam) return;

    // Simulate keystroke pattern analysis
    const variance = Math.random() * 0.3; // 0-30% variance
    exam.keystroke_pattern_consistency = Math.max(0, 100 - variance * 100);
    
    if (variance > 0.25) {
      exam.behavioral_flags.push('Keystroke pattern inconsistency detected');
    }

    this.examSessions.set(examId, exam);
  }

  private static detectTimingAnomalies(examId: string): void {
    const exam = this.examSessions.get(examId);
    if (!exam) return;

    // Simulate timing analysis
    if (Math.random() > 0.85) {
      exam.timing_anomalies++;
      exam.behavioral_flags.push('Unusual response timing detected');
    }

    // Typing speed analysis
    const speedVariation = Math.random() * 0.4;
    exam.typing_speed_deviation = speedVariation * 100;
    
    if (speedVariation > 0.3) {
      exam.behavioral_flags.push('Significant typing speed change detected');
    }

    this.examSessions.set(examId, exam);
  }

  private static monitorWindowFocus(examId: string): void {
    const exam = this.examSessions.get(examId);
    if (!exam) return;

    // Simulate window focus monitoring
    if (Math.random() > 0.92) {
      exam.window_focus_violations++;
      exam.behavioral_flags.push('Window focus lost - potential tab switching');
    }

    // Copy-paste detection
    if (Math.random() > 0.95) {
      exam.copy_paste_attempts++;
      exam.behavioral_flags.push('Copy-paste activity detected');
    }

    this.examSessions.set(examId, exam);
  }

  private static analyzePausePatterns(examId: string): void {
    const exam = this.examSessions.get(examId);
    if (!exam) return;

    // Analyze pause patterns for cheating indicators
    const pauseVariance = Math.random() * 0.2;
    exam.pause_pattern_analysis = Math.max(0, 100 - pauseVariance * 100);

    if (pauseVariance > 0.15) {
      exam.behavioral_flags.push('Unusual pause pattern detected');
    }

    this.examSessions.set(examId, exam);
  }

  private static calculateCheatingProbability(examId: string): void {
    const exam = this.examSessions.get(examId);
    if (!exam) return;

    let cheatingScore = 0;

    // Weight different factors
    cheatingScore += (100 - exam.keystroke_pattern_consistency) * 0.3;
    cheatingScore += exam.timing_anomalies * 5;
    cheatingScore += exam.copy_paste_attempts * 15;
    cheatingScore += exam.window_focus_violations * 10;
    cheatingScore += exam.typing_speed_deviation * 0.2;
    cheatingScore += (100 - exam.pause_pattern_analysis) * 0.25;

    exam.cheating_probability = Math.min(100, cheatingScore);
    exam.integrity_score = Math.max(0, 100 - exam.cheating_probability);

    this.examSessions.set(examId, exam);
  }

  // Student Identity Verification
  static async verifyStudentIdentity(studentId: string): Promise<StudentIdentityVerification> {
    const verification: StudentIdentityVerification = {
      id: crypto.randomUUID(),
      student_id: studentId,
      verification_session: crypto.randomUUID(),
      enrollment_biometric_match: this.simulateBiometricMatch(),
      writing_style_consistency: this.simulateWritingStyleAnalysis(),
      knowledge_baseline_score: this.simulateKnowledgeBaseline(),
      behavioral_authentication: this.simulateBehavioralAuth(),
      identity_confidence: 0,
      verification_status: 'pending',
      created_at: new Date().toISOString()
    };

    verification.identity_confidence = this.calculateIdentityConfidence(verification);
    verification.verification_status = this.determineVerificationStatus(verification);

    this.identityVerifications.set(studentId, verification);
    return verification;
  }

  private static simulateBiometricMatch(): number {
    return Math.random() * 30 + 70; // 70-100% match
  }

  private static simulateWritingStyleAnalysis(): number {
    return Math.random() * 25 + 75; // 75-100% consistency
  }

  private static simulateKnowledgeBaseline(): number {
    return Math.random() * 40 + 60; // 60-100% baseline match
  }

  private static simulateBehavioralAuth(): number {
    return Math.random() * 35 + 65; // 65-100% behavioral match
  }

  private static calculateIdentityConfidence(verification: StudentIdentityVerification): number {
    const weights = {
      biometric: 0.3,
      writing: 0.25,
      knowledge: 0.25,
      behavioral: 0.2
    };

    return (
      verification.enrollment_biometric_match * weights.biometric +
      verification.writing_style_consistency * weights.writing +
      verification.knowledge_baseline_score * weights.knowledge +
      verification.behavioral_authentication * weights.behavioral
    );
  }

  private static determineVerificationStatus(verification: StudentIdentityVerification): 'pending' | 'verified' | 'flagged' | 'failed' {
    if (verification.identity_confidence >= 85) return 'verified';
    if (verification.identity_confidence >= 70) return 'flagged';
    if (verification.identity_confidence >= 50) return 'pending';
    return 'failed';
  }

  // Academic Integrity Monitoring
  static async initializeIntegrityMonitor(
    studentId: string, 
    courseId: string, 
    assignmentType: 'exam' | 'quiz' | 'assignment' | 'project'
  ): Promise<AcademicIntegrityMonitor> {
    const monitor: AcademicIntegrityMonitor = {
      id: crypto.randomUUID(),
      student_id: studentId,
      course_id: courseId,
      assignment_type: assignmentType,
      behavioral_baseline: this.generateBehavioralBaseline(),
      current_behavior: {},
      deviation_score: 0,
      integrity_flags: [],
      risk_assessment: 'minimal',
      privacy_compliant: true,
      created_at: new Date().toISOString()
    };

    this.integrityMonitors.set(`${studentId}-${courseId}`, monitor);
    this.startIntegrityMonitoring(monitor);
    
    return monitor;
  }

  private static generateBehavioralBaseline(): Record<string, number> {
    return {
      typing_speed: Math.random() * 50 + 50, // 50-100 WPM
      pause_frequency: Math.random() * 0.3 + 0.1, // 0.1-0.4 pauses per word
      error_rate: Math.random() * 0.05, // 0-5% error rate
      work_session_duration: Math.random() * 60 + 30, // 30-90 minutes
      complexity_handling: Math.random() * 40 + 60 // 60-100% complexity score
    };
  }

  private static startIntegrityMonitoring(monitor: AcademicIntegrityMonitor): void {
    const interval = setInterval(() => {
      this.updateCurrentBehavior(monitor);
      this.calculateDeviationScore(monitor);
      this.assessRisk(monitor);
    }, 10000); // Every 10 seconds

    // Stop monitoring after 2 hours
    setTimeout(() => clearInterval(interval), 2 * 60 * 60 * 1000);
  }

  private static updateCurrentBehavior(monitor: AcademicIntegrityMonitor): void {
    monitor.current_behavior = {
      typing_speed: Math.random() * 50 + 50,
      pause_frequency: Math.random() * 0.3 + 0.1,
      error_rate: Math.random() * 0.05,
      work_session_duration: Math.random() * 60 + 30,
      complexity_handling: Math.random() * 40 + 60
    };
  }

  private static calculateDeviationScore(monitor: AcademicIntegrityMonitor): void {
    let totalDeviation = 0;
    let factors = 0;

    for (const [key, currentValue] of Object.entries(monitor.current_behavior)) {
      const baselineValue = monitor.behavioral_baseline[key];
      if (baselineValue !== undefined) {
        const deviation = Math.abs(currentValue - baselineValue) / baselineValue;
        totalDeviation += deviation;
        factors++;
      }
    }

    monitor.deviation_score = factors > 0 ? (totalDeviation / factors) * 100 : 0;
  }

  private static assessRisk(monitor: AcademicIntegrityMonitor): void {
    const deviation = monitor.deviation_score;
    
    if (deviation > 60) {
      monitor.risk_assessment = 'critical';
      monitor.integrity_flags.push('Extreme behavioral deviation detected');
    } else if (deviation > 40) {
      monitor.risk_assessment = 'high';
      monitor.integrity_flags.push('High behavioral deviation detected');
    } else if (deviation > 25) {
      monitor.risk_assessment = 'medium';
      monitor.integrity_flags.push('Moderate behavioral deviation detected');
    } else if (deviation > 15) {
      monitor.risk_assessment = 'low';
    } else {
      monitor.risk_assessment = 'minimal';
    }
  }

  // Utility methods
  static endExam(examId: string): void {
    const exam = this.examSessions.get(examId);
    if (exam) {
      exam.exam_end = new Date().toISOString();
      this.examSessions.set(examId, exam);
    }
  }

  static getExamProctoring(examId: string): ExamProctoring | undefined {
    return this.examSessions.get(examId);
  }

  static getStudentVerification(studentId: string): StudentIdentityVerification | undefined {
    return this.identityVerifications.get(studentId);
  }

  static getIntegrityMonitor(studentId: string, courseId: string): AcademicIntegrityMonitor | undefined {
    return this.integrityMonitors.get(`${studentId}-${courseId}`);
  }

  static getAllExamSessions(): ExamProctoring[] {
    return Array.from(this.examSessions.values());
  }

  static getAllVerifications(): StudentIdentityVerification[] {
    return Array.from(this.identityVerifications.values());
  }

  static getAllIntegrityMonitors(): AcademicIntegrityMonitor[] {
    return Array.from(this.integrityMonitors.values());
  }
}