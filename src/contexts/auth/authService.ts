import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { UserType, SubscriptionTier } from '@/lib/types';
import { Provider } from './types';

export const authOperations = {
  async login(email: string, password: string): Promise<boolean> {
    try {
      console.log('Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error);
        
        // Handle specific error types
        let errorMessage = 'Login failed. Please try again.';
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and confirm your account before logging in. If you didn\'t receive the email, you can try registering again to resend the confirmation email.';
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
      
      console.log('Login successful for user:', data.user?.email);
      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      });
      
      return true;
    } catch (error) {
      console.error('Unexpected login error:', error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to authentication service. Please check your internet connection and try again.",
        variant: "destructive",
      });
      return false;
    }
  },

  async resendConfirmation(email: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        console.error('Error resending confirmation:', error);
        toast({
          title: "Resend Failed",
          description: "Could not resend confirmation email. Please try again later.",
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Confirmation Email Sent",
        description: "Please check your email for the confirmation link.",
      });
      
      return true;
    } catch (error) {
      console.error('Unexpected resend error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
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
      console.log('Attempting registration for:', email);
      
      // Validate inputs
      if (!name.trim() || !email.trim() || !password.trim()) {
        toast({
          title: "Registration Failed",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return false;
      }

      if (password.length < 6) {
        toast({
          title: "Registration Failed",
          description: "Password must be at least 6 characters long.",
          variant: "destructive",
        });
        return false;
      }

      // Check if user already exists
      const { data: existingUsers } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email.trim())
        .limit(1);

      if (existingUsers && existingUsers.length > 0) {
        toast({
          title: "Registration Failed",
          description: "An account with this email already exists. Please try logging in instead.",
          variant: "destructive",
        });
        return false;
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
            user_type: userType,
            subscription_tier: subscriptionTier,
            organization_name: organizationName?.trim(),
            organization_size: organizationSize
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        console.error('Registration error:', error);
        
        // Handle specific error types
        let errorMessage = 'Registration failed. Please try again.';
        if (error.message.includes('User already registered')) {
          errorMessage = 'An account with this email already exists. Please try logging in instead.';
        } else if (error.message.includes('Password should be')) {
          errorMessage = error.message;
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Please enter a valid email address.';
        } else if (error.message.includes('Signup is disabled')) {
          errorMessage = 'Account registration is currently disabled. Please contact support.';
        } else if (error.message.includes('Unable to validate email address')) {
          errorMessage = 'Please enter a valid email address.';
        }
        
        toast({
          title: "Registration Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      }
      
      console.log('Registration response:', { user: data.user, session: data.session });
      
      // Check if email confirmation is required
      if (data.user && !data.session) {
        toast({
          title: "Registration Successful!",
          description: "Please check your email and click the confirmation link to activate your account. Then you can log in.",
        });
      } else if (data.user && data.session) {
        toast({
          title: "Welcome to Shoale!",
          description: "Your account has been created successfully.",
        });
      } else {
        toast({
          title: "Registration Issue",
          description: "Registration may have failed. Please try again or contact support.",
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Unexpected registration error:', error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to registration service. Please check your internet connection and try again.",
        variant: "destructive",
      });
      return false;
    }
  },

  async resetPassword(email: string): Promise<boolean> {
    try {
      console.log('Attempting password reset for:', email);
      
      if (!email.trim()) {
        toast({
          title: "Password Reset Failed",
          description: "Please enter your email address.",
          variant: "destructive",
        });
        return false;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error('Password reset error:', error);
        
        let errorMessage = 'Password reset failed. Please try again.';
        if (error.message.includes('Invalid email')) {
          errorMessage = 'Please enter a valid email address.';
        }
        
        toast({
          title: "Password Reset Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for password reset instructions. The link will expire in 1 hour.",
      });
      
      return true;
    } catch (error) {
      console.error('Unexpected password reset error:', error);
      toast({
        title: "Connection Error",
        description: "Unable to send password reset email. Please try again later.",
        variant: "destructive",
      });
      return false;
    }
  },

  async signInWithProvider(provider: Provider): Promise<boolean> {
    try {
      console.log('Attempting social login with:', provider);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as 'google' | 'github' | 'apple',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        console.error(`${provider} authentication error:`, error);
        
        let errorMessage = `Failed to authenticate with ${provider}. Please try again.`;
        if (error.message.includes('OAuth')) {
          errorMessage = `${provider} authentication is not properly configured. Please contact support.`;
        }
        
        toast({
          title: "Authentication Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Unexpected ${provider} authentication error:`, error);
      toast({
        title: "Connection Error",
        description: `Unable to connect to ${provider}. Please try again later.`,
        variant: "destructive",
      });
      return false;
    }
  },

  async updateUserProfile(name: string, email: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.updateUser({
        email: email.trim(),
        data: { name: name.trim() }
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
      console.error('Unexpected profile update error:', error);
      toast({
        title: "Update Failed",
        description: "An unexpected error occurred while updating your profile.",
        variant: "destructive",
      });
      return false;
    }
  },

  async updatePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      if (newPassword.length < 6) {
        toast({
          title: "Password Update Failed",
          description: "New password must be at least 6 characters long.",
          variant: "destructive",
        });
        return false;
      }

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
      console.error('Unexpected password update error:', error);
      toast({
        title: "Update Failed",
        description: "An unexpected error occurred while updating your password.",
        variant: "destructive",
      });
      return false;
    }
  }
};
