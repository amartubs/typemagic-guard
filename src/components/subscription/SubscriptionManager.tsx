
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSubscriptionManager } from '@/hooks/useSubscriptionManager';
import PricingCards from './PricingCards';
import CurrentPlanCard from './CurrentPlanCard';
import PlanFeaturesCard from './PlanFeaturesCard';

const SubscriptionManager: React.FC = () => {
  const [showPricing, setShowPricing] = useState(false);
  const {
    user,
    loading,
    handleUpgrade,
    handleManageSubscription,
    getCurrentPlanLimits
  } = useSubscriptionManager();

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
          userType={user?.subscription?.type || 'individual'}
          currentPlanId={user?.subscription?.tier}
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
        user={user}
        loading={loading}
        onUpgrade={() => setShowPricing(true)}
        onManageSubscription={handleManageSubscription}
      />

      <PlanFeaturesCard limits={limits} />
    </div>
  );
};

export default SubscriptionManager;
