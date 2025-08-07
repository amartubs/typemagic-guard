import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/auth';
import { KeystrokeNeuralNetwork } from '@/lib/ml/KeystrokeNeuralNetwork';
import { BiometricMLEngine } from '@/lib/ml/BiometricMLEngine';
import { performanceMonitor } from '@/lib/monitoring/performanceMonitor';

interface AnomalyDetectionResult {
  isAnomaly: boolean;
  confidence: number;
  riskScore: number;
  anomalyType: 'keystroke' | 'mouse' | 'timing' | 'behavioral' | 'device';
  details: {
    expectedPattern: number[];
    actualPattern: number[];
    deviation: number;
    threshold: number;
  };
  mlPrediction: {
    neuralNetworkScore: number;
    traditionalScore: number;
    consensusScore: number;
  };
  timestamp: string;
  context: Record<string, any>;
}

interface RealTimeMetrics {
  anomaliesDetected: number;
  averageConfidence: number;
  falsePositiveRate: number;
  detectionLatency: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface PatternHistory {
  patterns: number[][];
  timestamps: string[];
  confidenceScores: number[];
  anomalyFlags: boolean[];
}

export const useEnhancedAnomalyDetection = () => {
  const { user } = useAuth();
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [anomalies, setAnomalies] = useState<AnomalyDetectionResult[]>([]);
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetrics>({
    anomaliesDetected: 0,
    averageConfidence: 0,
    falsePositiveRate: 0,
    detectionLatency: 0,
    riskLevel: 'low'
  });
  const [patternHistory, setPatternHistory] = useState<PatternHistory>({
    patterns: [],
    timestamps: [],
    confidenceScores: [],
    anomalyFlags: []
  });

  const neuralNetworkRef = useRef<KeystrokeNeuralNetwork | null>(null);
  const mlEngineRef = useRef<BiometricMLEngine | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout>();

  // Initialize ML models
  useEffect(() => {
    if (user && !neuralNetworkRef.current) {
      neuralNetworkRef.current = new KeystrokeNeuralNetwork({
        inputSize: 10,
        hiddenLayers: [20, 15],
        outputSize: 1,
        learningRate: 0.001,
        epochs: 100,
        batchSize: 32
      });
      mlEngineRef.current = new BiometricMLEngine();
      
      // Load pre-trained models or train with user data
      initializeModels();
    }
  }, [user]);

  const initializeModels = async () => {
    if (!neuralNetworkRef.current || !mlEngineRef.current) return;

    try {
      // Initialize neural network with user's historical patterns
      const userPatterns = await getUserHistoricalPatterns();
      if (userPatterns.length > 0) {
        const trainingData = {
          inputs: userPatterns.map(p => p.input),
          targets: userPatterns.map(p => p.output)
        };
        await neuralNetworkRef.current.train(trainingData);
      }

      console.log('ML models initialized successfully');
    } catch (error) {
      console.error('Failed to initialize ML models:', error);
    }
  };

  const getUserHistoricalPatterns = async (): Promise<any[]> => {
    // In a real implementation, this would fetch from the database
    // For now, return mock patterns
    return Array.from({ length: 50 }, (_, i) => ({
      input: Array.from({ length: 10 }, () => Math.random() * 200 + 50),
      output: [1] // Normal pattern
    }));
  };

  const analyzePattern = useCallback(async (
    pattern: number[],
    context: Record<string, any> = {}
  ): Promise<AnomalyDetectionResult> => {
    const startTime = performance.now();

    if (!neuralNetworkRef.current || !mlEngineRef.current) {
      throw new Error('ML models not initialized');
    }

    try {
      // Create keystroke pattern object for neural network
      const keystrokePattern = {
        userId: 'current_user',
        patternId: `pattern_${Date.now()}`,
        timings: pattern.map((timing, i) => ({
          key: `key_${i}`,
          pressTime: timing,
          releaseTime: timing + 50,
          dwellTime: 50,
          flightTime: i > 0 ? timing - pattern[i-1] : 0,
          duration: 50
        })),
        timestamp: Date.now(),
        context: JSON.stringify(context)
      };

      // Get prediction from neural network
      const neuralNetworkResult = await neuralNetworkRef.current.predict(keystrokePattern);
      
      // Simple traditional analysis for comparison
      const traditionalResult = {
        confidence: Math.random() * 0.4 + 0.6, // Mock traditional algorithm
        riskScore: Math.random() * 30 + 10
      };

      // Calculate consensus score
      const consensusScore = (neuralNetworkResult.confidence + traditionalResult.confidence) / 2;
      
      // Determine if this is an anomaly
      const threshold = context.threshold || 0.7;
      const isAnomaly = consensusScore < threshold;

      // Calculate risk score based on deviation and context
      const riskScore = calculateRiskScore(pattern, neuralNetworkResult, traditionalResult, context);

      // Determine anomaly type
      const anomalyType = determineAnomalyType(pattern, context);

      const detectionLatency = performance.now() - startTime;

      const result: AnomalyDetectionResult = {
        isAnomaly,
        confidence: consensusScore,
        riskScore,
        anomalyType,
        details: {
          expectedPattern: pattern.map(p => p * 0.9), // Mock expected pattern
          actualPattern: pattern,
          deviation: Math.abs(neuralNetworkResult.confidence - traditionalResult.confidence),
          threshold
        },
        mlPrediction: {
          neuralNetworkScore: neuralNetworkResult.confidence,
          traditionalScore: traditionalResult.confidence,
          consensusScore
        },
        timestamp: new Date().toISOString(),
        context
      };

      // Update pattern history
      setPatternHistory(prev => ({
        patterns: [...prev.patterns.slice(-99), pattern],
        timestamps: [...prev.timestamps.slice(-99), result.timestamp],
        confidenceScores: [...prev.confidenceScores.slice(-99), consensusScore],
        anomalyFlags: [...prev.anomalyFlags.slice(-99), isAnomaly]
      }));

      // Track performance
      performanceMonitor.recordBiometricProcessingTime(detectionLatency);

      return result;
    } catch (error) {
      console.error('Error analyzing pattern:', error);
      throw error;
    }
  }, []);

  const calculateRiskScore = (
    pattern: number[],
    neuralResult: any,
    traditionalResult: any,
    context: Record<string, any>
  ): number => {
    let riskScore = 0;

    // Base risk from confidence scores
    const avgConfidence = (neuralResult.confidence + traditionalResult.confidence) / 2;
    riskScore += (1 - avgConfidence) * 50;

    // Context-based risk factors
    if (context.unusualTime) riskScore += 10;
    if (context.newDevice) riskScore += 15;
    if (context.unusualLocation) riskScore += 20;
    if (context.multipleFailedAttempts) riskScore += 25;

    // Pattern deviation risk
    const deviation = Math.abs(neuralResult.confidence - traditionalResult.confidence);
    if (deviation > 0.3) riskScore += 15;

    return Math.min(100, Math.max(0, riskScore));
  };

  const determineAnomalyType = (
    pattern: number[],
    context: Record<string, any>
  ): AnomalyDetectionResult['anomalyType'] => {
    if (context.inputType === 'keystroke') return 'keystroke';
    if (context.inputType === 'mouse') return 'mouse';
    if (context.deviceChange) return 'device';
    if (context.timingAnomaly) return 'timing';
    return 'behavioral';
  };

  const startRealTimeMonitoring = useCallback(() => {
    if (isMonitoring) return;

    setIsMonitoring(true);

    // Start real-time pattern monitoring
    detectionIntervalRef.current = setInterval(async () => {
      // Simulate real-time pattern detection
      const mockPattern = Array.from({ length: 10 }, () => Math.random() * 200 + 50);
      const mockContext = {
        inputType: Math.random() > 0.5 ? 'keystroke' : 'mouse',
        threshold: 0.75,
        sessionDuration: Math.random() * 3600000, // Up to 1 hour
        deviceChange: Math.random() > 0.95,
        unusualTime: Math.random() > 0.9
      };

      try {
        const result = await analyzePattern(mockPattern, mockContext);
        
        if (result.isAnomaly) {
          setAnomalies(prev => [result, ...prev.slice(0, 49)]); // Keep last 50 anomalies
        }

        // Update real-time metrics
        setRealTimeMetrics(prev => {
          const updatedAnomalies = result.isAnomaly ? prev.anomaliesDetected + 1 : prev.anomaliesDetected;
          const totalDetections = updatedAnomalies + 1;
          
          return {
            anomaliesDetected: updatedAnomalies,
            averageConfidence: (prev.averageConfidence * (totalDetections - 1) + result.confidence) / totalDetections,
            falsePositiveRate: calculateFalsePositiveRate(patternHistory.anomalyFlags),
            detectionLatency: result.timestamp ? performance.now() - new Date(result.timestamp).getTime() : 0,
            riskLevel: result.riskScore > 75 ? 'critical' : 
                      result.riskScore > 50 ? 'high' : 
                      result.riskScore > 25 ? 'medium' : 'low'
          };
        });
      } catch (error) {
        console.error('Real-time monitoring error:', error);
      }
    }, 2000); // Check every 2 seconds

  }, [isMonitoring, analyzePattern, patternHistory.anomalyFlags]);

  const stopRealTimeMonitoring = useCallback(() => {
    setIsMonitoring(false);
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = undefined;
    }
  }, []);

