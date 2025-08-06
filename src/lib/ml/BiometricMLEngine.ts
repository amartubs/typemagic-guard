import { KeystrokePattern, BiometricProfile } from '../types';

export interface MLModelWeights {
  keystroke: number[];
  mouse: number[];
  touch: number[];
  device: number[];
}

export interface FusionConfig {
  alpha: number; // Reliability weight
  beta: number;  // Availability weight
  gamma: number; // History weight
  delta: number; // Context weight
}

export interface RiskFactors {
  timeAnomaly: number;
  locationAnomaly: number;
  deviceAnomaly: number;
  behaviorAnomaly: number;
  velocityAnomaly: number;
}

export class BiometricMLEngine {
  private static modelWeights: MLModelWeights = {
    keystroke: new Array(100).fill(0).map(() => Math.random() * 2 - 1),
    mouse: new Array(50).fill(0).map(() => Math.random() * 2 - 1),
    touch: new Array(75).fill(0).map(() => Math.random() * 2 - 1),
    device: new Array(25).fill(0).map(() => Math.random() * 2 - 1)
  };

  private static fusionConfig: FusionConfig = {
    alpha: 0.35, // Reliability
    beta: 0.25,  // Availability
    gamma: 0.25, // History
    delta: 0.15  // Context
  };

  private static learningRate = 0.001;
  private static momentum = 0.9;
  private static previousGradients: MLModelWeights = {
    keystroke: new Array(100).fill(0),
    mouse: new Array(50).fill(0),
    touch: new Array(75).fill(0),
    device: new Array(25).fill(0)
  };

  /**
   * Multi-Modal Fusion Mathematics from Patent
   * w_k(t) = α × R_k(t) + β × A_k(t) + γ × H_k(t) + δ × C_k(t)
   */
  static calculateModalityWeights(
    reliability: Record<string, number>,
    availability: Record<string, number>, 
    history: Record<string, number>,
    context: Record<string, number>
  ): Record<string, number> {
    const modalities = ['keystroke', 'mouse', 'touch', 'device'];
    const weights: Record<string, number> = {};
    
    for (const modality of modalities) {
      weights[modality] = 
        this.fusionConfig.alpha * (reliability[modality] || 0) +
        this.fusionConfig.beta * (availability[modality] || 0) +
        this.fusionConfig.gamma * (history[modality] || 0) +
        this.fusionConfig.delta * (context[modality] || 0);
    }
    
    // Normalize weights to sum to 1
    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
    if (totalWeight > 0) {
      Object.keys(weights).forEach(key => {
        weights[key] /= totalWeight;
      });
    }
    
    return weights;
  }

