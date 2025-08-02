import { supabase } from '@/integrations/supabase/client';
import { 
  BiometricSample, 
  BiometricModality, 
  MultiModalProfile,
  AdaptiveLearningResult
} from '@/types/advancedAuth';

export class MultiModalBiometricEngine {
  private static readonly MODALITY_WEIGHTS = {
    keystroke: 0.3,
    mouse: 0.25,
    touch: 0.2,
    behavioral: 0.15,
    device: 0.1
  };

  private static readonly QUALITY_THRESHOLDS = {
    excellent: 0.9,
    good: 0.7,
    acceptable: 0.5,
    poor: 0.3
  };

  static async processMultiModalAuthentication(
    userId: string,
    samples: BiometricSample[]
  ): Promise<{
    success: boolean;
    confidence: number;
    modality_scores: Record<BiometricModality, number>;
    overall_quality: string;
    recommendations: string[];
  }> {
    try {
      const profile = await this.getOrCreateProfile(userId);
      const modalityScores: Record<BiometricModality, number> = {} as any;
      const recommendations: string[] = [];

      let weightedScore = 0;
      let totalWeight = 0;

      // Process each biometric sample
      for (const sample of samples) {
        const score = await this.processModalitySample(userId, sample, profile);
        modalityScores[sample.modality] = score;

        const weight = profile.confidence_weights[sample.modality] || this.MODALITY_WEIGHTS[sample.modality];
        weightedScore += score * weight;
        totalWeight += weight;

        // Generate recommendations based on quality
        if (sample.quality_score < this.QUALITY_THRESHOLDS.acceptable) {
          recommendations.push(`Improve ${sample.modality} sample quality`);
        }
      }

      const overallConfidence = totalWeight > 0 ? weightedScore / totalWeight : 0;
      const success = overallConfidence >= 0.6; // 60% threshold for success

      const qualityLevel = this.determineQualityLevel(samples);

      // Update profile if authentication was successful
      if (success) {
        await this.updateProfile(userId, samples, overallConfidence);
      }

      // Store authentication attempt
      await this.storeAuthAttempt(userId, samples, overallConfidence, success, modalityScores);

      return {
        success,
        confidence: Math.round(overallConfidence * 100),
        modality_scores: modalityScores,
        overall_quality: qualityLevel,
        recommendations
      };
    } catch (error) {
      console.error('Error processing multimodal authentication:', error);
      throw error;
    }
  }

  private static async getOrCreateProfile(userId: string): Promise<MultiModalProfile> {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('user_id', userId)
        .eq('setting_key', 'multimodal_profile')
        .maybeSingle();

      if (error) throw error;

      if (data?.setting_value) {
        return data.setting_value as any as MultiModalProfile;
      }

      // Create new profile
      const newProfile: MultiModalProfile = {
        id: crypto.randomUUID(),
        user_id: userId,
        modalities: ['keystroke', 'mouse'],
        confidence_weights: { ...this.MODALITY_WEIGHTS },
        baseline_established: false,
        learning_progress: 0,
        last_adaptation: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await supabase
        .from('admin_settings')
        .insert({
          user_id: userId,
          setting_key: 'multimodal_profile',
          setting_value: newProfile as any
        });

      return newProfile;
    } catch (error) {
      console.error('Error getting/creating profile:', error);
      throw error;
    }
  }

  private static async processModalitySample(
    userId: string,
    sample: BiometricSample,
    profile: MultiModalProfile
  ): Promise<number> {
    try {
      // Get historical patterns for this modality - use proper table names
      let patterns: any[] = [];
      
      if (sample.modality === 'keystroke') {
        const { data } = await supabase
          .from('keystroke_patterns')
          .select('pattern_data, confidence_score')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(20);
        patterns = data || [];
      } else if (sample.modality === 'mouse') {
        const { data } = await supabase
          .from('mouse_patterns')
          .select('pattern_data, confidence_score')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(20);
        patterns = data || [];
      } else if (sample.modality === 'behavioral') {
        const { data } = await supabase
          .from('behavioral_patterns')
          .select('pattern_data, confidence_score')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(20);
        patterns = data || [];
      }

      if (!patterns || patterns.length < 5) {
        // Not enough data for comparison, use sample confidence
        return Math.min(sample.confidence * 0.7, 0.7); // Cap at 70% for new users
      }

      // Calculate similarity to historical patterns
      const similarities = patterns.map(pattern => 
        this.calculateSimilarity(sample.data, pattern.pattern_data)
      );

      const avgSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length;
      const maxSimilarity = Math.max(...similarities);

      // Combine sample confidence with historical similarity
      const modalityScore = (sample.confidence * 0.4) + (avgSimilarity * 0.4) + (maxSimilarity * 0.2);

      return Math.min(modalityScore, 1.0);
    } catch (error) {
      console.error(`Error processing ${sample.modality} sample:`, error);
      return sample.confidence * 0.5; // Fallback with reduced confidence
    }
  }

