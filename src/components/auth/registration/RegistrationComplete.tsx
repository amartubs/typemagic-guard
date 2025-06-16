
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface RegistrationCompleteProps {
  biometricComplete: boolean;
  biometricConfidence: number;
  onComplete: () => void;
}

const RegistrationComplete: React.FC<RegistrationCompleteProps> = ({
  biometricComplete,
  biometricConfidence,
  onComplete
}) => {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold">Registration Complete!</h3>
        <p className="text-muted-foreground mt-2">
          {biometricComplete 
            ? `Your account and biometric profile have been created with ${biometricConfidence.toFixed(1)}% confidence.`
            : 'Your account has been created. You can set up biometrics later in your profile.'
          }
        </p>
      </div>

      <Button onClick={onComplete} className="w-full">
        Continue to Dashboard
      </Button>
    </div>
  );
};

export default RegistrationComplete;
