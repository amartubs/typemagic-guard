import { deviceFingerprinting, DeviceCapabilities } from './deviceFingerprinting';
import { TouchDynamicsCapture, TouchPattern } from './touchDynamics';
import { MouseDynamicsCapture, MousePattern } from './mouseDynamics';
import { BehavioralAnalysis, BehavioralPattern } from './behavioralAnalysis';
import { supabase } from '@/integrations/supabase/client';

export interface MultiModalAuthResult {
  success: boolean;
  combinedConfidence: number;
  individualScores: {
    keystroke?: number;
    touch?: number;
    mouse?: number;
    behavioral?: number;
  };
  riskScore: number;
  modalities: string[];
  deviceFingerprint: string;
}

export class MultiModalBiometricProcessor {
  private touchCapture: TouchDynamicsCapture | null = null;
  private mouseCapture: MouseDynamicsCapture | null = null;
  private behavioralAnalysis: BehavioralAnalysis;
  private capabilities: DeviceCapabilities | null = null;
  private isCapturing = false;

  constructor() {
    this.behavioralAnalysis = new BehavioralAnalysis();
    this.initializeCapture();
  }

  private async initializeCapture(): Promise<void> {
    this.capabilities = await deviceFingerprinting.detectDeviceCapabilities();
    
    if (this.capabilities.hasTouch) {
      this.touchCapture = new TouchDynamicsCapture();
    }
    
    if (this.capabilities.hasMouse) {
      this.mouseCapture = new MouseDynamicsCapture();
    }
  }

  async startCapture(userId: string): Promise<void> {
    if (this.isCapturing) return;
    
    this.isCapturing = true;
    
    // Store device capabilities
    await deviceFingerprinting.storeDeviceCapabilities(userId);
    
    // Start appropriate captures based on device capabilities
    if (this.touchCapture && this.capabilities?.hasTouch) {
      this.touchCapture.startCapture();
    }
    
    if (this.mouseCapture && this.capabilities?.hasMouse) {
      this.mouseCapture.startCapture();
    }
  }

  async stopCaptureAndAnalyze(userId: string): Promise<MultiModalAuthResult> {
    if (!this.isCapturing) {
      throw new Error('Capture not started');
    }

    this.isCapturing = false;
    const deviceFingerprint = await deviceFingerprinting.generateDeviceFingerprint();
    const modalities: string[] = [];
    const individualScores: any = {};
    
    // Collect patterns from all available modalities
    let touchPatterns: TouchPattern[] = [];
    let mousePatterns: MousePattern[] = [];
    let behavioralPatterns: BehavioralPattern[] = [];

    if (this.touchCapture && this.capabilities?.hasTouch) {
      touchPatterns = this.touchCapture.stopCapture();
      if (touchPatterns.length > 0) {
        modalities.push('touch');
        individualScores.touch = await this.analyzeTouchPatterns(userId, touchPatterns, deviceFingerprint.id);
      }
    }

    if (this.mouseCapture && this.capabilities?.hasMouse) {
      mousePatterns = this.mouseCapture.stopCapture();
      if (mousePatterns.length > 0) {
        modalities.push('mouse');
        individualScores.mouse = await this.analyzeMousePatterns(userId, mousePatterns, deviceFingerprint.id);
      }
    }

    // Always analyze behavioral patterns
    behavioralPatterns = this.behavioralAnalysis.getAllPatterns();
    modalities.push('behavioral');
    individualScores.behavioral = await this.analyzeBehavioralPatterns(userId, behavioralPatterns, deviceFingerprint.id);

    // Calculate combined confidence and risk score
    const { combinedConfidence, riskScore } = this.calculateCombinedScore(individualScores, modalities);

    const result: MultiModalAuthResult = {
      success: combinedConfidence >= 70 && riskScore < 50,
      combinedConfidence,
      individualScores,
      riskScore,
      modalities,
      deviceFingerprint: deviceFingerprint.id
    };

    // Store authentication attempt
    await this.storeAuthAttempt(userId, result);

    return result;
  }

