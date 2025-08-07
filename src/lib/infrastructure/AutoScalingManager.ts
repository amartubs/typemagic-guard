/**
 * Auto-Scaling Infrastructure for Biometric Authentication System
 * Implements intelligent scaling based on load patterns and performance metrics
 */

export interface ScalingConfig {
  minInstances: number;
  maxInstances: number;
  targetCpuUtilization: number;
  targetMemoryUtilization: number;
  targetResponseTime: number; // milliseconds
  scaleUpCooldown: number; // seconds
  scaleDownCooldown: number; // seconds
  instanceTypes: {
    small: InstanceSpec;
    medium: InstanceSpec;
    large: InstanceSpec;
  };
}

export interface InstanceSpec {
  cpu: number; // cores
  memory: number; // GB
  cost: number; // per hour
  maxUsers: number;
}

export interface ScalingMetrics {
  cpuUtilization: number;
  memoryUtilization: number;
  responseTime: number;
  requestsPerSecond: number;
  activeUsers: number;
  errorRate: number;
  timestamp: number;
}

export interface ScalingDecision {
  action: 'scale_up' | 'scale_down' | 'maintain' | 'switch_instance_type';
  reason: string;
  fromInstances: number;
  toInstances: number;
  fromInstanceType?: string;
  toInstanceType?: string;
  estimatedCost: number;
  confidence: number;
}

export interface LoadPrediction {
  predictedLoad: number;
  confidence: number;
  timeHorizon: number; // minutes
  factors: {
    historical: number;
    trending: number;
    seasonal: number;
    external: number;
  };
}

export class AutoScalingManager {
  private static instance: AutoScalingManager;
  private config: ScalingConfig;
  private currentInstances: number = 1;
  private currentInstanceType: keyof ScalingConfig['instanceTypes'] = 'medium';
  private metricsHistory: ScalingMetrics[] = [];
  private lastScaleAction: number = 0;
  private loadPredictor: LoadPredictor;

  private constructor(config: ScalingConfig) {
    this.config = config;
    this.loadPredictor = new LoadPredictor();
    this.initializeMonitoring();
  }

  static getInstance(config?: ScalingConfig): AutoScalingManager {
    if (!AutoScalingManager.instance) {
      const defaultConfig: ScalingConfig = {
        minInstances: 2,
        maxInstances: 50,
        targetCpuUtilization: 70,
        targetMemoryUtilization: 80,
        targetResponseTime: 50, // 50ms target from patent
        scaleUpCooldown: 300, // 5 minutes
        scaleDownCooldown: 600, // 10 minutes
        instanceTypes: {
          small: { cpu: 2, memory: 4, cost: 0.10, maxUsers: 5000 },
          medium: { cpu: 4, memory: 8, cost: 0.20, maxUsers: 15000 },
          large: { cpu: 8, memory: 16, cost: 0.40, maxUsers: 30000 }
        }
      };
      
      AutoScalingManager.instance = new AutoScalingManager(config || defaultConfig);
    }
    return AutoScalingManager.instance;
  }

