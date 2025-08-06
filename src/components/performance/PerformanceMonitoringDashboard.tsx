import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { useLoadTesting } from '@/hooks/useLoadTesting';
import { Activity, Zap, Database, Server, AlertTriangle, CheckCircle } from 'lucide-react';

export const PerformanceMonitoringDashboard: React.FC = () => {
  const {
    metrics,
    alerts,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    getPerformanceScore
  } = usePerformanceMonitoring();

  const {
    status: loadTestStatus,
    results: loadTestResults,
    error: loadTestError,
    runLoadTest,
    testDatabaseScalability,
    testCachingPerformance,
    testHorizontalScaling
  } = useLoadTesting();

  const performanceScore = getPerformanceScore();
  const hasAlerts = Object.values(alerts).some(alert => alert);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Performance Monitoring</h2>
          <p className="text-muted-foreground">
            Real-time metrics and load testing for 100K+ user scalability
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            variant={isMonitoring ? "destructive" : "default"}
          >
            <Activity className="w-4 h-4 mr-2" />
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </Button>
        </div>
      </div>

      {/* Performance Score & Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
            {hasAlerts ? (
              <AlertTriangle className="h-4 w-4 text-destructive" />
            ) : (
              <CheckCircle className="h-4 w-4 text-primary" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceScore}/100</div>
            <Progress value={performanceScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Target: {">"}90 for production ready
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant={alerts.responseTimeThreshold ? "destructive" : "secondary"}>
                Response Time: {metrics.averageResponseTime.toFixed(1)}ms
              </Badge>
              <Badge variant={alerts.highMemoryUsage ? "destructive" : "secondary"}>
                Memory: {metrics.memoryUsage.toFixed(1)}%
              </Badge>
              <Badge variant={alerts.errorSpikes > 0 ? "destructive" : "secondary"}>
                Error Rate: {metrics.errorRate.toFixed(2)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageResponseTime.toFixed(1)}ms</div>
            <p className="text-xs text-muted-foreground">
              Target: {"<"}50ms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">P95 Response Time</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.p95ResponseTime.toFixed(1)}ms</div>
            <p className="text-xs text-muted-foreground">
              95th percentile
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requests/Second</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.requestsPerSecond.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              Current throughput
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.cacheHitRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Redis cache efficiency
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Load Testing Section */}
      <Card>
        <CardHeader>
          <CardTitle>Load Testing & Scalability</CardTitle>
          <CardDescription>
            Validate 100K+ concurrent user capacity and infrastructure scalability
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadTestStatus.isRunning && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Load Test Progress ({loadTestStatus.currentPhase})
                </span>
                <span className="text-sm text-muted-foreground">
                  {loadTestStatus.progress}%
                </span>
              </div>
              <Progress value={loadTestStatus.progress} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            <Button
              onClick={() => runLoadTest()}
              disabled={loadTestStatus.isRunning}
              className="w-full"
            >
              <Server className="w-4 h-4 mr-2" />
              Full Load Test
            </Button>
            <Button
              onClick={testDatabaseScalability}
              disabled={loadTestStatus.isRunning}
              variant="outline"
              className="w-full"
            >
              <Database className="w-4 h-4 mr-2" />
              Database Test
            </Button>
            <Button
              onClick={testCachingPerformance}
              disabled={loadTestStatus.isRunning}
              variant="outline"
              className="w-full"
            >
              <Zap className="w-4 h-4 mr-2" />
              Cache Test
            </Button>
            <Button
              onClick={testHorizontalScaling}
              disabled={loadTestStatus.isRunning}
              variant="outline"
              className="w-full"
            >
              <Activity className="w-4 h-4 mr-2" />
              Scaling Test
            </Button>
          </div>

          {loadTestError && (
            <div className="p-3 border border-destructive/20 bg-destructive/10 rounded">
              <p className="text-sm text-destructive">{loadTestError}</p>
            </div>
          )}

          {loadTestResults && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="p-3 border rounded">
                <h4 className="font-medium">Peak Capacity</h4>
                <p className="text-2xl font-bold">{loadTestResults.maxConcurrentUsers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Concurrent users</p>
              </div>
              <div className="p-3 border rounded">
                <h4 className="font-medium">Peak Throughput</h4>
                <p className="text-2xl font-bold">{loadTestResults.peakThroughput.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">Requests/second</p>
              </div>
              <div className="p-3 border rounded">
                <h4 className="font-medium">Error Rate</h4>
                <p className="text-2xl font-bold">{(loadTestResults.errorRate * 100).toFixed(2)}%</p>
                <p className="text-xs text-muted-foreground">Under peak load</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};