  private async analyzeTouchPatterns(userId: string, patterns: TouchPattern[], deviceFingerprint: string): Promise<number> {
    const biometricProfileId = await this.getBiometricProfileId(userId);

    // Compute simple stability-based score
    const speeds: number[] = patterns.map(p => {
      if (p.type === 'swipe' && typeof p.velocity === 'number') return Math.max(0, p.velocity);
      const dur = Math.max(1, p.duration);
      return 1 / dur; // taps -> inverse of duration
    });
    const avg = speeds.length ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;
    const variance = speeds.length ? speeds.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / speeds.length : 0;
    const std = Math.sqrt(variance);
    const stability = avg > 0 ? Math.max(0, 1 - std / avg) : 0;
    const sessionScore = Math.round(Math.min(95, Math.max(40, 50 + stability * 40 + Math.min(patterns.length, 10))));

    for (const pattern of patterns) {
      const { error } = await supabase.from('touch_patterns').insert({
        user_id: userId,
        biometric_profile_id: biometricProfileId,
        pattern_type: pattern.type,
        pattern_data: pattern as any,
        device_fingerprint: deviceFingerprint,
        context: pattern.context,
        confidence_score: sessionScore
      });
      if (error) console.warn('Failed to insert touch pattern', error.message);
    }

    return sessionScore;
  }

  private async analyzeMousePatterns(userId: string, patterns: MousePattern[], deviceFingerprint: string): Promise<number> {
    const biometricProfileId = await this.getBiometricProfileId(userId);

    // Compute per-pattern scores and store
    const perScores: number[] = [];
    for (const pattern of patterns) {
      let score = 65; // baseline
      if ((pattern as any).straightness !== undefined) {
        const m = pattern as any;
        const straightness = Math.max(0, Math.min(1, m.straightness));
        const jerk = Math.abs(m.jerk || 0);
        const smoothness = Math.max(0, 1 - Math.min(jerk / 0.02, 1));
        score = Math.round(40 + straightness * 40 + smoothness * 20);
      }
      perScores.push(score);
      const { error } = await supabase.from('mouse_patterns').insert({
        user_id: userId,
        biometric_profile_id: biometricProfileId,
        pattern_type: pattern.type,
        pattern_data: pattern as any,
        device_fingerprint: deviceFingerprint,
        context: pattern.context,
        confidence_score: score
      });
      if (error) console.warn('Failed to insert mouse pattern', error.message);
    }

    const avgScore = perScores.length ? Math.round(perScores.reduce((a, b) => a + b, 0) / perScores.length) : 60;
    return Math.min(95, Math.max(40, avgScore));
  }

  private async analyzeBehavioralPatterns(userId: string, patterns: BehavioralPattern[], deviceFingerprint: string): Promise<number> {
    const biometricProfileId = await this.getBiometricProfileId(userId);

    // Compute session score from observed behavioral patterns
    const scores: number[] = [];
    for (const pattern of patterns) {
      try {
        if (pattern.type === 'timing') {
          const data = (pattern as any).data || {};
          const rhythm: number[] = Array.isArray(data.typingRhythm) ? data.typingRhythm : [];
          const mean = rhythm.length ? rhythm.reduce((a, b) => a + b, 0) / rhythm.length : 0;
          const variance = rhythm.length ? rhythm.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / rhythm.length : 0;
          const std = Math.sqrt(variance);
          const cv = mean > 0 ? Math.min(1, std / mean) : 0.5;
          const activityLevel = (data.activityLevel || 'medium') as 'low' | 'medium' | 'high';
          const activityMap: Record<string, number> = { low: 0.5, medium: 0.7, high: 0.9 };
          const freqPerMin = (data.typingRhythm?.length || 0) / Math.max(1, (data.sessionDuration || 60000) / 60000);
          const score = 45 + (activityMap[activityLevel] || 0.7) * 30 + (1 - cv) * 20 + Math.min(5, freqPerMin);
          scores.push(score);
        } else if (pattern.type === 'network') {
          const ns = Math.max(0, Math.min(1, (pattern as any).data?.networkStability ?? 0.5));
          scores.push(50 + ns * 40);
        } else if (pattern.type === 'location') {
          const lc = Math.max(0, Math.min(1, (pattern as any).data?.locationConsistency ?? 0.5));
          scores.push(50 + lc * 35);
        } else if (pattern.type === 'app_usage') {
          const freq = Math.max(0, (pattern as any).data?.interactionFrequency ?? 0);
          const norm = Math.min(1, freq / 20);
          scores.push(45 + norm * 45);
        }
      } catch (e) {
        console.warn('Behavioral scoring fallback', e);
      }
    }

    const sessionScore = scores.length
      ? Math.round(Math.min(95, Math.max(40, scores.reduce((a, b) => a + b, 0) / scores.length)))
      : 60;

    // Store patterns with computed confidence
    for (const pattern of patterns) {
      const { error } = await supabase.from('behavioral_patterns').insert({
        user_id: userId,
        biometric_profile_id: biometricProfileId,
        pattern_type: pattern.type,
        pattern_data: (pattern as any).data as any,
        device_fingerprint: deviceFingerprint,
        context: pattern.context,
        confidence_score: sessionScore
      });
      if (error) console.warn('Failed to insert behavioral pattern', error.message);
    }

    return sessionScore;
  }

