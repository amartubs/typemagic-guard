/**
 * Edge/Privacy-First Biometric Processor
 * Performs all biometric analysis locally without external data transmission
 * Key Patent Differentiator: On-device ML processing
 */

export interface LocalProcessingResult {
  success: boolean;
  confidence: number;
  riskScore: number;
  patterns: {
    keystroke?: LocalAnalysisResult;
    touch?: LocalAnalysisResult;
    mouse?: LocalAnalysisResult;
    behavioral?: LocalAnalysisResult;
  };
  deviceFingerprint: string;
  processingTime: number;
}

export interface LocalAnalysisResult {
  confidence: number;
  anomalyScore: number;
  featureVector: number[];
  templateSimilarity: number;
}

export class EdgeBiometricProcessor {
  private static instance: EdgeBiometricProcessor;
  private userTemplates = new Map<string, UserBiometricTemplate>();
  private localMLModels = new Map<string, LocalMLModel>();

  static getInstance(): EdgeBiometricProcessor {
    if (!this.instance) {
      this.instance = new EdgeBiometricProcessor();
    }
    return this.instance;
  }

  /**
   * Privacy-First Local Processing - No external API calls
   */
  async processLocally(
    userId: string,
    patterns: any,
    deviceFingerprint: string
  ): Promise<LocalProcessingResult> {
    const startTime = performance.now();
    
    // Get or create user template
    let userTemplate = this.userTemplates.get(userId);
    if (!userTemplate) {
      userTemplate = new UserBiometricTemplate(userId);
      this.userTemplates.set(userId, userTemplate);
    }

    const results: any = {};
    let totalConfidence = 0;
    let modalityCount = 0;

    // Process each modality locally
    if (patterns.keystroke) {
      results.keystroke = await this.processKeystrokeLocally(patterns.keystroke, userTemplate);
      totalConfidence += results.keystroke.confidence;
      modalityCount++;
    }

    if (patterns.touch) {
      results.touch = await this.processTouchLocally(patterns.touch, userTemplate);
      totalConfidence += results.touch.confidence;
      modalityCount++;
    }

    if (patterns.mouse) {
      results.mouse = await this.processMouseLocally(patterns.mouse, userTemplate);
      totalConfidence += results.mouse.confidence;
      modalityCount++;
    }

    if (patterns.behavioral) {
      results.behavioral = await this.processBehavioralLocally(patterns.behavioral, userTemplate);
      totalConfidence += results.behavioral.confidence;
      modalityCount++;
    }

    // Calculate combined metrics
    const averageConfidence = modalityCount > 0 ? totalConfidence / modalityCount : 0;
    const riskScore = this.calculateLocalRiskScore(results, deviceFingerprint);
    const processingTime = performance.now() - startTime;

    // Update user template with successful authentications
    if (averageConfidence > 70) {
      userTemplate.updateTemplate(patterns);
    }

    return {
      success: averageConfidence >= 70 && riskScore < 50,
      confidence: Math.round(averageConfidence),
      riskScore: Math.round(riskScore),
      patterns: results,
      deviceFingerprint,
      processingTime
    };
  }

  private async processKeystrokeLocally(patterns: any[], template: UserBiometricTemplate): Promise<LocalAnalysisResult> {
    const model = this.getOrCreateModel('keystroke');
    const featureVector = this.extractKeystrokeFeatures(patterns);
    
    const templateSimilarity = template.compareKeystroke(featureVector);
    const anomalyScore = model.detectAnomalies(featureVector);
    const confidence = this.calculateConfidence(templateSimilarity, anomalyScore);

    return {
      confidence,
      anomalyScore,
      featureVector,
      templateSimilarity
    };
  }

