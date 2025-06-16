
import { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useSubscriptionManager = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (plan: any) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          planId: plan.id,
          userType: user.subscription?.type || 'individual'
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open subscription management. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPlanLimits = () => {
    const tier = user?.subscription?.tier || 'free';
    
    switch (tier) {
      case 'basic':
        return { users: 1, devices: 3, analytics: false, support: 'Email' };
      case 'professional':
        return { users: 25, devices: 'Unlimited', analytics: true, support: '24/7 Priority' };
      case 'enterprise':
        return { users: 'Unlimited', devices: 'Unlimited', analytics: true, support: 'Dedicated Manager' };
      default:
        return { users: 1, devices: 1, analytics: false, support: 'Community' };
    }
  };

  return {
    user,
    loading,
    handleUpgrade,
    handleManageSubscription,
    getCurrentPlanLimits
  };
};
