
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const loginOperations = {
  async login(email: string, password: string): Promise<boolean> {
    console.log('Starting login process for:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and confirm your account before logging in.';
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'Too many login attempts. Please wait a few minutes before trying again.';
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
    
    if (data.user && data.session) {
      console.log('Login successful for user:', data.user.email);
      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      });
      return true;
    }
    
    console.error('Login failed: No user or session returned');
    return false;
  }
};
