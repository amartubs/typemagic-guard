
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Shield } from 'lucide-react';

type Step = 'info' | 'biometric' | 'complete';

interface RegistrationProgressProps {
  step: Step;
}

const RegistrationProgress: React.FC<RegistrationProgressProps> = ({ step }) => {
  const getStepProgress = () => {
    switch (step) {
      case 'info': return 33;
      case 'biometric': return 66;
      case 'complete': return 100;
      default: return 0;
    }
  };

  const getStepNumber = () => {
    switch (step) {
      case 'info': return 1;
      case 'biometric': return 2;
      case 'complete': return 3;
      default: return 1;
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-6 w-6" />
        Create Your Secure Account
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {getStepNumber()} of 3</span>
          <span>{getStepProgress()}% Complete</span>
        </div>
        <Progress value={getStepProgress()} className="h-2" />
      </div>
    </>
  );
};

export default RegistrationProgress;
