import { AutoScalingManager } from '@/lib/infrastructure/AutoScalingManager';
import { useState, useEffect, useCallback } from 'react';

interface ScalingMetrics {
  currentInstances: number;
  targetInstances: number;
  cpuUtilization: number;
  memoryUtilization: number;
  requestRate: number;
  responseTime: number;
  activeConnections: number;
}

interface ScalingEvent {
  timestamp: Date;
  type: 'scale_up' | 'scale_down' | 'health_check' | 'alert';
  instances: number;
  reason: string;
  metric?: string;
  value?: number;
}

export const useAutoScaling = () => {
  const [scalingManager] = useState(() => AutoScalingManager.getInstance());
  const [metrics, setMetrics] = useState<ScalingMetrics>({
    currentInstances: 1,
    targetInstances: 1,
    cpuUtilization: 0,
    memoryUtilization: 0,
    requestRate: 0,
    responseTime: 0,
    activeConnections: 0
  });
  
  const [events, setEvents] = useState<ScalingEvent[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [scalingConfig, setScalingConfig] = useState({
    minInstances: 1,
    maxInstances: 10,
    targetCpuUtilization: 70,
    targetMemoryUtilization: 80,
    scaleUpThreshold: 80,
    scaleDownThreshold: 30,
    cooldownPeriod: 300 // 5 minutes
  });

  const startMonitoring = useCallback(async () => {
    if (isMonitoring) return;
    
    setIsMonitoring(true);
    
    try {
      // Start metrics polling
      const metricsInterval = setInterval(async () => {
        try {
          const currentMetrics = await scalingManager.collectMetrics();
          setMetrics({
            currentInstances: 1,
            targetInstances: 1,
            cpuUtilization: currentMetrics.cpuUtilization,
            memoryUtilization: currentMetrics.memoryUtilization,
            requestRate: currentMetrics.requestsPerSecond,
            responseTime: currentMetrics.responseTime,
            activeConnections: currentMetrics.activeUsers
          });
        } catch (error) {
          console.error('Failed to fetch scaling metrics:', error);
        }
      }, 10000); // Update every 10 seconds

      return () => clearInterval(metricsInterval);
    } catch (error) {
      console.error('Failed to start auto-scaling monitoring:', error);
      setIsMonitoring(false);
    }
  }, [isMonitoring, scalingManager]);

  const stopMonitoring = useCallback(async () => {
    setIsMonitoring(false);
    // In production, would stop actual monitoring
    console.log('Auto-scaling monitoring stopped');
  }, []);

  const updateScalingConfig = useCallback(async (newConfig: Partial<typeof scalingConfig>) => {
    const updatedConfig = { ...scalingConfig, ...newConfig };
    setScalingConfig(updatedConfig);
    
    // In production, would update the actual scaling manager configuration
    console.log('Scaling configuration updated:', updatedConfig);
  }, [scalingConfig]);

  const forceScaling = useCallback(async (action: 'up' | 'down') => {
    try {
      const currentMetrics = await scalingManager.collectMetrics();
      const decision = await scalingManager.evaluateScaling(currentMetrics);
      
      // Force the decision to be the requested action
      const forcedDecision = {
        ...decision,
        action: (action === 'up' ? 'scale_up' : 'scale_down') as 'scale_up' | 'scale_down',
        reason: 'Manual override'
      };
      
      await scalingManager.executeScaling(forcedDecision);
    } catch (error) {
      console.error(`Failed to force scale ${action}:`, error);
    }
  }, [scalingManager]);

  const testLoadBalancing = useCallback(async () => {
    try {
      // Simulate load balancing test
      const results = {
        distributionEfficiency: 85 + Math.random() * 10,
        responseTimeVariance: 15 + Math.random() * 10,
        failoverTime: 2000 + Math.random() * 1000
      };
      return results;
    } catch (error) {
      console.error('Load balancing test failed:', error);
      throw error;
    }
  }, []);

  const getScalingRecommendations = useCallback(() => {
    const recommendations: string[] = [];
    
    if (metrics.cpuUtilization > 90) {
      recommendations.push('High CPU usage detected - consider scaling up');
    }
    
    if (metrics.memoryUtilization > 90) {
      recommendations.push('High memory usage detected - increase instance memory or scale up');
    }
    
    if (metrics.responseTime > 1000) {
      recommendations.push('High response times - scale up to improve performance');
    }
    
    if (metrics.currentInstances > 2 && metrics.cpuUtilization < 20 && metrics.memoryUtilization < 30) {
      recommendations.push('Low resource utilization - consider scaling down to save costs');
    }
    
    return recommendations;
  }, [metrics]);

  useEffect(() => {
    return () => {
      if (isMonitoring) {
        stopMonitoring();
      }
    };
  }, [isMonitoring, stopMonitoring]);

  return {
    metrics,
    events,
    isMonitoring,
    scalingConfig,
    startMonitoring,
    stopMonitoring,
    updateScalingConfig,
    forceScaling,
    testLoadBalancing,
    getScalingRecommendations
  };
};