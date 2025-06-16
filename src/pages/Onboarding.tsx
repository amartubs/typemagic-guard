
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import SEOHead from '@/components/seo/SEOHead';
import ConversionTracker from '@/components/optimization/ConversionTracker';
import ProtectedLayout from '@/components/layout/ProtectedLayout';

const Onboarding = () => {
  return (
    <ConversionTracker>
      <ProtectedLayout>
        <SEOHead
          title="Get Started - Shoale Onboarding"
          description="Quick setup guide to get started with Shoale keystroke biometric authentication."
          keywords={['onboarding', 'setup', 'getting started', 'keystroke biometrics']}
        />
        
        <div className="py-12 bg-background">
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
        </div>
      </ProtectedLayout>
    </ConversionTracker>
  );
};

export default Onboarding;
