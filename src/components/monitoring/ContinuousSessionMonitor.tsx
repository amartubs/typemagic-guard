import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  AlertTriangle, 
  Eye, 
  Shield, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Users,
  MousePointer,
  Keyboard,
  TouchpadIcon as Touch
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';

interface SessionMetrics {
  trustScore: number;
  behavioralConsistency: number;
  anomalyCount: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  sessionDuration: number;
  activityLevel: number;
}

interface BehavioralAnomaly {
  id: string;
  type: 'keystroke' | 'mouse' | 'touch' | 'timing' | 'pattern';
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  description: string;
  timestamp: string;
  context: string;
}

interface SessionEvent {
  timestamp: string;
  trustScore: number;
  activityLevel: number;
  anomalies: number;
}

const ContinuousSessionMonitor: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<SessionMetrics>({
    trustScore: 85,
    behavioralConsistency: 92,
    anomalyCount: 2,
    riskLevel: 'low',
    sessionDuration: 45,
    activityLevel: 78
  });
  const [anomalies, setAnomalies] = useState<BehavioralAnomaly[]>([]);
  const [sessionHistory, setSessionHistory] = useState<SessionEvent[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [realTimeData, setRealTimeData] = useState<SessionEvent[]>([]);

  // Simulate real-time monitoring
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      const now = new Date();
      const newEvent: SessionEvent = {
        timestamp: now.toISOString(),
        trustScore: Math.max(50, metrics.trustScore + (Math.random() - 0.5) * 10),
        activityLevel: Math.max(0, Math.min(100, metrics.activityLevel + (Math.random() - 0.5) * 20)),
        anomalies: Math.random() > 0.8 ? 1 : 0
      };

      setRealTimeData(prev => [...prev.slice(-19), newEvent]);
      
      // Update metrics
      setMetrics(prevMetrics => ({
        ...prevMetrics,
        trustScore: newEvent.trustScore,
        activityLevel: newEvent.activityLevel,
        anomalyCount: prevMetrics.anomalyCount + newEvent.anomalies,
        sessionDuration: prevMetrics.sessionDuration + 1
      }));

      // Randomly generate anomalies
      if (Math.random() > 0.9) {
        const anomalyTypes = ['keystroke', 'mouse', 'touch', 'timing', 'pattern'] as const;
        const severities = ['low', 'medium', 'high'] as const;
        
        const newAnomaly: BehavioralAnomaly = {
          id: `anomaly_${Date.now()}`,
          type: anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          confidence: Math.floor(Math.random() * 30) + 70,
          description: `Unusual ${anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)]} pattern detected`,
          timestamp: now.toISOString(),
          context: 'Real-time monitoring'
        };
        
        setAnomalies(prev => [newAnomaly, ...prev.slice(0, 9)]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isMonitoring, metrics.trustScore, metrics.activityLevel]);

  // Initialize session history
  useEffect(() => {
    const generateHistory = () => {
      const history = [];
      const now = new Date();
      
      for (let i = 60; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60000);
        history.push({
          timestamp: timestamp.toISOString(),
          trustScore: Math.floor(Math.random() * 40) + 60,
          activityLevel: Math.floor(Math.random() * 80) + 20,
          anomalies: Math.random() > 0.8 ? 1 : 0
        });
      }
      
      setSessionHistory(history);
      setRealTimeData(history.slice(-20));
    };

    generateHistory();
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getAnomalyIcon = (type: string) => {
    switch (type) {
      case 'keystroke': return <Keyboard className="h-4 w-4" />;
      case 'mouse': return <MousePointer className="h-4 w-4" />;
      case 'touch': return <Touch className="h-4 w-4" />;
      case 'timing': return <Clock className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-blue-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Continuous Session Monitor</h2>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-sm text-muted-foreground">
              {isMonitoring ? 'Monitoring Active' : 'Monitoring Paused'}
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsMonitoring(!isMonitoring)}
          >
            {isMonitoring ? 'Pause' : 'Resume'}
          </Button>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Trust Score</p>
                <p className="text-2xl font-bold">{Math.round(metrics.trustScore)}%</p>
                <div className="flex items-center space-x-1 mt-1">
                  {metrics.trustScore >= 85 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className="text-xs text-muted-foreground">Real-time</span>
                </div>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <Progress value={metrics.trustScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Behavioral Consistency</p>
                <p className="text-2xl font-bold">{metrics.behavioralConsistency}%</p>
                <p className="text-xs text-muted-foreground mt-1">Stable patterns</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <Progress value={metrics.behavioralConsistency} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Session Duration</p>
                <p className="text-2xl font-bold">{metrics.sessionDuration}m</p>
                <p className="text-xs text-muted-foreground mt-1">Active time</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Risk Level</p>
                <Badge className={getRiskColor(metrics.riskLevel)}>
                  {metrics.riskLevel.toUpperCase()}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">{metrics.anomalyCount} anomalies</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Trust Score Trend</CardTitle>
            <CardDescription>Real-time trust score monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={realTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleTimeString()}
                  formatter={(value) => [`${value}%`, 'Trust Score']}
                />
                <Line 
                  type="monotone" 
                  dataKey="trustScore" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Level</CardTitle>
            <CardDescription>User interaction intensity</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={realTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleTimeString()}
                  formatter={(value) => [`${value}%`, 'Activity Level']}
                />
                <Area 
                  type="monotone" 
                  dataKey="activityLevel" 
                  stroke="hsl(var(--accent))" 
                  fill="hsl(var(--accent))"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Anomalies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Recent Behavioral Anomalies</span>
          </CardTitle>
          <CardDescription>Real-time detection of unusual patterns</CardDescription>
        </CardHeader>
        <CardContent>
          {anomalies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No anomalies detected in current session</p>
            </div>
          ) : (
            <div className="space-y-3">
              {anomalies.map((anomaly) => (
                <Alert key={anomaly.id}>
                  <div className="flex items-start space-x-3">
                    {getAnomalyIcon(anomaly.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium capitalize">{anomaly.type} Anomaly</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={getSeverityColor(anomaly.severity)}>
                            {anomaly.severity}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {anomaly.confidence}% confidence
                          </span>
                        </div>
                      </div>
                      <AlertDescription className="text-sm">
                        {anomaly.description}
                      </AlertDescription>
                      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                        <span>{new Date(anomaly.timestamp).toLocaleTimeString()}</span>
                        <span>{anomaly.context}</span>
                      </div>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContinuousSessionMonitor;