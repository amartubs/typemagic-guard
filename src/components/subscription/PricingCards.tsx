
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';
import { SubscriptionPlan, UserType } from '@/lib/types';

interface PricingCardsProps {
  userType: UserType;
  currentPlanId?: string;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  loading?: boolean;
}

const PricingCards: React.FC<PricingCardsProps> = ({
  userType,
  currentPlanId,
  onSelectPlan,
  loading = false
}) => {
  const plans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Perfect for individuals getting started',
      tier: 'basic',
      userTypes: ['individual', 'charity'],
      price: { individual: 9.99, company: 49.99, charity: 4.99 },
      features: [
        'Up to 3 devices',
        'Basic keystroke analytics',
        'Email support',
        'Standard security settings'
      ],
      limits: {
        users: 1,
        biometricProfiles: 3,
        advancedAnalytics: false,
        customSecuritySettings: true,
        prioritySupport: false
      }
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Advanced features for power users',
      tier: 'professional',
      userTypes: ['individual', 'company', 'charity'],
      price: { individual: 29.99, company: 149.99, charity: 14.99 },
      features: [
        'Unlimited devices',
        'Advanced biometric analytics',
        'Real-time anomaly detection',
        '24/7 priority support',
        'Custom security policies',
        'Usage insights & reports'
      ],
      limits: {
        users: 25,
        biometricProfiles: 25,
        advancedAnalytics: true,
        customSecuritySettings: true,
        prioritySupport: true
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Full-scale solution for organizations',
      tier: 'enterprise',
      userTypes: ['company'],
      price: { individual: 99.99, company: 499.99, charity: 249.99 },
      features: [
        'Everything in Professional',
        'Unlimited users',
        'SSO integration',
        'Dedicated account manager',
        'Custom integrations',
        'Advanced compliance features',
        'API access'
      ],
      limits: {
        users: Infinity,
        biometricProfiles: Infinity,
        advancedAnalytics: true,
        customSecuritySettings: true,
        prioritySupport: true
      }
    }
  ];

  const filteredPlans = plans.filter(plan => plan.userTypes.includes(userType));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredPlans.map((plan) => {
        const isPopular = plan.tier === 'professional';
        const isCurrent = plan.id === currentPlanId;
        
        return (
          <Card 
            key={plan.id}
            className={`relative flex flex-col ${
              isPopular ? 'border-primary shadow-lg scale-105' : 'border-border'
            } ${isCurrent ? 'ring-2 ring-primary' : ''}`}
          >
            {isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Most Popular
                </div>
              </div>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  ${plan.price[userType]}
                </span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter>
              <Button
                className="w-full"
                variant={isCurrent ? 'secondary' : isPopular ? 'default' : 'outline'}
                onClick={() => onSelectPlan(plan)}
                disabled={loading || isCurrent}
              >
                {isCurrent ? 'Current Plan' : `Choose ${plan.name}`}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default PricingCards;