  /**
   * Main scaling decision engine
   */
  async evaluateScaling(currentMetrics: ScalingMetrics): Promise<ScalingDecision> {
    console.log('🔍 Evaluating scaling decision...');
    
    // Record metrics
    this.metricsHistory.push(currentMetrics);
    if (this.metricsHistory.length > 1000) {
      this.metricsHistory = this.metricsHistory.slice(-1000);
    }

    // Check cooldown periods
    const timeSinceLastScale = Date.now() - this.lastScaleAction;
    const isInCooldown = timeSinceLastScale < Math.min(
      this.config.scaleUpCooldown,
      this.config.scaleDownCooldown
    ) * 1000;

    // Calculate scaling scores
    const scalingScores = this.calculateScalingScores(currentMetrics);
    const prediction = await this.loadPredictor.predictLoad(this.metricsHistory);
    
    // Determine action
    let decision: ScalingDecision;

    if (this.shouldScaleUp(currentMetrics, scalingScores, prediction) && !isInCooldown) {
      decision = await this.planScaleUp(currentMetrics, scalingScores, prediction);
    } else if (this.shouldScaleDown(currentMetrics, scalingScores, prediction) && !isInCooldown) {
      decision = await this.planScaleDown(currentMetrics, scalingScores, prediction);
    } else if (this.shouldSwitchInstanceType(currentMetrics, scalingScores)) {
      decision = await this.planInstanceTypeSwitch(currentMetrics, scalingScores);
    } else {
      decision = {
        action: 'maintain',
        reason: isInCooldown ? 'In cooldown period' : 'Metrics within acceptable range',
        fromInstances: this.currentInstances,
        toInstances: this.currentInstances,
        estimatedCost: this.calculateCurrentCost(),
        confidence: 0.9
      };
    }

    // Log decision
    console.log(`📊 Scaling Decision: ${decision.action}`, {
      reason: decision.reason,
      instances: `${decision.fromInstances} → ${decision.toInstances}`,
      confidence: decision.confidence
    });

    return decision;
  }

  /**
   * Execute scaling decision
   */
  async executeScaling(decision: ScalingDecision): Promise<boolean> {
    if (decision.action === 'maintain') {
      return true;
    }

    console.log(`🚀 Executing scaling: ${decision.action}`);
    
    try {
      switch (decision.action) {
        case 'scale_up':
          await this.scaleUp(decision.toInstances);
          break;
        case 'scale_down':
          await this.scaleDown(decision.toInstances);
          break;
        case 'switch_instance_type':
          await this.switchInstanceType(decision.toInstanceType as keyof ScalingConfig['instanceTypes']);
          break;
      }

      this.lastScaleAction = Date.now();
      return true;
    } catch (error) {
      console.error('❌ Scaling execution failed:', error);
      return false;
    }
  }

  /**
   * Calculate scaling scores based on multiple factors
   */
  private calculateScalingScores(metrics: ScalingMetrics): {
    cpuScore: number;
    memoryScore: number;
    responseTimeScore: number;
    throughputScore: number;
    overallScore: number;
  } {
    // CPU utilization score (0-1, higher means more need to scale)
    const cpuScore = Math.max(0, (metrics.cpuUtilization - this.config.targetCpuUtilization) / 100);
    
    // Memory utilization score
    const memoryScore = Math.max(0, (metrics.memoryUtilization - this.config.targetMemoryUtilization) / 100);
    
    // Response time score (penalty for exceeding target)
    const responseTimeScore = Math.max(0, (metrics.responseTime - this.config.targetResponseTime) / this.config.targetResponseTime);
    
    // Throughput score based on current capacity
    const currentCapacity = this.currentInstances * this.config.instanceTypes[this.currentInstanceType].maxUsers;
    const throughputScore = Math.max(0, (metrics.activeUsers - currentCapacity * 0.8) / (currentCapacity * 0.2));
    
    // Weighted overall score
    const overallScore = (
      cpuScore * 0.25 +
      memoryScore * 0.25 +
      responseTimeScore * 0.3 +
      throughputScore * 0.2
    );

    return {
      cpuScore,
      memoryScore,
      responseTimeScore,
      throughputScore,
      overallScore
    };
  }

  /**
   * Determine if scale up is needed
   */
  private shouldScaleUp(
    metrics: ScalingMetrics,
    scores: ReturnType<typeof this.calculateScalingScores>,
    prediction: LoadPrediction
  ): boolean {
    // Scale up if any critical thresholds are exceeded
    const criticalCpu = metrics.cpuUtilization > 85;
    const criticalMemory = metrics.memoryUtilization > 90;
    const criticalResponseTime = metrics.responseTime > this.config.targetResponseTime * 1.5;
    const criticalThroughput = scores.throughputScore > 0.8;
    
    // Predictive scaling based on trend
    const predictiveNeed = prediction.predictedLoad > metrics.requestsPerSecond * 1.3 && 
                          prediction.confidence > 0.7;

    return (criticalCpu || criticalMemory || criticalResponseTime || criticalThroughput || predictiveNeed) &&
           this.currentInstances < this.config.maxInstances;
  }

