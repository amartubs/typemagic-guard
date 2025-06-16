
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp } from "lucide-react";

interface EnhancedKeystrokeChartProps {
  data: any[];
  currentConfidence: number;
  canExport?: boolean;
}

const EnhancedKeystrokeChart: React.FC<EnhancedKeystrokeChartProps> = ({
  data,
  currentConfidence,
  canExport = false
}) => {
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('area');

  const handleExport = () => {
    if (!canExport) return;
    
    const exportData = {
      timestamp: new Date().toISOString(),
      confidenceHistory: data,
      currentConfidence,
      analytics: {
        averageConfidence: data.reduce((sum, d) => sum + d.confidence, 0) / data.length,
        trend: data.length > 1 ? data[data.length - 1].confidence - data[0].confidence : 0,
        dataPoints: data.length
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keystroke-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderChart = () => {
    const chartProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 10 }
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="confidence"
              stroke="#8884d8"
              strokeWidth={3}
              dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="confidence"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="confidence" fill="#8884d8" />
          </BarChart>
        );
    }
  };

  const averageConfidence = data.length > 0 
    ? data.reduce((sum, d) => sum + d.confidence, 0) / data.length 
    : 0;
  
  const trend = data.length > 1 
    ? data[data.length - 1].confidence - data[0].confidence 
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Enhanced Keystroke Analytics
              <TrendingUp className="h-5 w-5" />
            </CardTitle>
            <CardDescription>
              Advanced visualization of your typing pattern confidence
            </CardDescription>
          </div>
          {canExport && (
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={chartType} onValueChange={(value) => setChartType(value as 'line' | 'area' | 'bar')}>
          <TabsList className="mb-4">
            <TabsTrigger value="area">Area Chart</TabsTrigger>
            <TabsTrigger value="line">Line Chart</TabsTrigger>
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
          </TabsList>
          
          <TabsContent value={chartType}>
            <div className="h-[300px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{currentConfidence}%</div>
                <div className="text-sm text-muted-foreground">Current</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{averageConfidence.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Average</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Trend</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedKeystrokeChart;
