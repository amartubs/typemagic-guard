import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { User, SubscriptionDetails } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { createUserFromSession } from './userUtils';
import { ProfileService } from '@/lib/profileService';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);

  useEffect(() => {
    let mounted = true;

    const handleAuthStateChange = async (event: string, session: Session | null) => {
      console.log('Auth state changed:', event, session ? 'session exists' : 'no session');
      
      if (!mounted) return;
      
      setSession(session);
      
      if (session?.user) {
        try {
          const fullProfile = await ProfileService.getProfile(session.user.id);
          if (fullProfile && mounted) {
            setUser(fullProfile);
            await ProfileService.updateLastLogin(session.user.id);
          } else if (mounted) {
            const userData = createUserFromSession(session);
            setUser(userData);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          if (mounted) {
            const userData = createUserFromSession(session);
            setUser(userData);
          }
        }
      } else if (mounted) {
        setUser(null);
      }
      
      if (mounted) {
        setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }

        if (mounted) {
          await handleAuthStateChange('INITIAL_SESSION', session);
        }
      } catch (error) {
        console.error('Unexpected error during auth initialization:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Safety timeout
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Auth initialization timeout reached');
        setLoading(false);
      }
    }, 3000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

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

  return {
    user,
    setUser,
    session,
    loading,
    setLoading,
    twoFactorRequired,
    setTwoFactorRequired,
    updateUser,
    updateSubscription
  };
};

export const useAuthActions = (setLoading: (loading: boolean) => void) => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
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
    } catch (error) {
      console.error('Unexpected logout error:', error);
      toast({
        title: "Logout Failed",
        description: "An unexpected error occurred while logging out",
        variant: "destructive",
      });
    }
  };

  // Mock functions for backward compatibility
  const sendTwoFactorCode = async (): Promise<boolean> => {
    return true;
  };

  const verifyTwoFactorCode = async (code: string): Promise<boolean> => {
    return true;
  };

  return {
    logout,
    sendTwoFactorCode,
    verifyTwoFactorCode
  };
};
