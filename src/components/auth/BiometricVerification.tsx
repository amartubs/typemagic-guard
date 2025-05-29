
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { KeyTiming } from '@/lib/types';
import KeystrokeCapture from '@/components/ui-custom/KeystrokeCapture';
import { Shield, AlertCircle } from 'lucide-react';

interface BiometricVerificationProps {
  onVerify: () => void;
  onSkip: () => void;
}

const BiometricVerification: React.FC<BiometricVerificationProps> = ({
  onVerify,
  onSkip
}) => {
  const [keystrokeTimings, setKeystrokeTimings] = useState<KeyTiming[]>([]);

  const handleKeystrokeCapture = (timings: KeyTiming[]) => {
    setKeystrokeTimings(timings);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Biometric Verification</h1>
          <p className="text-muted-foreground mt-2">
            Complete your biometric verification to continue
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-md">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Type the following sentence:</p>
                <p className="text-sm mt-1">
                  "My voice is my passport, verify me."
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="biometric-input">Keystroke Verification</Label>
            <KeystrokeCapture
              captureContext="login"
              onCapture={handleKeystrokeCapture}
              autoStart={true}
              inputProps={{
                placeholder: "Type the verification phrase here...",
                id: "biometric-input"
              }}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Button 
              onClick={onVerify} 
              disabled={keystrokeTimings.length < 5}
              className="w-full"
            >
              Verify Biometrics
            </Button>
            
            <Button 
              variant="outline"
              onClick={onSkip}
            >
              Skip Biometric Verification
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BiometricVerification;
