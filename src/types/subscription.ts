
export interface SubscriptionData {
  id: string;
  user_id: string;
  email: string;
  stripe_customer_id?: string;
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
  updated_at: string;
  created_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: string;
  description?: string;
  price_individual: number;
  price_company: number;
  price_charity: number;
  max_users: number;
  max_biometric_profiles: number;
  advanced_analytics: boolean;
  custom_security_settings: boolean;
  priority_support: boolean;
  active: boolean;
}
