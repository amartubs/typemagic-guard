
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Legacy function for backward compatibility - now redirects to real auth
export const loginWithEmail = async (email: string, password: string) => {
  console.warn('Using legacy loginWithEmail - please use AuthProvider login method instead');
  
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

// This file is now deprecated - all auth functions are in AuthProvider
export const deprecationWarning = () => {
  console.warn('This authUtils file is deprecated. Please use the AuthProvider context methods instead.');
};
