
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { User, UserType, SubscriptionTier, SubscriptionDetails } from '@/lib/types';

export type Provider = 'google' | 'github' | 'microsoft' | 'apple';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string, 
    email: string, 
    password: string, 
    userType: UserType,
    subscriptionTier: SubscriptionTier,
    organizationName?: string,
    organizationSize?: number
  ) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  updateUser: (userData: Partial<User>) => void;
  updateUserProfile: (name: string, email: string) => Promise<boolean>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  updateSubscription: (subscriptionData: Partial<SubscriptionDetails>) => void;
  verifyTwoFactorCode: (code: string) => Promise<boolean>;
  sendTwoFactorCode: () => Promise<boolean>;
  twoFactorRequired: boolean;
  setTwoFactorRequired: (required: boolean) => void;
  signInWithGoogle: () => Promise<boolean>;
  signInWithProvider: (provider: Provider) => Promise<boolean>;
  resetPassword?: (email: string) => Promise<boolean>;
}
