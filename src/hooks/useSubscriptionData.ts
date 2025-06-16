
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SubscriptionData {
  id: string;
  user_id: string;
  email: string;
  stripe_customer_id?: string;
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
  updated_at: string;
  created_at: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  tier: string;
  description?: string;
  price_individual: number;
  price_company: number;
  price_charity: number;
  max_users: number;
  max_biometric_profiles: number;
  advanced_analytics: boolean;
  custom_security_settings: boolean;
  priority_support: boolean;
  active: boolean;
}

export const useSubscriptionData = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = async () => {
    if (!user?.id) return;

    try {
      // Check both subscribers and profiles tables
      const { data: subscriberData, error: subscriberError } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_tier, subscription_status')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile data:', profileError);
      }

      if (subscriberError && subscriberError.code !== 'PGRST116') {
        console.error('Error fetching subscriber data:', subscriberError);
      }

      // Use profile data as primary source, fallback to subscriber data
      const subscriptionTier = profileData?.subscription_tier || subscriberData?.subscription_tier || 'free';
      
      setSubscription(subscriberData || {
        id: '',
        user_id: user.id,
        email: user.email || '',
        subscribed: profileData?.subscription_status === 'active',
        subscription_tier: subscriptionTier,
        subscription_end: null,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error in fetchSubscription:', err);
      setError('Failed to fetch subscription data');
    }
  };

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('active', true)
        .order('price_individual');

      if (error) {
        console.error('Error fetching plans:', error);
        // Provide fallback plans if database query fails
        setPlans([
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
        ]);
        return;
      }

      setPlans(data || []);
    } catch (err) {
      console.error('Error in fetchPlans:', err);
      setError('Failed to fetch subscription plans');
    }
  };

  const createOrUpdateSubscription = async (planId: string) => {
    if (!user?.id || !user?.email) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return false;
    }

    try {
      setLoading(true);
      
      const plan = plans.find(p => p.id === planId);
      if (!plan) {
        throw new Error('Plan not found');
      }

      // Update both tables to ensure consistency
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
        .eq('id', user.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
      }

      // Update or create subscriber record
      const { data, error } = await supabase
        .from('subscribers')
        .upsert({
          user_id: user.id,
          email: user.email,
          subscription_tier: plan.tier,
          subscribed: plan.tier !== 'free',
          subscription_end: subscriptionEnd,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) {
        console.error('Error updating subscription:', error);
        toast({
          title: "Error",
          description: "Failed to update subscription",
          variant: "destructive",
        });
        return false;
      }

      setSubscription(data);
      toast({
        title: "Success",
        description: `Successfully ${plan.tier === 'free' ? 'downgraded to' : 'upgraded to'} ${plan.name}`,
      });
      return true;
    } catch (err) {
      console.error('Error in createOrUpdateSubscription:', err);
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async () => {
    if (!user?.id) return false;

    try {
      setLoading(true);
      
      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          subscription_tier: 'free',
          subscription_status: 'cancelled',
          subscription_end_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

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
        .eq('user_id', user.id);

      if (error) {
        console.error('Error canceling subscription:', error);
        toast({
          title: "Error",
          description: "Failed to cancel subscription",
          variant: "destructive",
        });
        return false;
      }

      await fetchSubscription();
      toast({
        title: "Success",
        description: "Subscription canceled successfully",
      });
      return true;
    } catch (err) {
      console.error('Error in cancelSubscription:', err);
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchSubscription(), fetchPlans()]);
      setLoading(false);
    };

    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  return {
    subscription,
    plans,
    loading,
    error,
    createOrUpdateSubscription,
    cancelSubscription,
    refreshSubscription: fetchSubscription,
  };
};
