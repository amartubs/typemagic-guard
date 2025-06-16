
import { supabase } from '@/integrations/supabase/client';
import { User, SecuritySettings, BiometricProfile } from '@/lib/types';

export class DatabaseSeedService {
  static async seedDemoUser(): Promise<string | null> {
    try {
      // Check if demo user already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', 'demo@example.com')
        .single();

      if (existingProfile) {
        return existingProfile.id;
      }

      // Create demo user through Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'demo@example.com',
        password: 'demo123456',
        options: {
          data: {
            name: 'Demo User'
          }
        }
      });

      if (authError || !authData.user) {
        console.error('Error creating demo user:', authError);
        return null;
      }

      return authData.user.id;
    } catch (error) {
      console.error('Error seeding demo user:', error);
      return null;
    }
  }

  static async getOrCreateDemoProfile(): Promise<User | null> {
    try {
      const { data: profile, error } = await supabase
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
        .eq('email', 'demo@example.com')
        .single();

      if (error) {
        console.error('Error fetching demo profile:', error);
        return null;
      }

      return this.mapDbProfileToUser(profile);
    } catch (error) {
      console.error('Error getting demo profile:', error);
      return null;
    }
  }

  private static mapDbProfileToUser(data: any): User {
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role as 'admin' | 'user',
      status: data.status as 'active' | 'locked' | 'pending',
      lastLogin: data.last_login ? new Date(data.last_login).getTime() : null,
      organizationName: data.organization_name || undefined,
      organizationSize: data.organization_size || undefined,
      securitySettings: {
        minConfidenceThreshold: data.security_settings?.min_confidence_threshold || 65,
        learningPeriod: data.security_settings?.learning_period || 5,
        anomalyDetectionSensitivity: data.security_settings?.anomaly_detection_sensitivity || 70,
        securityLevel: data.security_settings?.security_level || 'medium',
        enforceTwoFactor: data.security_settings?.enforce_two_factor || false,
        maxFailedAttempts: data.security_settings?.max_failed_attempts || 5,
      },
      subscription: data.subscriptions ? {
        type: data.user_type as 'individual' | 'company' | 'charity',
        tier: data.subscriptions.plan?.tier || 'free',
        startDate: new Date(data.subscriptions.start_date).getTime(),
        endDate: data.subscriptions.end_date ? new Date(data.subscriptions.end_date).getTime() : null,
        autoRenew: data.subscriptions.auto_renew,
        status: data.subscriptions.status,
        paymentMethod: data.subscriptions.payment_method || undefined,
        lastPayment: data.subscriptions.last_payment ? new Date(data.subscriptions.last_payment).getTime() : undefined,
      } : undefined,
      biometricProfile: data.biometric_profiles ? {
        userId: data.id,
        keystrokePatterns: [], // Would be loaded separately if needed
        confidenceScore: data.biometric_profiles.confidence_score,
        lastUpdated: new Date(data.biometric_profiles.last_updated).getTime(),
        status: data.biometric_profiles.status,
      } : undefined,
    };
  }

  static async seedDefaultSecuritySettings(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('security_settings')
        .upsert({
          user_id: userId,
          min_confidence_threshold: 65,
          learning_period: 5,
          anomaly_detection_sensitivity: 70,
          max_failed_attempts: 5,
          security_level: 'medium',
          enforce_two_factor: false,
        });

      if (error) {
        console.error('Error seeding security settings:', error);
      }
    } catch (error) {
      console.error('Error in seedDefaultSecuritySettings:', error);
    }
  }

  static async seedBiometricProfile(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('biometric_profiles')
        .upsert({
          user_id: userId,
          confidence_score: 0,
          status: 'learning',
          pattern_count: 0,
        });

      if (error) {
        console.error('Error seeding biometric profile:', error);
      }
    } catch (error) {
      console.error('Error in seedBiometricProfile:', error);
    }
  }
}
