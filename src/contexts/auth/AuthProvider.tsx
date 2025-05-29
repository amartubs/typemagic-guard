
import React, { useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { User, UserType, SubscriptionTier, SubscriptionDetails } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Provider } from './types';
import AuthContext from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const navigate = useNavigate();

  const createUserFromSession = (session: Session): User => {
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

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        
        if (session?.user) {
          const userData = createUserFromSession(session);
          setUser(userData);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        const userData = createUserFromSession(session);
        setUser(userData);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
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
        return false;
      }
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    userType: UserType = 'individual',
    subscriptionTier: SubscriptionTier = 'free',
    organizationName?: string,
    organizationSize?: number
  ): Promise<boolean> => {
    setLoading(true);
    
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
        return false;
      }
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created. Please check your email for verification.",
      });
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Logout Failed",
        description: "An error occurred while logging out",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    
    navigate('/');
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error('Password reset error:', error);
        toast({
          title: "Password Reset Failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for password reset instructions",
      });
      
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: "Password Reset Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...userData });
  };

  const updateSubscription = (subscriptionData: Partial<SubscriptionDetails>) => {
    if (!user || !user.subscription) return;
    
    const updatedSubscription = { ...user.subscription, ...subscriptionData };
    const updatedUser = { ...user, subscription: updatedSubscription };
    setUser(updatedUser);
    
    toast({
      title: "Subscription Updated",
      description: "Your subscription details have been updated",
    });
  };

  const signInWithProvider = async (provider: Provider): Promise<boolean> => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as 'google' | 'github' | 'apple',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        console.error(`${provider} authentication error:`, error);
        toast({
          title: "Authentication Failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`${provider} authentication error:`, error);
      toast({
        title: "Authentication Failed",
        description: `Failed to authenticate with ${provider}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (name: string, email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        email: email,
        data: { name }
      });
      
      if (error) {
        console.error('Error updating user profile:', error);
        toast({
          title: "Profile Update Failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      
      if (user) {
        setUser({ ...user, name, email });
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

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
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

  // Mock functions for backward compatibility
  const sendTwoFactorCode = async (): Promise<boolean> => {
    return true;
  };

  const verifyTwoFactorCode = async (code: string): Promise<boolean> => {
    return true;
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    return signInWithProvider('google');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading, 
      updateUser,
      updateUserProfile,
      updatePassword,
      updateSubscription,
      verifyTwoFactorCode,
      sendTwoFactorCode,
      twoFactorRequired,
      setTwoFactorRequired: () => {},
      signInWithGoogle,
      signInWithProvider,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};
