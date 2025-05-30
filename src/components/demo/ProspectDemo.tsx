
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Shield, Clock, Users, Zap } from 'lucide-react';
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
      title: 'Enhanced Keystroke Analysis',
      description: 'Experience real-time biometric analysis with advanced visualizations',
      content: (
        <div className="space-y-6">
          <Input
            placeholder="Type your full name to see real-time analysis..."
            value={typingInput}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyDown={handleKeyDown}
            className="text-lg"
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ConfidenceScoreAnimation 
              score={confidenceScore}
              isUpdating={isTyping}
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
      title: 'Pattern Recognition Deep Dive',
      description: 'See how our advanced algorithms analyze your unique patterns',
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
      description: 'Compare your typing patterns across different samples',
      content: (
        <ComparativeAnalysis 
          currentSample={currentSample}
          onAddSample={(sample) => setCurrentSample(sample)}
        />
      )
    },
    {
      title: 'Integration Benefits',
      description: 'See how easy it is to integrate with your existing systems',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Clock className="mx-auto mb-2 text-blue-600" size={24} />
              <h4 className="font-semibold">5 Minute Setup</h4>
              <p className="text-xs text-muted-foreground">Quick integration</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Users className="mx-auto mb-2 text-green-600" size={24} />
              <h4 className="font-semibold">Zero User Training</h4>
              <p className="text-xs text-muted-foreground">Invisible to users</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Zap className="mx-auto mb-2 text-purple-600" size={24} />
              <h4 className="font-semibold">99.8% Accuracy</h4>
              <p className="text-xs text-muted-foreground">Enterprise grade</p>
            </div>
          </div>
          
          {currentSample && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="text-green-600" size={16} />
                <span className="font-semibold text-green-800">Analysis Complete</span>
              </div>
              <p className="text-sm text-green-700">
                Your biometric profile shows {currentSample.confidenceScore >= 75 ? 'excellent' : 
                currentSample.confidenceScore >= 60 ? 'good' : 'developing'} consistency. 
                Ready for production deployment!
              </p>
            </div>
          )}
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
