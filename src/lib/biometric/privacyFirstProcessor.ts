/**
 * Privacy-First Multi-Modal Processor
 * Integrates Edge Processing + Adaptive Sampling + Self-Learning
 * Complete Patent Differentiation Implementation
 */

import { edgeProcessor, LocalProcessingResult } from './edgeProcessor';
import { adaptiveSampling, SamplingContext, AdaptiveSamplingConfig } from './adaptiveSampling';
import { deviceFingerprinting } from './deviceFingerprinting';
import { TouchDynamicsCapture } from './touchDynamics';
import { MouseDynamicsCapture } from './mouseDynamics';
import { BehavioralAnalysis } from './behavioralAnalysis';

export interface PrivacyFirstAuthConfig {
  enableEdgeProcessing: boolean;
  enableAdaptiveSampling: boolean;
  enableSelfLearning: boolean;
  enableRealTimeAdjustment: boolean;
  privacyMode: 'strict' | 'balanced' | 'performance';
}

export interface PrivacyFirstAuthResult extends LocalProcessingResult {
  samplingConfig: AdaptiveSamplingConfig;
  privacyScore: number;
  adaptiveRecommendations: string[];
  learningProgress: {
    patternsLearned: number;
    templateQuality: number;
    adaptationRate: number;
  };
}

export class PrivacyFirstBiometricProcessor {
  private static instance: PrivacyFirstBiometricProcessor;
  private touchCapture: TouchDynamicsCapture | null = null;
  private mouseCapture: MouseDynamicsCapture | null = null;
  private behavioralAnalysis: BehavioralAnalysis;
  private sessionMetrics = new Map<string, SessionMetrics>();
  private isProcessing = false;

  private config: PrivacyFirstAuthConfig = {
    enableEdgeProcessing: true,
    enableAdaptiveSampling: true,
    enableSelfLearning: true,
    enableRealTimeAdjustment: true,
    privacyMode: 'strict'
  };

  static getInstance(): PrivacyFirstBiometricProcessor {
    if (!this.instance) {
      this.instance = new PrivacyFirstBiometricProcessor();
    }
    return this.instance;
  }

  constructor() {
    this.behavioralAnalysis = new BehavioralAnalysis();
    this.initializeCapture();
  }

  /**
   * Complete Privacy-First Authentication with all patent differentiators
   */
  async authenticatePrivacyFirst(
    userId: string,
    userEmail: string,
    customConfig?: Partial<PrivacyFirstAuthConfig>
  ): Promise<PrivacyFirstAuthResult> {
    
    if (this.isProcessing) {
      throw new Error('Authentication already in progress');
    }

    this.isProcessing = true;
    
    try {
      // Apply custom configuration
      const activeConfig = { ...this.config, ...customConfig };
      
      // Step 1: Generate sampling context
      const context = await this.generateSamplingContext(userId);
      
      // Step 2: Calculate adaptive sampling configuration
      const samplingConfig = activeConfig.enableAdaptiveSampling ? 
        adaptiveSampling.calculateOptimalSampling(userId, context) :
        { baseDuration: 3000, minDuration: 1000, maxDuration: 8000, riskMultiplier: 1.0, contextualAdjustments: {} };

      // Step 3: Perform adaptive biometric capture
      const capturedPatterns = await this.performAdaptiveCapture(samplingConfig, context);
      
      // Step 4: Privacy-first local processing (no external API calls)
      const authResult = activeConfig.enableEdgeProcessing ?
        await this.processCompletelyLocal(userId, capturedPatterns, context) :
        await this.processWithMinimalRemote(userId, capturedPatterns);

      // Step 5: Generate privacy score and recommendations
      const privacyScore = this.calculatePrivacyScore(activeConfig, authResult);
      const adaptiveRecommendations = this.generateAdaptiveRecommendations(context, authResult);
      
      // Step 6: Update learning progress
      const learningProgress = this.updateLearningProgress(userId, authResult, activeConfig.enableSelfLearning);

      // Step 7: Real-time adjustment of future sampling
      if (activeConfig.enableRealTimeAdjustment) {
        this.adjustFutureSampling(userId, authResult, context);
      }

      const result: PrivacyFirstAuthResult = {
        ...authResult,
        samplingConfig,
        privacyScore,
        adaptiveRecommendations,
        learningProgress
      };

      // Log session metrics for continuous improvement (locally only)
      this.updateSessionMetrics(userId, result);

      return result;

    } finally {
      this.isProcessing = false;
    }
  }

  private async generateSamplingContext(userId: string): Promise<SamplingContext> {
    const now = new Date();
    const deviceCapabilities = await deviceFingerprinting.detectDeviceCapabilities();
    const sessionMetrics = this.getSessionMetrics(userId);
    const behavioralPatterns = this.behavioralAnalysis.getAllPatterns();

    return {
      timeOfDay: now.getHours(),
      dayOfWeek: now.getDay(),
      userBehaviorPattern: this.inferBehaviorPattern(behavioralPatterns),
      networkStability: this.calculateNetworkStability(),
      deviceType: deviceCapabilities.deviceType,
      locationConsistency: this.calculateLocationConsistency(behavioralPatterns),
      sessionDuration: sessionMetrics.currentSessionDuration,
      interactionFrequency: sessionMetrics.interactionFrequency,
      lastAuthConfidence: sessionMetrics.lastAuthConfidence,
      recentFailures: sessionMetrics.recentFailures
    };
  }