  private async processTouchLocally(patterns: any[], template: UserBiometricTemplate): Promise<LocalAnalysisResult> {
    const model = this.getOrCreateModel('touch');
    const featureVector = this.extractTouchFeatures(patterns);
    
    const templateSimilarity = template.compareTouch(featureVector);
    const anomalyScore = model.detectAnomalies(featureVector);
    const confidence = this.calculateConfidence(templateSimilarity, anomalyScore);

    return {
      confidence,
      anomalyScore,
      featureVector,
      templateSimilarity
    };
  }

  private async processMouseLocally(patterns: any[], template: UserBiometricTemplate): Promise<LocalAnalysisResult> {
    const model = this.getOrCreateModel('mouse');
    const featureVector = this.extractMouseFeatures(patterns);
    
    const templateSimilarity = template.compareMouse(featureVector);
    const anomalyScore = model.detectAnomalies(featureVector);
    const confidence = this.calculateConfidence(templateSimilarity, anomalyScore);

    return {
      confidence,
      anomalyScore,
      featureVector,
      templateSimilarity
    };
  }

  private async processBehavioralLocally(patterns: any[], template: UserBiometricTemplate): Promise<LocalAnalysisResult> {
    const model = this.getOrCreateModel('behavioral');
    const featureVector = this.extractBehavioralFeatures(patterns);
    
    const templateSimilarity = template.compareBehavioral(featureVector);
    const anomalyScore = model.detectAnomalies(featureVector);
    const confidence = this.calculateConfidence(templateSimilarity, anomalyScore);

    return {
      confidence,
      anomalyScore,
      featureVector,
      templateSimilarity
    };
  }

  private extractKeystrokeFeatures(patterns: any[]): number[] {
    // Extract statistical features from keystroke patterns
    const dwellTimes = patterns.map(p => p.duration || 0);
    const flightTimes = [];
    
    for (let i = 1; i < patterns.length; i++) {
      flightTimes.push((patterns[i].pressTime || 0) - (patterns[i-1].releaseTime || 0));
    }

    return [
      this.mean(dwellTimes),
      this.std(dwellTimes),
      this.mean(flightTimes),
      this.std(flightTimes),
      dwellTimes.length, // Pattern length
      this.median(dwellTimes),
      this.median(flightTimes)
    ];
  }

  private extractTouchFeatures(patterns: any[]): number[] {
    const pressures = patterns.map(p => p.pressure || 0.5);
    const durations = patterns.map(p => p.duration || 0);
    const velocities = patterns.map(p => p.velocity || 0);

    return [
      this.mean(pressures),
      this.std(pressures),
      this.mean(durations),
      this.std(durations),
      this.mean(velocities),
      this.std(velocities),
      patterns.length
    ];
  }

  private extractMouseFeatures(patterns: any[]): number[] {
    const velocities = patterns.map(p => p.velocity || 0);
    const accelerations = patterns.map(p => p.acceleration || 0);
    const distances = patterns.map(p => p.distance || 0);

    return [
      this.mean(velocities),
      this.std(velocities),
      this.mean(accelerations),
      this.std(accelerations),
      this.mean(distances),
      this.std(distances),
      patterns.length
    ];
  }

  private extractBehavioralFeatures(patterns: any[]): number[] {
    // Extract behavioral timing and usage features
    const sessionTimes = patterns.map(p => p.data?.sessionDuration || 0);
    const interactionFreqs = patterns.map(p => p.data?.interactionFrequency || 0);

    return [
      this.mean(sessionTimes),
      this.std(sessionTimes),
      this.mean(interactionFreqs),
      this.std(interactionFreqs),
      patterns.length
    ];
  }

  private calculateLocalRiskScore(results: any, deviceFingerprint: string): number {
    let riskScore = 0;

    // Consistency check across modalities
    const confidences = Object.values(results).map((r: any) => r.confidence);
    const variance = this.variance(confidences);
    riskScore += variance * 2; // High variance = higher risk

    // Anomaly scores
    const anomalyScores = Object.values(results).map((r: any) => r.anomalyScore);
    const avgAnomalyScore = this.mean(anomalyScores);
    riskScore += avgAnomalyScore * 50;

    // Device fingerprint entropy (low entropy = higher risk)
    const fpEntropy = this.calculateEntropy(deviceFingerprint);
    riskScore += Math.max(0, 20 - fpEntropy);

    return Math.min(100, riskScore);
  }

