
import { useState, useEffect } from 'react';

interface ABTestVariant {
  id: string;
  name: string;
  weight: number;
}

interface ABTest {
  testId: string;
  variants: ABTestVariant[];
}

export const useABTest = (test: ABTest) => {
  const [selectedVariant, setSelectedVariant] = useState<string>('');

  useEffect(() => {
    // Check if user already has a variant assigned
    const storageKey = `ab_test_${test.testId}`;
    const savedVariant = localStorage.getItem(storageKey);
    
    if (savedVariant) {
      setSelectedVariant(savedVariant);
      return;
    }

    // Assign new variant based on weights
    const totalWeight = test.variants.reduce((sum, variant) => sum + variant.weight, 0);
    const random = Math.random() * totalWeight;
    
    let cumulativeWeight = 0;
    for (const variant of test.variants) {
      cumulativeWeight += variant.weight;
      if (random <= cumulativeWeight) {
        setSelectedVariant(variant.id);
        localStorage.setItem(storageKey, variant.id);
        
        // Track variant assignment
        trackEvent('ab_test_assignment', {
          test_id: test.testId,
          variant_id: variant.id,
          timestamp: new Date().toISOString()
        });
        break;
      }
    }
  }, [test]);

  const trackTestResult = (metric: string, value: number, context?: Record<string, any>) => {
    trackEvent('ab_test_result', {
      test_id: test.testId,
      variant_id: selectedVariant,
      metric,
      value,
      context,
      timestamp: new Date().toISOString()
    });
  };

  const getTestResults = () => {
    const results = JSON.parse(localStorage.getItem('ab_test_results') || '[]');
    return results.filter((result: any) => result.test_id === test.testId);
  };

  return {
    selectedVariant,
    trackTestResult,
    getTestResults
  };
};

const trackEvent = (eventName: string, properties: Record<string, any>) => {
  // Store events in localStorage for now (could be sent to analytics service)
  const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
  events.push({
    event: eventName,
    properties,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent
  });
  localStorage.setItem('analytics_events', JSON.stringify(events));
  
  console.log('Event tracked:', eventName, properties);
};
