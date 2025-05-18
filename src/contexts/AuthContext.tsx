import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { User, UserType, SubscriptionTier, SubscriptionDetails } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
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
  updateSubscription: (subscriptionData: Partial<SubscriptionDetails>) => void;
  verifyTwoFactorCode: (code: string) => Promise<boolean>;
  sendTwoFactorCode: () => Promise<boolean>;
  twoFactorRequired: boolean;
  setTwoFactorRequired: (required: boolean) => void;
  signInWithGoogle: () => Promise<boolean>;
  signInWithProvider: (provider: SocialProvider) => Promise<boolean>;
}

export type SocialProvider = 'google' | 'github' | 'microsoft' | 'apple';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [tempTwoFactorCode, setTempTwoFactorCode] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        
        if (session?.user) {
          const userData: User = {
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
          setUser(userData);
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        const userData: User = {
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
        setUser(userData);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const mockUsers: User[] = [
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
      
      // If using two-factor auth, handle that flow
      if (user?.securitySettings.enforceTwoFactor) {
        setTwoFactorRequired(true);
        const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
        setTempTwoFactorCode(randomCode);
        localStorage.setItem('pendingTwoFactorEmail', email);
        
        toast({
          title: "Two-Factor Authentication Required",
          description: `A verification code has been sent to your email. For demo purposes, the code is: ${randomCode}`,
        });
        
        return false;
      }
      
      toast({
        title: "Login Successful",
        description: `Welcome back!`,
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

  const sendTwoFactorCode = async (): Promise<boolean> => {
    try {
      if (!tempTwoFactorCode) {
        const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
        setTempTwoFactorCode(randomCode);
      }
      
      toast({
        title: "Verification Code Resent",
        description: `For demo purposes, the code is: ${tempTwoFactorCode}`,
      });
      
      return true;
    } catch (error) {
      console.error('Error sending 2FA code:', error);
      toast({
        title: "Failed to Send Code",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const verifyTwoFactorCode = async (code: string): Promise<boolean> => {
    try {
      if (code === tempTwoFactorCode) {
        const storedEmail = localStorage.getItem('pendingTwoFactorEmail');
        const foundUser = mockUsers.find(u => u.email.toLowerCase() === storedEmail?.toLowerCase());
        
        if (foundUser) {
          const updatedUser = {
            ...foundUser,
            lastLogin: Date.now()
          };
          
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          setUser(updatedUser);
          
          setTwoFactorRequired(false);
          setTempTwoFactorCode(null);
          localStorage.removeItem('pendingTwoFactorEmail');
          
          toast({
            title: "Verification Successful",
            description: `Welcome back, ${updatedUser.name}!`,
          });
          
          return true;
        }
      } else {
        toast({
          title: "Verification Failed",
          description: "Invalid verification code",
          variant: "destructive",
        });
      }
      
      return false;
    } catch (error) {
      console.error('2FA verification error:', error);
      toast({
        title: "Verification Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
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
    
    navigate('/login');
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const updateSubscription = (subscriptionData: Partial<SubscriptionDetails>) => {
    if (!user || !user.subscription) return;
    
    const updatedSubscription = { ...user.subscription, ...subscriptionData };
    const updatedUser = { ...user, subscription: updatedSubscription };
    
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    toast({
      title: "Subscription Updated",
      description: "Your subscription details have been updated",
    });
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard'
        }
      });
      
      if (error) {
        console.error('Google authentication error:', error);
        toast({
          title: "Authentication Failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Google authentication error:', error);
      toast({
        title: "Authentication Failed",
        description: "Failed to authenticate with Google",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signInWithProvider = async (provider: SocialProvider): Promise<boolean> => {
    setLoading(true);
    
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

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading, 
      updateUser,
      updateSubscription,
      verifyTwoFactorCode,
      sendTwoFactorCode,
      twoFactorRequired,
      setTwoFactorRequired,
      signInWithGoogle,
      signInWithProvider
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
