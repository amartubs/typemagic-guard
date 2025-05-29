
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserType, SubscriptionPlan } from '@/lib/types';
import SubscriptionPlans from '@/components/subscription/SubscriptionPlans';

interface SubscriptionStepProps {
  userType: UserType;
  selectedPlan: SubscriptionPlan | null;
  loading: boolean;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  onBack: () => void;
  onCreateAccount: () => void;
}

const SubscriptionStep: React.FC<SubscriptionStepProps> = ({
  userType,
  selectedPlan,
  loading,
  onSelectPlan,
  onBack,
  onCreateAccount
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Choose a Subscription Plan</h2>
      
      <SubscriptionPlans 
        userType={userType}
        onSelectPlan={onSelectPlan}
        selectedPlanId={selectedPlan?.id}
        className="mb-4"
      />
      
      {selectedPlan && (
        <div className="p-4 bg-muted rounded-md mt-4">
          <h3 className="font-medium">Selected Plan: {selectedPlan.name}</h3>
          <p className="text-sm mt-1">
            ${selectedPlan.price[userType]}/month
          </p>
        </div>
      )}
      
      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        
        <Button 
          onClick={onCreateAccount}
          disabled={!selectedPlan || loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionStep;
