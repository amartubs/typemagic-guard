
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth';
import { useSubscription } from '@/hooks/useSubscription';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Shield, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';

interface AnalyticsData {
  authenticationTrends: Array<{ date: string; successful: number; failed: number; }>;
  confidenceScores: Array<{ range: string; count: number; }>;
  deviceAnalytics: Array<{ device: string; count: number; risk: 'low' | 'medium' | 'high'; }>;
  timePatterns: Array<{ hour: number; authentications: number; }>;
  securityEvents: Array<{ type: string; count: number; severity: 'low' | 'medium' | 'high'; }>;
}

const AdvancedAnalytics: React.FC = () => {
  const { user } = useAuth();
  const { canAccessFeature } = useSubscription();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const hasAdvancedAnalytics = canAccessFeature('advancedAnalytics');

  useEffect(() => {
    if (hasAdvancedAnalytics) {
      loadAnalyticsData();
    } else {
      setLoading(false);
    }
  }, [hasAdvancedAnalytics, timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Mock data - in production this would fetch from your analytics API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalyticsData({
        authenticationTrends: [
          { date: '2024-01-01', successful: 45, failed: 3 },
          { date: '2024-01-02', successful: 52, failed: 1 },
          { date: '2024-01-03', successful: 38, failed: 5 },
          { date: '2024-01-04', successful: 61, failed: 2 },
          { date: '2024-01-05', successful: 49, failed: 4 },
          { date: '2024-01-06', successful: 55, failed: 1 },
          { date: '2024-01-07', successful: 43, failed: 3 }
        ],
        confidenceScores: [
          { range: '90-100%', count: 156 },
          { range: '80-89%', count: 89 },
          { range: '70-79%', count: 34 },
          { range: '60-69%', count: 12 },
          { range: '<60%', count: 5 }
        ],
        deviceAnalytics: [
          { device: 'Desktop - Chrome', count: 145, risk: 'low' },
          { device: 'Mobile - Safari', count: 89, risk: 'low' },
          { device: 'Desktop - Firefox', count: 34, risk: 'medium' },
          { device: 'Mobile - Chrome', count: 67, risk: 'low' },
          { device: 'Unknown Device', count: 3, risk: 'high' }
        ],
        timePatterns: [
          { hour: 0, authentications: 2 },
          { hour: 6, authentications: 8 },
          { hour: 9, authentications: 45 },
          { hour: 12, authentications: 38 },
          { hour: 15, authentications: 42 },
          { hour: 18, authentications: 35 },
          { hour: 21, authentications: 15 }
        ],
        securityEvents: [
          { type: 'Failed Login', count: 23, severity: 'medium' },
          { type: 'Suspicious Location', count: 5, severity: 'high' },
          { type: 'New Device', count: 12, severity: 'low' },
          { type: 'Rate Limit Hit', count: 3, severity: 'medium' },
          { type: 'Anomaly Detected', count: 7, severity: 'high' }
        ]
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE'];

  if (!hasAdvancedAnalytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Advanced Analytics</CardTitle>
          <CardDescription>
            Detailed insights into your authentication patterns and security metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BarChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Premium Feature</h3>
            <p className="text-muted-foreground">
              Advanced analytics are available for Professional and Enterprise subscribers.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">94.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Avg Confidence</p>
                <p className="text-2xl font-bold">87.3%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Security Events</p>
                <p className="text-2xl font-bold">23</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Authentication Trends</TabsTrigger>
          <TabsTrigger value="confidence">Confidence Analysis</TabsTrigger>
          <TabsTrigger value="devices">Device Analytics</TabsTrigger>
          <TabsTrigger value="security">Security Events</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Trends</CardTitle>
              <CardDescription>
                Successful vs failed authentication attempts over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData?.authenticationTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="successful" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  <Area type="monotone" dataKey="failed" stackId="1" stroke="#ff7300" fill="#ff7300" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="confidence" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Confidence Score Distribution</CardTitle>
              <CardDescription>
                Distribution of authentication confidence scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData?.confidenceScores}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ range, percent }) => `${range} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analyticsData?.confidenceScores.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Device Analytics</CardTitle>
              <CardDescription>
                Authentication attempts by device type and risk level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData?.deviceAnalytics.map((device, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="font-medium">{device.device}</span>
                      <Badge variant={
                        device.risk === 'high' ? 'destructive' : 
                        device.risk === 'medium' ? 'secondary' : 'default'
                      }>
                        {device.risk} risk
                      </Badge>
                    </div>
                    <span className="text-muted-foreground">{device.count} authentications</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Events</CardTitle>
              <CardDescription>
                Security incidents and anomalies detected
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData?.securityEvents}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;