  private async performAdaptiveCapture(
    config: AdaptiveSamplingConfig, 
    context: SamplingContext
  ): Promise<any> {
    const patterns: any = {};
    
    // Calculate sampling depth based on context
    const depthConfig = adaptiveSampling.calculateSamplingDepth(context, context.lastAuthConfidence);
    
    // Start captures based on device capabilities and depth configuration
    const capturePromises: Promise<any>[] = [];

    if (this.touchCapture && depthConfig.modalityWeights.touch > 0) {
      this.touchCapture.startCapture();
      capturePromises.push(
        new Promise(resolve => {
          setTimeout(() => {
            patterns.touch = this.touchCapture!.stopCapture();
            resolve(patterns.touch);
          }, config.baseDuration * depthConfig.frequencyMultiplier);
        })
      );
    }

    if (this.mouseCapture && depthConfig.modalityWeights.mouse > 0) {
      this.mouseCapture.startCapture();
      capturePromises.push(
        new Promise(resolve => {
          setTimeout(() => {
            patterns.mouse = this.mouseCapture!.stopCapture();
            resolve(patterns.mouse);
          }, config.baseDuration * depthConfig.frequencyMultiplier);
        })
      );
    }

    // Always capture behavioral patterns
    patterns.behavioral = this.behavioralAnalysis.getAllPatterns();

    // Wait for all captures to complete
    await Promise.all(capturePromises);

    return patterns;
  }

  private async processCompletelyLocal(
    userId: string, 
    patterns: any, 
    context: SamplingContext
  ): Promise<LocalProcessingResult> {
    const deviceFingerprint = await deviceFingerprinting.generateDeviceFingerprint();
    
    // Complete local processing - NO external API calls
    return await edgeProcessor.processLocally(userId, patterns, deviceFingerprint.id);
  }

  private async processWithMinimalRemote(userId: string, patterns: any): Promise<LocalProcessingResult> {
    // Fallback mode with minimal remote processing
    // This would still prioritize local analysis but allow some cloud assistance
    const localResult = await this.processCompletelyLocal(userId, patterns, {} as SamplingContext);
    
    // Could enhance with selective cloud processing if needed
    return localResult;
  }

  private calculatePrivacyScore(config: PrivacyFirstAuthConfig, result: LocalProcessingResult): number {
    let score = 100; // Start with perfect privacy

    // Reduce score based on configuration
    if (!config.enableEdgeProcessing) score -= 30; // Major privacy impact
    if (config.privacyMode !== 'strict') score -= 10;
    if (!config.enableSelfLearning) score -= 5; // Self-learning reduces external dependency

    // Processing time impacts privacy (faster = more private)
    if (result.processingTime > 1000) score -= 5;
    if (result.processingTime > 3000) score -= 10;

    return Math.max(0, score);
  }

  private generateAdaptiveRecommendations(
    context: SamplingContext, 
    result: LocalProcessingResult
  ): string[] {
    const recommendations: string[] = [];

    // Performance recommendations
    if (result.processingTime > 2000) {
      recommendations.push('Consider lighter analysis for better performance');
    }

    // Context-based recommendations
    if (context.networkStability < 0.5) {
      recommendations.push('Unstable network detected - using enhanced local processing');
    }

    if (context.userBehaviorPattern === 'rushed') {
      recommendations.push('Quick authentication mode activated');
    }

    // Confidence-based recommendations
    if (result.confidence < 70) {
      recommendations.push('Additional sampling may improve accuracy');
    }

    // Privacy recommendations
    if (this.config.privacyMode === 'strict') {
      recommendations.push('All processing performed locally for maximum privacy');
    }

    return recommendations;
  }

  private updateLearningProgress(
    userId: string, 
    result: LocalProcessingResult, 
    selfLearningEnabled: boolean
  ): { patternsLearned: number; templateQuality: number; adaptationRate: number } {
    
    if (!selfLearningEnabled) {
      return { patternsLearned: 0, templateQuality: 0, adaptationRate: 0 };
    }

    const sessionMetrics = this.getSessionMetrics(userId);
    
    // Update learning metrics
    if (result.success) {
      sessionMetrics.successfulPatterns++;
    }
    
    sessionMetrics.totalPatterns++;
    
    const templateQuality = sessionMetrics.successfulPatterns / Math.max(1, sessionMetrics.totalPatterns);
    const adaptationRate = this.calculateAdaptationRate(sessionMetrics);

    return {
      patternsLearned: sessionMetrics.totalPatterns,
      templateQuality: Math.round(templateQuality * 100),
      adaptationRate: Math.round(adaptationRate * 100)
    };
  }

