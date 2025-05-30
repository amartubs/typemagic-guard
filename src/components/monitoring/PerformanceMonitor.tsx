
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Activity, 
  Zap, 
  Server, 
  Globe, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Cpu,
  HardDrive,
  Wifi
} from 'lucide-react';

interface PerformanceMetrics {
  responseTime: Array<{ timestamp: string; time: number; }>;
  systemHealth: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
  apiMetrics: {
    totalRequests: number;
    errorRate: number;
    averageLatency: number;
    throughput: number;
  };
  uptime: {
    current: number;
    last30Days: number;
  };
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPerformanceMetrics();
    const interval = setInterval(loadPerformanceMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadPerformanceMetrics = async () => {
    try {
      // Mock performance data - in production this would fetch from your monitoring API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMetrics({
        responseTime: [
          { timestamp: '12:00', time: 120 },
          { timestamp: '12:05', time: 95 },
          { timestamp: '12:10', time: 110 },
          { timestamp: '12:15', time: 85 },
          { timestamp: '12:20', time: 102 },
          { timestamp: '12:25', time: 88 },
          { timestamp: '12:30', time: 92 }
        ],
        systemHealth: {
          cpu: 42,
          memory: 63,
          disk: 28,
          network: 57
        },
        apiMetrics: {
          totalRequests: 3245,
          errorRate: 1.3,
          averageLatency: 94,
          throughput: 18.5
        },
        uptime: {
          current: 99.98,
          last30Days: 99.95
        }
      });
    } catch (error) {
      console.error('Error loading performance metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (value: number): string => {
    if (value < 50) return 'text-green-500';
    if (value < 80) return 'text-amber-500';
    return 'text-red-500';
  };

  const getHealthStatus = (value: number): 'healthy' | 'warning' | 'critical' => {
    if (value < 50) return 'healthy';
    if (value < 80) return 'warning';
    return 'critical';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                System Status
              </CardTitle>
              <CardDescription>
                Current system performance and health metrics
              </CardDescription>
            </div>
            <Badge
              variant={metrics?.uptime.current === 100 ? 'default' : 'secondary'}
              className="px-3 py-1"
            >
              {metrics?.uptime.current}% Uptime
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* System Health */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">CPU</span>
                </div>
                <span className={`text-sm font-bold ${getHealthColor(metrics?.systemHealth.cpu || 0)}`}>
                  {metrics?.systemHealth.cpu}%
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded overflow-hidden">
                <div 
                  className={`h-full ${
                    getHealthStatus(metrics?.systemHealth.cpu || 0) === 'critical' ? 'bg-red-500' : 
                    getHealthStatus(metrics?.systemHealth.cpu || 0) === 'warning' ? 'bg-amber-500' : 
                    'bg-green-500'
                  }`}
                  style={{ width: `${metrics?.systemHealth.cpu || 0}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Memory</span>
                </div>
                <span className={`text-sm font-bold ${getHealthColor(metrics?.systemHealth.memory || 0)}`}>
                  {metrics?.systemHealth.memory}%
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded overflow-hidden">
                <div 
                  className={`h-full ${
                    getHealthStatus(metrics?.systemHealth.memory || 0) === 'critical' ? 'bg-red-500' : 
                    getHealthStatus(metrics?.systemHealth.memory || 0) === 'warning' ? 'bg-amber-500' : 
                    'bg-green-500'
                  }`}
                  style={{ width: `${metrics?.systemHealth.memory || 0}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Disk</span>
                </div>
                <span className={`text-sm font-bold ${getHealthColor(metrics?.systemHealth.disk || 0)}`}>
                  {metrics?.systemHealth.disk}%
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded overflow-hidden">
                <div 
                  className={`h-full ${
                    getHealthStatus(metrics?.systemHealth.disk || 0) === 'critical' ? 'bg-red-500' : 
                    getHealthStatus(metrics?.systemHealth.disk || 0) === 'warning' ? 'bg-amber-500' : 
                    'bg-green-500'
                  }`}
                  style={{ width: `${metrics?.systemHealth.disk || 0}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Network</span>
                </div>
                <span className={`text-sm font-bold ${getHealthColor(metrics?.systemHealth.network || 0)}`}>
                  {metrics?.systemHealth.network}%
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded overflow-hidden">
                <div 
                  className={`h-full ${
                    getHealthStatus(metrics?.systemHealth.network || 0) === 'critical' ? 'bg-red-500' : 
                    getHealthStatus(metrics?.systemHealth.network || 0) === 'warning' ? 'bg-amber-500' : 
                    'bg-green-500'
                  }`}
                  style={{ width: `${metrics?.systemHealth.network || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Response Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            API Response Times
          </CardTitle>
          <CardDescription>
            Average response time over the last 30 minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={metrics?.responseTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis domain={[0, 'auto']} />
              <Tooltip formatter={(value) => [`${value} ms`, 'Response Time']} />
              <Line 
                type="monotone" 
                dataKey="time" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* API Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              API Metrics
            </CardTitle>
            <CardDescription>
              Key performance indicators for the API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Requests</p>
                <p className="text-2xl font-bold">{metrics?.apiMetrics.totalRequests.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Error Rate</p>
                <p className={`text-2xl font-bold ${metrics?.apiMetrics.errorRate < 2 ? 'text-green-600' : 'text-red-600'}`}>
                  {metrics?.apiMetrics.errorRate}%
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Avg. Latency</p>
                <p className="text-2xl font-bold">{metrics?.apiMetrics.averageLatency} ms</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Throughput</p>
                <p className="text-2xl font-bold">{metrics?.apiMetrics.throughput} req/s</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Uptime Status
            </CardTitle>
            <CardDescription>
              System reliability and uptime metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center p-6">
              <div className="w-32 h-32 rounded-full border-8 border-primary flex items-center justify-center mb-4">
                <span className="text-3xl font-bold">{metrics?.uptime.current}%</span>
              </div>
              <p className="text-lg font-semibold">Current Uptime</p>
              <p className="text-sm text-muted-foreground">
                30-day average: {metrics?.uptime.last30Days}%
              </p>
              <div className="flex items-center mt-2">
                {metrics?.uptime.current >= 99.9 ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                )}
                <span className="text-sm">
                  {metrics?.uptime.current >= 99.9 ? 'All systems operational' : 'Minor issues detected'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Alert */}
      <Alert className={metrics?.apiMetrics.errorRate < 2 ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}>
        {metrics?.apiMetrics.errorRate < 2 ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <AlertCircle className="h-4 w-4 text-amber-600" />
        )}
        <AlertDescription className={metrics?.apiMetrics.errorRate < 2 ? 'text-green-800' : 'text-amber-800'}>
          {metrics?.apiMetrics.errorRate < 2 
            ? 'All systems are operating normally. No performance issues detected.' 
            : 'Minor performance issues detected. The team has been notified and is working on a resolution.'
          }
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default PerformanceMonitor;