  private calculateConfidence(templateSimilarity: number, anomalyScore: number): number {
    // Weighted combination of template similarity and anomaly detection
    const baseConfidence = templateSimilarity * 0.7 + (1 - anomalyScore) * 0.3;
    return Math.max(0, Math.min(100, baseConfidence * 100));
  }

  private getOrCreateModel(type: string): LocalMLModel {
    if (!this.localMLModels.has(type)) {
      this.localMLModels.set(type, new LocalMLModel(type));
    }
    return this.localMLModels.get(type)!;
  }

  // Statistical helper methods
  private mean(arr: number[]): number {
    return arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
  }

  private std(arr: number[]): number {
    const avg = this.mean(arr);
    const variance = arr.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / arr.length;
    return Math.sqrt(variance);
  }

  private variance(arr: number[]): number {
    const avg = this.mean(arr);
    return arr.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / arr.length;
  }

  private median(arr: number[]): number {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  }

  private calculateEntropy(str: string): number {
    const charCounts = new Map<string, number>();
    for (const char of str) {
      charCounts.set(char, (charCounts.get(char) || 0) + 1);
    }
    
    let entropy = 0;
    const length = str.length;
    for (const count of charCounts.values()) {
      const probability = count / length;
      entropy -= probability * Math.log2(probability);
    }
    
    return entropy;
  }
}

/**
 * Self-Learning User Template with Drift Protection
 * Key Patent Differentiator: Adaptive template evolution
 */
class UserBiometricTemplate {
  private keystrokeTemplates: number[][] = [];
  private touchTemplates: number[][] = [];
  private mouseTemplates: number[][] = [];
  private behavioralTemplates: number[][] = [];
  private updateCount = 0;
  private lastUpdate = Date.now();
  private driftProtectionThreshold = 0.3;

  constructor(private userId: string) {}

  updateTemplate(patterns: any): void {
    this.updateCount++;
    const timeSinceLastUpdate = Date.now() - this.lastUpdate;
    
    // Adaptive learning rate based on time and update frequency
    const learningRate = this.calculateAdaptiveLearningRate(timeSinceLastUpdate);
    
    if (patterns.keystroke) {
      this.updateKeystrokeTemplate(patterns.keystroke, learningRate);
    }
    if (patterns.touch) {
      this.updateTouchTemplate(patterns.touch, learningRate);
    }
    if (patterns.mouse) {
      this.updateMouseTemplate(patterns.mouse, learningRate);
    }
    if (patterns.behavioral) {
      this.updateBehavioralTemplate(patterns.behavioral, learningRate);
    }
    
    this.lastUpdate = Date.now();
  }

  private calculateAdaptiveLearningRate(timeSinceUpdate: number): number {
    // Higher learning rate for longer intervals, lower for frequent updates
    const timeHours = timeSinceUpdate / (1000 * 60 * 60);
    return Math.min(0.1, Math.max(0.01, timeHours / 24));
  }

  private updateKeystrokeTemplate(patterns: any[], learningRate: number): void {
    const processor = EdgeBiometricProcessor.getInstance();
    const newFeatures = (processor as any).extractKeystrokeFeatures(patterns);
    
    if (this.keystrokeTemplates.length === 0) {
      this.keystrokeTemplates.push(newFeatures);
    } else {
      // Drift protection: only update if similarity is above threshold
      const similarity = this.cosineSimilarity(this.keystrokeTemplates[0], newFeatures);
      if (similarity > this.driftProtectionThreshold) {
        this.keystrokeTemplates[0] = this.blendFeatures(this.keystrokeTemplates[0], newFeatures, learningRate);
      }
    }
  }

