
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const passwordOperations = {
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
