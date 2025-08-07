import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Server, Cpu, Database, Globe, TrendingUp, AlertTriangle, Settings, Activity } from 'lucide-react';
import { useAutoScaling } from '@/hooks/useAutoScaling';
import { useCDNIntegration } from '@/hooks/useCDNIntegration';
import { useLoadTesting } from '@/hooks/useLoadTesting';

interface InfrastructureHealth {
  database: {
    status: 'healthy' | 'warning' | 'critical';
    connections: number;
    queryTime: number;
    replicationLag: number;
  };
  cdn: {
    status: 'healthy' | 'warning' | 'critical';
    hitRate: number;
    bandwidth: number;
    regions: number;
  };
  security: {
    status: 'healthy' | 'warning' | 'critical';
    threatLevel: 'low' | 'medium' | 'high';
    blockedAttacks: number;
    lastScan: Date;
  };
}

export const ProductionScalingDashboard: React.FC = () => {
  const { 
    metrics: scalingMetrics, 
    isMonitoring, 
    scalingConfig,
    startMonitoring, 
    stopMonitoring,
    updateScalingConfig,
    forceScaling,
    getScalingRecommendations 
  } = useAutoScaling();

  const { 
    assets, 
    stats: cdnStats, 
    isOptimizing,
    optimizeAssets,
    purgeCache,
    preloadCriticalAssets 
  } = useCDNIntegration();

  const {
    status: loadTestStatus,
    results: loadTestResults,
    runLoadTest,
    testDatabaseScalability,
    testCachingPerformance,
    generateReport
  } = useLoadTesting();

  const [infrastructureHealth, setInfrastructureHealth] = useState<InfrastructureHealth>({
    database: {
      status: 'healthy',
      connections: 45,
      queryTime: 12,
      replicationLag: 0.5
    },
    cdn: {
      status: 'healthy',
      hitRate: 92,
      bandwidth: 1240,
      regions: 8
    },
    security: {
      status: 'healthy',
      threatLevel: 'low',
      blockedAttacks: 156,
      lastScan: new Date()
    }
  });

  const [isRunningCapacityTest, setIsRunningCapacityTest] = useState(false);

  useEffect(() => {
    // Start monitoring when component mounts
    if (!isMonitoring) {
      startMonitoring();
    }

    const interval = setInterval(() => {
      updateInfrastructureHealth();
    }, 15000);

    return () => {
      clearInterval(interval);
      if (isMonitoring) {
        stopMonitoring();
      }
    };
  }, []);

  const updateInfrastructureHealth = () => {
    setInfrastructureHealth(prev => ({
      database: {
        ...prev.database,
        connections: 45 + Math.floor(Math.random() * 30),
        queryTime: 10 + Math.random() * 10,
        replicationLag: Math.random() * 2
      },
      cdn: {
        ...prev.cdn,
        hitRate: 85 + Math.random() * 15,
        bandwidth: 1000 + Math.random() * 500,
      },
      security: {
        ...prev.security,
        blockedAttacks: prev.security.blockedAttacks + Math.floor(Math.random() * 5)
      }
    }));
  };

  const runCapacityTest = async () => {
    setIsRunningCapacityTest(true);
    try {
      await runLoadTest({
        testDuration: 300, // 5 minutes
        maxUsers: 1000,
        rampUpTime: 60,
        targetThroughput: 1000
      });
      
      await testDatabaseScalability();
      await testCachingPerformance();
    } catch (error) {
      console.error('Capacity test failed:', error);
    } finally {
      setIsRunningCapacityTest(false);
    }
  };

  const handleEmergencyScaling = async () => {
    await forceScaling('up');
    await optimizeAssets();
    await preloadCriticalAssets();
  };

  const getOverallHealthStatus = (): 'healthy' | 'warning' | 'critical' => {
    const statuses = [
      infrastructureHealth.database.status,
      infrastructureHealth.cdn.status,
      infrastructureHealth.security.status
    ];

    if (statuses.includes('critical')) return 'critical';
    if (statuses.includes('warning')) return 'warning';
    return 'healthy';
  };

  const scalingRecommendations = getScalingRecommendations();
  const overallHealth = getOverallHealthStatus();

  // Generate performance data for charts
  const performanceData = Array.from({ length: 20 }, (_, i) => ({
    time: `${i * 5}m`,
    cpu: scalingMetrics.cpuUtilization + Math.random() * 10 - 5,
    memory: scalingMetrics.memoryUtilization + Math.random() * 10 - 5,
    requests: scalingMetrics.requestRate + Math.random() * 100 - 50,
    responseTime: scalingMetrics.responseTime + Math.random() * 100 - 50
  }));

  const bandwidthData = Array.from({ length: 20 }, (_, i) => ({
    time: `${i * 5}m`,
    inbound: 500 + Math.random() * 300,
    outbound: 800 + Math.random() * 400,
    cached: 200 + Math.random() * 150
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold">Production Scaling Dashboard</h1>
          <Badge variant={overallHealth === 'healthy' ? "default" : overallHealth === 'warning' ? "secondary" : "destructive"}>
            {overallHealth.charAt(0).toUpperCase() + overallHealth.slice(1)}
          </Badge>
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={runCapacityTest}
            disabled={isRunningCapacityTest || loadTestStatus.isRunning}
            variant="outline"
          >
            <Activity className="w-4 h-4 mr-2" />
            {isRunningCapacityTest ? 'Testing...' : 'Capacity Test'}
          </Button>
          
          <Button
            onClick={handleEmergencyScaling}
            variant="destructive"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Emergency Scale
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Instances</p>
                <p className="text-2xl font-bold">{scalingMetrics.currentInstances}</p>
                <p className="text-xs text-muted-foreground">Target: {scalingMetrics.targetInstances}</p>
              </div>
              <Server className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">CPU Usage</p>
                <p className="text-2xl font-bold">{scalingMetrics.cpuUtilization.toFixed(1)}%</p>
              </div>
              <Cpu className="h-8 w-8 text-primary" />
            </div>
            <Progress value={scalingMetrics.cpuUtilization} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">DB Connections</p>
                <p className="text-2xl font-bold">{infrastructureHealth.database.connections}</p>
                <p className="text-xs text-muted-foreground">Query: {infrastructureHealth.database.queryTime.toFixed(1)}ms</p>
              </div>
              <Database className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">CDN Hit Rate</p>
                <p className="text-2xl font-bold">{infrastructureHealth.cdn.hitRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">{infrastructureHealth.cdn.regions} regions</p>
              </div>
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <Progress value={infrastructureHealth.cdn.hitRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Recommendations Panel */}
      {scalingRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <span>Scaling Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {scalingRecommendations.map((recommendation, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-orange-50 rounded-md">
                  <span className="text-sm">{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Monitoring */}
      <Tabs defaultValue="scaling" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scaling">Auto-Scaling</TabsTrigger>
          <TabsTrigger value="cdn">CDN Performance</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="load-testing">Load Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="scaling" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="cpu" stroke="#8884d8" name="CPU %" />
                    <Line type="monotone" dataKey="memory" stroke="#82ca9d" name="Memory %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Request Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="requests" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} name="Requests/sec" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scaling Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Min Instances</p>
                    <p className="text-lg font-bold">{scalingConfig.minInstances}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Max Instances</p>
                    <p className="text-lg font-bold">{scalingConfig.maxInstances}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Scale Up Threshold</p>
                    <p className="text-lg font-bold">{scalingConfig.scaleUpThreshold}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cooldown Period</p>
                    <p className="text-lg font-bold">{scalingConfig.cooldownPeriod}s</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button onClick={() => forceScaling('up')} size="sm" variant="outline">
                    Scale Up
                  </Button>
                  <Button onClick={() => forceScaling('down')} size="sm" variant="outline">
                    Scale Down
                  </Button>
                  <Button 
                    onClick={() => updateScalingConfig({ scaleUpThreshold: 60 })} 
                    size="sm" 
                    variant="outline"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Time Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="responseTime" stroke="#ff7300" name="Response Time (ms)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cdn" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>CDN Performance</CardTitle>
                <div className="flex space-x-2">
                  <Button onClick={optimizeAssets} disabled={isOptimizing} size="sm">
                    {isOptimizing ? 'Optimizing...' : 'Optimize Assets'}
                  </Button>
                  <Button onClick={() => purgeCache()} size="sm" variant="outline">
                    Purge Cache
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Assets</p>
                    <p className="text-lg font-bold">{cdnStats.totalAssets}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cached Assets</p>
                    <p className="text-lg font-bold">{cdnStats.cachedAssets}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Bandwidth Saved</p>
                    <p className="text-lg font-bold">{cdnStats.bandwidthSaved.toFixed(1)}MB</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Load Time</p>
                    <p className="text-lg font-bold">{cdnStats.averageLoadTime.toFixed(0)}ms</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bandwidth Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={bandwidthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="cached" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Cached" />
                    <Area type="monotone" dataKey="inbound" stackId="1" stroke="#8884d8" fill="#8884d8" name="Inbound" />
                    <Area type="monotone" dataKey="outbound" stackId="1" stroke="#ffc658" fill="#ffc658" name="Outbound" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Database Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Active Connections</span>
                    <span className="text-sm font-bold">{infrastructureHealth.database.connections}/100</span>
                  </div>
                  <Progress value={(infrastructureHealth.database.connections / 100) * 100} />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Query Performance</span>
                    <span className="text-sm font-bold">{infrastructureHealth.database.queryTime.toFixed(1)}ms</span>
                  </div>
                  <Progress value={Math.max(0, 100 - infrastructureHealth.database.queryTime * 2)} />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Replication Lag</span>
                    <span className="text-sm font-bold">{infrastructureHealth.database.replicationLag.toFixed(1)}s</span>
                  </div>
                  <Progress value={Math.max(0, 100 - infrastructureHealth.database.replicationLag * 20)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Threat Level</span>
                  <Badge variant={infrastructureHealth.security.threatLevel === 'low' ? 'default' : 'destructive'}>
                    {infrastructureHealth.security.threatLevel.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Blocked Attacks</span>
                  <span className="text-lg font-bold">{infrastructureHealth.security.blockedAttacks}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Security Scan</span>
                  <span className="text-sm">{infrastructureHealth.security.lastScan.toLocaleTimeString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button onClick={() => testDatabaseScalability()} className="w-full" size="sm">
                  Test DB Scalability
                </Button>
                <Button onClick={() => testCachingPerformance()} className="w-full" size="sm">
                  Test Cache Performance
                </Button>
                <Button onClick={() => preloadCriticalAssets()} className="w-full" size="sm">
                  Preload Critical Assets
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="load-testing" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Load Test Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadTestStatus.isRunning ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm">{loadTestStatus.progress}%</span>
                    </div>
                    <Progress value={loadTestStatus.progress} />
                    <p className="text-sm text-muted-foreground">
                      Current Phase: {loadTestStatus.currentPhase}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">No active load tests</p>
                    <Button onClick={runCapacityTest} disabled={isRunningCapacityTest}>
                      Start Comprehensive Test
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                {loadTestResults ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Peak Throughput</span>
                      <span className="text-sm font-bold">{loadTestResults.peakThroughput}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Avg Response Time</span>
                      <span className="text-sm font-bold">{loadTestResults.averageResponseTime}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Error Rate</span>
                      <span className="text-sm font-bold">{loadTestResults.errorRate.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">99th Percentile</span>
                      <span className="text-sm font-bold">{loadTestResults.p99ResponseTime}ms</span>
                    </div>
                    <Button onClick={generateReport} size="sm" className="w-full mt-4">
                      Generate Report
                    </Button>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Run a load test to see results
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};