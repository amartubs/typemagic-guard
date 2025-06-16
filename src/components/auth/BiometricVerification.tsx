
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, AlertCircle } from 'lucide-react';
import EnhancedBiometricAuth from '@/components/biometric/EnhancedBiometricAuth';

interface BiometricVerificationProps {
  onVerify: () => void;
  onSkip: () => void;
}

const BiometricVerification: React.FC<BiometricVerificationProps> = ({
  onVerify,
  onSkip
}) => {
  const [authenticationResult, setAuthenticationResult] = useState<{success: boolean, confidence: number} | null>(null);

  const handleAuthentication = (success: boolean, confidence: number) => {
    setAuthenticationResult({ success, confidence });
    
    if (success && confidence >= 70) {
      // Auto-verify if confidence is high enough
      setTimeout(() => {
        onVerify();
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-2xl p-6 shadow-lg">
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Enhanced Biometric Verification</h1>
          <p className="text-muted-foreground mt-2">
            Complete your advanced biometric verification to continue
          </p>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-muted rounded-md">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Advanced Security Notice:</p>
                <p className="text-sm mt-1">
                  This system uses advanced keystroke dynamics analysis with fraud detection 
                  and continuous learning capabilities for enhanced security.
                </p>
              </div>
            </div>
          </div>

          <EnhancedBiometricAuth
            mode="verification"
            onAuthentication={handleAuthentication}
            className="w-full"
          />

          <div className="flex flex-col space-y-2">
            <Button 
              onClick={onVerify} 
              disabled={!authenticationResult?.success}
              className="w-full"
            >
              {authenticationResult?.success ? 
                `Proceed with ${authenticationResult.confidence.toFixed(1)}% Confidence` : 
                'Complete Verification Above'
              }
            </Button>
            
            <Button 
              variant="outline"
              onClick={onSkip}
            >
              Skip Enhanced Verification
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BiometricVerification;
