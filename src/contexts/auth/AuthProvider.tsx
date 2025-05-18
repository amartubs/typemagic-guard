
import React, { useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { User, UserType, SubscriptionTier, SubscriptionDetails } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Provider } from './types';
import AuthContext from './AuthContext';
import { 
  createUserFromSession,
  loginWithEmail, 
  registerWithEmail, 
  logoutUser, 
  signInWithOAuthProvider,
  mockUsers
} from './authUtils';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
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
          const userData = createUserFromSession(session);
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
      const result = await loginWithEmail(email, password);
      
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
      
      return result.success;
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
      const result = await registerWithEmail(
        name, 
        email, 
        password, 
        userType, 
        subscriptionTier, 
        organizationName, 
        organizationSize
      );
      
      return result.success;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const result = await logoutUser();
    if (result.success) {
      navigate('/login');
    }
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
      const result = await signInWithOAuthProvider('google');
      return result.success;
    } finally {
      setLoading(false);
    }
  };

  const signInWithProvider = async (provider: Provider): Promise<boolean> => {
    setLoading(true);
    
    try {
      const result = await signInWithOAuthProvider(provider);
      return result.success;
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
