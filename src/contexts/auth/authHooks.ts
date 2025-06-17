import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { User, SubscriptionDetails } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { createUserFromSession } from './userUtils';
import { ProfileService } from '@/lib/profileService';

export const useAuthState = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [twoFactorRequired, setTwoFactorRequired] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;

    const handleAuthStateChange = async (event: string, session: Session | null) => {
      console.log('🔄 Auth state changed:', event, session ? 'session exists' : 'no session');
      
      if (!mounted) return;
      
      setSession(session);
      
      if (session?.user) {
        console.log('👤 Processing user session for:', session.user.email);
        
        // Create user from session immediately to avoid loading issues
        const userData = createUserFromSession(session);
        setUser(userData);
        
        // Try to load full profile but don't block on it
        setTimeout(async () => {
          try {
            const fullProfile = await ProfileService.getProfile(session.user.id);
            if (fullProfile && mounted) {
              console.log('👤 Full profile loaded for user');
              setUser(fullProfile);
              await ProfileService.updateLastLogin(session.user.id);
            }
          } catch (error) {
            console.error('👤 Error loading user profile:', error);
            // Keep the basic user data from session
          }
        }, 0);
      } else if (mounted) {
        console.log('👤 No user session, clearing user state');
        setUser(null);
      }
      
      if (mounted) {
        console.log('🔄 Setting loading to false');
        setLoading(false);
      }
    };

    // Set up auth state listener
    console.log('🎧 Setting up auth state listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        console.log('🚀 Initializing auth state');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('🚀 Error getting session:', error);
        } else {
          console.log('🚀 Initial session:', session ? 'exists' : 'none');
        }

        if (mounted) {
          await handleAuthStateChange('INITIAL_SESSION', session);
        }
      } catch (error) {
        console.error('🚀 Unexpected error during auth initialization:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Reduced timeout for better UX
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('⏰ Auth initialization timeout reached, setting loading to false');
        setLoading(false);
      }
    }, 1000);

    return () => {
      console.log('🧹 Cleaning up auth state listener');
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    console.log('👤 Updating user data');
    setUser({ ...user, ...userData });
  };

  const updateSubscription = (subscriptionData: Partial<SubscriptionDetails>) => {
    if (!user || !user.subscription) return;
    
    console.log('💳 Updating subscription data');
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
      console.log('🚪 Logging out user');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('🚪 Error logging out:', error);
        toast({
          title: "Logout Failed",
          description: "An error occurred while logging out",
          variant: "destructive",
        });
        return;
      }
      
      console.log('🚪 Logout successful');
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
      
      navigate('/');
    } catch (error) {
      console.error('🚪 Unexpected logout error:', error);
      toast({
        title: "Logout Failed",
        description: "An unexpected error occurred while logging out",
        variant: "destructive",
      });
    }
  };

  // Mock functions for backward compatibility
  const sendTwoFactorCode = async (): Promise<boolean> => {
    console.log('📱 Mock: sending two factor code');
    return true;
  };

  const verifyTwoFactorCode = async (code: string): Promise<boolean> => {
    console.log('📱 Mock: verifying two factor code:', code);
    return true;
  };

  return {
    logout,
    sendTwoFactorCode,
    verifyTwoFactorCode
  };
};
