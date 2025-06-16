
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { useSubscriptionData } from '@/hooks/useSubscriptionData';
import { stripeService } from '@/services/stripeService';
import { toast } from '@/hooks/use-toast';
import PricingCards from './PricingCards';
import CurrentPlanCard from './CurrentPlanCard';
import PlanFeaturesCard from './PlanFeaturesCard';

const SubscriptionManager: React.FC = () => {
  const { user } = useAuth();
  const [showPricing, setShowPricing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { subscription, plans, refreshSubscription } = useSubscriptionData();

  const handleUpgrade = async (plan: any) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Use userType from profiles or default to individual
      const userType = user.userType || 'individual';
      const success = await stripeService.createCheckoutSession(
        plan.id, 
        userType
      );
      
      if (success) {
        toast({
          title: "Redirecting to Stripe",
          description: "Opening checkout in a new tab...",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const success = await stripeService.createCustomerPortalSession();
      
      if (success) {
        toast({
          title: "Opening Customer Portal",
          description: "Manage your subscription in the new tab...",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPlanLimits = () => {
    const tier = subscription?.subscription_tier || user?.subscription?.tier || 'free';
    
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

  const limits = getCurrentPlanLimits();

  if (showPricing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Choose Your Plan</h2>
            <p className="text-muted-foreground">Upgrade to unlock more features</p>
          </div>
          <Button variant="outline" onClick={() => setShowPricing(false)}>
            Back to Current Plan
          </Button>
        </div>
        
        <PricingCards
          userType={user?.userType || 'individual'}
          currentPlanId={subscription?.subscription_tier || user?.subscription?.tier}
          onSelectPlan={handleUpgrade}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Subscription Management</h2>
        <p className="text-muted-foreground">Manage your plan and billing</p>
      </div>

      <CurrentPlanCard
        user={{
          ...user,
          subscription: {
            tier: (subscription?.subscription_tier || user?.subscription?.tier || 'free') as any,
            status: subscription?.subscribed ? 'active' : 'trial' as any,
            end_date: subscription?.subscription_end,
            type: user?.userType || 'individual'
          }
        }}
        loading={loading}
        onUpgrade={() => setShowPricing(true)}
        onManageSubscription={handleManageSubscription}
      />

      <PlanFeaturesCard limits={limits} />
    </div>
  );
};

export default SubscriptionManager;
