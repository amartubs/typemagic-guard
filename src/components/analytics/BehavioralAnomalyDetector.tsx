import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  Eye, 
  Activity,
  MousePointer,
  Keyboard,
  Clock,
  Target,
  Zap,
  Shield
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAuth } from '@/contexts/auth';

interface AnomalyDetection {
  id: string;
  timestamp: string;
  type: 'keystroke' | 'mouse' | 'touch' | 'timing' | 'sequence' | 'pressure';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  deviation: number;
  baseline: number;
  current: number;
  description: string;
  context: string;
  features: Record<string, number>;
}

interface PatternBaseline {
  type: string;
  mean: number;
  standardDeviation: number;
  confidence: number;
  sampleSize: number;
  lastUpdated: string;
}

interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  falsePositiveRate: number;
  detectionLatency: number;
}

const BehavioralAnomalyDetector: React.FC = () => {
  const { user } = useAuth();
  const [anomalies, setAnomalies] = useState<AnomalyDetection[]>([]);
  const [baselines, setBaselines] = useState<PatternBaseline[]>([]);
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics>({
    accuracy: 94.2,
    precision: 91.8,
    recall: 89.5,
    f1Score: 90.6,
    falsePositiveRate: 2.3,
    detectionLatency: 147
  });
  const [realTimeData, setRealTimeData] = useState<any[]>([]);
  const [isLearning, setIsLearning] = useState(true);

  // Generate mock anomaly data
  useEffect(() => {
    const generateAnomalies = () => {
      const anomalyTypes = ['keystroke', 'mouse', 'touch', 'timing', 'sequence', 'pressure'] as const;
      const severities = ['low', 'medium', 'high', 'critical'] as const;
      
      const mockAnomalies: AnomalyDetection[] = Array.from({ length: 15 }, (_, i) => {
        const type = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)];
        const severity = severities[Math.floor(Math.random() * severities.length)];
        const baseline = Math.random() * 100 + 50;
        const deviation = Math.random() * 50 + 10;
        const current = baseline + (Math.random() > 0.5 ? deviation : -deviation);
        
        return {
          id: `anomaly_${i + 1}`,
          timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
          type,
          severity,
          confidence: Math.floor(Math.random() * 30) + 70,
          deviation: Math.abs(current - baseline) / baseline * 100,
          baseline,
          current,
          description: `Unusual ${type} pattern detected - ${Math.abs(current - baseline).toFixed(1)} unit deviation from baseline`,
          context: 'Real-time monitoring',
          features: {
            dwellTime: Math.random() * 200 + 50,
            flightTime: Math.random() * 150 + 25,
            pressure: Math.random() * 100,
            velocity: Math.random() * 50 + 10,
            rhythm: Math.random() * 100 + 50
          }
        };
      });

      setAnomalies(mockAnomalies.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    };

    const generateBaselines = () => {
      const types = ['keystroke_dwell', 'keystroke_flight', 'mouse_velocity', 'mouse_acceleration', 'touch_pressure', 'sequence_timing'];
      
      const mockBaselines: PatternBaseline[] = types.map(type => ({
        type,
        mean: Math.random() * 100 + 50,
        standardDeviation: Math.random() * 20 + 5,
        confidence: Math.random() * 15 + 85,
        sampleSize: Math.floor(Math.random() * 500) + 100,
        lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      }));

      setBaselines(mockBaselines);
    };

    const generateRealTimeData = () => {
      const data = Array.from({ length: 50 }, (_, i) => ({
        time: i,
        keystroke: Math.sin(i * 0.1) * 20 + 80 + Math.random() * 10,
        mouse: Math.cos(i * 0.15) * 15 + 75 + Math.random() * 8,
        anomalyScore: Math.random() * 100,
        threshold: 85
      }));
      
      setRealTimeData(data);
    };

    generateAnomalies();
    generateBaselines();
    generateRealTimeData();
  }, []);

  // Real-time data simulation
  useEffect(() => {
    if (!isLearning) return;

    const interval = setInterval(() => {
      setRealTimeData(prev => {
        const newPoint = {
          time: prev.length,
          keystroke: Math.sin(prev.length * 0.1) * 20 + 80 + Math.random() * 10,
          mouse: Math.cos(prev.length * 0.15) * 15 + 75 + Math.random() * 8,
          anomalyScore: Math.random() * 100,
          threshold: 85
        };
        
        return [...prev.slice(-49), newPoint];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLearning]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-blue-600 bg-blue-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'keystroke': return <Keyboard className="h-4 w-4" />;
      case 'mouse': return <MousePointer className="h-4 w-4" />;
      case 'timing': return <Clock className="h-4 w-4" />;
      case 'sequence': return <Target className="h-4 w-4" />;
      case 'pressure': return <Zap className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const anomalyStats = {
    total: anomalies.length,
    critical: anomalies.filter(a => a.severity === 'critical').length,
    high: anomalies.filter(a => a.severity === 'high').length,
    avgConfidence: Math.round(anomalies.reduce((sum, a) => sum + a.confidence, 0) / anomalies.length),
    maxDeviation: Math.max(...anomalies.map(a => a.deviation))
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Behavioral Anomaly Detector</h2>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isLearning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-sm text-muted-foreground">
              {isLearning ? 'Learning Active' : 'Learning Paused'}
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsLearning(!isLearning)}
          >
            {isLearning ? 'Pause' : 'Resume'}
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Anomalies</p>
                <p className="text-2xl font-bold">{anomalyStats.total}</p>
              </div>
              <Eye className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Issues</p>
                <p className="text-2xl font-bold text-red-600">{anomalyStats.critical}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Model Accuracy</p>
                <p className="text-2xl font-bold">{modelMetrics.accuracy}%</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <Progress value={modelMetrics.accuracy} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Confidence</p>
                <p className="text-2xl font-bold">{anomalyStats.avgConfidence}%</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <Progress value={anomalyStats.avgConfidence} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Detection Latency</p>
                <p className="text-2xl font-bold">{modelMetrics.detectionLatency}ms</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="realtime" className="w-full">
        <TabsList>
          <TabsTrigger value="realtime">Real-time Monitoring</TabsTrigger>
          <TabsTrigger value="anomalies">Detected Anomalies</TabsTrigger>
          <TabsTrigger value="baselines">Pattern Baselines</TabsTrigger>
          <TabsTrigger value="model">Model Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="realtime" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Pattern Analysis</CardTitle>
                <CardDescription>Live monitoring of behavioral patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={realTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="keystroke" 
                      stroke="hsl(var(--primary))" 
                      name="Keystroke Pattern"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="mouse" 
                      stroke="hsl(var(--accent))" 
                      name="Mouse Pattern"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Anomaly Score</CardTitle>
                <CardDescription>Real-time anomaly detection threshold</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={realTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="anomalyScore" 
                      stroke="hsl(var(--destructive))" 
                      fill="hsl(var(--destructive))"
                      fillOpacity={0.3}
                      name="Anomaly Score"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="threshold" 
                      stroke="hsl(var(--secondary))" 
                      strokeDasharray="5 5"
                      name="Threshold"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-4">
          {anomalies.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No anomalies detected</p>
              </CardContent>
            </Card>
          ) : (
            anomalies.map((anomaly) => (
              <Card key={anomaly.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      {getTypeIcon(anomaly.type)}
                      <div>
                        <h4 className="font-semibold capitalize">
                          {anomaly.type} Anomaly
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(anomaly.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getSeverityColor(anomaly.severity)}>
                        {anomaly.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {anomaly.confidence}% confidence
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm mb-4">{anomaly.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Baseline</p>
                      <p className="font-medium">{anomaly.baseline.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Current</p>
                      <p className="font-medium">{anomaly.current.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Deviation</p>
                      <p className="font-medium text-red-600">{anomaly.deviation.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Context</p>
                      <p className="font-medium">{anomaly.context}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Feature Analysis</p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {Object.entries(anomaly.features).map(([feature, value]) => (
                        <div key={feature} className="text-center">
                          <p className="text-xs text-muted-foreground capitalize">
                            {feature.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </p>
                          <p className="text-sm font-medium">{value.toFixed(1)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="baselines" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {baselines.map((baseline) => (
              <Card key={baseline.type}>
                <CardHeader>
                  <CardTitle className="capitalize">
                    {baseline.type.replace(/_/g, ' ')}
                  </CardTitle>
                  <CardDescription>
                    Based on {baseline.sampleSize} samples
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Mean</p>
                        <p className="text-lg font-bold">{baseline.mean.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Std Dev</p>
                        <p className="text-lg font-bold">{baseline.standardDeviation.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Confidence</p>
                      <Progress value={baseline.confidence} />
                      <p className="text-xs text-muted-foreground mt-1">
                        {baseline.confidence.toFixed(1)}%
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Last updated: {new Date(baseline.lastUpdated).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="model" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Accuracy</span>
                      <span>{modelMetrics.accuracy}%</span>
                    </div>
                    <Progress value={modelMetrics.accuracy} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Precision</span>
                      <span>{modelMetrics.precision}%</span>
                    </div>
                    <Progress value={modelMetrics.precision} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Recall</span>
                      <span>{modelMetrics.recall}%</span>
                    </div>
                    <Progress value={modelMetrics.recall} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>F1 Score</span>
                      <span>{modelMetrics.f1Score}%</span>
                    </div>
                    <Progress value={modelMetrics.f1Score} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detection Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">False Positive Rate</p>
                  <p className="text-2xl font-bold text-orange-600">{modelMetrics.falsePositiveRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Detection Latency</p>
                  <p className="text-2xl font-bold text-blue-600">{modelMetrics.detectionLatency}ms</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Model Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full">Retrain Model</Button>
                <Button variant="outline" className="w-full">Export Model</Button>
                <Button variant="outline" className="w-full">Update Thresholds</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BehavioralAnomalyDetector;