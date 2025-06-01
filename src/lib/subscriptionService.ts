
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionPlan, UserType } from '@/lib/types';
import { Database } from '@/integrations/supabase/types';

type DbSubscriptionPlan = Database['public']['Tables']['subscription_plans']['Row'];

export class SubscriptionService {
  static async getAvailablePlans(): Promise<SubscriptionPlan[]> {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('active', true)
        .order('tier');

      if (error) {
        console.error('Error fetching subscription plans:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.warn('No subscription plans found in database');
        return this.getDefaultPlans();
      }

      return data.map(plan => this.mapDbPlanToSubscriptionPlan(plan));
    } catch (error) {
      console.error('Error in getAvailablePlans:', error);
      // Return default plans as fallback
      return this.getDefaultPlans();
    }
  }

  static getDefaultPlans(): SubscriptionPlan[] {
    return [
      {
        id: 'free',
        name: 'Free',
        description: 'Basic keystroke biometrics for getting started',
        tier: 'free',
        userTypes: ['individual', 'company', 'charity'],
        price: { individual: 0, company: 0, charity: 0 },
        features: [
          'Basic keystroke biometrics',
          '1 user only',
          'Single device support',
          'Community support'
        ],
        limits: {
          users: 1,
          biometricProfiles: 1,
          advancedAnalytics: false,
          customSecuritySettings: false,
          prioritySupport: false
        }
      },
      {
        id: 'basic',
        name: 'Basic',
        description: 'Multi-device support with basic analytics',
        tier: 'basic',
        userTypes: ['individual', 'company', 'charity'],
        price: { individual: 9.99, company: 49.99, charity: 4.99 },
        features: [
          'Multi-device support',
          'Up to 5 users',
          'Basic analytics',
          'Email support',
          'Custom security settings'
        ],
        limits: {
          users: 5,
          biometricProfiles: 5,
          advancedAnalytics: false,
          customSecuritySettings: true,
          prioritySupport: false
        }
      },
      {
        id: 'professional',
        name: 'Professional',
        description: 'Advanced biometrics with full analytics',
        tier: 'professional',
        userTypes: ['individual', 'company', 'charity'],
        price: { individual: 19.99, company: 99.99, charity: 19.99 },
        features: [
          'Advanced biometric analytics',
          'Up to 20 users',
          'Full analytics dashboard',
          'Real-time anomaly detection',
          '24/7 priority support',
          'Custom security policies'
        ],
        limits: {
          users: 20,
          biometricProfiles: 20,
          advancedAnalytics: true,
          customSecuritySettings: true,
          prioritySupport: true
        }
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'Unlimited users with API access',
        tier: 'enterprise',
        userTypes: ['company'],
        price: { individual: 99.99, company: 499.99, charity: 249.99 },
        features: [
          'Unlimited users',
          'API access',
          'Custom integration support',
          'Dedicated account manager',
          'Advanced compliance features',
          'SSO integration',
          'Audit logs & reporting'
        ],
        limits: {
          users: Infinity,
          biometricProfiles: Infinity,
          advancedAnalytics: true,
          customSecuritySettings: true,
          prioritySupport: true
        }
      }
    ];
  }

  static async getPlanById(planId: string): Promise<SubscriptionPlan | null> {
    try {
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
    } catch (error) {
      console.error('Error in getPlanById:', error);
      return null;
    }
  }

  static async getUserSubscription(userId: string) {
    try {
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
    } catch (error) {
      console.error('Error in getUserSubscription:', error);
      return null;
    }
  }

  static async createSubscription(userId: string, planId: string) {
    try {
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
    } catch (error) {
      console.error('Error in createSubscription:', error);
      throw error;
    }
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
    // All other plans are for all user types
    return ['individual', 'company', 'charity'];
  }

  private static getFeaturesForPlan(dbPlan: DbSubscriptionPlan): string[] {
    const features: string[] = [];
    
    switch (dbPlan.tier) {
      case 'free':
        features.push(
          'Basic keystroke biometrics',
          '1 user only',
          'Single device support',
          'Community support'
        );
        break;
      case 'basic':
        features.push(
          'Multi-device support',
          'Up to 5 users',
          'Basic analytics',
          'Email support',
          'Custom security settings'
        );
        break;
      case 'professional':
        features.push(
          'Advanced biometric analytics',
          'Up to 20 users',
          'Full analytics dashboard',
          'Real-time anomaly detection',
          '24/7 priority support',
          'Custom security policies'
        );
        break;
      case 'enterprise':
        features.push(
          'Unlimited users',
          'API access',
          'Custom integration support',
          'Dedicated account manager',
          'Advanced compliance features',
          'SSO integration',
          'Audit logs & reporting'
        );
        break;
    }

    return features;
  }
}
