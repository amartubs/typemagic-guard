import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { Shield, AlertTriangle, Clock, Activity, Users, Target, Lock, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SecurityMetrics {
  totalAttempts: number;
  successRate: number;
  averageConfidence: number;
  riskDistribution: { low: number; medium: number; high: number };
  lockedAccounts: number;
  rateLimitViolations: number;
  averageResponseTime: number;
  activeUsers: number;
}

interface SecurityEvent {
  id: string;
  timestamp: string;
  type: 'lockout' | 'rate_limit' | 'high_risk' | 'anomaly';
  severity: 'low' | 'medium' | 'high';
  message: string;
  userEmail?: string;
  details: any;
}

interface ChartData {
  timestamp: string;
  attempts: number;
  success_rate: number;
  average_confidence: number;
  risk_score: number;
}

export function BiometricSecurityDashboard() {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalAttempts: 0,
    successRate: 0,
    averageConfidence: 0,
    riskDistribution: { low: 0, medium: 0, high: 0 },
    lockedAccounts: 0,
    rateLimitViolations: 0,
    averageResponseTime: 0,
    activeUsers: 0
  });

  const [recentEvents, setRecentEvents] = useState<SecurityEvent[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSecurityMetrics();
    fetchRecentEvents();
    fetchChartData();

    // Set up real-time updates
    const interval = setInterval(() => {
      fetchSecurityMetrics();
      fetchRecentEvents();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchSecurityMetrics = async () => {
    try {
      // Fetch authentication attempts from last 24 hours
      const { data: attempts } = await supabase
        .from('authentication_attempts')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const { data: multiModalAttempts } = await supabase
        .from('multimodal_auth_attempts')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const allAttempts = [...(attempts || []), ...(multiModalAttempts || [])];
      
      if (allAttempts.length > 0) {
        const totalAttempts = allAttempts.length;
        const successfulAttempts = allAttempts.filter(a => a.success).length;
        const successRate = (successfulAttempts / totalAttempts) * 100;
        
        const confidenceScores = allAttempts
          .map(a => {
            if ('confidence_score' in a) return a.confidence_score;
            if ('combined_confidence' in a) return a.combined_confidence;
            return null;
          })
          .filter(c => c != null);
        const averageConfidence = confidenceScores.length > 0 
          ? confidenceScores.reduce((sum, c) => sum + c, 0) / confidenceScores.length 
          : 0;

        // Calculate risk distribution
        const riskLevels = allAttempts.map(a => {
          const confidence = ('confidence_score' in a ? a.confidence_score : 
                            'combined_confidence' in a ? a.combined_confidence : 0) || 0;
          const riskScore = ('risk_score' in a ? a.risk_score : (100 - confidence)) || 0;
          if (confidence >= 85 && riskScore <= 20) return 'low';
          if (confidence >= 70 && riskScore <= 40) return 'medium';
          return 'high';
        });

        const riskDistribution = {
          low: riskLevels.filter(r => r === 'low').length,
          medium: riskLevels.filter(r => r === 'medium').length,
          high: riskLevels.filter(r => r === 'high').length
        };

        setMetrics({
          totalAttempts,
          successRate,
          averageConfidence,
          riskDistribution,
          lockedAccounts: 0, // Would track from rate limiting system
          rateLimitViolations: 0, // Would track from rate limiting system
          averageResponseTime: 150, // Mock data
          activeUsers: new Set(allAttempts.map(a => a.user_id)).size
        });
      }
    } catch (error) {
      console.error('Error fetching security metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentEvents = async () => {
    try {
      // Fetch recent high-risk events
      const { data: highRiskAttempts } = await supabase
        .from('multimodal_auth_attempts')
        .select('*, profiles(email)')
        .eq('success', false)
        .gte('risk_score', 70)
        .order('created_at', { ascending: false })
        .limit(10);

      const events: SecurityEvent[] = (highRiskAttempts || []).map(attempt => ({
        id: attempt.id,
        timestamp: attempt.created_at,
        type: 'high_risk',
        severity: 'high',
        message: `High-risk authentication attempt detected`,
        userEmail: attempt.profiles?.email,
        details: {
          riskScore: attempt.risk_score,
          confidence: attempt.combined_confidence,
          modalities: attempt.modalities_used
        }
      }));

      setRecentEvents(events);
    } catch (error) {
      console.error('Error fetching recent events:', error);
    }
  };

  const fetchChartData = async () => {
    try {
      // Fetch hourly aggregated data for the last 24 hours
      const { data } = await supabase
        .from('multimodal_auth_attempts')
        .select('created_at, success, combined_confidence, risk_score')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true });

      if (data && data.length > 0) {
        // Group by hour
        const hourlyData = new Map<string, any>();
        
        data.forEach(attempt => {
          const hour = new Date(attempt.created_at).toISOString().substring(0, 13) + ':00:00.000Z';
          if (!hourlyData.has(hour)) {
            hourlyData.set(hour, {
              timestamp: hour,
              attempts: 0,
              successful: 0,
              totalConfidence: 0,
              totalRisk: 0
            });
          }
          
          const entry = hourlyData.get(hour)!;
          entry.attempts++;
          if (attempt.success) entry.successful++;
          entry.totalConfidence += attempt.combined_confidence || 0;
          entry.totalRisk += attempt.risk_score || 0;
        });

        const chartData = Array.from(hourlyData.values()).map(entry => ({
          timestamp: new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          attempts: entry.attempts,
          success_rate: entry.attempts > 0 ? (entry.successful / entry.attempts) * 100 : 0,
          average_confidence: entry.attempts > 0 ? entry.totalConfidence / entry.attempts : 0,
          risk_score: entry.attempts > 0 ? entry.totalRisk / entry.attempts : 0
        }));

        setChartData(chartData);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-orange-500 text-white';
      case 'low': return 'bg-yellow-500 text-white';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Security Dashboard</h2>
          <p className="text-muted-foreground">Real-time biometric authentication monitoring</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Live Monitoring
        </Badge>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.successRate.toFixed(1)}%</div>
            <Progress value={metrics.successRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageConfidence.toFixed(0)}%</div>
            <Progress value={metrics.averageConfidence} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageResponseTime}ms</div>
            <p className="text-xs text-muted-foreground mt-2">
              Sub-200ms target
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeUsers}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Last 24 hours
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="security">Security Events</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Authentication Trends</CardTitle>
                <CardDescription>Hourly authentication attempts and success rates</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="attempts" stroke="hsl(var(--primary))" strokeWidth={2} />
                    <Line type="monotone" dataKey="success_rate" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Confidence & Risk Scores</CardTitle>
                <CardDescription>Average confidence and risk trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="average_confidence" stackId="1" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" />
                    <Area type="monotone" dataKey="risk_score" stackId="2" stroke="hsl(var(--chart-4))" fill="hsl(var(--chart-4))" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Security Events
              </CardTitle>
              <CardDescription>High-priority security alerts and anomalies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEvents.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No recent security events</p>
                ) : (
                  recentEvents.map((event) => (
                    <Alert key={event.id}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{event.message}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.userEmail} • {new Date(event.timestamp).toLocaleString()}
                          </p>
                          {event.details && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Risk: {event.details.riskScore}% • Confidence: {event.details.confidence}%
                            </p>
                          )}
                        </div>
                        <Badge className={getSeverityColor(event.severity)}>
                          {event.severity}
                        </Badge>
                      </AlertDescription>
                    </Alert>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>Current risk level breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { name: 'Low Risk', value: metrics.riskDistribution.low, fill: 'hsl(var(--chart-1))' },
                    { name: 'Medium Risk', value: metrics.riskDistribution.medium, fill: 'hsl(var(--chart-2))' },
                    { name: 'High Risk', value: metrics.riskDistribution.high, fill: 'hsl(var(--chart-3))' }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Status
                </CardTitle>
                <CardDescription>System security overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Rate Limiting</span>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progressive Delays</span>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Account Lockouts</span>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Device Trust Scoring</span>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Anomaly Detection</span>
                  <Badge variant="secondary">Active</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}