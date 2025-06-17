
import React, { useEffect } from 'react';
import { usePerformanceMetrics } from '@/hooks/usePerformanceMetrics';

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

    return <WrappedComponent {...props} />;
  };
}
