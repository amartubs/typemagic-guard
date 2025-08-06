import { BiometricMLEngine } from '../ml/BiometricMLEngine';
import { KeystrokePattern } from '../types';

export interface ValidationMetrics {
  truePositiveRate: number;
  falsePositiveRate: number;
  trueNegativeRate: number;
  falseNegativeRate: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
  equalErrorRate: number;
}

export interface TestDataset {
  legitimate: KeystrokePattern[];
  impostor: KeystrokePattern[];
  metadata: {
    userId: string;
    sessionCount: number;
    generatedAt: number;
  };
}

export interface ABTestResult {
  variantA: ValidationMetrics;
  variantB: ValidationMetrics;
  statisticalSignificance: number;
  winner: 'A' | 'B' | 'tie';
  recommendation: string;
}

export class AccuracyValidator {
  private static testDatasets: Map<string, TestDataset> = new Map();
  private static validationHistory: Array<{
    timestamp: number;
    metrics: ValidationMetrics;
    userId: string;
  }> = [];

  /**
   * Generate synthetic test dataset for FAR/FRR measurement
   */
  static generateTestDataset(
    userId: string,
    legitimateCount: number = 1000,
    impostorCount: number = 1000
  ): TestDataset {
    console.log(`📊 Generating test dataset for user ${userId}...`);

    const legitimate = this.generateLegitimatePatterns(userId, legitimateCount);
    const impostor = this.generateImpostorPatterns(userId, impostorCount);

    const dataset: TestDataset = {
      legitimate,
      impostor,
      metadata: {
        userId,
        sessionCount: legitimateCount + impostorCount,
        generatedAt: Date.now()
      }
    };

    this.testDatasets.set(userId, dataset);
    return dataset;
  }

  /**
   * Run comprehensive accuracy validation
   */
  static async validateAccuracy(
    userId: string,
    testDataset?: TestDataset
  ): Promise<ValidationMetrics> {
    const dataset = testDataset || this.testDatasets.get(userId);
    if (!dataset) {
      throw new Error(`No test dataset found for user ${userId}`);
    }

    console.log(`🔍 Running accuracy validation for user ${userId}...`);

    let truePositives = 0;
    let falsePositives = 0;
    let trueNegatives = 0;
    let falseNegatives = 0;

    const threshold = 0.5; // Authentication threshold

    // Test legitimate patterns
    for (const pattern of dataset.legitimate) {
      const result = await BiometricMLEngine.processKeystrokePattern(pattern);
      if (result.confidence >= threshold) {
        truePositives++;
      } else {
        falseNegatives++;
      }
    }

    // Test impostor patterns
    for (const pattern of dataset.impostor) {
      const result = await BiometricMLEngine.processKeystrokePattern(pattern);
      if (result.confidence >= threshold) {
        falsePositives++;
      } else {
        trueNegatives++;
      }
    }

    const metrics = this.calculateMetrics(
      truePositives,
      falsePositives,
      trueNegatives,
      falseNegatives
    );

    // Store validation result
    this.validationHistory.push({
      timestamp: Date.now(),
      metrics,
      userId
    });

    console.log(`✅ Validation complete - Accuracy: ${(metrics.accuracy * 100).toFixed(2)}%`);
    return metrics;
  }

  /**
   * Calculate comprehensive validation metrics
   */
  private static calculateMetrics(
    tp: number,
    fp: number,
    tn: number,
    fn: number
  ): ValidationMetrics {
    const total = tp + fp + tn + fn;
    
    const tpr = tp / (tp + fn); // True Positive Rate (Sensitivity/Recall)
    const fpr = fp / (fp + tn); // False Positive Rate
    const tnr = tn / (tn + fp); // True Negative Rate (Specificity)
    const fnr = fn / (fn + tp); // False Negative Rate

    const accuracy = (tp + tn) / total;
    const precision = tp / (tp + fp);
    const recall = tpr;
    const f1Score = 2 * (precision * recall) / (precision + recall);

    // Calculate AUC using simple approximation
    const auc = this.calculateAUC(tpr, fpr);

    // Equal Error Rate (where FPR = FNR)
    const equalErrorRate = (fpr + fnr) / 2;

    return {
      truePositiveRate: tpr,
      falsePositiveRate: fpr,
      trueNegativeRate: tnr,
      falseNegativeRate: fnr,
      accuracy,
      precision,
      recall,
      f1Score,
      auc,
      equalErrorRate
    };
  }

