
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, Settings } from 'lucide-react';
import RealTimeMetrics from './RealTimeMetrics';
import UptimeTracker from './UptimeTracker';
import AlertsPanel from './AlertsPanel';

interface AlertItem {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
}

interface MetricData {
  timestamp: string;
  cpuUsage: number;
  memoryUsage: number;
  responseTime: number;
  requestCount: number;
}

interface Service {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  uptime: number;
  lastIncident?: string;
}

interface UptimeData {
  date: string;
  uptime: number;
  incidents: number;
}

const PerformanceMonitor: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [realTimeData, setRealTimeData] = useState<MetricData[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [uptimeHistory, setUptimeHistory] = useState<UptimeData[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState({
    cpu: 42,
    memory: 63,
    activeConnections: 127,
    requestsPerSecond: 18.5
  });

  useEffect(() => {
    loadInitialData();
    const interval = setInterval(updateRealTimeData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Initialize real-time data
      const initialData: MetricData[] = [];
      for (let i = 29; i >= 0; i--) {
        const timestamp = new Date(Date.now() - i * 60000).toISOString();
        initialData.push({
          timestamp,
          cpuUsage: Math.random() * 30 + 20,
          memoryUsage: Math.random() * 40 + 30,
          responseTime: Math.random() * 50 + 80,
          requestCount: Math.floor(Math.random() * 20 + 10)
        });
      }
      setRealTimeData(initialData);

      // Initialize services
      setServices([
        {
          id: '1',
          name: 'Authentication API',
          status: 'operational',
          uptime: 99.98,
          lastIncident: '2024-01-15'
        },
        {
          id: '2',
          name: 'Biometric Processing',
          status: 'operational',
          uptime: 99.95,
        },
        {
          id: '3',
          name: 'Database',
          status: 'operational',
          uptime: 100.0,
        },
        {
          id: '4',
          name: 'File Storage',
          status: 'degraded',
          uptime: 99.2,
          lastIncident: '2024-01-28'
        }
      ]);

      // Initialize uptime history
      const history: UptimeData[] = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        history.push({
          date: date.toISOString().split('T')[0],
          uptime: Math.random() * 1 + 99,
          incidents: Math.random() > 0.9 ? Math.floor(Math.random() * 3) : 0
        });
      }
      setUptimeHistory(history);

      // Initialize alerts
      setAlerts([
        {
          id: '1',
          type: 'warning',
          title: 'High Memory Usage',
          description: 'Memory usage has exceeded 80% for the past 5 minutes',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          resolved: false
        },
        {
          id: '2',
          type: 'info',
          title: 'Scheduled Maintenance',
          description: 'Database maintenance window scheduled for tonight at 2:00 AM',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          resolved: false
        }
      ]);

    } catch (error) {
      console.error('Error loading performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRealTimeData = () => {
    setRealTimeData(prev => {
      const newData = [...prev.slice(1)]; // Remove oldest point
      const timestamp = new Date().toISOString();
      
      // Add new data point
      newData.push({
        timestamp,
        cpuUsage: Math.random() * 30 + 20,
        memoryUsage: Math.random() * 40 + 30,
        responseTime: Math.random() * 50 + 80,
        requestCount: Math.floor(Math.random() * 20 + 10)
      });

      return newData;
    });

    // Update current metrics
    setCurrentMetrics({
      cpu: Math.floor(Math.random() * 30 + 20),
      memory: Math.floor(Math.random() * 40 + 30),
      activeConnections: Math.floor(Math.random() * 50 + 100),
      requestsPerSecond: Math.floor(Math.random() * 10 + 15)
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const handleDismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, resolved: true } : alert
      )
    );
  };

  const handleExportMetrics = () => {
    const data = {
      timestamp: new Date().toISOString(),
      metrics: currentMetrics,
      recentData: realTimeData.slice(-10),
      services: services,
      alerts: alerts.filter(alert => !alert.resolved)
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-metrics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const overallUptime = services.reduce((sum, service) => sum + service.uptime, 0) / services.length;

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
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Performance Monitor
                <Badge variant="default" className="ml-2">
                  Live
                </Badge>
              </CardTitle>
              <CardDescription>
                Real-time system performance, uptime tracking, and alert management
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExportMetrics}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Monitoring Tabs */}
      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="metrics">Real-time Metrics</TabsTrigger>
          <TabsTrigger value="uptime">Uptime & Status</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <RealTimeMetrics data={realTimeData} currentMetrics={currentMetrics} />
        </TabsContent>

        <TabsContent value="uptime" className="space-y-4">
          <UptimeTracker 
            services={services}
            uptimeHistory={uptimeHistory}
            overallUptime={overallUptime}
          />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <AlertsPanel 
            alerts={alerts}
            onDismissAlert={handleDismissAlert}
            onResolveAlert={handleResolveAlert}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceMonitor;
