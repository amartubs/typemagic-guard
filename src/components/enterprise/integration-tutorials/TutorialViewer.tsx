
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, RotateCcw, CheckCircle } from 'lucide-react';
import { useTutorialProgress } from '@/hooks/useTutorialProgress';
import InteractiveTutorialStepper from './InteractiveTutorialStepper';
import TutorialPrerequisites from './TutorialPrerequisites';
import TutorialResources from './TutorialResources';
import FrameworkGrid from './FrameworkGrid';
import FrameworkExamples from './FrameworkExamples';
import WebhookEventTypes from './WebhookEventTypes';
import { tutorialContent } from './TutorialContent';

interface TutorialViewerProps {
  selectedTutorial: string;
  tutorialTitle: string;
}

const TutorialViewer: React.FC<TutorialViewerProps> = ({ 
  selectedTutorial, 
  tutorialTitle 
}) => {
  const currentTutorial = tutorialContent[selectedTutorial];
  const {
    progress,
    startTutorial,
    nextStep,
    previousStep,
    goToStep,
    resetTutorial
  } = useTutorialProgress(currentTutorial?.steps.length || 0);

  if (!currentTutorial) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Tutorial not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{tutorialTitle}</CardTitle>
            <CardDescription>{currentTutorial.overview}</CardDescription>
          </div>
          <div className="flex gap-2">
            {progress.isStarted && (
              <Button
                variant="outline"
                onClick={resetTutorial}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
            <Button
              onClick={startTutorial}
              disabled={progress.isStarted && !progress.isCompleted}
            >
              {progress.isCompleted ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Completed
                </>
              ) : progress.isStarted ? (
                "Continue Tutorial"
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Tutorial
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={progress.isStarted ? "tutorial" : "overview"} className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tutorial">Interactive Tutorial</TabsTrigger>
            <TabsTrigger value="prerequisites">Prerequisites</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
            <TabsTrigger value="examples">SDK Examples</TabsTrigger>
            {selectedTutorial === 'webhooks' && (
              <TabsTrigger value="events">Event Types</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground text-base">{currentTutorial.overview}</p>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">What you'll learn:</h3>
              <ul className="space-y-1">
                {currentTutorial.steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary font-medium">{index + 1}.</span>
                    {step.title}
                  </li>
                ))}
              </ul>
              
              <div className="mt-6">
                <Button onClick={startTutorial}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Learning
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tutorial" className="space-y-6">
            {progress.isStarted ? (
              <InteractiveTutorialStepper
                steps={currentTutorial.steps}
                currentStep={progress.currentStep}
                completedSteps={progress.completedSteps}
                onNext={nextStep}
                onPrevious={previousStep}
                onStepClick={goToStep}
                isCompleted={progress.isCompleted}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Start the tutorial to begin your interactive learning experience
                </p>
                <Button onClick={startTutorial}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Tutorial
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="prerequisites" className="space-y-4">
            <TutorialPrerequisites prerequisites={currentTutorial.prerequisites} />
          </TabsContent>
          
          <TabsContent value="resources" className="space-y-4">
            <TutorialResources />
          </TabsContent>

          <TabsContent value="frameworks" className="space-y-4">
            <FrameworkGrid />
          </TabsContent>

          <TabsContent value="examples" className="space-y-4">
            <FrameworkExamples />
          </TabsContent>

          {selectedTutorial === 'webhooks' && (
            <TabsContent value="events" className="space-y-4">
              <WebhookEventTypes />
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TutorialViewer;