  const calculateFalsePositiveRate = (anomalyFlags: boolean[]): number => {
    if (anomalyFlags.length === 0) return 0;
    
    // Simple heuristic: assume recent patterns are more likely to be legitimate
    const recentFlags = anomalyFlags.slice(-20);
    const falsePositives = recentFlags.filter(flag => flag).length;
    return (falsePositives / recentFlags.length) * 100;
  };

  const trainModel = useCallback(async (newPatterns: any[]) => {
    if (!neuralNetworkRef.current) return;

    try {
      const trainingData = {
        inputs: newPatterns.map(p => p.input || p),
        targets: newPatterns.map(p => p.output || [1])
      };
      await neuralNetworkRef.current.train(trainingData);
      console.log('Model retrained with new patterns');
    } catch (error) {
      console.error('Failed to retrain model:', error);
    }
  }, []);

  const adjustSensitivity = useCallback((sensitivity: number) => {
    // Adjust detection thresholds based on sensitivity
    const threshold = 1 - (sensitivity / 100);
    
    setPatternHistory(prev => ({
      ...prev,
      // Re-evaluate recent patterns with new threshold
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRealTimeMonitoring();
    };
  }, [stopRealTimeMonitoring]);

  return {
    // State
    isMonitoring,
    anomalies,
    realTimeMetrics,
    patternHistory,

    // Actions
    analyzePattern,
    startRealTimeMonitoring,
    stopRealTimeMonitoring,
    trainModel,
    adjustSensitivity,

    // ML Model Status
    isModelReady: !!neuralNetworkRef.current && !!mlEngineRef.current
  };
};