
import { SubscriptionPlan, UserType, SubscriptionTier } from '@/lib/types';
import { Database } from '@/integrations/supabase/types';

export type DbSubscriptionPlan = Database['public']['Tables']['subscription_plans']['Row'];

export interface SubscriptionPlanConfig {
  id: string;
  name: string;
  description: string;
  tier: SubscriptionTier;
  userTypes: UserType[];
  price: {
    individual: number;
    company: number;
    charity: number;
  };
  features: string[];
  limits: {
    users: number;
    biometricProfiles: number;
    advancedAnalytics: boolean;
    customSecuritySettings: boolean;
    prioritySupport: boolean;
  };
}
