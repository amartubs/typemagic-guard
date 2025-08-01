
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComplianceDashboard } from '@/components/compliance/ComplianceDashboard';
import { SessionMonitoringDashboard } from '@/components/monitoring/SessionMonitoringDashboard';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Shield, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Database
} from 'lucide-react';

interface SystemMetrics {
  totalUsers: number;
  activeProfiles: number;
  learningProfiles: number;
  lockedProfiles: number;
  avgConfidenceScore: number;
  fraudDetections: number;
  systemUptime: number;
  dataProcessed: number;
}

interface SecurityAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  status: 'active' | 'resolved';
}

const AdminDashboard = () => {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: fetchSystemMetrics,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['security-alerts'],
    queryFn: fetchSecurityAlerts,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  if (metricsLoading || alertsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Users"
          value={metrics?.totalUsers || 0}
          icon={<Users className="h-4 w-4" />}
          description="Registered users"
        />
        <MetricCard
          title="Active Profiles"
          value={metrics?.activeProfiles || 0}
          icon={<Shield className="h-4 w-4" />}
          description="Verified biometric profiles"
        />
        <MetricCard
          title="Learning Profiles"
          value={metrics?.learningProfiles || 0}
          icon={<Activity className="h-4 w-4" />}
          description="Profiles in training"
        />
        <MetricCard
          title="Fraud Detections"
          value={metrics?.fraudDetections || 0}
          icon={<AlertTriangle className="h-4 w-4" />}
          description="Blocked attempts today"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              System Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Average Confidence Score</span>
                <span>{metrics?.avgConfidenceScore || 0}%</span>
              </div>
              <Progress value={metrics?.avgConfidenceScore || 0} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>System Uptime</span>
                <span>{metrics?.systemUptime || 0}%</span>
              </div>
              <Progress value={metrics?.systemUptime || 0} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Data Processed Today</span>
              <span className="font-medium">{metrics?.dataProcessed || 0} MB</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Security Alerts
            </CardTitle>
            <CardDescription>Recent security events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {alerts && alerts.length > 0 ? (
                alerts.slice(0, 5).map((alert) => (
                  <Alert key={alert.id} className={getAlertClassName(alert.severity)}>
                    <AlertDescription className="flex items-center justify-between">
                      <span className="text-sm">{alert.description}</span>
                      <Badge variant={alert.status === 'active' ? 'destructive' : 'secondary'}>
                        {alert.status}
                      </Badge>
                    </AlertDescription>
                  </Alert>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p>No active security alerts</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="monitoring">Session Monitor</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="security">Security Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {metrics?.activeProfiles || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {metrics?.learningProfiles || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Learning</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {metrics?.lockedProfiles || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Locked</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="compliance">
          <ComplianceDashboard />
        </TabsContent>
        
        <TabsContent value="monitoring">
          <SessionMonitoringDashboard />
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and profiles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                User management interface coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Event Logs</CardTitle>
              <CardDescription>Detailed security event history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Security logs interface coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, description }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value.toLocaleString()}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const getAlertClassName = (severity: string): string => {
  switch (severity) {
    case 'critical':
      return 'border-red-500 bg-red-50';
    case 'high':
      return 'border-orange-500 bg-orange-50';
    case 'medium':
      return 'border-yellow-500 bg-yellow-50';
    case 'low':
    default:
      return 'border-blue-500 bg-blue-50';
  }
};

async function fetchSystemMetrics(): Promise<SystemMetrics> {
  try {
    // Fetch total users
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Fetch profile statistics
    const { data: profiles } = await supabase
      .from('biometric_profiles')
      .select('status, confidence_score');

    const activeProfiles = profiles?.filter(p => p.status === 'active').length || 0;
    const learningProfiles = profiles?.filter(p => p.status === 'learning').length || 0;
    const lockedProfiles = profiles?.filter(p => p.status === 'locked').length || 0;

    const avgConfidenceScore = profiles?.length ? 
      profiles.reduce((sum, p) => sum + (p.confidence_score || 0), 0) / profiles.length : 0;

    // Mock data for other metrics (would be replaced with real queries)
    return {
      totalUsers: totalUsers || 0,
      activeProfiles,
      learningProfiles,
      lockedProfiles,
      avgConfidenceScore: Math.round(avgConfidenceScore),
      fraudDetections: 3, // Mock data
      systemUptime: 99.9, // Mock data
      dataProcessed: 1247 // Mock data
    };
  } catch (error) {
    console.error('Error fetching system metrics:', error);
    return {
      totalUsers: 0,
      activeProfiles: 0,
      learningProfiles: 0,
      lockedProfiles: 0,
      avgConfidenceScore: 0,
      fraudDetections: 0,
      systemUptime: 0,
      dataProcessed: 0
    };
  }
}

async function fetchSecurityAlerts(): Promise<SecurityAlert[]> {
  // Mock data - in a real app, this would fetch from a security_alerts table
  return [
    {
      id: '1',
      severity: 'medium',
      description: 'Unusual login pattern detected from IP 192.168.1.100',
      timestamp: new Date().toISOString(),
      status: 'active'
    },
    {
      id: '2',
      severity: 'low',
      description: 'Failed biometric verification attempt',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'resolved'
    }
  ];
}

export default AdminDashboard;
