
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const stripeService = {
  async createCheckoutSession(planId: string, userType: 'individual' | 'company' | 'charity' = 'individual') {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          planId,
          userType,
          successUrl: `${window.location.origin}/subscription/success`,
          cancelUrl: `${window.location.origin}/subscription`
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  },

  async createCustomerPortalSession() {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        body: {
          returnUrl: `${window.location.origin}/subscription`
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open subscription management. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  },

  async checkSubscriptionStatus() {
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error checking subscription:', error);
      return null;
    }
  }
};
