
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import SocialLoginButtons from './SocialLoginButtons';
import { SocialProvider } from '@/contexts/AuthContext';

interface EmailLoginSectionProps {
  showEmailLogin: boolean;
  authLoading: boolean;
  onSocialLogin: (provider: SocialProvider) => Promise<void>;
  onShowEmailLogin: () => void;
}

const EmailLoginSection: React.FC<EmailLoginSectionProps> = ({
  showEmailLogin,
  authLoading,
  onSocialLogin,
  onShowEmailLogin
}) => {
  if (showEmailLogin) {
    return null;
  }

  return (
    <div className="space-y-4">
      <SocialLoginButtons 
        onProviderClick={onSocialLogin} 
        isLoading={authLoading} 
      />
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full flex items-center gap-2"
        onClick={onShowEmailLogin}
      >
        <Mail className="h-4 w-4" />
        Sign in with Email
      </Button>
    </div>
  );
};

export default EmailLoginSection;