  private adjustFutureSampling(
    userId: string, 
    result: LocalProcessingResult, 
    context: SamplingContext
  ): void {
    const sessionMetrics = this.getSessionMetrics(userId);
    
    // Adjust based on success/failure patterns
    if (result.success && result.confidence > 85) {
      sessionMetrics.consecutiveSuccesses++;
      sessionMetrics.consecutiveFailures = 0;
    } else {
      sessionMetrics.consecutiveFailures++;
      sessionMetrics.consecutiveSuccesses = 0;
    }

    // Dynamic adjustment logic will be used by adaptive sampling engine
    sessionMetrics.lastAuthConfidence = result.confidence;
    sessionMetrics.lastContext = context;
  }

  private async initializeCapture(): Promise<void> {
    const capabilities = await deviceFingerprinting.detectDeviceCapabilities();
    
    if (capabilities.hasTouch) {
      this.touchCapture = new TouchDynamicsCapture();
    }
    
    if (capabilities.hasMouse) {
      this.mouseCapture = new MouseDynamicsCapture();
    }
  }

  private inferBehaviorPattern(patterns: any[]): 'focused' | 'distracted' | 'rushed' | 'relaxed' {
    // Analyze behavioral patterns to infer current user state
    if (patterns.length === 0) return 'relaxed';
    
    const avgInteractionTime = patterns
      .map(p => p.data?.sessionDuration || 0)
      .reduce((a, b) => a + b, 0) / patterns.length;

    if (avgInteractionTime < 30000) return 'rushed';
    if (avgInteractionTime > 300000) return 'focused';
    return 'relaxed';
  }

  private calculateNetworkStability(): number {
    // Simple network stability calculation
    const connection = (navigator as any).connection;
    if (!connection) return 0.8; // Default moderate stability
    
    const rtt = connection.rtt || 100;
    const downlink = connection.downlink || 5;
    
    // Normalize to 0-1 scale
    const stability = Math.min(1, (downlink / 10) * (300 / Math.max(rtt, 50)));
    return stability;
  }

  private calculateLocationConsistency(patterns: any[]): number {
    // Analyze timezone and timing patterns for consistency
    const timezones = patterns
      .map(p => p.data?.timezone)
      .filter(tz => tz);
    
    if (timezones.length === 0) return 1.0;
    
    const uniqueTimezones = new Set(timezones);
    return 1 - ((uniqueTimezones.size - 1) / timezones.length);
  }

  private calculateAdaptationRate(sessionMetrics: SessionMetrics): number {
    if (sessionMetrics.totalPatterns < 10) return 0.1; // Low adaptation for new users
    
    const recentSuccessRate = sessionMetrics.successfulPatterns / sessionMetrics.totalPatterns;
    return Math.min(0.9, recentSuccessRate);
  }

  private getSessionMetrics(userId: string): SessionMetrics {
    if (!this.sessionMetrics.has(userId)) {
      this.sessionMetrics.set(userId, new SessionMetrics());
    }
    return this.sessionMetrics.get(userId)!;
  }

  private updateSessionMetrics(userId: string, result: PrivacyFirstAuthResult): void {
    const metrics = this.getSessionMetrics(userId);
    metrics.currentSessionDuration = Date.now() - metrics.sessionStartTime;
    metrics.lastAuthConfidence = result.confidence;
    metrics.interactionFrequency = metrics.totalInteractions / (metrics.currentSessionDuration / 60000);
  }

  /**
   * Get privacy-first system status
   */
  getSystemStatus(): {
    privacyMode: string;
    localProcessing: boolean;
    adaptiveSampling: boolean;
    selfLearning: boolean;
    activeUsers: number;
    totalProcessingTime: number;
  } {
    return {
      privacyMode: this.config.privacyMode,
      localProcessing: this.config.enableEdgeProcessing,
      adaptiveSampling: this.config.enableAdaptiveSampling,
      selfLearning: this.config.enableSelfLearning,
      activeUsers: this.sessionMetrics.size,
      totalProcessingTime: Array.from(this.sessionMetrics.values())
        .reduce((sum, metrics) => sum + metrics.totalProcessingTime, 0)
    };
  }

  /**
   * Update system configuration
   */
  updateConfiguration(newConfig: Partial<PrivacyFirstAuthConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

class SessionMetrics {
  public sessionStartTime = Date.now();
  public currentSessionDuration = 0;
  public totalInteractions = 0;
  public interactionFrequency = 0;
  public lastAuthConfidence = 0;
  public recentFailures = 0;
  public consecutiveSuccesses = 0;
  public consecutiveFailures = 0;
  public successfulPatterns = 0;
  public totalPatterns = 0;
  public totalProcessingTime = 0;
  public lastContext: SamplingContext | null = null;
}

export const privacyFirstProcessor = PrivacyFirstBiometricProcessor.getInstance();