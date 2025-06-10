
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Provider } from './types';

export const socialAuthOperations = {
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
  }
};
