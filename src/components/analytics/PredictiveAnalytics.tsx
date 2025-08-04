import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown,
  Brain, 
  Shield, 
  AlertTriangle, 
  Users,
  Target,
  Activity
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface PredictiveAnalyticsProps {
  timeRange: string;
}

const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({ timeRange }) => {
  const [selectedModel, setSelectedModel] = useState<string>('fraud-prediction');
  const [predictionHorizon, setPredictionHorizon] = useState<string>('7d');
  const [confidence, setConfidence] = useState<number>(85);

  // Mock predictive data - in real implementation, this would come from ML models
  const fraudPredictionData = [
    { date: 'Today', actual: 3, predicted: 3.2, confidence: 87 },
    { date: 'Day 2', actual: null, predicted: 4.1, confidence: 85 },
    { date: 'Day 3', actual: null, predicted: 2.8, confidence: 83 },
    { date: 'Day 4', actual: null, predicted: 5.2, confidence: 81 },
    { date: 'Day 5', actual: null, predicted: 3.6, confidence: 80 },
    { date: 'Day 6', actual: null, predicted: 4.8, confidence: 78 },
    { date: 'Day 7', actual: null, predicted: 3.9, confidence: 76 }
  ];

  const insiderThreatData = [
    { userId: 'User001', riskScore: 15, behavioral: 12, access: 18, temporal: 20 },
    { userId: 'User042', riskScore: 45, behavioral: 50, access: 40, temporal: 45 },
    { userId: 'User078', riskScore: 72, behavioral: 70, access: 75, temporal: 70 },
    { userId: 'User156', riskScore: 28, behavioral: 25, access: 30, temporal: 30 },
    { userId: 'User234', riskScore: 89, behavioral: 85, access: 90, temporal: 92 }
  ];

  const behavioralAnomalyData = [
    { week: 'Week 1', baseline: 100, predicted: 105, anomalies: 2 },
    { week: 'Week 2', baseline: 100, predicted: 115, anomalies: 4 },
    { week: 'Week 3', baseline: 100, predicted: 125, anomalies: 6 },
    { week: 'Week 4', baseline: 100, predicted: 110, anomalies: 3 }
  ];

  const complianceViolationData = [
    { category: 'Data Access', current: 2, predicted: 3, severity: 'medium' },
    { category: 'Authentication', current: 1, predicted: 2, severity: 'high' },
    { category: 'Privacy', current: 0, predicted: 1, severity: 'low' },
    { category: 'Retention', current: 1, predicted: 1, severity: 'medium' }
  ];

  const modelAccuracy = {
    'fraud-prediction': { accuracy: 87, precision: 84, recall: 90, f1Score: 87 },
    'insider-threat': { accuracy: 92, precision: 89, recall: 94, f1Score: 91 },
    'behavioral-anomaly': { accuracy: 85, precision: 82, recall: 88, f1Score: 85 },
    'compliance-violation': { accuracy: 90, precision: 87, recall: 93, f1Score: 90 }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-destructive';
    if (score >= 40) return 'text-orange-500';
    return 'text-green-500';
  };

  const getRiskBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 70) return 'destructive';
    if (score >= 40) return 'secondary';
    return 'default';
  };

  const renderFraudPrediction = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Predicted Fraud Events</p>
                <p className="text-2xl font-bold">4.2</p>
                <p className="text-xs text-muted-foreground">Next 7 days</p>
              </div>
              <TrendingUp className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Model Confidence</p>
                <p className="text-2xl font-bold">{confidence}%</p>
                <Progress value={confidence} className="w-20 mt-1" />
              </div>
              <Brain className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Risk Increase</p>
                <p className="text-2xl font-bold text-destructive">+23%</p>
                <p className="text-xs text-muted-foreground">vs last week</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fraud Prediction Forecast</CardTitle>
          <CardDescription>ML-powered fraud detection predictions with confidence intervals</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={fraudPredictionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                connectNulls={false}
                name="Actual"
              />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="hsl(var(--destructive))" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Predicted"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderInsiderThreat = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>High-Risk Users</CardTitle>
          <CardDescription>Users with elevated insider threat risk scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insiderThreatData
              .filter(user => user.riskScore >= 40)
              .sort((a, b) => b.riskScore - a.riskScore)
              .map((user, index) => (
                <div key={user.userId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${user.riskScore >= 70 ? 'bg-destructive' : 'bg-orange-500'}`} />
                    <div>
                      <p className="font-medium">{user.userId}</p>
                      <p className="text-sm text-muted-foreground">
                        Behavioral: {user.behavioral}% | Access: {user.access}% | Temporal: {user.temporal}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getRiskBadgeVariant(user.riskScore)}>
                      {user.riskScore}% Risk
                    </Badge>
                    <Button size="sm" variant="outline">
                      Investigate
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Risk Score Distribution</CardTitle>
          <CardDescription>Insider threat risk assessment across all users</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={insiderThreatData}>
              <CartesianGrid />
              <XAxis dataKey="behavioral" name="Behavioral Risk" />
              <YAxis dataKey="access" name="Access Risk" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter dataKey="riskScore" fill="hsl(var(--primary))" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderBehavioralAnomaly = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Behavioral Anomaly Forecast</CardTitle>
          <CardDescription>Predicted deviations from normal user behavior patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={behavioralAnomalyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="baseline" 
                stackId="1" 
                stroke="hsl(var(--muted))" 
                fill="hsl(var(--muted))" 
                fillOpacity={0.6}
                name="Baseline"
              />
              <Area 
                type="monotone" 
                dataKey="predicted" 
                stackId="2" 
                stroke="hsl(var(--primary))" 
                fill="hsl(var(--primary))" 
                fillOpacity={0.6}
                name="Predicted"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Anomaly Trend</p>
                <p className="text-2xl font-bold text-orange-500">+200%</p>
                <p className="text-xs text-muted-foreground">Expected increase</p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confidence Level</p>
                <p className="text-2xl font-bold">82%</p>
                <Progress value={82} className="w-20 mt-1" />
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderComplianceViolation = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Compliance Violation Predictions</CardTitle>
          <CardDescription>Forecasted compliance issues by category</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={complianceViolationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="current" fill="hsl(var(--muted))" name="Current" />
              <Bar dataKey="predicted" fill="hsl(var(--destructive))" name="Predicted" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {complianceViolationData.map((item, index) => (
          <Card key={item.category}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{item.category}</h4>
                <Badge variant={item.severity === 'high' ? 'destructive' : item.severity === 'medium' ? 'secondary' : 'default'}>
                  {item.severity}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Current: {item.current}</span>
                <span className="text-destructive">Predicted: {item.predicted}</span>
              </div>
              <Progress 
                value={(item.predicted / Math.max(item.current, item.predicted, 1)) * 100} 
                className="mt-2"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const currentModelStats = modelAccuracy[selectedModel as keyof typeof modelAccuracy];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Predictive Analytics</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={predictionHorizon} onValueChange={setPredictionHorizon}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">1 Day</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Model Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Model Performance</span>
            <Badge variant="outline">{selectedModel.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{currentModelStats.accuracy}%</p>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">{currentModelStats.precision}%</p>
              <p className="text-sm text-muted-foreground">Precision</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-500">{currentModelStats.recall}%</p>
              <p className="text-sm text-muted-foreground">Recall</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-500">{currentModelStats.f1Score}%</p>
              <p className="text-sm text-muted-foreground">F1 Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedModel} onValueChange={setSelectedModel} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="fraud-prediction">Fraud Prediction</TabsTrigger>
          <TabsTrigger value="insider-threat">Insider Threat</TabsTrigger>
          <TabsTrigger value="behavioral-anomaly">Behavioral Anomaly</TabsTrigger>
          <TabsTrigger value="compliance-violation">Compliance Violation</TabsTrigger>
        </TabsList>

        <TabsContent value="fraud-prediction">
          {renderFraudPrediction()}
        </TabsContent>

        <TabsContent value="insider-threat">
          {renderInsiderThreat()}
        </TabsContent>

        <TabsContent value="behavioral-anomaly">
          {renderBehavioralAnomaly()}
        </TabsContent>

        <TabsContent value="compliance-violation">
          {renderComplianceViolation()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PredictiveAnalytics;