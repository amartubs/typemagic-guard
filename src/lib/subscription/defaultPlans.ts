
import { SubscriptionPlan } from '@/lib/types';

export const getDefaultPlans = (): SubscriptionPlan[] => {
  return [
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
};
