
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface AuthenticationTrendsData {
  date: string;
  successful: number;
  failed: number;
  suspicious: number;
  avgConfidence: number;
}

interface AuthenticationTrendsChartProps {
  data: AuthenticationTrendsData[];
  timeRange: string;
}

const AuthenticationTrendsChart: React.FC<AuthenticationTrendsChartProps> = ({ data, timeRange }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{`Date: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication Trends</CardTitle>
        <CardDescription>
          Authentication attempts over {timeRange} showing success, failure, and suspicious activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="successful" 
              stackId="1" 
              stroke="#22c55e" 
              fill="#22c55e" 
              fillOpacity={0.6}
              name="Successful"
            />
            <Area 
              type="monotone" 
              dataKey="failed" 
              stackId="1" 
              stroke="#ef4444" 
              fill="#ef4444" 
              fillOpacity={0.6}
              name="Failed"
            />
            <Area 
              type="monotone" 
              dataKey="suspicious" 
              stackId="1" 
              stroke="#f59e0b" 
              fill="#f59e0b" 
              fillOpacity={0.6}
              name="Suspicious"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AuthenticationTrendsChart;
