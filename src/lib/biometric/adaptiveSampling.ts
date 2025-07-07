/**
 * Risk-Based Dynamic Sampling Engine
 * Key Patent Differentiator: Context-aware adaptive sampling frequency
 */

export interface SamplingContext {
  timeOfDay: number;
  dayOfWeek: number;
  userBehaviorPattern: 'focused' | 'distracted' | 'rushed' | 'relaxed';
  networkStability: number;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  locationConsistency: number;
  sessionDuration: number;
  interactionFrequency: number;
  lastAuthConfidence: number;
  recentFailures: number;
}

export interface AdaptiveSamplingConfig {
  baseDuration: number;
  minDuration: number; 
  maxDuration: number;
  riskMultiplier: number;
  contextualAdjustments: Record<string, number>;
}

export class AdaptiveSamplingEngine {
  private static instance: AdaptiveSamplingEngine;
  private samplingHistory = new Map<string, SamplingSession[]>();
  private userContextProfiles = new Map<string, UserContextProfile>();

  static getInstance(): AdaptiveSamplingEngine {
    if (!this.instance) {
      this.instance = new AdaptiveSamplingEngine();
    }
    return this.instance;
  }

  /**
   * Calculate optimal sampling duration based on current context and risk
   */
  calculateOptimalSampling(userId: string, context: SamplingContext): AdaptiveSamplingConfig {
    const userProfile = this.getUserContextProfile(userId);
    const riskScore = this.assessCurrentRisk(context, userProfile);
    
    // Base configuration
    const baseConfig: AdaptiveSamplingConfig = {
      baseDuration: 3000, // 3 seconds default
      minDuration: 1000,  // 1 second minimum
      maxDuration: 8000,  // 8 seconds maximum
      riskMultiplier: 1.0,
      contextualAdjustments: {}
    };

    // Apply risk-based adjustments
    baseConfig.riskMultiplier = this.calculateRiskMultiplier(riskScore);
    
    // Apply contextual adjustments
    baseConfig.contextualAdjustments = {
      timeOfDay: this.getTimeOfDayAdjustment(context.timeOfDay, userProfile),
      behaviorPattern: this.getBehaviorPatternAdjustment(context.userBehaviorPattern),
      networkStability: this.getNetworkStabilityAdjustment(context.networkStability),
      deviceType: this.getDeviceTypeAdjustment(context.deviceType),
      locationConsistency: this.getLocationConsistencyAdjustment(context.locationConsistency),
      sessionDuration: this.getSessionDurationAdjustment(context.sessionDuration),
      interactionFrequency: this.getInteractionFrequencyAdjustment(context.interactionFrequency),
      recentPerformance: this.getRecentPerformanceAdjustment(context.lastAuthConfidence, context.recentFailures)
    };

    // Calculate final sampling duration
    const adjustmentFactor = Object.values(baseConfig.contextualAdjustments)
      .reduce((acc, val) => acc * val, baseConfig.riskMultiplier);
    
    const optimalDuration = Math.max(
      baseConfig.minDuration,
      Math.min(baseConfig.maxDuration, baseConfig.baseDuration * adjustmentFactor)
    );

    baseConfig.baseDuration = optimalDuration;

    // Log sampling decision for learning
    this.logSamplingDecision(userId, context, baseConfig, riskScore);

    return baseConfig;
  }

  /**
   * Dynamic depth adjustment based on current confidence and risk
   */
  calculateSamplingDepth(context: SamplingContext, currentConfidence: number): {
    modalityWeights: Record<string, number>;
    analysisDepth: 'shallow' | 'standard' | 'deep';
    frequencyMultiplier: number;
  } {
    let analysisDepth: 'shallow' | 'standard' | 'deep' = 'standard';
    let frequencyMultiplier = 1.0;
    
    // Adjust based on current confidence
    if (currentConfidence < 50) {
      analysisDepth = 'deep';
      frequencyMultiplier = 1.5;
    } else if (currentConfidence > 85) {
      analysisDepth = 'shallow';
      frequencyMultiplier = 0.7;
    }

    // Context-based depth adjustments
    if (context.userBehaviorPattern === 'rushed') {
      analysisDepth = 'shallow';
      frequencyMultiplier *= 0.8;
    } else if (context.userBehaviorPattern === 'suspicious' as any) {
      analysisDepth = 'deep';
      frequencyMultiplier *= 1.3;
    }

    // Device-specific adjustments
    const modalityWeights: Record<string, number> = {
      keystroke: context.deviceType === 'desktop' ? 1.0 : 0.5,
      touch: context.deviceType !== 'desktop' ? 1.0 : 0.0,
      mouse: context.deviceType === 'desktop' ? 1.0 : 0.0,
      behavioral: 1.0 // Always important
    };

    return {
      modalityWeights,
      analysisDepth,
      frequencyMultiplier
    };
  }