  /**
   * A/B Testing for algorithm improvements
   */
  static async runABTest(
    userId: string,
    algorithmA: 'current' | 'enhanced',
    algorithmB: 'current' | 'enhanced',
    testDataset?: TestDataset
  ): Promise<ABTestResult> {
    console.log(`🧪 Running A/B test for user ${userId}...`);

    const dataset = testDataset || this.testDatasets.get(userId);
    if (!dataset) {
      throw new Error(`No test dataset found for user ${userId}`);
    }

    // Split dataset for fair comparison
    const halfLegitimate = Math.floor(dataset.legitimate.length / 2);
    const halfImpostor = Math.floor(dataset.impostor.length / 2);

    const datasetA: TestDataset = {
      legitimate: dataset.legitimate.slice(0, halfLegitimate),
      impostor: dataset.impostor.slice(0, halfImpostor),
      metadata: { ...dataset.metadata }
    };

    const datasetB: TestDataset = {
      legitimate: dataset.legitimate.slice(halfLegitimate),
      impostor: dataset.impostor.slice(halfImpostor),
      metadata: { ...dataset.metadata }
    };

    // Test both algorithms
    const metricsA = await this.testAlgorithmVariant(algorithmA, datasetA);
    const metricsB = await this.testAlgorithmVariant(algorithmB, datasetB);

    // Calculate statistical significance
    const significance = this.calculateStatisticalSignificance(metricsA, metricsB);
    
    let winner: 'A' | 'B' | 'tie' = 'tie';
    if (significance > 0.95) {
      winner = metricsA.accuracy > metricsB.accuracy ? 'A' : 'B';
    }

    const recommendation = this.generateABTestRecommendation(metricsA, metricsB, winner);

    return {
      variantA: metricsA,
      variantB: metricsB,
      statisticalSignificance: significance,
      winner,
      recommendation
    };
  }

  /**
   * ROC Curve Analysis
   */
  static async generateROCCurve(
    userId: string,
    testDataset?: TestDataset
  ): Promise<Array<{ fpr: number; tpr: number; threshold: number }>> {
    const dataset = testDataset || this.testDatasets.get(userId);
    if (!dataset) {
      throw new Error(`No test dataset found for user ${userId}`);
    }

    const rocPoints: Array<{ fpr: number; tpr: number; threshold: number }> = [];
    const thresholds = Array.from({ length: 101 }, (_, i) => i / 100);

    for (const threshold of thresholds) {
      let tp = 0, fp = 0, tn = 0, fn = 0;

      // Test legitimate patterns
      for (const pattern of dataset.legitimate) {
        const result = await BiometricMLEngine.processKeystrokePattern(pattern);
        if (result.confidence >= threshold) tp++;
        else fn++;
      }

      // Test impostor patterns
      for (const pattern of dataset.impostor) {
        const result = await BiometricMLEngine.processKeystrokePattern(pattern);
        if (result.confidence >= threshold) fp++;
        else tn++;
      }

      const tpr = tp / (tp + fn);
      const fpr = fp / (fp + tn);

      rocPoints.push({ fpr, tpr, threshold });
    }

    return rocPoints;
  }

