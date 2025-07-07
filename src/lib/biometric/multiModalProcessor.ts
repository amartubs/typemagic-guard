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
    // Store patterns and calculate confidence
    for (const pattern of patterns) {
      await supabase.from('touch_patterns').insert({
        user_id: userId,
        biometric_profile_id: await this.getBiometricProfileId(userId),
        pattern_type: pattern.type,
        pattern_data: pattern,
        device_fingerprint: deviceFingerprint,
        context: pattern.context
      });
    }

    // Simplified confidence calculation - would use ML in production
    return Math.random() * 40 + 50; // 50-90% confidence
  }

  private async analyzeMousePatterns(userId: string, patterns: MousePattern[], deviceFingerprint: string): Promise<number> {
    // Store patterns and calculate confidence
    for (const pattern of patterns) {
      await supabase.from('mouse_patterns').insert({
        user_id: userId,
        biometric_profile_id: await this.getBiometricProfileId(userId),
        pattern_type: pattern.type,
        pattern_data: pattern,
        device_fingerprint: deviceFingerprint,
        context: pattern.context
      });
    }

    return Math.random() * 40 + 50;
  }

  private async analyzeBehavioralPatterns(userId: string, patterns: BehavioralPattern[], deviceFingerprint: string): Promise<number> {
    // Store patterns and calculate confidence
    for (const pattern of patterns) {
      await supabase.from('behavioral_patterns').insert({
        user_id: userId,
        biometric_profile_id: await this.getBiometricProfileId(userId),
        pattern_type: pattern.type,
        pattern_data: pattern.data,
        device_fingerprint: deviceFingerprint,
        context: pattern.context
      });
    }

    return Math.random() * 30 + 60; // Behavioral is typically more reliable
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