
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

interface UserBehaviorData {
  deviceTypes: Array<{ name: string; value: number; risk: 'low' | 'medium' | 'high' }>;
  loginPatterns: Array<{ hour: number; logins: number }>;
  locationAnalysis: Array<{ country: string; users: number; suspicious: number }>;
  keystrokePatterns: {
    avgTypingSpeed: number;
    consistencyScore: number;
    uniquePatterns: number;
  };
}

interface UserBehaviorAnalysisProps {
  data: UserBehaviorData;
}

const UserBehaviorAnalysis: React.FC<UserBehaviorAnalysisProps> = ({ data }) => {
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE'];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Device Type Distribution</CardTitle>
            <CardDescription>User authentication by device type and risk level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={data.deviceTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.deviceTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {data.deviceTypes.map((device, index) => (
                  <div key={device.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm">{device.name}</span>
                      <Badge variant={getRiskColor(device.risk) as any}>{device.risk} risk</Badge>
                    </div>
                    <span className="text-sm font-medium">{device.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Login Patterns */}
        <Card>
          <CardHeader>
            <CardTitle>Login Patterns</CardTitle>
            <CardDescription>Authentication activity by hour of day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.loginPatterns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="hour" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value}:00`}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(value) => `${value}:00`}
                  formatter={(value) => [value, 'Logins']}
                />
                <Bar dataKey="logins" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Keystroke Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Keystroke Pattern Analysis</CardTitle>
          <CardDescription>Biometric typing behavior insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Average Typing Speed</span>
                <span className="text-sm text-muted-foreground">{data.keystrokePatterns.avgTypingSpeed} WPM</span>
              </div>
              <Progress value={Math.min(data.keystrokePatterns.avgTypingSpeed / 100 * 100, 100)} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Consistency Score</span>
                <span className="text-sm text-muted-foreground">{data.keystrokePatterns.consistencyScore}%</span>
              </div>
              <Progress value={data.keystrokePatterns.consistencyScore} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Unique Patterns</span>
                <span className="text-sm text-muted-foreground">{data.keystrokePatterns.uniquePatterns}</span>
              </div>
              <Progress value={Math.min(data.keystrokePatterns.uniquePatterns / 50 * 100, 100)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Geographic Analysis</CardTitle>
          <CardDescription>User authentication by location</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.locationAnalysis.map((location, index) => (
              <div key={location.country} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="font-medium">{location.country}</span>
                  {location.suspicious > 0 && (
                    <Badge variant="destructive">{location.suspicious} suspicious</Badge>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium">{location.users} users</span>
                  <div className="text-xs text-muted-foreground">
                    {((location.users / data.locationAnalysis.reduce((sum, l) => sum + l.users, 0)) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserBehaviorAnalysis;
