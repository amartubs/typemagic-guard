
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, UserType, SubscriptionTier } from '@/lib/types';
import { Provider } from './types';

// Mock users for demo purposes
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'demo@example.com',
    name: 'Demo User',
    role: 'user',
    biometricProfile: {
      userId: 'user-1',
      keystrokePatterns: [],
      confidenceScore: 0,
      lastUpdated: Date.now(),
      status: 'learning'
    },
    securitySettings: {
      minConfidenceThreshold: 65,
      learningPeriod: 5,
      anomalyDetectionSensitivity: 70,
      securityLevel: 'medium',
      enforceTwoFactor: false,
      maxFailedAttempts: 5
    },
    lastLogin: null,
    status: 'active',
    subscription: {
      type: 'individual',
      tier: 'basic',
      startDate: Date.now(),
      endDate: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
      autoRenew: true,
      status: 'active'
    }
  }
];

export const createUserFromSession = (session: any): User => {
  return {
    id: session.user.id,
    email: session.user.email || '',
    name: session.user.user_metadata?.name || 'User',
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
      tier: session.user.user_metadata?.subscriptionTier || 'basic',
      startDate: Date.now(),
      endDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
      autoRenew: true,
      status: 'active'
    },
    organizationName: session.user.user_metadata?.organizationName,
    organizationSize: session.user.user_metadata?.organizationSize
  };
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Login error:', error);
      toast({
        title: "Authentication Failed",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error };
    }
    
    toast({
      title: "Login Successful",
      description: `Welcome back!`,
    });
    
    return { success: true, data };
  } catch (error) {
    console.error('Login error:', error);
    toast({
      title: "Login Failed",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return { success: false, error };
  }
};

export const registerWithEmail = async (
  name: string, 
  email: string, 
  password: string, 
  userType: UserType = 'individual',
  subscriptionTier: SubscriptionTier = 'free',
  organizationName?: string,
  organizationSize?: number
) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          userType,
          subscriptionTier,
          organizationName,
          organizationSize
        }
      }
    });
    
    if (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error };
    }
    
    toast({
      title: "Registration Successful",
      description: "Your account has been created. Please check your email for verification.",
    });
    
    return { success: true, data };
  } catch (error) {
    console.error('Registration error:', error);
    toast({
      title: "Registration Failed",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return { success: false, error };
  }
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Error logging out:', error);
    toast({
      title: "Logout Failed",
      description: "An error occurred while logging out",
      variant: "destructive",
    });
    return { success: false, error };
  }
  
  toast({
    title: "Logged Out",
    description: "You have been successfully logged out",
  });
  
  return { success: true };
};

export const signInWithOAuthProvider = async (provider: Provider) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + '/dashboard'
      }
    });
    
    if (error) {
      console.error(`${provider} authentication error:`, error);
      toast({
        title: "Authentication Failed",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error(`${provider} authentication error:`, error);
    toast({
      title: "Authentication Failed",
      description: `Failed to authenticate with ${provider}`,
      variant: "destructive",
    });
    return { success: false, error };
  }
};
