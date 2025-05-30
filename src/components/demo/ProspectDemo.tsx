
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Shield, Clock, Users, Zap } from 'lucide-react';
import { useConversionTracking } from '@/hooks/useConversionTracking';

const ProspectDemo = () => {
  const [typingInput, setTypingInput] = useState('');
  const [demoStep, setDemoStep] = useState(1);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const { trackClick, trackGoalConversion } = useConversionTracking();

  const handleTyping = (value: string) => {
    setTypingInput(value);
    // Simulate confidence calculation
    const score = Math.min(85, Math.max(45, value.length * 3 + Math.random() * 20));
    setConfidenceScore(Math.round(score));
  };

  const handleDemoAction = (action: string) => {
    trackClick('demo_interaction', { action, step: demoStep });
    if (action === 'complete_demo') {
      trackGoalConversion('demo_completed', 1);
    }
  };

  const nextStep = () => {
    setDemoStep(prev => Math.min(4, prev + 1));
    handleDemoAction('next_step');
  };

  const getConfidenceColor = () => {
    if (confidenceScore >= 75) return 'text-green-600';
    if (confidenceScore >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const demoSteps = [
    {
      title: 'Type Your Name',
      description: 'Start typing to see keystroke biometrics in action',
      content: (
        <div className="space-y-4">
          <Input
            placeholder="Enter your full name..."
            value={typingInput}
            onChange={(e) => handleTyping(e.target.value)}
            className="text-lg"
          />
          <div className="flex items-center justify-between">
            <span>Confidence Score:</span>
            <Badge variant={confidenceScore >= 75 ? 'default' : 'secondary'} 
                   className={getConfidenceColor()}>
              {confidenceScore}%
            </Badge>
          </div>
        </div>
      )
    },
    {
      title: 'Authentication Analysis',
      description: 'See how we analyze your unique typing patterns',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Dwell Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">92ms</div>
                <p className="text-xs text-muted-foreground">Average key hold</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Flight Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">145ms</div>
                <p className="text-xs text-muted-foreground">Between keystrokes</p>
              </CardContent>
            </Card>
          </div>
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle size={16} />
            <span className="text-sm">Pattern matches established profile</span>
          </div>
        </div>
      )
    },
    {
      title: 'Threat Detection',
      description: 'Watch how we detect and prevent unauthorized access',
      content: (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertTriangle size={16} />
            <span className="text-sm">Simulating unauthorized access attempt...</span>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="text-red-600" size={16} />
              <span className="font-semibold text-red-800">Access Denied</span>
            </div>
            <p className="text-sm text-red-700">
              Typing pattern anomaly detected. Confidence score: 23%
            </p>
          </div>
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle size={16} />
            <span className="text-sm">Your account remains secure</span>
          </div>
        </div>
      )
    },
    {
      title: 'Integration Benefits',
      description: 'See how easy it is to integrate with your existing systems',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <Clock className="mx-auto mb-2 text-blue-600" size={24} />
              <h4 className="font-semibold">5 Minute Setup</h4>
              <p className="text-xs text-muted-foreground">Quick integration</p>
            </div>
            <div className="text-center">
              <Users className="mx-auto mb-2 text-green-600" size={24} />
              <h4 className="font-semibold">Zero User Training</h4>
              <p className="text-xs text-muted-foreground">Invisible to users</p>
            </div>
            <div className="text-center">
              <Zap className="mx-auto mb-2 text-purple-600" size={24} />
              <h4 className="font-semibold">99.8% Accuracy</h4>
              <p className="text-xs text-muted-foreground">Enterprise grade</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = demoSteps[demoStep - 1];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{currentStepData.title}</CardTitle>
              <CardDescription>{currentStepData.description}</CardDescription>
            </div>
            <Badge variant="outline">Step {demoStep} of 4</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {currentStepData.content}
          
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={() => setDemoStep(prev => Math.max(1, prev - 1))}
              disabled={demoStep === 1}
            >
              Previous
            </Button>
            {demoStep < 4 ? (
              <Button onClick={nextStep}>
                Next Step
              </Button>
            ) : (
              <Button onClick={() => handleDemoAction('complete_demo')}>
                Complete Demo
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProspectDemo;
