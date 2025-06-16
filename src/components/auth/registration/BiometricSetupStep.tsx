
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';
import EnhancedBiometricAuth from '@/components/biometric/EnhancedBiometricAuth';

interface BiometricSetupStepProps {
  onBiometricResult: (success: boolean, confidence: number) => void;
  onSkip: () => void;
}

const BiometricSetupStep: React.FC<BiometricSetupStepProps> = ({
  onBiometricResult,
  onSkip
}) => {
  return (
    <div className="space-y-6">
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Set up your biometric profile for enhanced security. This creates a unique 
          typing signature based on your keystroke patterns.
        </AlertDescription>
      </Alert>

      <EnhancedBiometricAuth
        mode="registration"
        onAuthentication={onBiometricResult}
      />

      <div className="flex gap-2">
        <Button onClick={onSkip} variant="outline" className="flex-1">
          Skip for Now
        </Button>
      </div>
    </div>
  );
};

export default BiometricSetupStep;
