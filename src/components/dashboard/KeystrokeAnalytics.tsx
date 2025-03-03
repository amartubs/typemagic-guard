
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { VisualizationData } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Activity, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface KeystrokeAnalyticsProps {
  visualizationData: VisualizationData | null;
  isLoading?: boolean;
}

const KeystrokeAnalytics: React.FC<KeystrokeAnalyticsProps> = ({ 
  visualizationData, 
  isLoading = false 
}) => {
  // Generate demo data if none provided
  const data = visualizationData || {
    typingSpeed: [45, 48, 52, 49, 53, 55, 54, 58, 60, 61],
    keyPressHeatmap: {
      'a': 65, 'e': 89, 't': 76, 'i': 69, 'o': 80, 
      'n': 62, 's': 70, 'r': 64, 'h': 35, 'l': 34,
      'd': 28, 'c': 26, 'u': 23, 'm': 20, 'f': 19,
      'p': 18, 'g': 17, 'w': 15, 'y': 14, 'b': 13,
      'v': 10, 'k': 7, 'x': 4, 'j': 3, 'q': 3, 'z': 2
    },
    rhythmPatterns: [
      [12, 28, 40, 35, 25, 18, 32, 45, 50, 60],
      [22, 38, 30, 45, 35, 28, 42, 35, 40, 50],
      [32, 28, 50, 25, 45, 38, 22, 55, 30, 40]
    ],
    confidenceHistory: [
      {timestamp: Date.now() - 500000, score: 65},
      {timestamp: Date.now() - 400000, score: 72},
      {timestamp: Date.now() - 300000, score: 68},
      {timestamp: Date.now() - 200000, score: 75},
      {timestamp: Date.now() - 100000, score: 80},
      {timestamp: Date.now(), score: 85}
    ]
  };

  // Transform key press data for pie chart
  const keyPressData = Object.entries(data.keyPressHeatmap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([key, value]) => ({ name: key, value }));

  // Generate colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

  // Format timestamp for x-axis
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 animate-pulse">
        <Card className="h-80 bg-muted/30"></Card>
        <Card className="h-80 bg-muted/30"></Card>
        <Card className="h-80 bg-muted/30"></Card>
        <Card className="h-80 bg-muted/30"></Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Typing Speed Chart */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Typing Speed Trend
            </CardTitle>
            <Badge variant="outline" className="font-normal">
              {data.typingSpeed[data.typingSpeed.length - 1]} WPM
            </Badge>
          </div>
          <CardDescription>Your typing speed over time (words per minute)</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.typingSpeed.map((speed, index) => ({ day: index + 1, speed }))}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="day" label={{ value: 'Session', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'WPM', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.5rem'
                }} 
                formatter={(value) => [`${value} WPM`, 'Speed']}
                labelFormatter={(value) => `Session ${value}`}
              />
              <Line type="monotone" dataKey="speed" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Key Frequency Chart */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              Key Usage Distribution
            </CardTitle>
            <Badge variant="outline" className="font-normal">
              Top 8 Keys
            </Badge>
          </div>
          <CardDescription>Most frequently used keys in your typing patterns</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={keyPressData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {keyPressData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.5rem'
                }} 
                formatter={(value) => [`${value} presses`, 'Frequency']}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Typing Rhythm Patterns */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Typing Rhythm Patterns
          </CardTitle>
          <CardDescription>Keystroke timing patterns across different sessions</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.rhythmPatterns[0].map((_, index) => ({
              index: index + 1,
              pattern1: data.rhythmPatterns[0][index],
              pattern2: data.rhythmPatterns[1][index],
              pattern3: data.rhythmPatterns[2][index]
            }))}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="index" label={{ value: 'Key Transition', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.5rem'
                }} 
              />
              <Bar dataKey="pattern1" fill="#0088FE" name="Session 1" />
              <Bar dataKey="pattern2" fill="#00C49F" name="Session 2" />
              <Bar dataKey="pattern3" fill="#FFBB28" name="Session 3" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Confidence Score Trend */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Confidence Score Trend
            </CardTitle>
            <Badge variant="outline" className="font-normal">
              {data.confidenceHistory[data.confidenceHistory.length - 1].score}%
            </Badge>
          </div>
          <CardDescription>Authentication confidence score over time</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.confidenceHistory.map(item => ({
              time: item.timestamp,
              score: item.score
            }))}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="time" 
                tickFormatter={formatTimestamp}
                label={{ value: 'Time', position: 'insideBottom', offset: -5 }} 
              />
              <YAxis domain={[0, 100]} label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.5rem'
                }} 
                labelFormatter={formatTimestamp}
                formatter={(value) => [`${value}%`, 'Confidence']}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="hsl(var(--primary))" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default KeystrokeAnalytics;
