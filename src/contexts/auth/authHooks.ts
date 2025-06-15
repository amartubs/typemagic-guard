
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

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (!mounted) return;
        
        setSession(session);
        
        if (session?.user) {
          try {
            // Try to get full profile from database
            const fullProfile = await ProfileService.getProfile(session.user.id);
            if (fullProfile && mounted) {
              setUser(fullProfile);
              // Update last login
              await ProfileService.updateLastLogin(session.user.id);
            } else if (mounted) {
              // Fallback to session-based user if profile not found
              const userData = createUserFromSession(session);
              setUser(userData);
            }
          } catch (error) {
            console.error('Error loading user profile:', error);
            if (mounted) {
              // Fallback to session-based user
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
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        if (!mounted) return;
        
        setSession(session);
        
        if (session?.user) {
          try {
            const fullProfile = await ProfileService.getProfile(session.user.id);
            if (fullProfile && mounted) {
              setUser(fullProfile);
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
        }
        
        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Unexpected error during auth initialization:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
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
