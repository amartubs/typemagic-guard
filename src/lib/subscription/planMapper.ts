
import { SubscriptionPlan, UserType } from '@/lib/types';
import { DbSubscriptionPlan } from './types';

export const mapDbPlanToSubscriptionPlan = (dbPlan: DbSubscriptionPlan): SubscriptionPlan => {
  return {
    id: dbPlan.id,
    name: dbPlan.name,
    description: dbPlan.description || '',
    tier: dbPlan.tier as any,
    userTypes: getUserTypesForPlan(dbPlan),
    price: {
      individual: Number(dbPlan.price_individual),
      company: Number(dbPlan.price_company),
      charity: Number(dbPlan.price_charity),
    },
    features: getFeaturesForPlan(dbPlan),
    limits: {
      users: dbPlan.max_users === -1 ? Infinity : dbPlan.max_users,
      biometricProfiles: dbPlan.max_biometric_profiles === -1 ? Infinity : dbPlan.max_biometric_profiles,
      advancedAnalytics: dbPlan.advanced_analytics,
      customSecuritySettings: dbPlan.custom_security_settings,
      prioritySupport: dbPlan.priority_support,
    },
  };
};

const getUserTypesForPlan = (dbPlan: DbSubscriptionPlan): UserType[] => {
  // Enterprise is only for companies
  if (dbPlan.tier === 'enterprise') {
    return ['company'];
  }
  // All other plans are for all user types
  return ['individual', 'company', 'charity'];
};

const getFeaturesForPlan = (dbPlan: DbSubscriptionPlan): string[] => {
  const features: string[] = [];
  
  switch (dbPlan.tier) {
    case 'free':
      features.push(
        'Basic keystroke biometrics',
        '1 user only',
        'Single device support',
        'Community support'
      );
      break;
    case 'basic':
      features.push(
        'Multi-device support',
        'Up to 5 users',
        'Basic analytics',
        'Email support',
        'Custom security settings'
      );
      break;
    case 'professional':
      features.push(
        'Advanced biometric analytics',
        'Up to 20 users',
        'Full analytics dashboard',
        'Real-time anomaly detection',
        '24/7 priority support',
        'Custom security policies'
      );
      break;
    case 'enterprise':
      features.push(
        'Unlimited users',
        'API access',
        'Custom integration support',
        'Dedicated account manager',
        'Advanced compliance features',
        'SSO integration',
        'Audit logs & reporting'
      );
      break;
  }

  return features;
};
