
import React from 'react';
import Header from '@/components/layout/Header';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import SEOHead from '@/components/seo/SEOHead';
import ConversionTracker from '@/components/optimization/ConversionTracker';

const Onboarding = () => {
  return (
    <ConversionTracker>
      <div className="min-h-screen flex flex-col">
        <SEOHead
          title="Get Started - Shoale Onboarding"
          description="Quick setup guide to get started with Shoale keystroke biometric authentication."
          keywords={['onboarding', 'setup', 'getting started', 'keystroke biometrics']}
        />
        
        <Header />

        <main className="flex-grow py-12 bg-background">
          <div className="container mx-auto px-4">
            <OnboardingFlow />
          </div>
        </main>
      </div>
    </ConversionTracker>
  );
};

export default Onboarding;