  private static calculateSimilarity(newData: any, historicalData: any): number {
    // Simplified similarity calculation
    // In a real implementation, this would be much more sophisticated
    try {
      const newKeys = Object.keys(newData);
      const historicalKeys = Object.keys(historicalData);
      
      const commonKeys = newKeys.filter(key => historicalKeys.includes(key));
      if (commonKeys.length === 0) return 0;

      let totalSimilarity = 0;
      
      for (const key of commonKeys) {
        const newValue = newData[key];
        const historicalValue = historicalData[key];
        
        if (typeof newValue === 'number' && typeof historicalValue === 'number') {
          const diff = Math.abs(newValue - historicalValue);
          const maxValue = Math.max(Math.abs(newValue), Math.abs(historicalValue), 1);
          const similarity = 1 - (diff / maxValue);
          totalSimilarity += Math.max(0, similarity);
        } else if (newValue === historicalValue) {
          totalSimilarity += 1;
        }
      }

      return totalSimilarity / commonKeys.length;
    } catch (error) {
      console.error('Error calculating similarity:', error);
      return 0;
    }
  }

  private static determineQualityLevel(samples: BiometricSample[]): string {
    const avgQuality = samples.reduce((sum, s) => sum + s.quality_score, 0) / samples.length;
    
    if (avgQuality >= this.QUALITY_THRESHOLDS.excellent) return 'excellent';
    if (avgQuality >= this.QUALITY_THRESHOLDS.good) return 'good';
    if (avgQuality >= this.QUALITY_THRESHOLDS.acceptable) return 'acceptable';
    return 'poor';
  }

  private static async updateProfile(
    userId: string,
    samples: BiometricSample[],
    confidence: number
  ): Promise<void> {
    try {
      const profile = await this.getOrCreateProfile(userId);
      
      // Update learning progress
      profile.learning_progress = Math.min(100, profile.learning_progress + 1);
      
      // Mark baseline as established after 50 successful authentications
      if (profile.learning_progress >= 50) {
        profile.baseline_established = true;
      }

      // Adaptive weight adjustment based on performance
      for (const sample of samples) {
        const currentWeight = profile.confidence_weights[sample.modality];
        if (currentWeight && sample.quality_score > this.QUALITY_THRESHOLDS.good) {
          // Slightly increase weight for high-performing modalities
          profile.confidence_weights[sample.modality] = Math.min(1.0, currentWeight * 1.01);
        }
      }

      profile.last_adaptation = new Date().toISOString();
      profile.updated_at = new Date().toISOString();

      await supabase
        .from('admin_settings')
        .update({
          setting_value: profile as any
        })
        .eq('user_id', userId)
        .eq('setting_key', 'multimodal_profile');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }

  private static async storeAuthAttempt(
    userId: string,
    samples: BiometricSample[],
    confidence: number,
    success: boolean,
    modalityScores: Record<BiometricModality, number>
  ): Promise<void> {
    try {
      await supabase
        .from('multimodal_auth_attempts')
        .insert({
          user_id: userId,
          modalities_used: samples.map(s => s.modality),
          individual_scores: modalityScores as any,
          combined_confidence: Math.round(confidence * 100),
          risk_score: Math.round((1 - confidence) * 100),
          success,
          device_fingerprint: samples[0]?.context || 'unknown'
        });
    } catch (error) {
      console.error('Error storing auth attempt:', error);
    }
  }

  static async getProfileAnalytics(userId: string): Promise<{
    profile: MultiModalProfile;
    recent_attempts: any[];
    learning_recommendations: AdaptiveLearningResult[];
  }> {
    try {
      const profile = await this.getOrCreateProfile(userId);
      
      const { data: attempts } = await supabase
        .from('multimodal_auth_attempts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      const learningRecommendations = await this.generateLearningRecommendations(userId, profile);

    return {
        profile,
        recent_attempts: attempts || [],
        learning_recommendations: learningRecommendations
      };
    } catch (error) {
      console.error('Error getting profile analytics:', error);
      throw error;
    }
  }

  private static async generateLearningRecommendations(
    userId: string,
    profile: MultiModalProfile
  ): Promise<AdaptiveLearningResult[]> {
    const recommendations: AdaptiveLearningResult[] = [];

    for (const modality of profile.modalities) {
      try {
        let recentPatterns: any[] = [];
        
        // Get patterns based on modality type
        if (modality === 'keystroke') {
          const { data } = await supabase
            .from('keystroke_patterns')
            .select('confidence_score, created_at')
            .eq('user_id', userId)
            .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
            .order('created_at', { ascending: false });
          recentPatterns = data || [];
        } else if (modality === 'mouse') {
          const { data } = await supabase
            .from('mouse_patterns')
            .select('confidence_score, created_at')
            .eq('user_id', userId)
            .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
            .order('created_at', { ascending: false });
          recentPatterns = data || [];
        } else if (modality === 'behavioral') {
          const { data } = await supabase
            .from('behavioral_patterns')
            .select('confidence_score, created_at')
            .eq('user_id', userId)
            .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
            .order('created_at', { ascending: false });
          recentPatterns = data || [];
        }

        if (recentPatterns && recentPatterns.length > 5) {
          const avgConfidence = recentPatterns.reduce((sum, p) => sum + (p.confidence_score || 0), 0) / recentPatterns.length;
          const improvement = avgConfidence > 70 ? 1 : avgConfidence / 100;
          
          recommendations.push({
            user_id: userId,
            modality,
            improvement_score: improvement,
            pattern_stability: Math.min(recentPatterns.length / 20, 1),
            recommended_weight: Math.max(0.1, Math.min(0.5, improvement)),
            learning_rate: improvement > 0.7 ? 0.05 : 0.1,
            next_adaptation_due: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          });
        }
      } catch (error) {
        console.error(`Error generating recommendations for ${modality}:`, error);
      }
    }

    return recommendations;
  }
}