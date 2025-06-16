import React from 'react';

export class PerformanceMonitor {
  private static metrics: Array<{
    name: string;
    value: number;
    timestamp: number;
    userId?: string;
  }> = [];

  static recordMetric(name: string, value: number, userId?: string) {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now(),
      userId
    });

    // Keep only last 1000 metrics to prevent memory issues
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }

    // Log slow operations
    if (this.isSlowOperation(name, value)) {
      console.warn(`Slow operation detected: ${name} took ${value}ms`);
    }
  }

  static startTimer(name: string): () => void {
    const startTime = performance.now();
    return () => {
      const duration = performance.now() - startTime;
      this.recordMetric(name, duration);
      return duration;
    };
  }

  static getMetrics(): Array<any> {
    return [...this.metrics];
  }

  static getAverageMetric(name: string, timeWindow: number = 5 * 60 * 1000): number {
    const cutoff = Date.now() - timeWindow;
    const relevantMetrics = this.metrics.filter(
      m => m.name === name && m.timestamp > cutoff
    );

    if (relevantMetrics.length === 0) return 0;

    const sum = relevantMetrics.reduce((acc, m) => acc + m.value, 0);
    return sum / relevantMetrics.length;
  }

  private static isSlowOperation(name: string, value: number): boolean {
    const thresholds: Record<string, number> = {
      'auth.login': 3000,
      'biometric.analysis': 2000,
      'database.query': 1000,
      'api.request': 5000
    };

    return value > (thresholds[name] || 2000);
  }

  static measureComponent<T>(
    componentName: string, 
    fn: () => T
  ): T {
    const timer = this.startTimer(`component.${componentName}`);
    try {
      const result = fn();
      timer();
      return result;
    } catch (error) {
      timer();
      throw error;
    }
  }

  static async measureAsync<T>(
    operationName: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const timer = this.startTimer(operationName);
    try {
      const result = await fn();
      timer();
      return result;
    } catch (error) {
      timer();
      throw error;
    }
  }
}

// Performance monitoring HOC
export function withPerformanceMonitoring<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) {
  return function PerformanceMonitoredComponent(props: P) {
    return PerformanceMonitor.measureComponent(
      componentName,
      () => React.createElement(WrappedComponent, props)
    );
  };
}
