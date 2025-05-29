
import React from 'react';
import { useABTest } from '@/hooks/useABTest';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const VALUE_PROPOSITION_TEST = {
  testId: 'hero_value_prop_v1',
  variants: [
    { id: 'security_focused', name: 'Security Focused', weight: 33 },
    { id: 'convenience_focused', name: 'Convenience Focused', weight: 33 },
    { id: 'technology_focused', name: 'Technology Focused', weight: 34 }
  ]
};

const ValuePropositionTest = () => {
  const variant = useABTest(VALUE_PROPOSITION_TEST);

  const getValueProposition = () => {
    switch (variant) {
      case 'security_focused':
        return {
          headline: 'Unbreakable Security Through Keystroke DNA',
          subheadline: 'Stop fraud before it happens with behavioral biometrics that can\'t be stolen, faked, or duplicated.',
          cta: 'Secure Your App Now'
        };
      case 'convenience_focused':
        return {
          headline: 'Seamless Authentication That Just Works',
          subheadline: 'Add invisible security to your app without disrupting user experience. No additional steps required.',
          cta: 'Try Seamless Auth'
        };
      case 'technology_focused':
        return {
          headline: 'Next-Gen AI Biometric Authentication',
          subheadline: 'Cutting-edge machine learning analyzes typing patterns to create unique digital fingerprints.',
          cta: 'Explore Technology'
        };
      default:
        return {
          headline: 'Secure Authentication Through Keystroke Biometrics',
          subheadline: 'Add an invisible layer of security to your application with advanced behavioral biometrics.',
          cta: 'Try Now'
        };
    }
  };

  const { headline, subheadline, cta } = getValueProposition();

  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        {headline.split(' ').slice(0, -2).join(' ')}
        <span className="text-[#9b87f5] block mt-2">
          {headline.split(' ').slice(-2).join(' ')}
        </span>
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
        {subheadline}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/login">
          <Button size="lg" className="gap-2 bg-[#9b87f5] hover:bg-[#7E69AB]">
            {cta}
            <ChevronRight size={18} />
          </Button>
        </Link>
        <Link to="/demo">
          <Button size="lg" variant="outline" className="border-[#9b87f5] text-[#9b87f5]">
            View Demo
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ValuePropositionTest;
