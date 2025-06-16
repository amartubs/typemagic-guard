
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface RegistrationSuccessProps {
  onGoToLogin: () => void;
  onRegisterAnother: () => void;
}

const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({
  onGoToLogin,
  onRegisterAnother
}) => {
  return (
    <div className="text-center space-y-4">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
      <h2 className="text-xl font-semibold">Check Your Email!</h2>
      <p className="text-muted-foreground">
        We've sent you a confirmation link. Please check your email and click the link to activate your account.
      </p>
      <div className="space-y-2">
        <Button onClick={onGoToLogin} className="w-full">
          Go to Login
        </Button>
        <Button 
          variant="outline"
          onClick={onRegisterAnother}
          className="w-full"
        >
          Register Another Account
        </Button>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
