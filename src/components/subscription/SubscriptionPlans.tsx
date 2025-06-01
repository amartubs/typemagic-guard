
import React, { useState, useEffect } from 'react';
import { SubscriptionPlan, UserType } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Loader2, RefreshCw } from 'lucide-react';
import { SubscriptionService } from '@/lib/subscriptionService';
import { toast } from '@/hooks/use-toast';

interface SubscriptionPlansProps {
  userType: UserType;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  className?: string;
  selectedPlanId?: string;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ 
  userType, 
  onSelectPlan,
  className,
  selectedPlanId
}) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading subscription plans...');
      
      const availablePlans = await SubscriptionService.getAvailablePlans();
      console.log('Loaded plans:', availablePlans);
      
      // Filter plans based on user type
      const filteredPlans = availablePlans.filter(plan => 
        plan.userTypes.includes(userType)
      );
      
      console.log('Filtered plans for user type', userType, ':', filteredPlans);
      setPlans(filteredPlans);
      
      if (filteredPlans.length === 0) {
        setError(`No subscription plans available for ${userType} users`);
      }
    } catch (error) {
      console.error('Error loading subscription plans:', error);
      setError('Failed to load subscription plans. Please try again.');
      toast({
        title: "Error Loading Plans",
        description: "Failed to load subscription plans. Using default plans.",
        variant: "destructive",
      });
      
      // Load default plans as fallback
      const defaultPlans = SubscriptionService.getDefaultPlans();
      const filteredDefaultPlans = defaultPlans.filter(plan => 
        plan.userTypes.includes(userType)
      );
      setPlans(filteredDefaultPlans);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, [userType]);

  const handleRetry = () => {
    loadPlans();
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading subscription plans...</span>
      </div>
    );
  }

  if (error && plans.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={handleRetry} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(plans.length, 4)} gap-6 ${className}`}>
      {plans.map(plan => (
        <Card 
          key={plan.id} 
          className={`flex flex-col border-2 ${plan.id === selectedPlanId 
            ? 'border-primary shadow-md' 
            : plan.tier === 'professional' && !selectedPlanId 
              ? 'border-primary shadow-md' 
              : 'border-border'}`}
        >
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">${plan.price[userType]}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => onSelectPlan(plan)} 
              className="w-full"
              variant={plan.id === selectedPlanId ? 'default' : plan.tier === 'professional' && !selectedPlanId ? 'default' : 'outline'}
            >
              {plan.id === selectedPlanId 
                ? 'Selected' 
                : `Select ${plan.name} Plan`}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default SubscriptionPlans;