  private assessCurrentRisk(context: SamplingContext, userProfile: UserContextProfile): number {
    let riskScore = 0;

    // Time-based risk
    if (this.isUnusualTime(context.timeOfDay, context.dayOfWeek, userProfile)) {
      riskScore += 20;
    }

    // Location consistency risk
    if (context.locationConsistency < 0.5) {
      riskScore += 25;
    }

    // Network stability risk
    if (context.networkStability < 0.7) {
      riskScore += 15;
    }

    // Recent failures risk
    riskScore += context.recentFailures * 10;

    // Low confidence history risk
    if (context.lastAuthConfidence < 60) {
      riskScore += 20;
    }

    // Behavioral anomaly risk
    if (context.userBehaviorPattern === 'distracted' || context.interactionFrequency > userProfile.averageInteractionFrequency * 2) {
      riskScore += 15;
    }

    return Math.min(100, riskScore);
  }

  private calculateRiskMultiplier(riskScore: number): number {
    // Higher risk = longer sampling duration
    if (riskScore > 70) return 1.8;
    if (riskScore > 50) return 1.4;
    if (riskScore > 30) return 1.2;
    if (riskScore < 10) return 0.8;
    return 1.0;
  }

  private getTimeOfDayAdjustment(hour: number, userProfile: UserContextProfile): number {
    const userActiveHours = userProfile.activeHours;
    const isActiveHour = userActiveHours.includes(hour);
    
    // Longer sampling during unusual hours
    return isActiveHour ? 1.0 : 1.3;
  }

  private getBehaviorPatternAdjustment(pattern: string): number {
    const adjustments = {
      'focused': 0.9,   // Shorter sampling for focused users
      'relaxed': 1.0,   // Normal sampling
      'distracted': 1.2, // Longer sampling for distracted users
      'rushed': 0.8     // Shorter sampling for rushed users
    };
    return adjustments[pattern as keyof typeof adjustments] || 1.0;
  }

  private getNetworkStabilityAdjustment(stability: number): number {
    // Poor network = shorter sampling to reduce frustration
    if (stability < 0.5) return 0.7;
    if (stability < 0.8) return 0.9;
    return 1.0;
  }

  private getDeviceTypeAdjustment(deviceType: string): number {
    const adjustments = {
      'mobile': 0.8,   // Shorter on mobile
      'tablet': 0.9,   // Slightly shorter on tablet
      'desktop': 1.0   // Normal on desktop
    };
    return adjustments[deviceType as keyof typeof adjustments] || 1.0;
  }

  private getLocationConsistencyAdjustment(consistency: number): number {
    // Low location consistency = longer sampling
    if (consistency < 0.3) return 1.4;
    if (consistency < 0.6) return 1.2;
    return 1.0;
  }

  private getSessionDurationAdjustment(duration: number): number {
    // Very short sessions might be suspicious
    if (duration < 30000) return 1.2; // Less than 30 seconds
    if (duration > 300000) return 0.9; // More than 5 minutes
    return 1.0;
  }

  private getInteractionFrequencyAdjustment(frequency: number): number {
    // Very high frequency might indicate automation
    if (frequency > 20) return 1.3; // More than 20 interactions per minute
    if (frequency < 2) return 1.1;  // Less than 2 interactions per minute
    return 1.0;
  }

  private getRecentPerformanceAdjustment(lastConfidence: number, failures: number): number {
    let multiplier = 1.0;
    
    // Recent low confidence
    if (lastConfidence < 60) multiplier *= 1.2;
    
    // Recent failures
    if (failures > 2) multiplier *= 1.3;
    if (failures > 0) multiplier *= 1.1;
    
    return multiplier;
  }

