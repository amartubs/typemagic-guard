
import { supabase } from '@/integrations/supabase/client';
import { KeyTiming, KeystrokePattern, AuthenticationResult } from '@/lib/types';
import { BiometricEncryption } from '@/lib/security/encryption';
import { KeystrokeNeuralNetwork } from '@/lib/ml/KeystrokeNeuralNetwork';
import { BiometricCache } from '@/lib/caching/BiometricCache';
import { performanceMonitor } from '@/lib/monitoring/performanceMonitor';

export class BiometricProcessor {
  private static readonly CONFIDENCE_THRESHOLD = 70;
  private static readonly LEARNING_PATTERN_COUNT = 10;
  private static neuralNetwork: KeystrokeNeuralNetwork;
  private static cache: BiometricCache;

  static {
    // Initialize neural network for ML-powered authentication
    this.neuralNetwork = new KeystrokeNeuralNetwork({
      inputSize: 15, // Number of features extracted from keystroke patterns
      hiddenLayers: [32, 16, 8],
      outputSize: 1,
      learningRate: 0.001,
      epochs: 100,
      batchSize: 32,
      momentum: 0.9,
      optimizer: 'adam',
      regularization: 0.01
    });
    
    // Initialize Redis caching
    this.cache = BiometricCache.getInstance();
  }

  static async processKeystrokeData(
    timings: KeyTiming[],
    userId: string,
    context: string = 'authentication'
  ): Promise<AuthenticationResult> {
    const startTime = performance.now();
    
    try {
      // Create pattern from timings
      const pattern: KeystrokePattern = {
        userId,
        patternId: crypto.randomUUID(),
        timings,
        timestamp: Date.now(),
        context
      };

      // Try to get cached profile first
      let profile = await this.cache.getBiometricProfile(userId);
      
      if (!profile) {
        // Get user's biometric profile from database
        profile = await this.getBiometricProfile(userId);
        
        if (profile) {
          // Cache the profile for future requests
          await this.cache.setBiometricProfile(userId, profile);
        }
      }
      
      if (!profile) {
        // Create new profile for first-time user
        await this.createBiometricProfile(userId);
        return {
          success: true,
          confidenceScore: 100, // First time gets full confidence
          timestamp: Date.now(),
          userId,
          patternId: pattern.patternId
        };
      }

      // Calculate confidence score using ML neural network
      const confidenceScore = await this.calculateMLConfidence(pattern, profile);
      
      // Store the pattern
      await this.storeKeystrokePattern(pattern, profile.id, confidenceScore);
      
      // Log authentication attempt
      await this.logAuthenticationAttempt(userId, confidenceScore >= this.CONFIDENCE_THRESHOLD, confidenceScore, pattern.patternId);

      // Update profile if learning
      if (profile.status === 'learning' && profile.pattern_count < this.LEARNING_PATTERN_COUNT) {
        await this.updateProfileLearning(profile.id, profile.pattern_count + 1);
      }

      const result: AuthenticationResult = {
        success: confidenceScore >= this.CONFIDENCE_THRESHOLD,
        confidenceScore,
        timestamp: Date.now(),
        userId,
        patternId: pattern.patternId,
        anomalyDetails: confidenceScore < this.CONFIDENCE_THRESHOLD ? {
          fields: ['keystroke_timing'],
          severity: confidenceScore < 40 ? 'high' : confidenceScore < 60 ? 'medium' : 'low',
          description: `Keystroke pattern anomaly detected. Confidence: ${confidenceScore}%`
        } : undefined
      };

      // Record performance metrics
      const processingTime = performance.now() - startTime;
      performanceMonitor.recordBiometricProcessingTime(processingTime);
      
      // Log if processing time exceeds 50ms target
      if (processingTime > 50) {
        console.warn(`⚠️ Biometric processing exceeded 50ms target: ${processingTime.toFixed(2)}ms`);
      }

      return result;
    } catch (error) {
      const processingTime = performance.now() - startTime;
      performanceMonitor.recordBiometricProcessingTime(processingTime);
      
      console.error('Error processing keystroke data:', error);
      return {
        success: false,
        confidenceScore: 0,
        timestamp: Date.now(),
        userId,
        patternId: null,
        anomalyDetails: {
          fields: ['system_error'],
          severity: 'high',
          description: 'System error during biometric processing'
        }
      };
    }
  }

  private static async getBiometricProfile(userId: string) {
    const { data, error } = await supabase
      .from('biometric_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching biometric profile:', error);
      return null;
    }

