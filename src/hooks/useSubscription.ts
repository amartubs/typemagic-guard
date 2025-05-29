
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SubscriptionLimits {
  maxUsers: number;
  maxDevices: number;
  advancedAnalytics: boolean;
  prioritySupport: boolean;
  customSecurity: boolean;
  apiAccess: boolean;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const checkSubscriptionStatus = async () => {
    if (!user) return null;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error checking subscription:', error);
      toast({
        title: "Error",
        description: "Failed to check subscription status",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getSubscriptionLimits = (): SubscriptionLimits => {
    const tier = user?.subscription?.tier || 'free';
    
    switch (tier) {
      case 'basic':
        return {
          maxUsers: 1,
          maxDevices: 3,
          advancedAnalytics: false,
          prioritySupport: false,
          customSecurity: true,
          apiAccess: false
        };
      case 'professional':
        return {
          maxUsers: 25,
          maxDevices: -1, // unlimited
          advancedAnalytics: true,
          prioritySupport: true,
          customSecurity: true,
          apiAccess: true
        };
      case 'enterprise':
        return {
          maxUsers: -1, // unlimited
          maxDevices: -1, // unlimited
          advancedAnalytics: true,
          prioritySupport: true,
          customSecurity: true,
          apiAccess: true
        };
      default: // free
        return {
          maxUsers: 1,
          maxDevices: 1,
          advancedAnalytics: false,
          prioritySupport: false,
          customSecurity: false,
          apiAccess: false
        };
    }
  };

  const canAccessFeature = (feature: keyof SubscriptionLimits): boolean => {
    const limits = getSubscriptionLimits();
    return limits[feature] === true;
  };

  const isWithinLimits = (type: 'users' | 'devices', currentCount: number): boolean => {
    const limits = getSubscriptionLimits();
    const limit = type === 'users' ? limits.maxUsers : limits.maxDevices;
    
    if (limit === -1) return true; // unlimited
    return currentCount < limit;
  };

  return {
    subscription: user?.subscription,
    limits: getSubscriptionLimits(),
    loading,
    checkSubscriptionStatus,
    canAccessFeature,
    isWithinLimits
  };
};
