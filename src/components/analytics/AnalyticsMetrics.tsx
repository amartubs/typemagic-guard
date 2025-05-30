
import React from 'react';
import MetricsCards from './MetricsCards';

interface AnalyticsMetricsProps {
  metrics: {
    successRate: number;
    avgConfidence: number;
    activeUsers: number;
    securityEvents: number;
    avgResponseTime: number;
    threatLevel: 'low' | 'medium' | 'high';
    systemUptime: number;
    authenticationsToday: number;
  };
}

const AnalyticsMetrics: React.FC<AnalyticsMetricsProps> = ({ metrics }) => {
  return <MetricsCards metrics={metrics} />;
};

export default AnalyticsMetrics;
