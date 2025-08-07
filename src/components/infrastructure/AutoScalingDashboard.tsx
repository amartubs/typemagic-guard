import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Server, 
  TrendingUp, 
  Activity, 
  AlertTriangle, 
  Settings, 
  RefreshCw,
  Cpu,
  MemoryStick,
  HardDrive
} from 'lucide-react';
import { AutoScalingManager } from '@/lib/infrastructure/AutoScalingManager';

interface ScalingMetrics {
  currentInstances: number;
  targetInstances: number;
  cpuUtilization: number;
  memoryUtilization: number;
  requestsPerSecond: number;
  averageResponseTime: number;
  scalingEvents: Array<{
    timestamp: string;
    action: 'scale_up' | 'scale_down';
    reason: string;
    instanceCount: number;
  }>;
  healthStatus: 'healthy' | 'degraded' | 'critical';
}

export const AutoScalingDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<ScalingMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [configuring, setConfiguring] = useState(false);

  useEffect(() => {
    loadScalingMetrics();
    const interval = setInterval(loadScalingMetrics, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadScalingMetrics = async () => {
    try {
      const scalingManager = AutoScalingManager.getInstance();
      const scalingStatus = await scalingManager.getScalingStatus();
      const currentMetrics = await scalingManager.collectMetrics();
      
      setMetrics({
        currentInstances: scalingStatus.currentInstances,
        targetInstances: scalingStatus.currentInstances,
        cpuUtilization: currentMetrics.cpuUtilization,
        memoryUtilization: currentMetrics.memoryUtilization,
        requestsPerSecond: currentMetrics.requestsPerSecond,
        averageResponseTime: currentMetrics.responseTime,
        scalingEvents: [],
        healthStatus: currentMetrics.errorRate < 0.01 ? 'healthy' : currentMetrics.errorRate < 0.05 ? 'degraded' : 'critical'
      });
    } catch (error) {
      console.error('Failed to load scaling metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigureScaling = async () => {
    setConfiguring(true);
    try {
      const scalingManager = AutoScalingManager.getInstance();
      
      // Configure auto-scaling by triggering a scaling evaluation
      const currentMetrics = await scalingManager.collectMetrics();
      await scalingManager.evaluateScaling(currentMetrics);
      
      await loadScalingMetrics();
    } catch (error) {
      console.error('Scaling configuration failed:', error);
    } finally {
      setConfiguring(false);
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return <Badge className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'degraded': return <Badge variant="secondary">Degraded</Badge>;
      case 'critical': return <Badge variant="destructive">Critical</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Auto-Scaling Management</h2>
          <p className="text-muted-foreground">Monitor and configure automatic infrastructure scaling</p>
        </div>
        <div className="flex items-center gap-2">
          {metrics && getHealthStatusBadge(metrics.healthStatus)}
          <Button onClick={handleConfigureScaling} disabled={configuring}>
            {configuring ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Configuring...
              </>
            ) : (
              <>
                <Settings className="mr-2 h-4 w-4" />
                Configure
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Instances</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.currentInstances}</div>
            <p className="text-xs text-muted-foreground">
              Target: {metrics?.targetInstances}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Utilization</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.cpuUtilization.toFixed(1)}%</div>
            <Progress value={metrics?.cpuUtilization} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.memoryUtilization.toFixed(1)}%</div>
            <Progress value={metrics?.memoryUtilization} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.averageResponseTime.toFixed(0)}ms</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.requestsPerSecond.toFixed(0)} req/s
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Scaling Events</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Status</span>
                  <span className={`text-sm font-medium ${getHealthStatusColor(metrics?.healthStatus || 'unknown')}`}>
                    {metrics?.healthStatus.toUpperCase()}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CPU Utilization</span>
                    <span>{metrics?.cpuUtilization.toFixed(1)}%</span>
                  </div>
                  <Progress value={metrics?.cpuUtilization} />
                  <div className="flex justify-between text-sm">
                    <span>Memory Utilization</span>
                    <span>{metrics?.memoryUtilization.toFixed(1)}%</span>
                  </div>
                  <Progress value={metrics?.memoryUtilization} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{metrics?.requestsPerSecond.toFixed(0)}</div>
                    <p className="text-sm text-muted-foreground">Requests per Second</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{metrics?.averageResponseTime.toFixed(0)}ms</div>
                    <p className="text-sm text-muted-foreground">Average Response Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Scaling Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics?.scalingEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {event.action === 'scale_up' ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-blue-600 rotate-180" />
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {event.action === 'scale_up' ? 'Scaled Up' : 'Scaled Down'}
                        </p>
                        <p className="text-xs text-muted-foreground">{event.reason}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{event.instanceCount} instances</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )) || (
                  <p className="text-center text-muted-foreground py-4">No recent scaling events</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scaling Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Instance Limits</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Minimum Instances:</span>
                      <span>2</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Maximum Instances:</span>
                      <span>50</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Scaling Thresholds</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>CPU Scale-up:</span>
                      <span>80%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CPU Scale-down:</span>
                      <span>30%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};