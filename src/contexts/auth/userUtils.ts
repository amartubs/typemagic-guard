
import { Session } from '@supabase/supabase-js';
import { User } from '@/lib/types';

export const createUserFromSession = (session: Session): User => {
  return {
    id: session.user.id,
    email: session.user.email || '',
    name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
    role: 'user',
    securitySettings: {
      minConfidenceThreshold: 65,
      learningPeriod: 5,
      anomalyDetectionSensitivity: 70,
      securityLevel: 'medium',
      enforceTwoFactor: false,
      maxFailedAttempts: 5
    },
    lastLogin: Date.now(),
    status: 'active',
    subscription: {
      type: session.user.user_metadata?.userType || 'individual',
      tier: session.user.user_metadata?.subscriptionTier || 'free',
      startDate: Date.now(),
      endDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
      autoRenew: true,
      status: 'active'
    },
    organizationName: session.user.user_metadata?.organizationName,
    organizationSize: session.user.user_metadata?.organizationSize
  };
};
