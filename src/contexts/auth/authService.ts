
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { UserType, SubscriptionTier } from '@/lib/types';
import { Provider } from './types';

export const authOperations = {
  async login(email: string, password: string): Promise<boolean> {
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
    }
  },

  async register(
    name: string, 
    email: string, 
    password: string, 
    userType: UserType = 'individual',
    subscriptionTier: SubscriptionTier = 'free',
    organizationName?: string,
    organizationSize?: number
  ): Promise<boolean> {
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
    }
  },

  async resetPassword(email: string): Promise<boolean> {
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
  },

  async signInWithProvider(provider: Provider): Promise<boolean> {
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
    }
  },

  async updateUserProfile(name: string, email: string): Promise<boolean> {
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
  },

  async updatePassword(currentPassword: string, newPassword: string): Promise<boolean> {
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
  }
};
