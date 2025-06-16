
import { Session } from '@supabase/supabase-js';
import { User } from '@/lib/types';

export const createUserFromSession = (session: Session): User => {
  const user = session.user;
  
  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.name || user.email?.split('@')[0] || '',
    role: user.user_metadata?.role || 'user',
    status: 'active',
    lastLogin: Date.now(),
    securitySettings: {
      minConfidenceThreshold: 65,
      learningPeriod: 5,
      anomalyDetectionSensitivity: 70,
      securityLevel: 'medium',
      enforceTwoFactor: false,
      maxFailedAttempts: 5,
    },
    subscription: {
      type: user.user_metadata?.userType || 'individual',
      tier: 'free',
      startDate: Date.now(),
      endDate: null,
      autoRenew: true,
      status: 'trial',
    }
  };
};

export const getUserFromMetadata = (metadata: any): Partial<User> => {
  return {
    name: metadata?.name,
    role: metadata?.role || 'user',
    subscription: metadata?.subscription ? {
      type: metadata.subscription.type || 'individual',
      tier: metadata.subscription.tier || 'free',
      startDate: metadata.subscription.startDate || Date.now(),
      endDate: metadata.subscription.endDate,
      autoRenew: metadata.subscription.autoRenew || true,
      status: metadata.subscription.status || 'trial',
    } : undefined
  };
};