  /**
   * Determine if scale down is possible
   */
  private shouldScaleDown(
    metrics: ScalingMetrics,
    scores: ReturnType<typeof this.calculateScalingScores>,
    prediction: LoadPrediction
  ): boolean {
    // Only scale down if all metrics are well below targets
    const lowCpu = metrics.cpuUtilization < this.config.targetCpuUtilization * 0.6;
    const lowMemory = metrics.memoryUtilization < this.config.targetMemoryUtilization * 0.6;
    const goodResponseTime = metrics.responseTime < this.config.targetResponseTime * 0.8;
    const lowThroughput = scores.throughputScore < 0.3;
    
    // Check if trend is decreasing
    const descendingTrend = prediction.predictedLoad < metrics.requestsPerSecond * 0.8;

    return lowCpu && lowMemory && goodResponseTime && lowThroughput && descendingTrend &&
           this.currentInstances > this.config.minInstances;
  }

  /**
   * Determine if instance type should be switched
   */
  private shouldSwitchInstanceType(
    metrics: ScalingMetrics,
    scores: ReturnType<typeof this.calculateScalingScores>
  ): boolean {
    const currentSpec = this.config.instanceTypes[this.currentInstanceType];
    
    // Switch to larger instances if consistently hitting resource limits
    if (this.currentInstanceType === 'small' && 
        (scores.cpuScore > 0.7 || scores.memoryScore > 0.7)) {
      return true;
    }
    
    // Switch to smaller instances if over-provisioned
    if (this.currentInstanceType === 'large' && 
        scores.overallScore < 0.2 && 
        metrics.activeUsers < currentSpec.maxUsers * 0.3) {
      return true;
    }
    
    return false;
  }

  /**
   * Plan scale up action
   */
  private async planScaleUp(
    metrics: ScalingMetrics,
    scores: ReturnType<typeof this.calculateScalingScores>,
    prediction: LoadPrediction
  ): Promise<ScalingDecision> {
    // Calculate how many instances to add
    let instancesToAdd = 1;
    
    if (scores.overallScore > 0.8) {
      instancesToAdd = Math.ceil(this.currentInstances * 0.5); // 50% increase for high urgency
    } else if (scores.overallScore > 0.5) {
      instancesToAdd = Math.ceil(this.currentInstances * 0.25); // 25% increase for medium urgency
    }
    
    const targetInstances = Math.min(
      this.currentInstances + instancesToAdd,
      this.config.maxInstances
    );

    const estimatedCost = this.calculateCostForInstances(targetInstances);
    const confidence = Math.min(0.95, 0.7 + scores.overallScore * 0.25);

    return {
      action: 'scale_up',
      reason: `High load detected: CPU=${metrics.cpuUtilization.toFixed(1)}%, Memory=${metrics.memoryUtilization.toFixed(1)}%, ResponseTime=${metrics.responseTime.toFixed(1)}ms`,
      fromInstances: this.currentInstances,
      toInstances: targetInstances,
      estimatedCost,
      confidence
    };
  }

  /**
   * Plan scale down action
   */
  private async planScaleDown(
    metrics: ScalingMetrics,
    scores: ReturnType<typeof this.calculateScalingScores>,
    prediction: LoadPrediction
  ): Promise<ScalingDecision> {
    // Conservative scale down - remove 1-2 instances at a time
    const instancesToRemove = Math.max(1, Math.floor(this.currentInstances * 0.2));
    const targetInstances = Math.max(
      this.currentInstances - instancesToRemove,
      this.config.minInstances
    );

    const estimatedCost = this.calculateCostForInstances(targetInstances);
    const confidence = 0.8; // Lower confidence for scale down

    return {
      action: 'scale_down',
      reason: `Low utilization: CPU=${metrics.cpuUtilization.toFixed(1)}%, Memory=${metrics.memoryUtilization.toFixed(1)}%`,
      fromInstances: this.currentInstances,
      toInstances: targetInstances,
      estimatedCost,
      confidence
    };
  }

