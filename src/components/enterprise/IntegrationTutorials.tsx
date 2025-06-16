
import React, { useState } from 'react';
import TutorialList from './integration-tutorials/TutorialList';
import TutorialViewer from './integration-tutorials/TutorialViewer';

const IntegrationTutorials = () => {
  const [selectedTutorial, setSelectedTutorial] = useState('web-app');

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
          <TutorialViewer
            selectedTutorial={selectedTutorial}
            tutorialTitle={tutorialTitles[selectedTutorial]}
          />
        </div>
      </div>
    </div>
  );
};

export default IntegrationTutorials;
