
import { useState, useEffect } from 'react';

interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});

  useEffect(() => {
    const measurePerformance = () => {
      // Page Load Time
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationTiming) {
        setMetrics(prev => ({
          ...prev,
          pageLoadTime: navigationTiming.loadEventEnd - navigationTiming.loadEventStart
        }));
      }

      // First Contentful Paint
      const paintEntries = performance.getEntriesByType('paint');
      const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcp) {
        setMetrics(prev => ({
          ...prev,
          firstContentfulPaint: fcp.startTime
        }));
      }

      // Largest Contentful Paint
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        setMetrics(prev => ({
          ...prev,
          largestContentfulPaint: lastEntry.startTime
        }));
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        setMetrics(prev => ({
          ...prev,
          cumulativeLayoutShift: clsValue
        }));
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          setMetrics(prev => ({
            ...prev,
            firstInputDelay: (entry as any).processingStart - entry.startTime
          }));
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      return () => {
        observer.disconnect();
        clsObserver.disconnect();
        fidObserver.disconnect();
      };
    };

    // Wait for page to be fully loaded
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
      return () => window.removeEventListener('load', measurePerformance);
    }
  }, []);

  const logMetrics = () => {
    console.log('Performance Metrics:', metrics);
    
    // Store metrics for analysis
    const performanceData = {
      ...metrics,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    const storedMetrics = JSON.parse(localStorage.getItem('performance_metrics') || '[]');
    storedMetrics.push(performanceData);
    localStorage.setItem('performance_metrics', JSON.stringify(storedMetrics));
  };

  return { metrics, logMetrics };
};
