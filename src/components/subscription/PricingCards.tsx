
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
      id: 'free',
      name: 'Free',
      description: 'Basic keystroke biometrics for getting started',
      tier: 'free',
      userTypes: ['individual', 'company', 'charity'],
      price: { individual: 0, company: 0, charity: 0 },
      features: [
        'Basic keystroke biometrics',
        '1 user only',
        'Single device support',
        'Community support'
      ],
      limits: {
        users: 1,
        biometricProfiles: 1,
        advancedAnalytics: false,
        customSecuritySettings: false,
        prioritySupport: false
      }
    },
    {
      id: 'basic',
      name: 'Basic',
      description: 'Multi-device support with basic analytics',
      tier: 'basic',
      userTypes: ['individual', 'company', 'charity'],
      price: { individual: 9.99, company: 49.99, charity: 4.99 },
      features: [
        'Multi-device support',
        'Up to 5 users',
        'Basic analytics',
        'Email support',
        'Custom security settings'
      ],
      limits: {
        users: 5,
        biometricProfiles: 5,
        advancedAnalytics: false,
        customSecuritySettings: true,
        prioritySupport: false
      }
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Advanced biometrics with full analytics',
      tier: 'professional',
      userTypes: ['individual', 'company', 'charity'],
      price: { individual: 19.99, company: 99.99, charity: 19.99 },
      features: [
        'Advanced biometric analytics',
        'Up to 20 users',
        'Full analytics dashboard',
        'Real-time anomaly detection',
        '24/7 priority support',
        'Custom security policies'
      ],
      limits: {
        users: 20,
        biometricProfiles: 20,
        advancedAnalytics: true,
        customSecuritySettings: true,
        prioritySupport: true
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Unlimited users with API access',
      tier: 'enterprise',
      userTypes: ['company'],
      price: { individual: 99.99, company: 499.99, charity: 249.99 },
      features: [
        'Unlimited users',
        'API access',
        'Custom integration support',
        'Dedicated account manager',
        'Advanced compliance features',
        'SSO integration',
        'Audit logs & reporting'
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {filteredPlans.map((plan) => {
        const isPopular = plan.tier === 'professional';
        const isCurrent = plan.id === currentPlanId;
        const isFree = plan.tier === 'free';
        
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
                {isFree ? (
                  <span className="text-4xl font-bold">Free</span>
                ) : (
                  <>
                    <span className="text-4xl font-bold">
                      ${plan.price[userType]}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </>
                )}
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
                variant={isCurrent ? 'secondary' : isPopular ? 'default' : isFree ? 'outline' : 'outline'}
                onClick={() => onSelectPlan(plan)}
                disabled={loading || isCurrent}
              >
                {isCurrent ? 'Current Plan' : isFree ? 'Get Started' : `Choose ${plan.name}`}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default PricingCards;
