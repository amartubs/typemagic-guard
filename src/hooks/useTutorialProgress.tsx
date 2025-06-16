
import { useState, useCallback } from 'react';

export interface TutorialProgress {
  currentStep: number;
  completedSteps: Set<number>;
  isStarted: boolean;
  isCompleted: boolean;
}

export const useTutorialProgress = (totalSteps: number) => {
  const [progress, setProgress] = useState<TutorialProgress>({
    currentStep: 0,
    completedSteps: new Set(),
    isStarted: false,
    isCompleted: false
  });

  const startTutorial = useCallback(() => {
    setProgress({
      currentStep: 0,
      completedSteps: new Set(),
      isStarted: true,
      isCompleted: false
    });
  }, []);

  const nextStep = useCallback(() => {
    setProgress(prev => {
      const newCompletedSteps = new Set(prev.completedSteps);
      newCompletedSteps.add(prev.currentStep);
      
      const nextStepIndex = prev.currentStep + 1;
      const isCompleted = nextStepIndex >= totalSteps;
      
      return {
        ...prev,
        currentStep: isCompleted ? prev.currentStep : nextStepIndex,
        completedSteps: newCompletedSteps,
        isCompleted
      };
    });
  }, [totalSteps]);

  const previousStep = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1),
      isCompleted: false
    }));
  }, []);

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < totalSteps) {
      setProgress(prev => ({
        ...prev,
        currentStep: stepIndex
      }));
    }
  }, [totalSteps]);

  const resetTutorial = useCallback(() => {
    setProgress({
      currentStep: 0,
      completedSteps: new Set(),
      isStarted: false,
      isCompleted: false
    });
  }, []);

  return {
    progress,
    startTutorial,
    nextStep,
    previousStep,
    goToStep,
    resetTutorial
  };
};
