
import React from 'react';

export class PerformanceMonitor {
  private static metrics: Array<{
    name: string;
    value: number;
    timestamp: number;
    userId?: string;
  }> = [];

  private static observers: Map<string, PerformanceObserver> = new Map();

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
      console.warn(`🐌 Slow operation detected: ${name} took ${value}ms`);
    }
  }

  static startTimer(name: string): () => number {
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
      'api.request': 5000,
      'component.render': 16, // 60fps threshold
      'route.change': 1000
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

  static initializeWebVitals() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    try {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('web-vitals.lcp', entry.startTime);
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.set('lcp', lcpObserver);

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fid = (entry as any).processingStart - entry.startTime;
          this.recordMetric('web-vitals.fid', fid);
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.set('fid', fidObserver);

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            this.recordMetric('web-vitals.cls', clsValue);
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('cls', clsObserver);

    } catch (error) {
      console.warn('Failed to initialize Web Vitals monitoring:', error);
    }
  }

  static cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.metrics = [];
  }

  static getPerformanceReport() {
    const report = {
      metrics: this.getMetrics(),
      averages: {
        componentRender: this.getAverageMetric('component.render'),
        apiRequest: this.getAverageMetric('api.request'),
        databaseQuery: this.getAverageMetric('database.query'),
        routeChange: this.getAverageMetric('route.change')
      },
      webVitals: {
        lcp: this.getAverageMetric('web-vitals.lcp'),
        fid: this.getAverageMetric('web-vitals.fid'),
        cls: this.getAverageMetric('web-vitals.cls')
      },
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    console.group('📊 Performance Report');
    console.table(report.averages);
    console.table(report.webVitals);
    console.groupEnd();

    return report;
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

// Initialize Web Vitals monitoring when module loads
if (typeof window !== 'undefined') {
  PerformanceMonitor.initializeWebVitals();
}
