
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play } from 'lucide-react';
import TutorialList from './integration-tutorials/TutorialList';
import TutorialSteps from './integration-tutorials/TutorialSteps';
import TutorialPrerequisites from './integration-tutorials/TutorialPrerequisites';
import TutorialResources from './integration-tutorials/TutorialResources';
import FrameworkGrid from './integration-tutorials/FrameworkGrid';
import FrameworkExamples from './integration-tutorials/FrameworkExamples';
import WebhookEventTypes from './integration-tutorials/WebhookEventTypes';
import { tutorialContent } from './integration-tutorials/TutorialContent';

const IntegrationTutorials = () => {
  const [selectedTutorial, setSelectedTutorial] = useState('web-app');

  const currentTutorial = tutorialContent[selectedTutorial];
  const tutorialTitles: Record<string, string> = {
    'web-app': 'Web Application Integration',
    'mobile-app': 'Mobile App Integration',
    'backend-api': 'Backend API Integration',
    'enterprise': 'Enterprise SSO Integration',
    'webhooks': 'Webhook Configuration'
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Integration Tutorials</h2>
        <p className="text-muted-foreground">
          Step-by-step guides for implementing TypeMagic Guard in your applications
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div>
          <TutorialList 
            selectedTutorial={selectedTutorial}
            onTutorialSelect={setSelectedTutorial}
          />
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">
                    {tutorialTitles[selectedTutorial]}
                  </CardTitle>
                  <CardDescription>
                    {currentTutorial?.overview}
                  </CardDescription>
                </div>
                <Button>
                  <Play className="h-4 w-4 mr-2" />
                  Start Tutorial
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="steps" className="w-full">
                <TabsList>
                  <TabsTrigger value="steps">Tutorial Steps</TabsTrigger>
                  <TabsTrigger value="prerequisites">Prerequisites</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
                  <TabsTrigger value="examples">SDK Examples</TabsTrigger>
                  {selectedTutorial === 'webhooks' && (
                    <TabsTrigger value="events">Event Types</TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="steps" className="space-y-6">
                  {currentTutorial && (
                    <TutorialSteps steps={currentTutorial.steps} />
                  )}
                </TabsContent>
                
                <TabsContent value="prerequisites" className="space-y-4">
                  {currentTutorial && (
                    <TutorialPrerequisites prerequisites={currentTutorial.prerequisites} />
                  )}
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
        </div>
      </div>
    </div>
  );
};

export default IntegrationTutorials;
