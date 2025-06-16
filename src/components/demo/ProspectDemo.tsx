
import React, { useState } from 'react';
import { useConversionTracking } from '@/hooks/useConversionTracking';
import { KeyTiming } from '@/lib/types';
import ComparativeAnalysis from './ComparativeAnalysis';
import DemoStepCard from './DemoStepCard';
import WebsiteLoginForm from './WebsiteLoginForm';
import DeveloperIntegrationView from './DeveloperIntegrationView';
import PatternAnalysisView from './PatternAnalysisView';
import BusinessBenefitsView from './BusinessBenefitsView';
import DemoNavigation from './DemoNavigation';

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

  const previousStep = () => {
    setDemoStep(prev => Math.max(1, prev - 1));
  };

  const completeDemo = () => {
    handleDemoAction('complete_demo');
  };

  const demoSteps = [
    {
      title: 'Real Website Experience',
      description: 'See how Shoale works from an end user perspective - completely invisible!',
      content: (
        <WebsiteLoginForm
          typingInput={typingInput}
          onTypingChange={handleTyping}
          onKeyDown={handleKeyDown}
          isTyping={isTyping}
          confidenceScore={confidenceScore}
          keystrokes={keystrokes}
        />
      )
    },
    {
      title: 'Developer Integration View',
      description: 'See how simple it is to integrate Shoale into your application',
      content: (
        <DeveloperIntegrationView
          confidenceScore={confidenceScore}
          keystrokes={keystrokes}
        />
      )
    },
    {
      title: 'Advanced Pattern Analysis',
      description: 'Deep dive into the biometric analysis powering fraud prevention',
      content: (
        <PatternAnalysisView
          keystrokes={keystrokes}
          confidenceScore={confidenceScore}
        />
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
        <BusinessBenefitsView currentSample={currentSample} />
      )
    }
  ];

  const currentStepData = demoSteps[demoStep - 1];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <DemoStepCard
        title={currentStepData.title}
        description={currentStepData.description}
        step={demoStep}
        totalSteps={5}
      >
        {currentStepData.content}
        
        <DemoNavigation
          currentStep={demoStep}
          totalSteps={5}
          onPrevious={previousStep}
          onNext={nextStep}
          onComplete={completeDemo}
          isFirstStep={demoStep === 1}
          isLastStep={demoStep === 5}
        />
      </DemoStepCard>
    </div>
  );
};

export default ProspectDemo;
