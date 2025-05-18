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
    // Convert our Provider type to a type that Supabase accepts
    const supabaseProvider = provider as 'google' | 'github' | 'apple';
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: supabaseProvider,
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

export const updateUserProfile = async (name: string, email: string) => {
  try {
    // First update auth user email if changed
    const { data: { user }, error: emailError } = await supabase.auth.updateUser({
      email: email,
      data: { name }
    });
    
    if (emailError) {
      console.error('Error updating user email:', emailError);
      toast({
        title: "Profile Update Failed",
        description: emailError.message,
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
    
    // If email was updated, a confirmation email might be sent
    if (user?.email !== email) {
      toast({
        title: "Email Verification Required",
        description: "We've sent a verification email to your new address. Please check your inbox.",
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    toast({
      title: "Profile Update Failed",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
};

export const updateUserPassword = async (currentPassword: string, newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({ 
      password: newPassword 
    });
    
    if (error) {
      console.error('Error updating password:', error);
      toast({
        title: "Password Update Failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Password Updated",
      description: "Your password has been updated successfully.",
    });
    
    return true;
  } catch (error) {
    console.error('Error updating password:', error);
    toast({
      title: "Password Update Failed",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
};
