
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Circle, ChevronLeft, ChevronRight, Copy, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TutorialStep {
  title: string;
  content: string;
  code?: string;
}

interface InteractiveTutorialStepperProps {
  steps: TutorialStep[];
  currentStep: number;
  completedSteps: Set<number>;
  onNext: () => void;
  onPrevious: () => void;
  onStepClick: (stepIndex: number) => void;
  isCompleted: boolean;
}

const InteractiveTutorialStepper: React.FC<InteractiveTutorialStepperProps> = ({
  steps,
  currentStep,
  completedSteps,
  onNext,
  onPrevious,
  onStepClick,
  isCompleted
}) => {
  const currentStepData = steps[currentStep];
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Code copied!",
        description: "The code has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy code to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Tutorial Progress</h3>
            <p className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
          <Badge variant={isCompleted ? "default" : "secondary"}>
            {isCompleted ? "Completed" : "In Progress"}
          </Badge>
        </div>
        <Progress value={progressPercentage} className="w-full" />
      </div>

      {/* Step Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <Button
            key={index}
            variant={currentStep === index ? "default" : "outline"}
            size="sm"
            className="whitespace-nowrap flex items-center gap-2"
            onClick={() => onStepClick(index)}
          >
            {completedSteps.has(index) ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <Circle className="h-4 w-4" />
            )}
            {index + 1}. {step.title}
          </Button>
        ))}
      </div>

      {/* Current Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {completedSteps.has(currentStep) ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
            {currentStepData.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm max-w-none">
            <p>{currentStepData.content}</p>
          </div>

          {currentStepData.code && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Code Example</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyCode(currentStepData.code!)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a 
                      href="https://docs.lovable.dev" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Docs
                    </a>
                  </Button>
                </div>
              </div>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{currentStepData.code}</code>
              </pre>
            </div>
          )}

          <Separator />

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex gap-2">
              {!isCompleted ? (
                <Button onClick={onNext}>
                  {currentStep === steps.length - 1 ? "Complete Tutorial" : "Next Step"}
                  {currentStep < steps.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
                </Button>
              ) : (
                <Badge variant="default" className="px-4 py-2">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Tutorial Completed!
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveTutorialStepper;
