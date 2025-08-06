import { useState, useEffect, useRef } from 'react';
import { performanceMonitor } from '@/lib/monitoring/performanceMonitor';

export interface RealTimeMetrics {
  averageResponseTime: number;
  p95ResponseTime: number;
  requestsPerSecond: number;
  errorRate: number;
  activeUsers: number;
  cacheHitRate: number;
  memoryUsage: number;
  cpuUsage: number;
}

export interface PerformanceAlerts {
  slowRequests: number;
  errorSpikes: number;
  highMemoryUsage: boolean;
  responseTimeThreshold: boolean;
}

export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState<RealTimeMetrics>({
    averageResponseTime: 0,
    p95ResponseTime: 0,
    requestsPerSecond: 0,
    errorRate: 0,
    activeUsers: 0,
    cacheHitRate: 0,
    memoryUsage: 0,
    cpuUsage: 0
  });

  const [alerts, setAlerts] = useState<PerformanceAlerts>({
    slowRequests: 0,
    errorSpikes: 0,
    highMemoryUsage: false,
    responseTimeThreshold: false
  });

  const [isMonitoring, setIsMonitoring] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  const startMonitoring = () => {
    if (isMonitoring) return;
    
    setIsMonitoring(true);
    
    // Update metrics every 5 seconds
    intervalRef.current = setInterval(async () => {
      try {
        const currentMetrics = await performanceMonitor.getRealTimeMetrics();
        setMetrics(currentMetrics);

        // Check for performance alerts
        const newAlerts: PerformanceAlerts = {
          slowRequests: currentMetrics.averageResponseTime > 50 ? 1 : 0,
          errorSpikes: currentMetrics.errorRate > 5 ? 1 : 0,
          highMemoryUsage: currentMetrics.memoryUsage > 85,
          responseTimeThreshold: currentMetrics.p95ResponseTime > 100
        };

        setAlerts(newAlerts);

        // Log critical alerts
        if (newAlerts.responseTimeThreshold) {
          console.warn('🚨 Response time threshold exceeded:', currentMetrics.p95ResponseTime);
        }
        
        if (newAlerts.highMemoryUsage) {
          console.warn('🚨 High memory usage detected:', currentMetrics.memoryUsage);
        }

      } catch (error) {
        console.error('Failed to fetch performance metrics:', error);
      }
    }, 5000);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  };

  const getPerformanceScore = (): number => {
    // Calculate overall performance score (0-100)
    const responseTimeScore = Math.max(0, 100 - (metrics.averageResponseTime / 50) * 100);
    const errorRateScore = Math.max(0, 100 - metrics.errorRate * 10);
    const cacheScore = metrics.cacheHitRate;
    const resourceScore = Math.max(0, 100 - ((metrics.memoryUsage + metrics.cpuUsage) / 2));

    return Math.round((responseTimeScore + errorRateScore + cacheScore + resourceScore) / 4);
  };

  const recordBiometricProcessing = (processingTime: number) => {
    performanceMonitor.recordBiometricProcessingTime(processingTime);
  };

  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, []);

  return {
    metrics,
    alerts,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    getPerformanceScore,
    recordBiometricProcessing
  };
};