  private calculateCombinedScore(scores: any, modalities: string[]) {
    const validScores = Object.values(scores).filter(s => typeof s === 'number') as number[];
    
    if (validScores.length === 0) {
      return { combinedConfidence: 0, riskScore: 100 };
    }

    // Weighted combination based on modality reliability
    let totalWeight = 0;
    let weightedSum = 0;

    Object.entries(scores).forEach(([modality, score]) => {
      if (typeof score === 'number') {
        const weight = this.getModalityWeight(modality);
        weightedSum += score * weight;
        totalWeight += weight;
      }
    });

    const combinedConfidence = totalWeight > 0 ? weightedSum / totalWeight : 0;
    
    // Risk score calculation
    const modalityCount = modalities.length;
    const deviceRisk = this.calculateDeviceRisk();
    const consistencyRisk = this.calculateConsistencyRisk(scores);
    
    const riskScore = Math.max(0, 100 - combinedConfidence - (modalityCount * 10) + deviceRisk + consistencyRisk);

    return { combinedConfidence: Math.round(combinedConfidence), riskScore: Math.round(riskScore) };
  }

  private getModalityWeight(modality: string): number {
    const weights = {
      keystroke: 1.0,
      touch: 0.8,
      mouse: 0.9,
      behavioral: 0.7
    };
    return weights[modality as keyof typeof weights] || 0.5;
  }

  private calculateDeviceRisk(): number {
    if (!this.capabilities) return 20;
    
    // Higher risk for mobile devices (easier to spoof)
    if (this.capabilities.deviceType === 'mobile') return 15;
    if (this.capabilities.deviceType === 'tablet') return 10;
    return 5; // Desktop
  }

  private calculateConsistencyRisk(scores: any): number {
    const validScores = Object.values(scores).filter(s => typeof s === 'number') as number[];
    if (validScores.length < 2) return 0;
    
    const mean = validScores.reduce((a, b) => a + b, 0) / validScores.length;
    const variance = validScores.reduce((acc, score) => acc + Math.pow(score - mean, 2), 0) / validScores.length;
    
    // Higher variance = higher risk
    return Math.min(30, variance / 10);
  }

  private async getBiometricProfileId(userId: string): Promise<string> {
    const { data } = await supabase
      .from('biometric_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();
    
    return data?.id || '';
  }

  private async storeAuthAttempt(userId: string, result: MultiModalAuthResult): Promise<void> {
    await supabase.from('multimodal_auth_attempts').insert({
      user_id: userId,
      device_fingerprint: result.deviceFingerprint,
      modalities_used: result.modalities,
      individual_scores: result.individualScores,
      combined_confidence: result.combinedConfidence,
      risk_score: result.riskScore,
      success: result.success,
      anomaly_details: !result.success ? { 
        reason: 'Multi-modal authentication failed',
        confidence: result.combinedConfidence,
        risk: result.riskScore 
      } : null
    });
  }
}

export const multiModalProcessor = new MultiModalBiometricProcessor();