  /**
   * Plan instance type switch
   */
  private async planInstanceTypeSwitch(
    metrics: ScalingMetrics,
    scores: ReturnType<typeof this.calculateScalingScores>
  ): Promise<ScalingDecision> {
    let targetType: keyof ScalingConfig['instanceTypes'];
    let reason: string;

    if (this.currentInstanceType === 'small' && scores.overallScore > 0.7) {
      targetType = 'medium';
      reason = 'Upgrading to medium instances for better performance';
    } else if (this.currentInstanceType === 'medium' && scores.overallScore > 0.8) {
      targetType = 'large';
      reason = 'Upgrading to large instances for high load';
    } else if (this.currentInstanceType === 'large' && scores.overallScore < 0.2) {
      targetType = 'medium';
      reason = 'Downgrading to medium instances for cost optimization';
    } else {
      targetType = 'small';
      reason = 'Downgrading to small instances for cost optimization';
    }

    const estimatedCost = this.calculateCostForInstanceType(targetType);

    return {
      action: 'switch_instance_type',
      reason,
      fromInstances: this.currentInstances,
      toInstances: this.currentInstances,
      fromInstanceType: this.currentInstanceType,
      toInstanceType: targetType,
      estimatedCost,
      confidence: 0.85
    };
  }

  // Scaling execution methods
  private async scaleUp(targetInstances: number): Promise<void> {
    console.log(`⬆️ Scaling up from ${this.currentInstances} to ${targetInstances} instances`);
    
    // Simulate instance provisioning
    const instancesToAdd = targetInstances - this.currentInstances;
    for (let i = 0; i < instancesToAdd; i++) {
      await this.provisionInstance();
    }
    
    this.currentInstances = targetInstances;
  }

  private async scaleDown(targetInstances: number): Promise<void> {
    console.log(`⬇️ Scaling down from ${this.currentInstances} to ${targetInstances} instances`);
    
    // Simulate graceful instance termination
    const instancesToRemove = this.currentInstances - targetInstances;
    for (let i = 0; i < instancesToRemove; i++) {
      await this.terminateInstance();
    }
    
    this.currentInstances = targetInstances;
  }

  private async switchInstanceType(targetType: keyof ScalingConfig['instanceTypes']): Promise<void> {
    console.log(`🔄 Switching from ${this.currentInstanceType} to ${targetType} instances`);
    
    // Simulate instance type change
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second simulation
    
    this.currentInstanceType = targetType;
  }

  private async provisionInstance(): Promise<void> {
    // Simulate instance provisioning time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    console.log('✅ Instance provisioned');
  }

  private async terminateInstance(): Promise<void> {
    // Simulate graceful shutdown
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    console.log('🔴 Instance terminated');
  }

  // Cost calculation methods
  private calculateCurrentCost(): number {
    const spec = this.config.instanceTypes[this.currentInstanceType];
    return this.currentInstances * spec.cost;
  }

  private calculateCostForInstances(instances: number): number {
    const spec = this.config.instanceTypes[this.currentInstanceType];
    return instances * spec.cost;
  }

  private calculateCostForInstanceType(instanceType: keyof ScalingConfig['instanceTypes']): number {
    const spec = this.config.instanceTypes[instanceType];
    return this.currentInstances * spec.cost;
  }

  // Monitoring initialization
  private initializeMonitoring(): void {
    console.log('📊 Initializing auto-scaling monitoring...');
    
    // Monitor metrics every 30 seconds
    setInterval(async () => {
      const metrics = await this.collectMetrics();
      const decision = await this.evaluateScaling(metrics);
      
      if (decision.action !== 'maintain') {
        await this.executeScaling(decision);
      }
    }, 30000);
  }

