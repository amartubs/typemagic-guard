
import React from 'react';
import { SubscriptionPlan, UserType } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface SubscriptionPlansProps {
  userType: UserType;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  className?: string;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Basic protection for individuals',
    tier: 'free',
    userTypes: ['individual', 'charity'],
    price: {
      individual: 0,
      company: 0,
      charity: 0,
    },
    features: [
      'Basic keystroke biometrics',
      'Single device support',
      'Standard security settings',
      'Email support'
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
    description: 'Enhanced protection for small teams',
    tier: 'basic',
    userTypes: ['individual', 'company', 'charity'],
    price: {
      individual: 9.99,
      company: 19.99,
      charity: 4.99,
    },
    features: [
      'Advanced keystroke biometrics',
      'Multi-device support (up to 3)',
      'Custom security settings',
      'Basic analytics',
      'Priority email support'
    ],
    limits: {
      users: 5,
      biometricProfiles: 3,
      advancedAnalytics: false,
      customSecuritySettings: true,
      prioritySupport: false
    }
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Professional-grade security',
    tier: 'professional',
    userTypes: ['individual', 'company', 'charity'],
    price: {
      individual: 19.99,
      company: 49.99,
      charity: 9.99,
    },
    features: [
      'Advanced keystroke & mouse biometrics',
      'Unlimited device support',
      'Advanced security settings',
      'Comprehensive analytics',
      '24/7 priority support',
      'Anomaly detection alerts'
    ],
    limits: {
      users: 20,
      biometricProfiles: 10,
      advancedAnalytics: true,
      customSecuritySettings: true,
      prioritySupport: true
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Full-featured enterprise security',
    tier: 'enterprise',
    userTypes: ['company'],
    price: {
      individual: 0, // Not available for individuals
      company: 99.99,
      charity: 0, // Not available for charities
    },
    features: [
      'All Professional features',
      'Unlimited users',
      'Unlimited biometric profiles',
      'Custom integration support',
      'Dedicated account manager',
      'SSO integration',
      'Audit logs & compliance reports'
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

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ 
  userType, 
  onSelectPlan,
  className
}) => {
  // Filter plans based on user type
  const availablePlans = subscriptionPlans.filter(plan => 
    plan.userTypes.includes(userType)
  );

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(availablePlans.length, 4)} gap-6 ${className}`}>
      {availablePlans.map(plan => (
        <Card 
          key={plan.id} 
          className={`flex flex-col border-2 ${plan.tier === 'professional' ? 'border-primary shadow-md' : 'border-border'}`}
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
              variant={plan.tier === 'professional' ? 'default' : 'outline'}
            >
              Select {plan.name} Plan
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default SubscriptionPlans;
