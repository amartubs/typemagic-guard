
import React, { useEffect } from 'react';
import { useConversionTracking } from '@/hooks/useConversionTracking';
import { useLocation } from 'react-router-dom';

interface ConversionTrackerProps {
  children: React.ReactNode;
}

const ConversionTracker = ({ children }: ConversionTrackerProps) => {
  const { trackPageView, trackClick } = useConversionTracking();
  const location = useLocation();

  useEffect(() => {
    // Track page views
    trackPageView(location.pathname);
  }, [location.pathname, trackPageView]);

  useEffect(() => {
    // Track clicks on important elements
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Track CTA button clicks
      if (target.matches('button, a[href]')) {
        const text = target.textContent || '';
        const href = target.getAttribute('href') || '';
        
        trackClick('cta_click', {
          text,
          href,
          element_type: target.tagName.toLowerCase(),
          page: location.pathname
        });
      }

      // Track feature card clicks
      if (target.closest('[data-feature-card]')) {
        const card = target.closest('[data-feature-card]') as HTMLElement;
        const featureTitle = card.querySelector('h3')?.textContent || 'unknown';
        
        trackClick('feature_card_click', {
          feature: featureTitle,
          page: location.pathname
        });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [trackClick, location.pathname]);

  return <>{children}</>;
};

export default ConversionTracker;
