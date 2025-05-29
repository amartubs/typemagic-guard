
import { Session } from '@supabase/supabase-js';
import { User, SecuritySettings, SubscriptionDetails } from '@/lib/types';

export const createUserFromSession = (session: Session): User => {
  const { user: authUser } = session;
  
  // Create a user object that matches our database schema
  const user: User = {
    id: authUser.id,
    email: authUser.email || '',
    name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Unknown User',
    role: authUser.user_metadata?.role || 'user',
    status: 'active',
    lastLogin: Date.now(),
    securitySettings: getDefaultSecuritySettings(),
    // These will be populated from the database in a real implementation
    subscription: getDefaultSubscription(),
  };

  return user;
};

const getDefaultSecuritySettings = (): SecuritySettings => ({
  minConfidenceThreshold: 65,
  learningPeriod: 5,
  anomalyDetectionSensitivity: 70,
  securityLevel: 'medium',
  enforceTwoFactor: false,
  maxFailedAttempts: 5,
});

const getDefaultSubscription = (): SubscriptionDetails => ({
  type: 'individual',
  tier: 'free',
  startDate: Date.now(),
  endDate: null,
  autoRenew: true,
  status: 'trial',
});