  private updateTouchTemplate(patterns: any[], learningRate: number): void {
    const processor = EdgeBiometricProcessor.getInstance();
    const newFeatures = (processor as any).extractTouchFeatures(patterns);
    
    if (this.touchTemplates.length === 0) {
      this.touchTemplates.push(newFeatures);
    } else {
      const similarity = this.cosineSimilarity(this.touchTemplates[0], newFeatures);
      if (similarity > this.driftProtectionThreshold) {
        this.touchTemplates[0] = this.blendFeatures(this.touchTemplates[0], newFeatures, learningRate);
      }
    }
  }

  private updateMouseTemplate(patterns: any[], learningRate: number): void {
    const processor = EdgeBiometricProcessor.getInstance();
    const newFeatures = (processor as any).extractMouseFeatures(patterns);
    
    if (this.mouseTemplates.length === 0) {
      this.mouseTemplates.push(newFeatures);
    } else {
      const similarity = this.cosineSimilarity(this.mouseTemplates[0], newFeatures);
      if (similarity > this.driftProtectionThreshold) {
        this.mouseTemplates[0] = this.blendFeatures(this.mouseTemplates[0], newFeatures, learningRate);
      }
    }
  }

  private updateBehavioralTemplate(patterns: any[], learningRate: number): void {
    const processor = EdgeBiometricProcessor.getInstance();
    const newFeatures = (processor as any).extractBehavioralFeatures(patterns);
    
    if (this.behavioralTemplates.length === 0) {
      this.behavioralTemplates.push(newFeatures);
    } else {
      const similarity = this.cosineSimilarity(this.behavioralTemplates[0], newFeatures);
      if (similarity > this.driftProtectionThreshold) {
        this.behavioralTemplates[0] = this.blendFeatures(this.behavioralTemplates[0], newFeatures, learningRate);
      }
    }
  }

  compareKeystroke(features: number[]): number {
    if (this.keystrokeTemplates.length === 0) return 0;
    return this.cosineSimilarity(this.keystrokeTemplates[0], features);
  }

  compareTouch(features: number[]): number {
    if (this.touchTemplates.length === 0) return 0;
    return this.cosineSimilarity(this.touchTemplates[0], features);
  }

  compareMouse(features: number[]): number {
    if (this.mouseTemplates.length === 0) return 0;
    return this.cosineSimilarity(this.mouseTemplates[0], features);
  }

  compareBehavioral(features: number[]): number {
    if (this.behavioralTemplates.length === 0) return 0;
    return this.cosineSimilarity(this.behavioralTemplates[0], features);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private blendFeatures(existing: number[], newFeatures: number[], learningRate: number): number[] {
    return existing.map((val, i) => val * (1 - learningRate) + newFeatures[i] * learningRate);
  }
}

/**
 * Local ML Model for Anomaly Detection
 * Key Patent Differentiator: On-device machine learning
 */
class LocalMLModel {
  private normalPatterns: number[][] = [];
  private threshold = 0.5;

  constructor(private type: string) {}

  detectAnomalies(features: number[]): number {
    if (this.normalPatterns.length === 0) {
      this.normalPatterns.push(features);
      return 0; // No anomaly for first pattern
    }

    // Calculate distance to all normal patterns
    const distances = this.normalPatterns.map(pattern => this.euclideanDistance(features, pattern));
    const minDistance = Math.min(...distances);
    const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;

    // Normalize anomaly score (0 = normal, 1 = highly anomalous)
    const anomalyScore = Math.min(1, minDistance / (avgDistance + 0.001));
    
    // Update normal patterns if this seems normal
    if (anomalyScore < this.threshold) {
      this.normalPatterns.push(features);
      // Keep only recent patterns to adapt to user changes
      if (this.normalPatterns.length > 50) {
        this.normalPatterns.shift();
      }
    }

    return anomalyScore;
  }

  private euclideanDistance(a: number[], b: number[]): number {
    return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
  }
}

export const edgeProcessor = EdgeBiometricProcessor.getInstance();
