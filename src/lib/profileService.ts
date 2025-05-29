
import { supabase } from '@/integrations/supabase/client';
import { User, UserType } from '@/lib/types';
import { Database } from '@/integrations/supabase/types';

type DbProfile = Database['public']['Tables']['profiles']['Row'];
type DbProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type DbProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export class ProfileService {
  static async getProfile(userId: string): Promise<User | null> {
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
  }

  static async updateProfile(userId: string, updates: Partial<DbProfileUpdate>): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile:', error);
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
    const { error } = await supabase
      .from('profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      console.error('Error updating last login:', error);
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
      } : undefined,
      biometricProfile: profile.biometric_profiles ? {
        userId: profile.id,
        keystrokePatterns: [], // Would be loaded separately if needed
        confidenceScore: profile.biometric_profiles.confidence_score,
        lastUpdated: new Date(profile.biometric_profiles.last_updated).getTime(),
        status: profile.biometric_profiles.status,
      } : undefined,
    };
  }
}
