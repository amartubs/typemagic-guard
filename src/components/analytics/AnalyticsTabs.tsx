
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthenticationTrendsChart from './AuthenticationTrendsChart';
import UserBehaviorAnalysis from './UserBehaviorAnalysis';
import SecurityInsights from './SecurityInsights';
import CustomReports from './CustomReports';

interface AnalyticsTabsProps {
  timeRange: string;
  analyticsData: {
    authTrends: Array<{
      date: string;
      successful: number;
      failed: number;
      suspicious: number;
      avgConfidence: number;
    }>;
    userBehavior: {
      deviceTypes: Array<{ name: string; value: number; risk: 'low' | 'medium' | 'high' }>;
      loginPatterns: Array<{ hour: number; logins: number }>;
      locationAnalysis: Array<{ country: string; users: number; suspicious: number }>;
      keystrokePatterns: {
        avgTypingSpeed: number;
        consistencyScore: number;
        uniquePatterns: number;
      };
    };
    securityInsights: {
      insights: Array<{
        id: string;
        type: 'threat' | 'improvement' | 'anomaly' | 'recommendation';
        severity: 'low' | 'medium' | 'high' | 'critical';
        title: string;
        description: string;
        timestamp: string;
        affectedUsers?: number;
        action?: string;
      }>;
      threatTrends: {
        current: number;
        previous: number;
        change: number;
      };
      anomalyDetection: {
        totalAnomalies: number;
        resolvedAnomalies: number;
        activeThreats: number;
        riskScore: number;
      };
    };
    reportTemplates: Array<{
      id: string;
      name: string;
      description: string;
      type: 'security' | 'performance' | 'user_behavior' | 'compliance';
      frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
      lastGenerated: string;
      status: 'active' | 'inactive';
    }>;
  };
  onGenerateReport: (templateId: string, config: any) => void;
  onCreateTemplate: () => void;
}

const AnalyticsTabs: React.FC<AnalyticsTabsProps> = ({
  timeRange,
  analyticsData,
  onGenerateReport,
  onCreateTemplate
}) => {
  return (
    <Tabs defaultValue="trends" className="space-y-4">
      <TabsList>
        <TabsTrigger value="trends">Authentication Trends</TabsTrigger>
        <TabsTrigger value="behavior">User Behavior</TabsTrigger>
        <TabsTrigger value="security">Security Insights</TabsTrigger>
        <TabsTrigger value="reports">Custom Reports</TabsTrigger>
      </TabsList>

      <TabsContent value="trends" className="space-y-4">
        <AuthenticationTrendsChart 
          data={analyticsData.authTrends} 
          timeRange={timeRange}
        />
      </TabsContent>

      <TabsContent value="behavior" className="space-y-4">
        <UserBehaviorAnalysis data={analyticsData.userBehavior} />
      </TabsContent>

      <TabsContent value="security" className="space-y-4">
        <SecurityInsights 
          insights={analyticsData.securityInsights.insights}
          threatTrends={analyticsData.securityInsights.threatTrends}
          anomalyDetection={analyticsData.securityInsights.anomalyDetection}
        />
      </TabsContent>

      <TabsContent value="reports" className="space-y-4">
        <CustomReports 
          templates={analyticsData.reportTemplates}
          onGenerateReport={onGenerateReport}
          onCreateTemplate={onCreateTemplate}
        />
      </TabsContent>
    </Tabs>
  );
};

export default AnalyticsTabs;
