
import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { useSubscription } from '@/hooks/useSubscription';
import AnalyticsHeader from './AnalyticsHeader';
import AnalyticsMetrics from './AnalyticsMetrics';
import AnalyticsTabs from './AnalyticsTabs';

const AdvancedAnalytics: React.FC = () => {
  const { user } = useAuth();
  const { canAccessFeature } = useSubscription();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [refreshing, setRefreshing] = useState(false);

  const hasAdvancedAnalytics = canAccessFeature('advancedAnalytics');

  const [analyticsData, setAnalyticsData] = useState({
    metrics: {
      successRate: 94.2,
      avgConfidence: 87.3,
      activeUsers: 1247,
      securityEvents: 23,
      avgResponseTime: 145,
      threatLevel: 'low' as const,
      systemUptime: 99.8,
      authenticationsToday: 3456
    },
    authTrends: [
      { date: '2024-01-23', successful: 45, failed: 3, suspicious: 1, avgConfidence: 89 },
      { date: '2024-01-24', successful: 52, failed: 1, suspicious: 0, avgConfidence: 91 },
      { date: '2024-01-25', successful: 38, failed: 5, suspicious: 2, avgConfidence: 85 },
      { date: '2024-01-26', successful: 61, failed: 2, suspicious: 1, avgConfidence: 93 },
      { date: '2024-01-27', successful: 49, failed: 4, suspicious: 1, avgConfidence: 88 },
      { date: '2024-01-28', successful: 55, failed: 1, suspicious: 0, avgConfidence: 92 },
      { date: '2024-01-29', successful: 43, failed: 3, suspicious: 2, avgConfidence: 87 }
    ],
    userBehavior: {
      deviceTypes: [
        { name: 'Desktop - Chrome', value: 45, risk: 'low' as const },
        { name: 'Mobile - Safari', value: 28, risk: 'low' as const },
        { name: 'Desktop - Firefox', value: 15, risk: 'medium' as const },
        { name: 'Mobile - Chrome', value: 10, risk: 'low' as const },
        { name: 'Unknown Device', value: 2, risk: 'high' as const }
      ],
      loginPatterns: [
        { hour: 0, logins: 12 }, { hour: 6, logins: 45 }, { hour: 9, logins: 156 },
        { hour: 12, logins: 134 }, { hour: 15, logins: 98 }, { hour: 18, logins: 87 },
        { hour: 21, logins: 56 }
      ],
      locationAnalysis: [
        { country: 'United States', users: 567, suspicious: 2 },
        { country: 'United Kingdom', users: 234, suspicious: 0 },
        { country: 'Germany', users: 189, suspicious: 1 },
        { country: 'Canada', users: 156, suspicious: 0 },
        { country: 'Australia', users: 101, suspicious: 3 }
      ],
      keystrokePatterns: {
        avgTypingSpeed: 67,
        consistencyScore: 84,
        uniquePatterns: 1247
      }
    },
    securityInsights: {
      insights: [
        {
          id: '1',
          type: 'threat' as const,
          severity: 'high' as const,
          title: 'Unusual Login Pattern Detected',
          description: 'Multiple failed login attempts from new geographic location detected for 5 users.',
          timestamp: '2024-01-29T10:30:00Z',
          affectedUsers: 5,
          action: 'Monitor and review'
        },
        {
          id: '2',
          type: 'improvement' as const,
          severity: 'low' as const,
          title: 'Confidence Score Improvement',
          description: 'Average confidence scores have increased by 8% over the last week.',
          timestamp: '2024-01-29T08:15:00Z'
        },
        {
          id: '3',
          type: 'anomaly' as const,
          severity: 'medium' as const,
          title: 'Keystroke Pattern Anomaly',
          description: 'Detected unusual typing patterns for user group in marketing department.',
          timestamp: '2024-01-29T07:45:00Z',
          affectedUsers: 12,
          action: 'Schedule retraining'
        }
      ],
      threatTrends: {
        current: 23,
        previous: 31,
        change: -25.8
      },
      anomalyDetection: {
        totalAnomalies: 15,
        resolvedAnomalies: 12,
        activeThreats: 3,
        riskScore: 35
      }
    },
    reportTemplates: [
      {
        id: 'security-weekly',
        name: 'Weekly Security Report',
        description: 'Comprehensive security analysis with threat detection and user behavior insights',
        type: 'security' as const,
        frequency: 'weekly' as const,
        lastGenerated: '2024-01-22T00:00:00Z',
        status: 'active' as const
      },
      {
        id: 'performance-daily',
        name: 'Daily Performance Metrics',
        description: 'System performance, response times, and uptime statistics',
        type: 'performance' as const,
        frequency: 'daily' as const,
        lastGenerated: '2024-01-29T00:00:00Z',
        status: 'active' as const
      },
      {
        id: 'user-behavior-monthly',
        name: 'Monthly User Behavior Analysis',
        description: 'Detailed analysis of user authentication patterns and device usage',
        type: 'user_behavior' as const,
        frequency: 'monthly' as const,
        lastGenerated: '2024-01-01T00:00:00Z',
        status: 'active' as const
      },
      {
        id: 'compliance-quarterly',
        name: 'Quarterly Compliance Report',
        description: 'GDPR, SOC2, and other compliance metrics and audit trail',
        type: 'compliance' as const,
        frequency: 'custom' as const,
        lastGenerated: '2024-01-01T00:00:00Z',
        status: 'inactive' as const
      }
    ]
  });

  useEffect(() => {
    if (hasAdvancedAnalytics) {
      loadAnalyticsData();
    } else {
      setLoading(false);
    }
  }, [hasAdvancedAnalytics, timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Data is already set in state above
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
  };

  const handleGenerateReport = (templateId: string, config: any) => {
    console.log('Generating report:', templateId, config);
    // Implementation would trigger report generation
  };

  const handleCreateTemplate = () => {
    console.log('Creating new report template');
    // Implementation would open template creation dialog
  };

  if (!hasAdvancedAnalytics) {
    return (
      <div className="text-center py-8">
        <div className="max-w-md mx-auto">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Premium Feature</h3>
          <p className="text-muted-foreground">
            Advanced analytics are available for Professional and Enterprise subscribers.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnalyticsHeader
        timeRange={timeRange}
        refreshing={refreshing}
        onTimeRangeChange={setTimeRange}
        onRefresh={handleRefresh}
      />

      <AnalyticsMetrics metrics={analyticsData.metrics} />

      <AnalyticsTabs
        timeRange={timeRange}
        analyticsData={analyticsData}
        onGenerateReport={handleGenerateReport}
        onCreateTemplate={handleCreateTemplate}
      />
    </div>
  );
};

export default AdvancedAnalytics;