  /**
   * Fused Confidence Score Calculation
   * C(t) = Σ[w_k(t) × S_k(t)] / Σ[w_k(t)]
   */
  static calculateFusedConfidence(
    modalityScores: Record<string, number>,
    modalityWeights: Record<string, number>
  ): number {
    let weightedSum = 0;
    let totalWeight = 0;
    
    Object.keys(modalityScores).forEach(modality => {
      const score = modalityScores[modality] || 0;
      const weight = modalityWeights[modality] || 0;
      
      weightedSum += weight * score;
      totalWeight += weight;
    });
    
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  /**
   * Uncertainty Quantification
   * U(t) = √(Σ[w_k(t) × (S_k(t) - C(t))²] / Σ[w_k(t)])
   */
  static calculateUncertainty(
    modalityScores: Record<string, number>,
    modalityWeights: Record<string, number>,
    fusedConfidence: number
  ): number {
    let weightedVariance = 0;
    let totalWeight = 0;
    
    Object.keys(modalityScores).forEach(modality => {
      const score = modalityScores[modality] || 0;
      const weight = modalityWeights[modality] || 0;
      const deviation = score - fusedConfidence;
      
      weightedVariance += weight * (deviation * deviation);
      totalWeight += weight;
    });
    
    return totalWeight > 0 ? Math.sqrt(weightedVariance / totalWeight) : 0;
  }

  /**
   * Risk Assessment Calculation from Patent
   * Risk(t) = 1 - C(t) + λ × U(t) + μ × E(t)
   */
  static calculateRiskScore(
    confidence: number,
    uncertainty: number,
    environmentalRisk: number,
    lambda: number = 0.3,
    mu: number = 0.2
  ): number {
    const risk = 1 - confidence + lambda * uncertainty + mu * environmentalRisk;
    return Math.max(0, Math.min(1, risk)); // Clamp between 0 and 1
  }

  /**
   * Enhanced Pattern Recognition using Neural Network-like approach
   */
  static async processKeystrokePattern(pattern: KeystrokePattern): Promise<{
    features: number[];
    confidence: number;
    anomalyScore: number;
  }> {
    // Extract timing features
    const features = this.extractKeystrokeFeatures(pattern);
    
    // Apply learned weights (simulated neural network)
    const neuralOutput = this.forwardPass(features, this.modelWeights.keystroke);
    
    // Calculate confidence and anomaly scores
    const confidence = this.sigmoid(neuralOutput);
    const anomalyScore = this.calculateAnomalyScore(features, 'keystroke');
    
    return {
      features,
      confidence,
      anomalyScore
    };
  }

  private static extractKeystrokeFeatures(pattern: KeystrokePattern): number[] {
    const timings = pattern.timings;
    if (timings.length < 2) return new Array(100).fill(0);
    
    const features: number[] = [];
    
    // Dwell times (key press duration)
    const dwellTimes = timings
      .filter(t => t.duration !== null)
      .map(t => t.duration!);
    
    // Flight times (time between key releases and next press)
    const flightTimes: number[] = [];
    for (let i = 0; i < timings.length - 1; i++) {
      if (timings[i].releaseTime && timings[i + 1].pressTime) {
        flightTimes.push(timings[i + 1].pressTime - timings[i].releaseTime!);
      }
    }
    
    // Statistical features
    features.push(
      // Dwell time statistics
      this.calculateMean(dwellTimes),
      this.calculateStdDev(dwellTimes),
      this.calculateSkewness(dwellTimes),
      this.calculateKurtosis(dwellTimes),
      
      // Flight time statistics
      this.calculateMean(flightTimes),
      this.calculateStdDev(flightTimes),
      this.calculateSkewness(flightTimes),
      this.calculateKurtosis(flightTimes),
      
      // Rhythm features
      this.calculateTypingRhythm(timings),
      this.calculateVelocityVariation(timings)
    );
    
    // Pad to 100 features
    while (features.length < 100) {
      features.push(0);
    }
    
    return features.slice(0, 100);
  }

  /**
   * Z-Score Anomaly Detection
   * z_k(t) = (x_k(t) - μ_k) / σ_k
   */
  static calculateZScore(value: number, mean: number, stdDev: number): number {
    return stdDev > 0 ? (value - mean) / stdDev : 0;
  }

  /**
   * Mahalanobis Distance for Multivariate Anomaly Detection
   * D²(x) = (x - μ)ᵀ Σ⁻¹ (x - μ)
   */
  static calculateMahalanobisDistance(
    features: number[],
    meanVector: number[],
    covarianceMatrix: number[][]
  ): number {
    if (features.length !== meanVector.length) return Infinity;
    
    // Calculate difference vector
    const diff = features.map((f, i) => f - meanVector[i]);
    
    // Simplified calculation (assuming diagonal covariance for performance)
    const variance = covarianceMatrix.map(row => row.reduce((sum, val) => sum + val * val, 0));
    
    let distance = 0;
    for (let i = 0; i < diff.length; i++) {
      if (variance[i] > 0) {
        distance += (diff[i] * diff[i]) / variance[i];
      }
    }
    
    return Math.sqrt(distance);
  }

  /**
   * Reinforcement Learning Weight Updates
   */
  static updateModelWeights(
    modality: keyof MLModelWeights,
    features: number[],
    actualResult: number,
    predictedResult: number
  ): void {
    const error = actualResult - predictedResult;
    const weights = this.modelWeights[modality];
    const gradients = this.previousGradients[modality];
    
    for (let i = 0; i < weights.length && i < features.length; i++) {
      // Calculate gradient
      const gradient = error * features[i];
      
      // Apply momentum
      gradients[i] = this.momentum * gradients[i] + this.learningRate * gradient;
      
      // Update weight
      weights[i] += gradients[i];
    }
  }

  /**
   * Adaptive Learning Rate based on performance
   */
  static adaptLearningRate(accuracyTrend: number[]): void {
    if (accuracyTrend.length < 3) return;
    
    const recentTrend = accuracyTrend.slice(-3);
    const isImproving = recentTrend[2] > recentTrend[0];
    
    if (isImproving) {
      this.learningRate = Math.min(0.01, this.learningRate * 1.05);
    } else {
      this.learningRate = Math.max(0.0001, this.learningRate * 0.95);
    }
  }

  // Helper methods
  private static forwardPass(inputs: number[], weights: number[]): number {
    let sum = 0;
    for (let i = 0; i < Math.min(inputs.length, weights.length); i++) {
      sum += inputs[i] * weights[i];
    }
    return sum;
  }

  private static sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }

  private static calculateAnomalyScore(features: number[], modality: string): number {
    // Simplified anomaly detection based on feature distribution
    const mean = this.calculateMean(features);
    const stdDev = this.calculateStdDev(features);
    
    let anomalySum = 0;
    for (const feature of features) {
      const zScore = this.calculateZScore(feature, mean, stdDev);
      anomalySum += Math.abs(zScore);
    }
    
    return Math.min(1, anomalySum / features.length / 3); // Normalize to 0-1
  }

