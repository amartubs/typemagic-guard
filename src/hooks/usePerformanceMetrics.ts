import { useEffect, useRef, useState, useCallback } from 'react';

interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
}

interface ComponentMetrics {
  renderTime: number;
  rerenderCount: number;
  lastRenderTime: number;
}

export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});
  const [componentMetrics, setComponentMetrics] = useState<ComponentMetrics>({
    renderTime: 0,
    rerenderCount: 0,
    lastRenderTime: 0
  });

  useEffect(() => {
    const measurePerformance = () => {
      // Page Load Time
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationTiming) {
        const loadTime = navigationTiming.loadEventEnd - navigationTiming.loadEventStart;
        setMetrics(prev => ({
          ...prev,
          pageLoadTime: loadTime
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

      // Core Web Vitals observers
      if ('PerformanceObserver' in window) {
        // Largest Contentful Paint
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            setMetrics(prev => ({
              ...prev,
              largestContentfulPaint: lastEntry.startTime
            }));
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

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
            lcpObserver.disconnect();
            clsObserver.disconnect();
            fidObserver.disconnect();
          };
        } catch (error) {
          console.warn('Performance observers not fully supported:', error);
        }
      }
    };

    // Wait for page to be fully loaded
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
      return () => window.removeEventListener('load', measurePerformance);
    }
  }, []);

  const measureComponentRender = useCallback((componentName: string) => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      setComponentMetrics(prev => ({
        renderTime: renderTime,
        rerenderCount: prev.rerenderCount + 1,
        lastRenderTime: renderTime
      }));

      // Log slow renders in development
      if (process.env.NODE_ENV === 'development' && renderTime > 16) {
        console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
    };
  }, []);

  const logMetrics = useCallback(() => {
    const performanceData = {
      ...metrics,
      ...componentMetrics,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      connection: (navigator as any).connection ? {
        effectiveType: (navigator as any).connection.effectiveType,
        downlink: (navigator as any).connection.downlink
      } : null
    };
    
    console.group('📊 Performance Metrics');
    console.table(performanceData);
    console.groupEnd();
    
    // Store metrics for analysis
    const storedMetrics = JSON.parse(localStorage.getItem('performance_metrics') || '[]');
    storedMetrics.push(performanceData);
    
    // Keep only last 50 entries to prevent localStorage bloat
    if (storedMetrics.length > 50) {
      storedMetrics.splice(0, storedMetrics.length - 50);
    }
    
    localStorage.setItem('performance_metrics', JSON.stringify(storedMetrics));
  }, [metrics, componentMetrics]);

  const getPerformanceScore = useCallback(() => {
    const { firstContentfulPaint = 0, largestContentfulPaint = 0, cumulativeLayoutShift = 0, firstInputDelay = 0 } = metrics;
    
    // Simple scoring based on Google's Core Web Vitals thresholds
    let score = 100;
    
    // FCP scoring (good: <1.8s, needs improvement: 1.8s-3s, poor: >3s)
    if (firstContentfulPaint > 3000) score -= 25;
    else if (firstContentfulPaint > 1800) score -= 10;
    
    // LCP scoring (good: <2.5s, needs improvement: 2.5s-4s, poor: >4s)
    if (largestContentfulPaint > 4000) score -= 25;
    else if (largestContentfulPaint > 2500) score -= 10;
    
    // CLS scoring (good: <0.1, needs improvement: 0.1-0.25, poor: >0.25)
    if (cumulativeLayoutShift > 0.25) score -= 25;
    else if (cumulativeLayoutShift > 0.1) score -= 10;
    
    // FID scoring (good: <100ms, needs improvement: 100ms-300ms, poor: >300ms)
    if (firstInputDelay > 300) score -= 25;
    else if (firstInputDelay > 100) score -= 10;
    
    return Math.max(0, score);
  }, [metrics]);

  return { 
    metrics, 
    componentMetrics,
    measureComponentRender,
    logMetrics,
    getPerformanceScore
  };
};

// Higher-order component for performance monitoring
export function withPerformanceMonitoring<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) {
  return function PerformanceMonitoredComponent(props: P) {
    const { measureComponentRender } = usePerformanceMetrics();
    
    useEffect(() => {
      const endMeasurement = measureComponentRender(componentName);
      return endMeasurement;
    });

    return React.createElement(WrappedComponent, props);
  };
}
