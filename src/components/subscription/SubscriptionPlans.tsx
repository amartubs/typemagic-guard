
import React, { useState, useEffect } from 'react';
import { SubscriptionPlan, UserType } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
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

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const availablePlans = await SubscriptionService.getAvailablePlans();
        // Filter plans based on user type
        const filteredPlans = availablePlans.filter(plan => 
          plan.userTypes.includes(userType)
        );
        setPlans(filteredPlans);
      } catch (error) {
        console.error('Error loading subscription plans:', error);
        toast({
          title: "Error Loading Plans",
          description: "Failed to load subscription plans. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, [userType]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading subscription plans...</span>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-muted-foreground">No subscription plans available for your user type.</p>
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
