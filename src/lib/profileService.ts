
import { supabase } from '@/integrations/supabase/client';
import { User, UserType } from '@/lib/types';
import { Database } from '@/integrations/supabase/types';

type DbProfile = Database['public']['Tables']['profiles']['Row'];
type DbProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type DbProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export class ProfileService {
  static async getProfile(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          security_settings(*),
          subscriptions(
            *,
            plan:subscription_plans(*)
          ),
          biometric_profiles(*)
        `)
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return this.mapDbProfileToUser(data);
    } catch (error) {
      console.error('Error in getProfile:', error);
      return null;
    }
  }

  static async createProfile(userId: string, email: string, userData: {
    name: string;
    userType?: UserType;
    organizationName?: string;
    organizationSize?: number;
  }): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email,
          name: userData.name,
          user_type: userData.userType || 'individual',
          organization_name: userData.organizationName,
          organization_size: userData.organizationSize,
          status: 'active'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        return null;
      }

      // Create default security settings
      await this.createDefaultSecuritySettings(userId);
      
      // Create biometric profile
      await this.createBiometricProfile(userId);

      return this.getProfile(userId);
    } catch (error) {
      console.error('Error in createProfile:', error);
      return null;
    }
  }

  static async updateProfile(userId: string, updates: Partial<DbProfileUpdate>): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  }

  static async updateUserType(userId: string, userType: UserType, organizationData?: {
    organizationName?: string;
    organizationSize?: number;
  }): Promise<void> {
    const updates: DbProfileUpdate = {
      user_type: userType,
      ...organizationData,
    };

    await this.updateProfile(userId, updates);
  }

  static async updateLastLogin(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating last login:', error);
      }
    } catch (error) {
      console.error('Error in updateLastLogin:', error);
    }
  }

  private static async createDefaultSecuritySettings(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('security_settings')
        .insert({
          user_id: userId,
          min_confidence_threshold: 65,
          learning_period: 5,
          anomaly_detection_sensitivity: 70,
          max_failed_attempts: 5,
          security_level: 'medium',
          enforce_two_factor: false,
        });

      if (error) {
        console.error('Error creating security settings:', error);
      }
    } catch (error) {
      console.error('Error in createDefaultSecuritySettings:', error);
    }
  }

  private static async createBiometricProfile(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('biometric_profiles')
        .insert({
          user_id: userId,
          confidence_score: 0,
          status: 'learning',
          pattern_count: 0,
        });

      if (error) {
        console.error('Error creating biometric profile:', error);
      }
    } catch (error) {
      console.error('Error in createBiometricProfile:', error);
    }
  }

  private static mapDbProfileToUser(data: any): User {
    const profile = data as DbProfile & {
      security_settings: any;
      subscriptions: any;
      biometric_profiles: any;
    };

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role as 'admin' | 'user',
      status: profile.status as 'active' | 'locked' | 'pending',
      lastLogin: profile.last_login ? new Date(profile.last_login).getTime() : null,
      organizationName: profile.organization_name || undefined,
      organizationSize: profile.organization_size || undefined,
      securitySettings: {
        minConfidenceThreshold: profile.security_settings?.min_confidence_threshold || 65,
        learningPeriod: profile.security_settings?.learning_period || 5,
        anomalyDetectionSensitivity: profile.security_settings?.anomaly_detection_sensitivity || 70,
        securityLevel: profile.security_settings?.security_level || 'medium',
        enforceTwoFactor: profile.security_settings?.enforce_two_factor || false,
        maxFailedAttempts: profile.security_settings?.max_failed_attempts || 5,
      },
      subscription: profile.subscriptions ? {
        type: profile.user_type as UserType,
        tier: profile.subscriptions.plan?.tier || 'free',
        startDate: new Date(profile.subscriptions.start_date).getTime(),
        endDate: profile.subscriptions.end_date ? new Date(profile.subscriptions.end_date).getTime() : null,
        autoRenew: profile.subscriptions.auto_renew,
        status: profile.subscriptions.status,
        paymentMethod: profile.subscriptions.payment_method || undefined,
        lastPayment: profile.subscriptions.last_payment ? new Date(profile.subscriptions.last_payment).getTime() : undefined,
      } : {
        type: profile.user_type as UserType || 'individual',
        tier: 'free',
        startDate: Date.now(),
        endDate: null,
        autoRenew: true,
        status: 'trial',
      },
      biometricProfile: profile.biometric_profiles ? {
        userId: profile.id,
        keystrokePatterns: [], // Would be loaded separately if needed
        confidenceScore: profile.biometric_profiles.confidence_score,
        lastUpdated: new Date(profile.biometric_profiles.last_updated).getTime(),
        status: profile.biometric_profiles.status,
      } : undefined,
    };
  }

  static async deleteProfile(userId: string): Promise<void> {
    try {
      // Delete related data first (cascading should handle this, but being explicit)
      await Promise.all([
        supabase.from('security_settings').delete().eq('user_id', userId),
        supabase.from('biometric_profiles').delete().eq('user_id', userId),
        supabase.from('keystroke_patterns').delete().eq('user_id', userId),
        supabase.from('authentication_attempts').delete().eq('user_id', userId),
      ]);

      // Delete the profile
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Error deleting profile:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in deleteProfile:', error);
      throw error;
    }
  }
}
