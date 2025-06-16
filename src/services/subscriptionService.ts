
import { supabase } from '@/integrations/supabase/client';
import { SubscriptionData, SubscriptionPlan } from '@/types/subscription';

export const subscriptionService = {
  async fetchSubscription(userId: string): Promise<SubscriptionData | null> {
    // Check both subscribers and profiles tables
    const { data: subscriberData, error: subscriberError } = await supabase
      .from('subscribers')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_tier, subscription_status')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching profile data:', profileError);
    }

    if (subscriberError && subscriberError.code !== 'PGRST116') {
      console.error('Error fetching subscriber data:', subscriberError);
    }

    // Use profile data as primary source, fallback to subscriber data
    const subscriptionTier = profileData?.subscription_tier || subscriberData?.subscription_tier || 'free';
    
    return subscriberData || {
      id: '',
      user_id: userId,
      email: '',
      subscribed: profileData?.subscription_status === 'active',
      subscription_tier: subscriptionTier,
      subscription_end: null,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
  },

  async fetchPlans(): Promise<SubscriptionPlan[]> {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('active', true)
      .order('price_individual');

    if (error) {
      console.error('Error fetching plans:', error);
      return this.getFallbackPlans();
    }

    return data || [];
  },

  getFallbackPlans(): SubscriptionPlan[] {
    return [
      {
        id: 'free',
        name: 'Free Plan',
        tier: 'free',
        description: 'Basic keystroke authentication',
        price_individual: 0,
        price_company: 0,
        price_charity: 0,
        max_users: 1,
        max_biometric_profiles: 1,
        advanced_analytics: false,
        custom_security_settings: false,
        priority_support: false,
        active: true
      },
      {
        id: 'basic',
        name: 'Basic Plan',
        tier: 'basic',
        description: 'Enhanced security features',
        price_individual: 9.99,
        price_company: 49.99,
        price_charity: 4.99,
        max_users: 1,
        max_biometric_profiles: 3,
        advanced_analytics: false,
        custom_security_settings: true,
        priority_support: false,
        active: true
      },
      {
        id: 'professional',
        name: 'Professional Plan',
        tier: 'professional',
        description: 'Advanced analytics and priority support',
        price_individual: 19.99,
        price_company: 99.99,
        price_charity: 19.99,
        max_users: 25,
        max_biometric_profiles: -1,
        advanced_analytics: true,
        custom_security_settings: true,
        priority_support: true,
        active: true
      },
      {
        id: 'enterprise',
        name: 'Enterprise Plan',
        tier: 'enterprise',
        description: 'Unlimited everything with dedicated support',
        price_individual: 99.99,
        price_company: 499.99,
        price_charity: 249.99,
        max_users: -1,
        max_biometric_profiles: -1,
        advanced_analytics: true,
        custom_security_settings: true,
        priority_support: true,
        active: true
      }
    ];
  },

  async updateSubscription(userId: string, userEmail: string, planId: string, plans: SubscriptionPlan[]): Promise<SubscriptionData | null> {
    const plan = plans.find(p => p.id === planId);
    if (!plan) {
      throw new Error('Plan not found');
    }

    const subscriptionEnd = plan.tier === 'free' ? null : 
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    // Update profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        subscription_tier: plan.tier,
        subscription_status: plan.tier === 'free' ? 'trial' : 'active',
        subscription_end_date: subscriptionEnd,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (profileError) {
      console.error('Error updating profile:', profileError);
    }

    // Update or create subscriber record
    const { data, error } = await supabase
      .from('subscribers')
      .upsert({
        user_id: userId,
        email: userEmail,
        subscription_tier: plan.tier,
        subscribed: plan.tier !== 'free',
        subscription_end: subscriptionEnd,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }

    return data;
  },

  async cancelSubscription(userId: string): Promise<void> {
    // Update profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        subscription_tier: 'free',
        subscription_status: 'cancelled',
        subscription_end_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (profileError) {
      console.error('Error updating profile:', profileError);
    }

    // Update subscribers table
    const { error } = await supabase
      .from('subscribers')
      .update({
        subscribed: false,
        subscription_tier: 'free',
        subscription_end: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }
};
