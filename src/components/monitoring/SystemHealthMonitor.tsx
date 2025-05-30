
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Database, 
  Server,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Zap
} from 'lucide-react';

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  target?: number;
}

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  uptime: number;
  responseTime: number;
  lastCheck: string;
}

const SystemHealthMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    { name: 'CPU Usage', value: 45, unit: '%', status: 'healthy', trend: 'stable', target: 80 },
    { name: 'Memory Usage', value: 62, unit: '%', status: 'healthy', trend: 'up', target: 85 },
    { name: 'Disk Usage', value: 78, unit: '%', status: 'warning', trend: 'up', target: 90 },
    { name: 'Network I/O', value: 234, unit: 'MB/s', status: 'healthy', trend: 'down' },
    { name: 'Active Connections', value: 1247, unit: '', status: 'healthy', trend: 'stable', target: 2000 },
    { name: 'Queue Depth', value: 12, unit: 'items', status: 'healthy', trend: 'down', target: 100 }
  ]);

  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'API Gateway', status: 'operational', uptime: 99.98, responseTime: 45, lastCheck: '2024-01-15T14:30:00Z' },
    { name: 'Authentication Service', status: 'operational', uptime: 99.95, responseTime: 52, lastCheck: '2024-01-15T14:30:00Z' },
    { name: 'Database', status: 'operational', uptime: 99.99, responseTime: 23, lastCheck: '2024-01-15T14:30:00Z' },
    { name: 'Biometric Processor', status: 'degraded', uptime: 98.45, responseTime: 156, lastCheck: '2024-01-15T14:30:00Z' },
    { name: 'Analytics Engine', status: 'operational', uptime: 99.87, responseTime: 78, lastCheck: '2024-01-15T14:30:00Z' },
    { name: 'File Storage', status: 'operational', uptime: 99.92, responseTime: 34, lastCheck: '2024-01-15T14:30:00Z' }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, metric.value + (Math.random() - 0.5) * 5),
        trend: Math.random() > 0.7 ? (Math.random() > 0.5 ? 'up' : 'down') : 'stable'
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'outage':
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      operational: 'default',
      healthy: 'default',
      degraded: 'secondary',
      warning: 'secondary',
      outage: 'destructive',
      critical: 'destructive'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>{status}</Badge>;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-red-500" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-green-500" />;
      default:
        return <Activity className="h-3 w-3 text-gray-500" />;
    }
  };

  const overallHealth = Math.round(
    (metrics.filter(m => m.status === 'healthy').length / metrics.length) * 100
  );

  const criticalServices = services.filter(s => s.status === 'outage').length;
  const degradedServices = services.filter(s => s.status === 'degraded').length;

  return (
    <div className="space-y-6">
      {/* Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Health</p>
                <p className="text-2xl font-bold">{overallHealth}%</p>
              </div>
              <Activity className={`h-8 w-8 ${overallHealth > 90 ? 'text-green-500' : overallHealth > 70 ? 'text-yellow-500' : 'text-red-500'}`} />
            </div>
            <Progress value={overallHealth} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Services Online</p>
                <p className="text-2xl font-bold text-green-500">
                  {services.filter(s => s.status === 'operational').length}/{services.length}
                </p>
              </div>
              <Server className="h-8 w-8 text-green-500" />
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {degradedServices > 0 && `${degradedServices} degraded`}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold">
                  {Math.round(services.reduce((sum, s) => sum + s.responseTime, 0) / services.length)}ms
                </p>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-1 text-sm">
              <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">-15ms from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Uptime</p>
                <p className="text-2xl font-bold text-green-500">99.97%</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Last 30 days
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Monitoring */}
      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="metrics">System Metrics</TabsTrigger>
          <TabsTrigger value="services">Service Status</TabsTrigger>
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-primary" />
                Real-time System Metrics
              </CardTitle>
              <CardDescription>
                Live monitoring of critical system resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {metrics.map((metric, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{metric.name}</h4>
                        {getTrendIcon(metric.trend)}
                      </div>
                      {getStatusIcon(metric.status)}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">
                          {Math.round(metric.value)}{metric.unit}
                        </span>
                        {getStatusBadge(metric.status)}
                      </div>
                      
                      {metric.target && (
                        <div className="space-y-1">
                          <Progress 
                            value={(metric.value / metric.target) * 100} 
                            className="h-2"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Current</span>
                            <span>Target: {metric.target}{metric.unit}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                Service Health Status
              </CardTitle>
              <CardDescription>
                Monitoring of all critical services and dependencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(service.status)}
                          <div>
                            <h4 className="font-medium">{service.name}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span>Uptime: {service.uptime}%</span>
                              <span>Response: {service.responseTime}ms</span>
                              <span>Last check: {new Date(service.lastCheck).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(service.status)}
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <Progress value={service.uptime} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Active System Alerts
              </CardTitle>
              <CardDescription>
                Current system alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Critical:</strong> Biometric Processor response time exceeding 150ms threshold
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Warning:</strong> Disk usage approaching 80% capacity on primary storage
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <Activity className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Info:</strong> Scheduled maintenance window begins in 2 hours
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemHealthMonitor;