  /**
   * Cross-validation for robust accuracy assessment
   */
  static async crossValidate(
    userId: string,
    folds: number = 5,
    testDataset?: TestDataset
  ): Promise<{
    meanAccuracy: number;
    stdDeviation: number;
    confidenceInterval: [number, number];
    foldResults: ValidationMetrics[];
  }> {
    const dataset = testDataset || this.testDatasets.get(userId);
    if (!dataset) {
      throw new Error(`No test dataset found for user ${userId}`);
    }

    console.log(`🔄 Running ${folds}-fold cross-validation...`);

    const allPatterns = [...dataset.legitimate, ...dataset.impostor];
    const labels = [
      ...new Array(dataset.legitimate.length).fill(true),
      ...new Array(dataset.impostor.length).fill(false)
    ];

    // Shuffle data
    const shuffled = allPatterns.map((pattern, i) => ({ pattern, label: labels[i] }))
      .sort(() => Math.random() - 0.5);

    const foldSize = Math.floor(shuffled.length / folds);
    const foldResults: ValidationMetrics[] = [];

    for (let fold = 0; fold < folds; fold++) {
      const testStart = fold * foldSize;
      const testEnd = fold === folds - 1 ? shuffled.length : testStart + foldSize;
      
      const testSet = shuffled.slice(testStart, testEnd);
      
      let tp = 0, fp = 0, tn = 0, fn = 0;

      for (const { pattern, label } of testSet) {
        const result = await BiometricMLEngine.processKeystrokePattern(pattern);
        const predicted = result.confidence >= 0.5;

        if (label && predicted) tp++;
        else if (label && !predicted) fn++;
        else if (!label && predicted) fp++;
        else tn++;
      }

      const metrics = this.calculateMetrics(tp, fp, tn, fn);
      foldResults.push(metrics);
    }

    const accuracies = foldResults.map(m => m.accuracy);
    const meanAccuracy = accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length;
    const variance = accuracies.reduce((sum, acc) => sum + Math.pow(acc - meanAccuracy, 2), 0) / accuracies.length;
    const stdDeviation = Math.sqrt(variance);

    // 95% confidence interval
    const marginOfError = 1.96 * stdDeviation / Math.sqrt(folds);
    const confidenceInterval: [number, number] = [
      meanAccuracy - marginOfError,
      meanAccuracy + marginOfError
    ];

    console.log(`✅ Cross-validation complete - Mean accuracy: ${(meanAccuracy * 100).toFixed(2)}%`);

    return {
      meanAccuracy,
      stdDeviation,
      confidenceInterval,
      foldResults
    };
  }

  // Helper methods
  private static generateLegitimatePatterns(userId: string, count: number): KeystrokePattern[] {
    const patterns: KeystrokePattern[] = [];
    
    for (let i = 0; i < count; i++) {
      const pattern: KeystrokePattern = {
        userId,
        patternId: `legit_${userId}_${i}`,
        timings: this.generateRealisticTimings(userId, true),
        timestamp: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000, // Last 30 days
        context: 'validation_test'
      };
      patterns.push(pattern);
    }
    
    return patterns;
  }

  private static generateImpostorPatterns(userId: string, count: number): KeystrokePattern[] {
    const patterns: KeystrokePattern[] = [];
    
    for (let i = 0; i < count; i++) {
      const pattern: KeystrokePattern = {
        userId: `impostor_${i}`, // Different user ID
        patternId: `impostor_${userId}_${i}`,
        timings: this.generateRealisticTimings(userId, false),
        timestamp: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
        context: 'validation_test'
      };
      patterns.push(pattern);
    }
    
    return patterns;
  }

  private static generateRealisticTimings(userId: string, isLegitimate: boolean): Array<{
    key: string;
    pressTime: number;
    releaseTime: number;
    duration: number;
  }> {
    const keys = ['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd'];
    const timings = [];
    let currentTime = 0;

    for (const key of keys) {
      const baseDelay = isLegitimate ? 
        150 + Math.random() * 100 : // Legitimate user: 150-250ms
        100 + Math.random() * 200;  // Impostor: 100-300ms (more variation)

      const duration = isLegitimate ?
        80 + Math.random() * 40 :   // Legitimate: 80-120ms
        60 + Math.random() * 80;    // Impostor: 60-140ms

      currentTime += baseDelay;
      
      timings.push({
        key,
        pressTime: currentTime,
        releaseTime: currentTime + duration,
        duration
      });
    }

    return timings;
  }

  private static calculateAUC(tpr: number, fpr: number): number {
    // Simplified AUC calculation
    // In practice, you'd integrate over the entire ROC curve
    return 0.5 + (tpr - fpr) / 2;
  }

  private static async testAlgorithmVariant(
    variant: 'current' | 'enhanced',
    dataset: TestDataset
  ): Promise<ValidationMetrics> {
    // For demonstration, we'll simulate different algorithms
    // In practice, you'd switch between actual algorithm implementations
    
    if (variant === 'enhanced') {
      // Simulate enhanced algorithm with slightly better performance
      BiometricMLEngine.adaptLearningRate([0.95, 0.96, 0.97]); // Increasing trend
    }

    return await this.validateAccuracy(dataset.metadata.userId, dataset);
  }