  private isUnusualTime(hour: number, dayOfWeek: number, userProfile: UserContextProfile): boolean {
    return !userProfile.activeHours.includes(hour) || !userProfile.activeDays.includes(dayOfWeek);
  }

  private getUserContextProfile(userId: string): UserContextProfile {
    if (!this.userContextProfiles.has(userId)) {
      // Create default profile for new users
      this.userContextProfiles.set(userId, new UserContextProfile(userId));
    }
    return this.userContextProfiles.get(userId)!;
  }

  private logSamplingDecision(
    userId: string, 
    context: SamplingContext, 
    config: AdaptiveSamplingConfig, 
    riskScore: number
  ): void {
    const session: SamplingSession = {
      timestamp: Date.now(),
      context,
      config,
      riskScore,
      userId
    };

    if (!this.samplingHistory.has(userId)) {
      this.samplingHistory.set(userId, []);
    }

    const history = this.samplingHistory.get(userId)!;
    history.push(session);

    // Keep only recent history
    if (history.length > 100) {
      history.shift();
    }

    // Update user context profile
    this.updateUserContextProfile(userId, context);
  }

  private updateUserContextProfile(userId: string, context: SamplingContext): void {
    const profile = this.getUserContextProfile(userId);
    profile.updateFromContext(context);
  }

  /**
   * Get adaptive sampling recommendations for UI
   */
  getSamplingRecommendations(userId: string, context: SamplingContext): {
    recommendedDuration: number;
    confidencePrediction: number;
    riskFactors: string[];
    optimizations: string[];
  } {
    const config = this.calculateOptimalSampling(userId, context);
    const riskScore = this.assessCurrentRisk(context, this.getUserContextProfile(userId));
    
    const riskFactors: string[] = [];
    const optimizations: string[] = [];

    // Identify risk factors
    if (context.networkStability < 0.7) riskFactors.push('Unstable network connection');
    if (context.locationConsistency < 0.5) riskFactors.push('Unusual location pattern');
    if (context.recentFailures > 0) riskFactors.push('Recent authentication failures');
    if (context.lastAuthConfidence < 60) riskFactors.push('Low recent confidence scores');

    // Suggest optimizations
    if (config.baseDuration > 5000) optimizations.push('Extended sampling for enhanced security');
    if (context.deviceType !== 'desktop') optimizations.push('Touch-optimized biometric analysis');
    if (context.userBehaviorPattern === 'rushed') optimizations.push('Streamlined capture for efficiency');

    return {
      recommendedDuration: config.baseDuration,
      confidencePrediction: Math.max(60, 100 - riskScore),
      riskFactors,
      optimizations
    };
  }
}

interface SamplingSession {
  timestamp: number;
  context: SamplingContext;
  config: AdaptiveSamplingConfig;
  riskScore: number;
  userId: string;
}

class UserContextProfile {
  public activeHours: number[] = [];
  public activeDays: number[] = [];
  public averageInteractionFrequency = 5;
  public typicalSessionDuration = 120000; // 2 minutes
  public preferredNetworkTypes: string[] = [];
  public locationPatterns: string[] = [];
  private updateCount = 0;

  constructor(private userId: string) {
    // Initialize with default patterns
    this.activeHours = Array.from({length: 12}, (_, i) => i + 8); // 8 AM to 8 PM
    this.activeDays = [1, 2, 3, 4, 5]; // Weekdays
  }

  updateFromContext(context: SamplingContext): void {
    this.updateCount++;
    const learningRate = Math.min(0.1, 1 / this.updateCount);

    // Update active hours
    if (!this.activeHours.includes(context.timeOfDay)) {
      this.activeHours.push(context.timeOfDay);
      this.activeHours.sort();
    }

    // Update active days
    if (!this.activeDays.includes(context.dayOfWeek)) {
      this.activeDays.push(context.dayOfWeek);
      this.activeDays.sort();
    }

    // Update average interaction frequency
    this.averageInteractionFrequency = 
      this.averageInteractionFrequency * (1 - learningRate) + 
      context.interactionFrequency * learningRate;

    // Update typical session duration
    this.typicalSessionDuration = 
      this.typicalSessionDuration * (1 - learningRate) + 
      context.sessionDuration * learningRate;
  }
}

export const adaptiveSampling = AdaptiveSamplingEngine.getInstance();
