
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
            <div className="mb-6">
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
            <OnboardingFlow />
          </div>
        </main>
      </div>
    </ConversionTracker>
  );
};

export default Onboarding;
