import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCDNIntegration } from '@/hooks/useCDNIntegration';
import { useAutoScaling } from '@/hooks/useAutoScaling';
import { 
  Database, 
  Zap, 
  Server, 
  Activity, 
  TrendingUp, 
  Globe, 
  HardDrive,
  Cpu,
  MemoryStick,
  Network
} from 'lucide-react';

export const ProductionReadinessDashboard: React.FC = () => {
  const {
    assets: cdnAssets,
    stats: cdnStats,
    isOptimizing,
    optimizeAssets,
    purgeCache,
    preloadCriticalAssets
  } = useCDNIntegration();

  const {
    metrics: scalingMetrics,
    events: scalingEvents,
    isMonitoring: scalingMonitoring,
    scalingConfig,
    startMonitoring: startScalingMonitoring,
    stopMonitoring: stopScalingMonitoring,
    forceScaling,
    getScalingRecommendations
  } = useAutoScaling();

  const recommendations = getScalingRecommendations();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Production Readiness</h2>
        <p className="text-muted-foreground">
          Database optimization, CDN deployment, and auto-scaling for 100K+ users
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Optimization</CardTitle>
            <Database className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">✓ Complete</div>
            <p className="text-xs text-muted-foreground">
              Performance indexes applied
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CDN Integration</CardTitle>
            <Globe className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {cdnStats.cachedAssets}/{cdnStats.totalAssets}
            </div>
            <p className="text-xs text-muted-foreground">
              Assets cached
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-Scaling</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {scalingMetrics.currentInstances}/{scalingConfig.maxInstances}
            </div>
            <p className="text-xs text-muted-foreground">
              Active instances
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="database" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="cdn">CDN</TabsTrigger>
          <TabsTrigger value="scaling">Auto-Scaling</TabsTrigger>
        </TabsList>

        {/* Database Tab */}
        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Database Optimization Status
              </CardTitle>
              <CardDescription>
                Performance indexes and optimization applied for {"<"}50ms response times
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Applied Optimizations:</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <Badge variant="secondary" className="w-2 h-2 p-0 bg-primary" />
                      Biometric profiles indexes
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="secondary" className="w-2 h-2 p-0 bg-primary" />
                      Keystroke patterns optimization
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="secondary" className="w-2 h-2 p-0 bg-primary" />
                      Authentication attempts indexing
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="secondary" className="w-2 h-2 p-0 bg-primary" />
                      Multi-modal auth indexes
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="secondary" className="w-2 h-2 p-0 bg-primary" />
                      Performance monitoring functions
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Performance Targets:</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Query Response Time</span>
                      <span className="text-primary font-medium">{"<"}50ms</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Index Coverage</span>
                      <span className="text-primary font-medium">100%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Concurrent Users</span>
                      <span className="text-primary font-medium">100K+</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CDN Tab */}
        <TabsContent value="cdn" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                CDN Asset Optimization
              </CardTitle>
              <CardDescription>
                Static asset optimization and global content delivery
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{cdnStats.totalAssets}</div>
                  <div className="text-sm text-muted-foreground">Total Assets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{cdnStats.cachedAssets}</div>
                  <div className="text-sm text-muted-foreground">Cached</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{cdnStats.bandwidthSaved.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Bandwidth Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{cdnStats.averageLoadTime.toFixed(0)}ms</div>
                  <div className="text-sm text-muted-foreground">Avg Load Time</div>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={optimizeAssets}
                  disabled={isOptimizing}
                  className="flex-1 min-w-[120px]"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {isOptimizing ? 'Optimizing...' : 'Optimize Assets'}
                </Button>
                <Button
                  onClick={preloadCriticalAssets}
                  variant="outline"
                  className="flex-1 min-w-[120px]"
                >
                  <HardDrive className="w-4 h-4 mr-2" />
                  Preload Critical
                </Button>
                <Button
                  onClick={() => purgeCache()}
                  variant="outline"
                  className="flex-1 min-w-[120px]"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Purge Cache
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Auto-Scaling Tab */}
        <TabsContent value="scaling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                Auto-Scaling Infrastructure
              </CardTitle>
              <CardDescription>
                Automatic horizontal scaling for 100K+ concurrent users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Resource Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    <span className="text-sm font-medium">CPU Usage</span>
                  </div>
                  <Progress value={scalingMetrics.cpuUtilization} className="h-2" />
                  <div className="text-right text-sm text-muted-foreground">
                    {scalingMetrics.cpuUtilization.toFixed(1)}%
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MemoryStick className="w-4 h-4" />
                    <span className="text-sm font-medium">Memory Usage</span>
                  </div>
                  <Progress value={scalingMetrics.memoryUtilization} className="h-2" />
                  <div className="text-right text-sm text-muted-foreground">
                    {scalingMetrics.memoryUtilization.toFixed(1)}%
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Network className="w-4 h-4" />
                    <span className="text-sm font-medium">Response Time</span>
                  </div>
                  <Progress value={Math.min(100, scalingMetrics.responseTime / 10)} className="h-2" />
                  <div className="text-right text-sm text-muted-foreground">
                    {scalingMetrics.responseTime.toFixed(0)}ms
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={scalingMonitoring ? stopScalingMonitoring : startScalingMonitoring}
                  variant={scalingMonitoring ? "destructive" : "default"}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  {scalingMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
                </Button>
                <Button
                  onClick={() => forceScaling('up')}
                  variant="outline"
                  disabled={!scalingMonitoring}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Force Scale Up
                </Button>
                <Button
                  onClick={() => forceScaling('down')}
                  variant="outline"
                  disabled={!scalingMonitoring || scalingMetrics.currentInstances <= 1}
                >
                  Scale Down
                </Button>
              </div>

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div className="p-3 border border-primary/20 bg-primary/5 rounded">
                  <h4 className="font-medium mb-2">Scaling Recommendations:</h4>
                  <ul className="space-y-1 text-sm">
                    {recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Badge variant="secondary" className="w-2 h-2 p-0 bg-primary mt-1.5" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};