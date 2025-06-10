
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const profileOperations = {
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
  }
};
