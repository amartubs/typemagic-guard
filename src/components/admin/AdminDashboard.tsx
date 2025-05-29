
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Users, 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Eye,
  UserCheck,
  UserX,
  Lock
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';

interface AdminStats {
  totalUsers: number;
  activeProfiles: number;
  learningProfiles: number;
  lockedProfiles: number;
  todayAttempts: number;
  successfulAttempts: number;
  failedAttempts: number;
  suspiciousActivity: number;
}

interface SecurityEvent {
  id: string;
  userId: string;
  userEmail: string;
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
  timestamp: number;
  resolved: boolean;
}

interface UserActivity {
  userId: string;
  userEmail: string;
  lastLogin: number;
  attemptCount: number;
  successRate: number;
  riskScore: number;
  status: string;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  useEffect(() => {
    if (user?.role === 'admin') {
      loadDashboardData();
    }
  }, [user, selectedTimeRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load statistics
      const statsData = await loadAdminStats();
      setStats(statsData);
      
      // Load security events
      const eventsData = await loadSecurityEvents();
      setSecurityEvents(eventsData);
      
      // Load user activities
      const activitiesData = await loadUserActivities();
      setUserActivities(activitiesData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAdminStats = async (): Promise<AdminStats> => {
    const timeRangeHours = selectedTimeRange === '24h' ? 24 : selectedTimeRange === '7d' ? 168 : 720;
    const cutoffTime = new Date(Date.now() - timeRangeHours * 60 * 60 * 1000).toISOString();

    // Get user counts by profile status
    const { data: profiles } = await supabase
      .from('biometric_profiles')
      .select('status');

    // Get authentication attempts for the time range
    const { data: attempts } = await supabase
      .from('authentication_attempts')
      .select('success, anomaly_details')
      .gte('created_at', cutoffTime);

    const totalUsers = profiles?.length || 0;
    const activeProfiles = profiles?.filter(p => p.status === 'active').length || 0;
    const learningProfiles = profiles?.filter(p => p.status === 'learning').length || 0;
    const lockedProfiles = profiles?.filter(p => p.status === 'locked').length || 0;
    
    const todayAttempts = attempts?.length || 0;
    const successfulAttempts = attempts?.filter(a => a.success).length || 0;
    const failedAttempts = attempts?.filter(a => !a.success).length || 0;
    const suspiciousActivity = attempts?.filter(a => a.anomaly_details).length || 0;

    return {
      totalUsers,
      activeProfiles,
      learningProfiles,
      lockedProfiles,
      todayAttempts,
      successfulAttempts,
      failedAttempts,
      suspiciousActivity
    };
  };

  const loadSecurityEvents = async (): Promise<SecurityEvent[]> => {
    const timeRangeHours = selectedTimeRange === '24h' ? 24 : selectedTimeRange === '7d' ? 168 : 720;
    const cutoffTime = new Date(Date.now() - timeRangeHours * 60 * 60 * 1000).toISOString();

    const { data: attempts } = await supabase
      .from('authentication_attempts')
      .select(`
        id,
        user_id,
        success,
        anomaly_details,
        created_at,
        profiles!authentication_attempts_user_id_fkey(email)
      `)
      .gte('created_at', cutoffTime)
      .not('anomaly_details', 'is', null)
      .order('created_at', { ascending: false })
      .limit(50);

    return attempts?.map(attempt => ({
      id: attempt.id,
      userId: attempt.user_id,
      userEmail: attempt.profiles?.email || 'Unknown',
      eventType: attempt.success ? 'Suspicious Success' : 'Failed Authentication',
      severity: attempt.anomaly_details?.severity || 'medium',
      details: attempt.anomaly_details?.description || 'Anomalous behavior detected',
      timestamp: new Date(attempt.created_at).getTime(),
      resolved: false
    })) || [];
  };

  const loadUserActivities = async (): Promise<UserActivity[]> => {
    const { data: activities } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        last_login,
        biometric_profiles!biometric_profiles_user_id_fkey(status),
        authentication_attempts!authentication_attempts_user_id_fkey(success, created_at)
      `)
      .limit(100);

    return activities?.map(activity => {
      const attempts = activity.authentication_attempts || [];
      const recentAttempts = attempts.filter(a => 
        new Date(a.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
      );
      
      const successfulAttempts = recentAttempts.filter(a => a.success).length;
      const totalAttempts = recentAttempts.length;
      const successRate = totalAttempts > 0 ? (successfulAttempts / totalAttempts) * 100 : 0;
      
      // Calculate risk score based on success rate and activity
      let riskScore = 0;
      if (successRate < 50) riskScore += 30;
      if (totalAttempts > 20) riskScore += 20;
      if (!activity.last_login) riskScore += 10;
      
      return {
        userId: activity.id,
        userEmail: activity.email,
        lastLogin: activity.last_login ? new Date(activity.last_login).getTime() : 0,
        attemptCount: totalAttempts,
        successRate,
        riskScore: Math.min(100, riskScore),
        status: activity.biometric_profiles?.[0]?.status || 'unknown'
      };
    }).sort((a, b) => b.riskScore - a.riskScore) || [];
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskColor = (riskScore: number) => {
    if (riskScore >= 70) return 'text-red-600';
    if (riskScore >= 40) return 'text-orange-600';
    if (riskScore >= 20) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <UserCheck className="h-4 w-4 text-green-600" />;
      case 'learning': return <Activity className="h-4 w-4 text-blue-600" />;
      case 'locked': return <Lock className="h-4 w-4 text-red-600" />;
      default: return <UserX className="h-4 w-4 text-gray-600" />;
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Access denied. Admin privileges required to view this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading admin dashboard...</div>
      </div>
    );
  }

  // Chart data
  const profileStatusData = [
    { name: 'Active', value: stats?.activeProfiles || 0, color: '#10b981' },
    { name: 'Learning', value: stats?.learningProfiles || 0, color: '#3b82f6' },
    { name: 'Locked', value: stats?.lockedProfiles || 0, color: '#ef4444' }
  ];

  const authenticationData = [
    { name: 'Successful', value: stats?.successfulAttempts || 0 },
    { name: 'Failed', value: stats?.failedAttempts || 0 },
    { name: 'Suspicious', value: stats?.suspiciousActivity || 0 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Admin Dashboard</span>
          </div>
          
          <div className="flex items-center gap-2">
            <select 
              value={selectedTimeRange} 
              onChange={(e) => setSelectedTimeRange(e.target.value as any)}
              className="border rounded px-3 py-1"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <Button variant="outline" size="sm" onClick={loadDashboardData}>
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Authentication Attempts</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.todayAttempts || 0}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round(((stats?.successfulAttempts || 0) / Math.max(stats?.todayAttempts || 1, 1)) * 100)}% success rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.suspiciousActivity || 0}</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Profiles</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeProfiles || 0}</div>
              <p className="text-xs text-muted-foreground">Fully trained biometric profiles</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="security">Security Events</TabsTrigger>
            <TabsTrigger value="users">User Activity</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={profileStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        dataKey="value"
                      >
                        {profileStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Authentication Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={authenticationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Recent Security Events</CardTitle>
                <CardDescription>
                  Anomalous authentication attempts and security incidents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityEvents.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No security events in the selected time range</p>
                  ) : (
                    securityEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${getSeverityColor(event.severity)}`} />
                          <div>
                            <p className="font-medium">{event.eventType}</p>
                            <p className="text-sm text-muted-foreground">{event.userEmail}</p>
                            <p className="text-sm text-muted-foreground">{event.details}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={event.severity === 'critical' ? 'destructive' : 'secondary'}>
                            {event.severity}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(event.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Risk Assessment</CardTitle>
                <CardDescription>
                  Users sorted by risk score and recent activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userActivities.slice(0, 20).map((activity) => (
                    <div key={activity.userId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(activity.status)}
                        <div>
                          <p className="font-medium">{activity.userEmail}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.attemptCount} attempts, {activity.successRate.toFixed(1)}% success rate
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Last login: {activity.lastLogin ? new Date(activity.lastLogin).toLocaleDateString() : 'Never'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getRiskColor(activity.riskScore)}`}>
                          {activity.riskScore}%
                        </div>
                        <p className="text-xs text-muted-foreground">Risk Score</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Performance Metrics</CardTitle>
                  <CardDescription>
                    Key performance indicators for the biometric authentication system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {stats ? Math.round((stats.successfulAttempts / Math.max(stats.todayAttempts, 1)) * 100) : 0}%
                      </div>
                      <p className="text-sm text-muted-foreground">Authentication Success Rate</p>
                    </div>
                    
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {stats ? Math.round((stats.activeProfiles / Math.max(stats.totalUsers, 1)) * 100) : 0}%
                      </div>
                      <p className="text-sm text-muted-foreground">Profile Completion Rate</p>
                    </div>
                    
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {stats ? Math.round((stats.suspiciousActivity / Math.max(stats.todayAttempts, 1)) * 100) : 0}%
                      </div>
                      <p className="text-sm text-muted-foreground">Anomaly Detection Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
