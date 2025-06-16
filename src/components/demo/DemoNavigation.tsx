
import React from 'react';
import { Button } from '@/components/ui/button';

interface DemoNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const DemoNavigation: React.FC<DemoNavigationProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onComplete,
  isFirstStep,
  isLastStep
}) => {
  return (
    <div className="flex justify-between mt-6">
      <Button 
        variant="outline" 
        onClick={onPrevious}
        disabled={isFirstStep}
      >
        Previous
      </Button>
      {!isLastStep ? (
        <Button onClick={onNext}>
          Next Step
        </Button>
      ) : (
        <Button onClick={onComplete}>
          Start Free Trial
        </Button>
      )}
    </div>
  );
};

export default DemoNavigation;