  private static calculateMean(values: number[]): number {
    return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
  }

  private static calculateStdDev(values: number[]): number {
    if (values.length < 2) return 0;
    
    const mean = this.calculateMean(values);
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    
    return Math.sqrt(variance);
  }

  private static calculateSkewness(values: number[]): number {
    if (values.length < 3) return 0;
    
    const mean = this.calculateMean(values);
    const stdDev = this.calculateStdDev(values);
    
    if (stdDev === 0) return 0;
    
    const skew = values.reduce((sum, val) => {
      return sum + Math.pow((val - mean) / stdDev, 3);
    }, 0) / values.length;
    
    return skew;
  }

  private static calculateKurtosis(values: number[]): number {
    if (values.length < 4) return 0;
    
    const mean = this.calculateMean(values);
    const stdDev = this.calculateStdDev(values);
    
    if (stdDev === 0) return 0;
    
    const kurt = values.reduce((sum, val) => {
      return sum + Math.pow((val - mean) / stdDev, 4);
    }, 0) / values.length;
    
    return kurt - 3; // Excess kurtosis
  }

  private static calculateTypingRhythm(timings: Array<{pressTime: number}>): number {
    if (timings.length < 3) return 0;
    
    const intervals: number[] = [];
    for (let i = 1; i < timings.length; i++) {
      intervals.push(timings[i].pressTime - timings[i - 1].pressTime);
    }
    
    return this.calculateStdDev(intervals) / this.calculateMean(intervals);
  }

  private static calculateVelocityVariation(timings: Array<{pressTime: number}>): number {
    if (timings.length < 4) return 0;
    
    const velocities: number[] = [];
    for (let i = 2; i < timings.length; i++) {
      const dt1 = timings[i - 1].pressTime - timings[i - 2].pressTime;
      const dt2 = timings[i].pressTime - timings[i - 1].pressTime;
      
      if (dt1 > 0 && dt2 > 0) {
        velocities.push(Math.abs(1/dt2 - 1/dt1));
      }
    }
    
    return this.calculateMean(velocities);
  }

  /**
   * Training Pipeline for Biometric Templates
   */
  static async trainBiometricProfile(
    userId: string,
    trainingData: KeystrokePattern[],
    targetAccuracy: number = 0.95
  ): Promise<{
    success: boolean;
    accuracy: number;
    iterations: number;
    finalWeights: MLModelWeights;
  }> {
    console.log(`🎯 Starting training pipeline for user ${userId}...`);
    
    let currentAccuracy = 0;
    let iterations = 0;
    const maxIterations = 1000;
    
    // Split data into training and validation sets
    const trainSize = Math.floor(trainingData.length * 0.8);
    const trainSet = trainingData.slice(0, trainSize);
    const validationSet = trainingData.slice(trainSize);
    
    while (currentAccuracy < targetAccuracy && iterations < maxIterations) {
      let correctPredictions = 0;
      
      // Training phase
      for (const pattern of trainSet) {
        const processed = await this.processKeystrokePattern(pattern);
        const expected = 1; // Assuming all training data is legitimate
        
        this.updateModelWeights('keystroke', processed.features, expected, processed.confidence);
      }
      
      // Validation phase
      for (const pattern of validationSet) {
        const processed = await this.processKeystrokePattern(pattern);
        if (processed.confidence > 0.5) correctPredictions++;
      }
      
      currentAccuracy = correctPredictions / validationSet.length;
      iterations++;
      
      // Adapt learning rate based on progress
      if (iterations % 100 === 0) {
        const recentAccuracy = new Array(3).fill(currentAccuracy);
        this.adaptLearningRate(recentAccuracy);
      }
    }
    
    console.log(`✅ Training completed: ${currentAccuracy.toFixed(3)} accuracy in ${iterations} iterations`);
    
    return {
      success: currentAccuracy >= targetAccuracy,
      accuracy: currentAccuracy,
      iterations,
      finalWeights: { ...this.modelWeights }
    };
  }

  /**
   * Export current model state
   */
  static exportModel(): {
    weights: MLModelWeights;
    config: FusionConfig;
    learningRate: number;
    timestamp: number;
  } {
    return {
      weights: { ...this.modelWeights },
      config: { ...this.fusionConfig },
      learningRate: this.learningRate,
      timestamp: Date.now()
    };
  }

  /**
   * Import model state
   */
  static importModel(modelData: {
    weights: MLModelWeights;
    config: FusionConfig;
    learningRate: number;
  }): void {
    this.modelWeights = { ...modelData.weights };
    this.fusionConfig = { ...modelData.config };
    this.learningRate = modelData.learningRate;
    
    console.log('📥 ML model imported successfully');
  }
}