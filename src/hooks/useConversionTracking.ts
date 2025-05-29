
import { useCallback } from 'react';

export interface ConversionEvent {
  funnel_step: string;
  event_type: 'view' | 'click' | 'conversion';
  value?: number;
  metadata?: Record<string, any>;
}

export const useConversionTracking = () => {
  const trackConversion = useCallback((event: ConversionEvent) => {
    const conversionData = {
      ...event,
      timestamp: new Date().toISOString(),
      session_id: getSessionId(),
      page_url: window.location.href,
      referrer: document.referrer,
      user_agent: navigator.userAgent
    };

    // Store in localStorage (in production, send to analytics service)
    const conversions = JSON.parse(localStorage.getItem('conversion_events') || '[]');
    conversions.push(conversionData);
    localStorage.setItem('conversion_events', JSON.stringify(conversions));

    console.log('Conversion tracked:', conversionData);
  }, []);

  const trackPageView = useCallback((page: string) => {
    trackConversion({
      funnel_step: page,
      event_type: 'view'
    });
  }, [trackConversion]);

  const trackClick = useCallback((element: string, metadata?: Record<string, any>) => {
    trackConversion({
      funnel_step: element,
      event_type: 'click',
      metadata
    });
  }, [trackConversion]);

  const trackGoalConversion = useCallback((goal: string, value?: number) => {
    trackConversion({
      funnel_step: goal,
      event_type: 'conversion',
      value
    });
  }, [trackConversion]);

  return {
    trackConversion,
    trackPageView,
    trackClick,
    trackGoalConversion
  };
};

const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};
