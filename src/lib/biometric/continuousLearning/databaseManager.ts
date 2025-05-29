
import { BiometricProfile, KeystrokePattern } from '@/lib/types';
import { BiometricEncryption } from '@/lib/security/encryption';
import { supabase } from '@/integrations/supabase/client';

export class DatabaseManager {
  static async storePatternAndUpdateProfile(pattern: KeystrokePattern, userId: string): Promise<void> {
    const biometricProfileId = await this.getBiometricProfileId(userId);
    if (biometricProfileId) {
      await this.storeEncryptedPattern(pattern, biometricProfileId, userId);
    }
  }

  private static async getBiometricProfileId(userId: string): Promise<string | null> {
    try {
      const { data } = await supabase
        .from('biometric_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      return data?.id || null;
    } catch (error) {
      console.error('Failed to get biometric profile ID:', error);
      return null;
    }
  }

  private static async storeEncryptedPattern(pattern: KeystrokePattern, biometricProfileId: string, userId: string): Promise<void> {
    try {
      // Encrypt the pattern data
      const encryptedData = await BiometricEncryption.encryptBiometricData(pattern.timings);
      
      // Store in database with all required fields
      const { error } = await supabase
        .from('keystroke_patterns')
        .insert({
          user_id: userId,
          biometric_profile_id: biometricProfileId,
          pattern_data: { encrypted: encryptedData },
          context: pattern.context,
          confidence_score: null // Will be calculated by the analysis
        });

      if (error) {
        console.warn('Failed to store pattern in database:', error.message);
      }
    } catch (error) {
      console.error('Failed to store encrypted pattern:', error);
      // Don't throw - this shouldn't block the authentication process
    }
  }

  static async updateProfileInDatabase(profile: BiometricProfile): Promise<void> {
    try {
      await supabase
        .from('biometric_profiles')
        .update({
          confidence_score: profile.confidenceScore,
          status: profile.status,
          pattern_count: profile.keystrokePatterns.length,
          last_updated: new Date().toISOString()
        })
        .eq('user_id', profile.userId);
    } catch (error) {
      console.error('Failed to update profile in database:', error);
      // Don't throw - this shouldn't block the authentication process
    }
  }
}
