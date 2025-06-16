
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
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        setError(error.message);
        return;
      }

      setSubscription(data);
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
        setError(error.message);
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

      const subscriptionData = {
        user_id: user.id,
        email: user.email,
        subscription_tier: plan.tier,
        subscribed: true,
        subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      };

      const { data, error } = await supabase
        .from('subscribers')
        .upsert(subscriptionData, { onConflict: 'user_id' })
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
        description: "Subscription updated successfully",
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
      
      const { error } = await supabase
        .from('subscribers')
        .update({
          subscribed: false,
          subscription_tier: 'free',
          subscription_end: new Date().toISOString(),
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
