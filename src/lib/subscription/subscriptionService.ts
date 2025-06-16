
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionPlan } from '@/lib/types';
import { getDefaultPlans } from './defaultPlans';
import { mapDbPlanToSubscriptionPlan } from './planMapper';

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
        return getDefaultPlans();
      }

      return data.map(plan => mapDbPlanToSubscriptionPlan(plan));
    } catch (error) {
      console.error('Error in getAvailablePlans:', error);
      // Return default plans as fallback
      return getDefaultPlans();
    }
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

      return mapDbPlanToSubscriptionPlan(data);
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

  // Alias for backward compatibility
  static getDefaultPlans = getDefaultPlans;
}
