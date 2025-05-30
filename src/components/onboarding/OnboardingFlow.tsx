
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowRight, Settings, Key, Shield, Zap } from 'lucide-react';
import { useConversionTracking } from '@/hooks/useConversionTracking';
import { useAuth } from '@/contexts/auth';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed?: boolean;
}

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    companyName: '',
    useCase: '',
    teamSize: '',
    apiKey: ''
  });
  const { trackClick, trackGoalConversion } = useConversionTracking();
  const { user } = useAuth();

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Shoale',
      description: 'Let\'s get your account set up for success',
      icon: <Shield className="h-6 w-6 text-blue-600" />
    },
    {
      id: 'profile',
      title: 'Tell us about yourself',
      description: 'Help us personalize your experience',
      icon: <Settings className="h-6 w-6 text-green-600" />
    },
    {
      id: 'setup',
      title: 'Configure your settings',
      description: 'Set up your security preferences',
      icon: <Key className="h-6 w-6 text-purple-600" />
    },
    {
      id: 'integration',
      title: 'Get your API keys',
      description: 'Start integrating with your applications',
      icon: <Zap className="h-6 w-6 text-orange-600" />
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps(prev => [...prev, stepId]);
      trackClick('onboarding_step_completed', { step: stepId });
    }
  };

  const nextStep = () => {
    const currentStepId = steps[currentStep].id;
    handleStepComplete(currentStepId);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      trackGoalConversion('onboarding_completed', 1);
    }
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'welcome':
        return (
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">Welcome, {user?.name || 'there'}!</h3>
            <p className="text-muted-foreground">
              You're about to experience the most advanced keystroke biometric authentication platform. 
              Let's get you set up in just a few quick steps.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Shield className="mx-auto mb-2 text-blue-600" size={32} />
                <h4 className="font-semibold">Enterprise Security</h4>
                <p className="text-sm text-muted-foreground">Bank-grade protection</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Zap className="mx-auto mb-2 text-green-600" size={32} />
                <h4 className="font-semibold">5-Minute Setup</h4>
                <p className="text-sm text-muted-foreground">Quick integration</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Key className="mx-auto mb-2 text-purple-600" size={32} />
                <h4 className="font-semibold">Invisible Auth</h4>
                <p className="text-sm text-muted-foreground">Seamless user experience</p>
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="Enter your company name"
              />
            </div>
            <div>
              <Label htmlFor="useCase">Primary Use Case</Label>
              <Input
                id="useCase"
                value={formData.useCase}
                onChange={(e) => setFormData(prev => ({ ...prev, useCase: e.target.value }))}
                placeholder="e.g., User authentication, Fraud prevention"
              />
            </div>
            <div>
              <Label htmlFor="teamSize">Team Size</Label>
              <Input
                id="teamSize"
                value={formData.teamSize}
                onChange={(e) => setFormData(prev => ({ ...prev, teamSize: e.target.value }))}
                placeholder="e.g., 1-10, 11-50, 50+"
              />
            </div>
          </div>
        );

      case 'setup':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Security Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Confidence Threshold</h4>
                  <p className="text-sm text-muted-foreground">Minimum confidence score for authentication</p>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-green-600">75%</span>
                  <p className="text-xs text-muted-foreground">Recommended</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Learning Period</h4>
                  <p className="text-sm text-muted-foreground">Days to learn user patterns</p>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-blue-600">14 days</span>
                  <p className="text-xs text-muted-foreground">Standard</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'integration':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your API Keys</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <Label htmlFor="apiKey">Production API Key</Label>
              <div className="flex space-x-2 mt-2">
                <Input
                  id="apiKey"
                  value="sk_live_abc123...xyz789"
                  readOnly
                  className="font-mono text-sm"
                />
                <Button variant="outline" size="sm">Copy</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Keep this key secure and never share it publicly
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Next Steps:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Check out our Quick Start Guide</li>
                <li>• Review the API documentation</li>
                <li>• Join our developer community</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    // Track onboarding started
    if (currentStep === 0) {
      trackClick('onboarding_started', {});
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Getting Started</h2>
          <span className="text-sm text-muted-foreground">
            {currentStep + 1} of {steps.length}
          </span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      <div className="flex space-x-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center space-x-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>
              {completedSteps.includes(step.id) ? (
                <CheckCircle size={16} />
              ) : (
                <span className="text-sm">{index + 1}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <ArrowRight size={16} className="text-gray-400" />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            {steps[currentStep].icon}
            <div>
              <CardTitle>{steps[currentStep].title}</CardTitle>
              <CardDescription>{steps[currentStep].description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
          
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button onClick={nextStep}>
              {currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
