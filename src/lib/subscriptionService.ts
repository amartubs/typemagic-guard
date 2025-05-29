import { supabase } from '@/integrations/supabase/client';
import { SubscriptionPlan, UserType } from '@/lib/types';
import { Database } from '@/integrations/supabase/types';

type DbSubscriptionPlan = Database['public']['Tables']['subscription_plans']['Row'];

export class SubscriptionService {
  static async getAvailablePlans(): Promise<SubscriptionPlan[]> {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('active', true)
      .order('tier');

    if (error) {
      console.error('Error fetching subscription plans:', error);
      return [];
    }

    return data.map(this.mapDbPlanToSubscriptionPlan);
  }

  static async getPlanById(planId: string): Promise<SubscriptionPlan | null> {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (error) {
      console.error('Error fetching subscription plan:', error);
      return null;
    }

    return this.mapDbPlanToSubscriptionPlan(data);
  }

  static async getUserSubscription(userId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        plan:subscription_plans(*)
      `)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user subscription:', error);
      return null;
    }

    return data;
  }

  static async createSubscription(userId: string, planId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        plan_id: planId,
        status: 'active',
        start_date: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }

    return data;
  }

  private static mapDbPlanToSubscriptionPlan(dbPlan: DbSubscriptionPlan): SubscriptionPlan {
    return {
      id: dbPlan.id,
      name: dbPlan.name,
      description: dbPlan.description || '',
      tier: dbPlan.tier as any,
      userTypes: this.getUserTypesForPlan(dbPlan),
      price: {
        individual: Number(dbPlan.price_individual),
        company: Number(dbPlan.price_company),
        charity: Number(dbPlan.price_charity),
      },
      features: this.getFeaturesForPlan(dbPlan),
      limits: {
        users: dbPlan.max_users === -1 ? Infinity : dbPlan.max_users,
        biometricProfiles: dbPlan.max_biometric_profiles === -1 ? Infinity : dbPlan.max_biometric_profiles,
        advancedAnalytics: dbPlan.advanced_analytics,
        customSecuritySettings: dbPlan.custom_security_settings,
        prioritySupport: dbPlan.priority_support,
      },
    };
  }

  private static getUserTypesForPlan(dbPlan: DbSubscriptionPlan): UserType[] {
    // Enterprise is only for companies
    if (dbPlan.tier === 'enterprise') {
      return ['company'];
    }
    // Free plan is for individuals and charities
    if (dbPlan.tier === 'free') {
      return ['individual', 'charity'];
    }
    // Other plans are for all user types
    return ['individual', 'company', 'charity'];
  }

  private static getFeaturesForPlan(dbPlan: DbSubscriptionPlan): string[] {
    const features: string[] = [];
    
    switch (dbPlan.tier) {
      case 'free':
        features.push(
          'Basic keystroke biometrics',
          'Single device support',
          'Standard security settings',
          'Email support'
        );
        break;
      case 'basic':
        features.push(
          'Advanced keystroke biometrics',
          'Multi-device support (up to 3)',
          'Custom security settings',
          'Basic analytics',
          'Priority email support'
        );
        break;
      case 'professional':
        features.push(
          'Advanced keystroke & mouse biometrics',
          'Unlimited device support',
          'Advanced security settings',
          'Comprehensive analytics',
          '24/7 priority support',
          'Anomaly detection alerts'
        );
        break;
      case 'enterprise':
        features.push(
          'All Professional features',
          'Unlimited users',
          'Unlimited biometric profiles',
          'Custom integration support',
          'Dedicated account manager',
          'SSO integration',
          'Audit logs & compliance reports'
        );
        break;
    }

    return features;
  }
}
