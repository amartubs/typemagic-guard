
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const QuickStartGuides = () => {
  const integrationGuides = [
    {
      id: 'quickstart',
      title: 'Quick Start Guide',
      description: 'Get started with TypeMagic Guard in 5 minutes',
      steps: [
        'Generate your API key',
        'Install the SDK or set up HTTP calls',
        'Initialize the biometric authentication',
        'Handle authentication responses',
        'Test your integration'
      ]
    },
    {
      id: 'web-app',
      title: 'Web Application Integration',
      description: 'Complete guide for integrating into web applications',
      steps: [
        'Add TypeMagic Guard JavaScript SDK',
        'Initialize keystroke capture',
        'Implement authentication flow',
        'Handle success and failure states',
        'Customize security settings'
      ]
    },
    {
      id: 'mobile-app',
      title: 'Mobile Application Integration',
      description: 'Guide for React Native and mobile web apps',
      steps: [
        'Install mobile-compatible SDK',
        'Set up touch and keyboard event capture',
        'Configure biometric thresholds',
        'Implement offline fallback',
        'Test across devices'
      ]
    },
    {
      id: 'backend',
      title: 'Backend API Integration',
      description: 'Server-to-server authentication validation',
      steps: [
        'Set up server-side API calls',
        'Implement webhook endpoints',
        'Configure user management',
        'Set up analytics reporting',
        'Implement security policies'
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {integrationGuides.map((guide) => (
        <Card key={guide.id}>
          <CardHeader>
            <CardTitle className="text-lg">{guide.title}</CardTitle>
            <CardDescription>{guide.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              {guide.steps.map((step, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-sm">{step}</span>
                </li>
              ))}
            </ol>
            <Button variant="outline" size="sm" className="mt-4">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Full Guide
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickStartGuides;