  /**
   * Collect current system metrics
   */
  async collectMetrics(): Promise<ScalingMetrics> {
    // Simulate metric collection
    // In production, this would integrate with monitoring systems
    
    const baseLoad = 0.5 + Math.sin(Date.now() / 300000) * 0.3; // Simulate daily cycle
    const randomVariation = (Math.random() - 0.5) * 0.2;
    const load = Math.max(0, Math.min(1, baseLoad + randomVariation));

    return {
      cpuUtilization: 30 + load * 50 + Math.random() * 10,
      memoryUtilization: 40 + load * 40 + Math.random() * 10,
      responseTime: 25 + load * 30 + Math.random() * 15,
      requestsPerSecond: 1000 + load * 5000 + Math.random() * 500,
      activeUsers: Math.floor(5000 + load * 15000 + Math.random() * 1000),
      errorRate: Math.max(0, load * 0.02 + Math.random() * 0.005),
      timestamp: Date.now()
    };
  }

  /**
   * Get current scaling status
   */
  getScalingStatus(): {
    currentInstances: number;
    currentInstanceType: string;
    currentCost: number;
    lastScaleAction: number;
    recentMetrics: ScalingMetrics[];
  } {
    return {
      currentInstances: this.currentInstances,
      currentInstanceType: this.currentInstanceType,
      currentCost: this.calculateCurrentCost(),
      lastScaleAction: this.lastScaleAction,
      recentMetrics: this.metricsHistory.slice(-10)
    };
  }

  /**
   * Update scaling configuration
   */
  updateConfig(newConfig: Partial<ScalingConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ Auto-scaling configuration updated');
  }
}

/**
 * Load prediction engine for proactive scaling
 */
class LoadPredictor {
  private historicalPatterns: Map<string, number[]> = new Map();

  async predictLoad(metricsHistory: ScalingMetrics[]): Promise<LoadPrediction> {
    if (metricsHistory.length < 10) {
      return {
        predictedLoad: metricsHistory[metricsHistory.length - 1]?.requestsPerSecond || 1000,
        confidence: 0.3,
        timeHorizon: 15,
        factors: { historical: 0.2, trending: 0.3, seasonal: 0.2, external: 0.3 }
      };
    }

    const recent = metricsHistory.slice(-10);
    const currentLoad = recent[recent.length - 1].requestsPerSecond;
    
    // Calculate trend
    const trend = this.calculateTrend(recent.map(m => m.requestsPerSecond));
    
    // Historical pattern matching
    const historicalFactor = this.getHistoricalPattern(new Date().getHours());
    
    // Seasonal adjustment (day of week, hour of day)
    const seasonalFactor = this.getSeasonalAdjustment();
    
    // Combine factors
    const predictedLoad = currentLoad * (1 + trend * 0.1 + historicalFactor * 0.05 + seasonalFactor * 0.03);
    
    const confidence = Math.min(0.9, 0.5 + metricsHistory.length / 100);

    return {
      predictedLoad: Math.max(0, predictedLoad),
      confidence,
      timeHorizon: 15,
      factors: {
        historical: historicalFactor,
        trending: trend,
        seasonal: seasonalFactor,
        external: 0
      }
    };
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 3) return 0;
    
    // Simple linear regression slope
    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, i) => sum + i * val, 0);
    const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope / (sumY / n); // Normalize by average value
  }

  private getHistoricalPattern(hour: number): number {
    // Simulate historical patterns based on hour of day
    const patterns = [
      0.3, 0.2, 0.1, 0.1, 0.1, 0.2, 0.4, 0.6, // 0-7 AM
      0.8, 1.0, 1.2, 1.3, 1.2, 1.1, 1.2, 1.3, // 8-15 PM
      1.1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3  // 16-23 PM
    ];
    
    return patterns[hour] || 1.0;
  }

  private getSeasonalAdjustment(): number {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday
    
    // Weekend adjustment
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return -0.2; // 20% less traffic on weekends
    }
    
    // Weekday peak adjustment
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      return 0.1; // 10% more traffic on weekdays
    }
    
    return 0;
  }
}