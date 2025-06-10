
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { UserType, SubscriptionTier } from '@/lib/types';

export const registrationOperations = {
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
  }
};
