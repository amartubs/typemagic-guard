
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Zap, Clock, TrendingUp } from 'lucide-react';

interface MetricData {
  timestamp: string;
  cpuUsage: number;
  memoryUsage: number;
  responseTime: number;
  requestCount: number;
}

interface RealTimeMetricsProps {
  data: MetricData[];
  currentMetrics: {
    cpu: number;
    memory: number;
    activeConnections: number;
    requestsPerSecond: number;
  };
}

const RealTimeMetrics: React.FC<RealTimeMetricsProps> = ({ data, currentMetrics }) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Real-time Metrics Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              CPU Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.cpu}%</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              Real-time
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-500" />
              Memory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.memory}%</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              Real-time
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              Connections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.activeConnections}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-orange-500" />
              Req/sec
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.requestsPerSecond}</div>
            <div className="text-xs text-muted-foreground">Current</div>
          </CardContent>
        </Card>
      </div>

      {/* CPU & Memory Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">System Resources</CardTitle>
          <CardDescription>CPU and Memory usage over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatTime}
                interval="preserveStartEnd"
              />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                labelFormatter={(value) => formatTime(value as string)}
                formatter={(value, name) => [`${value}%`, name]}
              />
              <Area 
                type="monotone" 
                dataKey="cpuUsage" 
                stackId="1"
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.6}
                name="CPU"
              />
              <Area 
                type="monotone" 
                dataKey="memoryUsage" 
                stackId="2"
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.6}
                name="Memory"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Response Time Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">API Response Times</CardTitle>
          <CardDescription>Average response time and request volume</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatTime}
                interval="preserveStartEnd"
              />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                labelFormatter={(value) => formatTime(value as string)}
                formatter={(value, name, props) => [
                  name === 'Response Time' ? `${value} ms` : `${value} req`,
                  name
                ]}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="responseTime" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                name="Response Time"
                dot={false}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="requestCount" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="Request Count"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeMetrics;
