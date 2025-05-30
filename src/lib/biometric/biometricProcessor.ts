
import { supabase } from '@/integrations/supabase/client';
import { KeyTiming, KeystrokePattern, AuthenticationResult } from '@/lib/types';
import { BiometricEncryption } from '@/lib/security/encryption';

export class BiometricProcessor {
  private static readonly CONFIDENCE_THRESHOLD = 70;
  private static readonly LEARNING_PATTERN_COUNT = 10;

  static async processKeystrokeData(
    timings: KeyTiming[],
    userId: string,
    context: string = 'authentication'
  ): Promise<AuthenticationResult> {
    try {
      // Create pattern from timings
      const pattern: KeystrokePattern = {
        userId,
        patternId: crypto.randomUUID(),
        timings,
        timestamp: Date.now(),
        context
      };

      // Get user's biometric profile
      const profile = await this.getBiometricProfile(userId);
      
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

      // Calculate confidence score
      const confidenceScore = await this.calculateConfidence(pattern, profile);
      
      // Store the pattern
      await this.storeKeystrokePattern(pattern, profile.id, confidenceScore);
      
      // Log authentication attempt
      await this.logAuthenticationAttempt(userId, confidenceScore >= this.CONFIDENCE_THRESHOLD, confidenceScore, pattern.patternId);

      // Update profile if learning
      if (profile.status === 'learning' && profile.pattern_count < this.LEARNING_PATTERN_COUNT) {
        await this.updateProfileLearning(profile.id, profile.pattern_count + 1);
      }

      return {
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
    } catch (error) {
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

  private static async calculateConfidence(pattern: KeystrokePattern, profile: any): Promise<number> {
    // Simplified confidence calculation - in production this would use ML models
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
