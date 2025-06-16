
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { toast } from '@/hooks/use-toast';
import { subscriptionService } from '@/services/subscriptionService';
import { SubscriptionData, SubscriptionPlan } from '@/types/subscription';

export const useSubscriptionData = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = async () => {
    if (!user?.id) return;

    try {
      const data = await subscriptionService.fetchSubscription(user.id);
      setSubscription(data);
    } catch (err) {
      console.error('Error in fetchSubscription:', err);
      setError('Failed to fetch subscription data');
    }
  };

  const fetchPlans = async () => {
    try {
      const data = await subscriptionService.fetchPlans();
      setPlans(data);
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

      const data = await subscriptionService.updateSubscription(user.id, user.email, planId, plans);
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
      
      await subscriptionService.cancelSubscription(user.id);
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