    return data;
  }

  private static async createBiometricProfile(userId: string) {
    const { error } = await supabase
      .from('biometric_profiles')
      .insert({
        user_id: userId,
        confidence_score: 0,
        status: 'learning',
        pattern_count: 0
      });

    if (error) {
      console.error('Error creating biometric profile:', error);
    }
  }

  /**
   * ML-powered confidence calculation using neural network
   */
  private static async calculateMLConfidence(pattern: KeystrokePattern, profile: any): Promise<number> {
    try {
      // Try to get cached training data first
      let trainingData = await this.cache.getTrainingData(pattern.userId);
      
      if (!trainingData) {
        // Get training data from database
        const { data: existingPatterns } = await supabase
          .from('keystroke_patterns')
          .select('pattern_data, confidence_score')
          .eq('biometric_profile_id', profile.id)
          .limit(100);

        if (!existingPatterns || existingPatterns.length === 0) {
          return 85; // New user gets high initial confidence
        }

        // Prepare training data for neural network
        trainingData = existingPatterns.map(p => ({
          pattern: p.pattern_data,
          confidence: p.confidence_score
        }));

        // Cache training data
        await this.cache.setTrainingData(pattern.userId, trainingData);
      }

      // Use neural network for prediction
      const mlResult = await this.neuralNetwork.predict(pattern);
      
      // Combine ML confidence with rule-based confidence for robustness
      const traditionalConfidence = await this.calculateTraditionalConfidence(pattern, profile);
      
      // Weighted combination: 70% ML, 30% traditional
      const combinedConfidence = (mlResult.confidence * 0.7) + (traditionalConfidence * 0.3);
      
      return Math.max(0, Math.min(100, combinedConfidence));
    } catch (error) {
      console.error('ML confidence calculation failed, falling back to traditional method:', error);
      return await this.calculateTraditionalConfidence(pattern, profile);
    }
  }

  /**
   * Traditional confidence calculation as fallback
   */
  private static async calculateTraditionalConfidence(pattern: KeystrokePattern, profile: any): Promise<number> {
    const { data: existingPatterns } = await supabase
      .from('keystroke_patterns')
      .select('pattern_data')
      .eq('biometric_profile_id', profile.id)
      .limit(5);

    if (!existingPatterns || existingPatterns.length === 0) {
      return 85; // New user gets high initial confidence
    }

    // Calculate timing similarity (simplified algorithm)
    let totalSimilarity = 0;
    let comparisons = 0;

    for (const existingPattern of existingPatterns) {
      const similarity = this.calculateTimingSimilarity(pattern.timings, existingPattern.pattern_data);
      totalSimilarity += similarity;
      comparisons++;
    }

    const averageSimilarity = totalSimilarity / comparisons;
    return Math.max(0, Math.min(100, averageSimilarity));
  }

  private static calculateTimingSimilarity(current: KeyTiming[], stored: any): number {
    // Simplified timing similarity calculation
    if (!stored || !Array.isArray(stored)) return 50;
    
    const currentAvgDwell = current.reduce((sum, t) => sum + (t.duration || 0), 0) / current.length;
    const storedAvgDwell = stored.reduce((sum: number, t: any) => sum + (t.duration || 0), 0) / stored.length;
    
    const dwellDiff = Math.abs(currentAvgDwell - storedAvgDwell);
    const similarity = Math.max(0, 100 - (dwellDiff * 2));
    
    return similarity;
  }

  private static async storeKeystrokePattern(pattern: KeystrokePattern, profileId: string, confidenceScore: number) {
    try {
      const encryptedData = await BiometricEncryption.encryptBiometricData(pattern.timings);
      
      const { error } = await supabase
        .from('keystroke_patterns')
        .insert({
          user_id: pattern.userId,
          biometric_profile_id: profileId,
          pattern_data: encryptedData,
          context: pattern.context,
          confidence_score: confidenceScore
        });

      if (error) {
        console.error('Error storing keystroke pattern:', error);
      }
    } catch (error) {
      console.error('Error encrypting and storing pattern:', error);
    }
  }

  private static async logAuthenticationAttempt(
    userId: string,
    success: boolean,
    confidenceScore: number,
    patternId: string
  ) {
    const { error } = await supabase
      .from('authentication_attempts')
      .insert({
        user_id: userId,
        success,
        confidence_score: confidenceScore,
        pattern_id: patternId,
        ip_address: await this.getClientIP(),
        user_agent: navigator.userAgent
      });

    if (error) {
      console.error('Error logging authentication attempt:', error);
    }
  }

  private static async updateProfileLearning(profileId: string, patternCount: number) {
    const status = patternCount >= this.LEARNING_PATTERN_COUNT ? 'active' : 'learning';
    
    const { error } = await supabase
      .from('biometric_profiles')
      .update({
        pattern_count: patternCount,
        status,
        last_updated: new Date().toISOString()
      })
      .eq('id', profileId);

    if (error) {
      console.error('Error updating profile learning status:', error);
    }
  }

  private static async getClientIP(): Promise<string | null> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return null;
    }
  }
}