  private static calculateStatisticalSignificance(
    metricsA: ValidationMetrics,
    metricsB: ValidationMetrics
  ): number {
    // Simplified significance test
    const diffAccuracy = Math.abs(metricsA.accuracy - metricsB.accuracy);
    const avgAccuracy = (metricsA.accuracy + metricsB.accuracy) / 2;
    
    // Simple heuristic: larger differences are more significant
    return Math.min(0.99, diffAccuracy / avgAccuracy * 10);
  }

  private static generateABTestRecommendation(
    metricsA: ValidationMetrics,
    metricsB: ValidationMetrics,
    winner: 'A' | 'B' | 'tie'
  ): string {
    if (winner === 'tie') {
      return 'No statistically significant difference found. Continue with current algorithm.';
    }

    const winningMetrics = winner === 'A' ? metricsA : metricsB;
    const improvement = Math.abs(metricsA.accuracy - metricsB.accuracy) * 100;

    return `Algorithm ${winner} shows ${improvement.toFixed(2)}% improvement in accuracy. ` +
           `Winner has ${(winningMetrics.accuracy * 100).toFixed(2)}% accuracy, ` +
           `${(winningMetrics.falsePositiveRate * 100).toFixed(3)}% FAR, ` +
           `${(winningMetrics.falseNegativeRate * 100).toFixed(3)}% FRR. Recommend deployment.`;
  }

  /**
   * Get validation history
   */
  static getValidationHistory(userId?: string): Array<{
    timestamp: number;
    metrics: ValidationMetrics;
    userId: string;
  }> {
    return userId ? 
      this.validationHistory.filter(h => h.userId === userId) :
      this.validationHistory;
  }

  /**
   * Generate validation report
   */
  static generateValidationReport(userId: string): string {
    const history = this.getValidationHistory(userId);
    if (history.length === 0) {
      return `No validation history found for user ${userId}`;
    }

    const latest = history[history.length - 1];
    const target = {
      accuracy: 0.997,  // 99.7%
      far: 0.001,       // <0.1%
      frr: 0.003,       // <0.3%
      eer: 0.002        // <0.2%
    };

    const passed = {
      accuracy: latest.metrics.accuracy >= target.accuracy,
      far: latest.metrics.falsePositiveRate <= target.far,
      frr: latest.metrics.falseNegativeRate <= target.frr,
      eer: latest.metrics.equalErrorRate <= target.eer
    };

    const passCount = Object.values(passed).filter(Boolean).length;

    return `
📊 ACCURACY VALIDATION REPORT
====================================
User ID: ${userId}
Validation Date: ${new Date(latest.timestamp).toISOString()}
Tests Passed: ${passCount}/4

🎯 CORE METRICS
Overall Accuracy: ${(latest.metrics.accuracy * 100).toFixed(3)}% ${passed.accuracy ? '✅' : '❌'} (target: ≥99.7%)
False Acceptance Rate: ${(latest.metrics.falsePositiveRate * 100).toFixed(4)}% ${passed.far ? '✅' : '❌'} (target: ≤0.1%)
False Rejection Rate: ${(latest.metrics.falseNegativeRate * 100).toFixed(4)}% ${passed.frr ? '✅' : '❌'} (target: ≤0.3%)
Equal Error Rate: ${(latest.metrics.equalErrorRate * 100).toFixed(4)}% ${passed.eer ? '✅' : '❌'} (target: ≤0.2%)

📈 ADDITIONAL METRICS
Precision: ${(latest.metrics.precision * 100).toFixed(2)}%
Recall: ${(latest.metrics.recall * 100).toFixed(2)}%
F1 Score: ${(latest.metrics.f1Score * 100).toFixed(2)}%
AUC: ${latest.metrics.auc.toFixed(3)}

📊 TREND ANALYSIS
Validation Count: ${history.length}
${history.length > 1 ? `Accuracy Trend: ${this.calculateTrend(history.map(h => h.metrics.accuracy))}` : 'Insufficient data for trend analysis'}

${passCount === 4 ? '🎉 ALL PATENT SPECIFICATIONS MET!' : '⚠️  Optimization needed to meet patent requirements'}
====================================
    `;
  }

  private static calculateTrend(values: number[]): string {
    if (values.length < 2) return 'N/A';
    
    const recent = values.slice(-3);
    const trend = recent[recent.length - 1] - recent[0];
    
    if (trend > 0.001) return '📈 Improving';
    if (trend < -0.001) return '📉 Declining';
    return '➡️ Stable';
  }
}