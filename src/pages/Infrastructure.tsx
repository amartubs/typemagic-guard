import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CDNIntegration } from '@/components/infrastructure/CDNIntegration';
import { AutoScalingDashboard } from '@/components/infrastructure/AutoScalingDashboard';
import { PerformanceMonitoringDashboard } from '@/components/performance/PerformanceMonitoringDashboard';
import { IntegrationStatus } from '@/components/integration/IntegrationStatus';
import SEOHead from '@/components/seo/SEOHead';

const Infrastructure: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Infrastructure Management"
        description="Monitor and manage production infrastructure including CDN, auto-scaling, and performance metrics"
      />
      
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Infrastructure Management</h1>
          <p className="text-muted-foreground">
            Monitor and optimize your production infrastructure for maximum performance and reliability.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cdn">CDN Management</TabsTrigger>
            <TabsTrigger value="scaling">Auto-Scaling</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <IntegrationStatus />
          </TabsContent>

          <TabsContent value="cdn" className="space-y-6">
            <CDNIntegration />
          </TabsContent>

          <TabsContent value="scaling" className="space-y-6">
            <AutoScalingDashboard />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceMonitoringDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Infrastructure;