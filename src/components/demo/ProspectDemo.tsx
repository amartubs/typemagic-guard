
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Shield, Clock, Users, Zap, Globe, Code } from 'lucide-react';
import { useConversionTracking } from '@/hooks/useConversionTracking';
import { KeyTiming } from '@/lib/types';
import KeystrokeVisualizer from './KeystrokeVisualizer';
import ConfidenceScoreAnimation from './ConfidenceScoreAnimation';
import ComparativeAnalysis from './ComparativeAnalysis';

interface TypingSample {
  id: string;
  label: string;
  keystrokes: KeyTiming[];
  confidenceScore: number;
  timestamp: Date;
}

const ProspectDemo = () => {
  const [typingInput, setTypingInput] = useState('');
  const [demoStep, setDemoStep] = useState(1);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [keystrokes, setKeystrokes] = useState<KeyTiming[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentSample, setCurrentSample] = useState<TypingSample | null>(null);
  const { trackClick, trackGoalConversion } = useConversionTracking();

  const handleTyping = (value: string) => {
    setTypingInput(value);
    setIsTyping(true);
    
    // Simulate confidence calculation with more realistic variation
    const baseScore = Math.min(85, Math.max(45, value.length * 3));
    const variation = (Math.sin(Date.now() / 1000) + 1) * 10; // Oscillating variation
    const score = Math.min(95, Math.max(30, baseScore + variation));
    setConfidenceScore(Math.round(score));

    // Clear typing indicator after a delay
    setTimeout(() => setIsTyping(false), 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const pressTime = Date.now();
    
    // Simulate keystroke capture
    setTimeout(() => {
      const duration = 80 + Math.random() * 40; // 80-120ms
      const newKeystroke: KeyTiming = {
        key: e.key,
        pressTime,
        releaseTime: pressTime + duration,
        duration
      };
      
      setKeystrokes(prev => [...prev, newKeystroke]);
    }, Math.random() * 50); // Small delay to simulate real processing
  };

  const handleDemoAction = (action: string) => {
    trackClick('demo_interaction', { action, step: demoStep });
    if (action === 'complete_demo') {
      trackGoalConversion('demo_completed', 1);
    }
  };

  const nextStep = () => {
    // Save current sample when moving to next step
    if (demoStep === 1 && keystrokes.length > 0) {
      const sample: TypingSample = {
        id: `sample-${Date.now()}`,
        label: `Sample ${demoStep}`,
        keystrokes: [...keystrokes],
        confidenceScore,
        timestamp: new Date()
      };
      setCurrentSample(sample);
    }
    
    setDemoStep(prev => Math.min(5, prev + 1));
    handleDemoAction('next_step');
  };

  const demoSteps = [
    {
      title: 'Real Website Experience',
      description: 'See how Shoale works from an end user perspective - completely invisible!',
      content: (
        <div className="space-y-6">
          <div className="bg-white border-2 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold">MyBank - Secure Login</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <Input
                  type="email"
                  placeholder="user@example.com"
                  className="w-full"
                  defaultValue="john.doe@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <Input
                  type="password"
                  placeholder="Type your password here..."
                  value={typingInput}
                  onChange={(e) => handleTyping(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full"
                />
                {isTyping && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Biometric verification active (invisible to user)</span>
                  </div>
                )}
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Sign In Securely
              </Button>
            </div>
          </div>
          
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-sm">What Users See</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Users see a completely normal login form. They type their password as usual. 
                There are no extra steps, downloads, or changes to their experience.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ConfidenceScoreAnimation 
              score={confidenceScore}
              isUpdating={isTyping}
              label="Developer Dashboard View"
            />
            <KeystrokeVisualizer 
              keystrokes={keystrokes}
              isActive={isTyping}
            />
          </div>
        </div>
      )
    },
    {
      title: 'Developer Integration View',
      description: 'See how simple it is to integrate Shoale into your application',
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Integration Code
              </CardTitle>
              <CardDescription>Add this to your login form to enable biometric protection</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                <code>{`// Install the SDK
npm install @shoale/auth-sdk

// Initialize in your app
import { Shoale } from '@shoale/auth-sdk';

const shoale = new Shoale({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Enable on login form
shoale.capture('password-field', {
  onResult: (result) => {
    if (result.confidence > 0.75) {
      // High confidence - proceed normally
      submitLogin();
    } else {
      // Low confidence - trigger 2FA
      showTwoFactorAuth();
    }
  }
});`}</code>
              </pre>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Real-time Confidence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {confidenceScore}%
                </div>
                <p className="text-xs text-muted-foreground">Based on typing patterns</p>
                <div className="mt-2 h-1 bg-muted rounded">
                  <div 
                    className="h-1 bg-green-500 rounded transition-all duration-500"
                    style={{ width: `${confidenceScore}%` }}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">API Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {keystrokes.length > 0 ? Math.round(Math.random() * 20) + 15 : 23}ms
                </div>
                <p className="text-xs text-muted-foreground">Real-time analysis</p>
                <div className="mt-2 h-1 bg-muted rounded">
                  <div 
                    className="h-1 bg-blue-500 rounded transition-all duration-500"
                    style={{ width: '85%' }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      title: 'Advanced Pattern Analysis',
      description: 'Deep dive into the biometric analysis powering fraud prevention',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Dwell Time Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {keystrokes.length > 0 ? 
                    Math.round(keystrokes.reduce((sum, k) => sum + k.duration, 0) / keystrokes.length) : 92}ms
                </div>
                <p className="text-xs text-muted-foreground">Average key hold duration</p>
                <div className="mt-2 h-1 bg-muted rounded">
                  <div 
                    className="h-1 bg-green-500 rounded transition-all duration-500"
                    style={{ width: keystrokes.length > 0 ? '75%' : '60%' }}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Flight Time Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {keystrokes.length > 1 ? 
                    Math.round(Math.abs(keystrokes.slice(-1)[0].pressTime - keystrokes.slice(-2)[0].releaseTime)) : 145}ms
                </div>
                <p className="text-xs text-muted-foreground">Between keystrokes</p>
                <div className="mt-2 h-1 bg-muted rounded">
                  <div 
                    className="h-1 bg-blue-500 rounded transition-all duration-500"
                    style={{ width: keystrokes.length > 1 ? '65%' : '45%' }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle size={16} />
            <span className="text-sm">Pattern recognition confidence: {confidenceScore}%</span>
          </div>
        </div>
      )
    },
    {
      title: 'Comparative Analysis',
      description: 'Compare typing patterns across different samples for consistency',
      content: (
        <ComparativeAnalysis 
          currentSample={currentSample}
          onAddSample={(sample) => setCurrentSample(sample)}
        />
      )
    },
    {
      title: 'Business Benefits & ROI',
      description: 'See the impact on your business metrics and user experience',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg bg-green-50">
              <Clock className="mx-auto mb-2 text-green-600" size={24} />
              <h4 className="font-semibold">5 Minute Setup</h4>
              <p className="text-xs text-muted-foreground">Quick integration</p>
              <div className="text-2xl font-bold text-green-600 mt-2">99.9%</div>
              <p className="text-xs">Uptime SLA</p>
            </div>
            <div className="text-center p-4 border rounded-lg bg-blue-50">
              <Users className="mx-auto mb-2 text-blue-600" size={24} />
              <h4 className="font-semibold">Zero User Training</h4>
              <p className="text-xs text-muted-foreground">Invisible to users</p>
              <div className="text-2xl font-bold text-blue-600 mt-2">0ms</div>
              <p className="text-xs">Added latency</p>
            </div>
            <div className="text-center p-4 border rounded-lg bg-purple-50">
              <Zap className="mx-auto mb-2 text-purple-600" size={24} />
              <h4 className="font-semibold">99.8% Accuracy</h4>
              <p className="text-xs text-muted-foreground">Enterprise grade</p>
              <div className="text-2xl font-bold text-purple-600 mt-2">87%</div>
              <p className="text-xs">Avg fraud reduction</p>
            </div>
          </div>
          
          {currentSample && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="text-green-600" size={16} />
                <span className="font-semibold text-green-800">Ready for Production</span>
              </div>
              <p className="text-sm text-green-700">
                Your biometric profile shows {currentSample.confidenceScore >= 75 ? 'excellent' : 
                currentSample.confidenceScore >= 60 ? 'good' : 'developing'} consistency. 
                This technology can now protect your users invisibly while stopping fraudsters.
              </p>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>Ready to add invisible security to your application?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="h-auto p-4 justify-start">
                  <div className="text-left">
                    <div className="font-semibold">Start Free Trial</div>
                    <div className="text-xs opacity-80">1,000 free authentications/month</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-4 justify-start">
                  <div className="text-left">
                    <div className="font-semibold">View Documentation</div>
                    <div className="text-xs opacity-80">Complete integration guide</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  const currentStepData = demoSteps[demoStep - 1];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{currentStepData.title}</CardTitle>
              <CardDescription>{currentStepData.description}</CardDescription>
            </div>
            <Badge variant="outline">Step {demoStep} of 5</Badge>
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
            {demoStep < 5 ? (
              <Button onClick={nextStep}>
                Next Step
              </Button>
            ) : (
              <Button onClick={() => handleDemoAction('complete_demo')}>
                Start Free Trial
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProspectDemo;
