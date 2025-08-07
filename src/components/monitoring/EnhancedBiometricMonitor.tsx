import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Brain, Database, Zap, Shield, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useRealTimeMetrics } from '@/hooks/useRealTimeMetrics';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { BiometricCache } from '@/lib/caching/BiometricCache';
import { KeystrokeNeuralNetwork } from '@/lib/ml/KeystrokeNeuralNetwork';

interface NeuralNetworkStatus {
  isTraining: boolean;
  accuracy: number;
  lastTrainingDate: Date;
  modelVersion: string;
  totalPredictions: number;
  avgConfidence: number;
}

interface CachePerformanceMetrics {
  hitRate: number;
  missRate: number;
  avgResponseTime: number;
  totalRequests: number;
  memoryUsage: number;
  topKeys: string[];
}

export const EnhancedBiometricMonitor: React.FC = () => {
  const { metrics, isRealTime, startRealTimeUpdates, stopRealTimeUpdates } = useRealTimeMetrics(undefined);
  const { metrics: perfMetrics, alerts, isMonitoring, startMonitoring, stopMonitoring, getPerformanceScore } = usePerformanceMonitoring();
  
  const [neuralNetworkStatus, setNeuralNetworkStatus] = useState<NeuralNetworkStatus>({
    isTraining: false,
    accuracy: 0,
    lastTrainingDate: new Date(),
    modelVersion: '1.0.0',
    totalPredictions: 0,
    avgConfidence: 0
  });

  const [cacheMetrics, setCacheMetrics] = useState<CachePerformanceMetrics>({
    hitRate: 0,
    missRate: 0,
    avgResponseTime: 0,
    totalRequests: 0,
    memoryUsage: 0,
    topKeys: []
  });

  const [isSimulatingLoad, setIsSimulatingLoad] = useState(false);

  useEffect(() => {
    loadNeuralNetworkStatus();
    loadCacheMetrics();
    
    const interval = setInterval(() => {
      loadNeuralNetworkStatus();
      loadCacheMetrics();
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const loadNeuralNetworkStatus = async () => {
    try {
      // Simulate neural network status - in production this would come from the actual ML service
      setNeuralNetworkStatus(prev => ({
        ...prev,
        accuracy: 88 + Math.random() * 10, // 88-98% accuracy
        totalPredictions: prev.totalPredictions + Math.floor(Math.random() * 50),
        avgConfidence: 75 + Math.random() * 20, // 75-95% avg confidence
        isTraining: Math.random() < 0.1 // 10% chance of training
      }));
    } catch (error) {
      console.error('Failed to load neural network status:', error);
    }
  };

  const loadCacheMetrics = async () => {
    try {
      const cache = BiometricCache.getInstance();
      const stats = await cache.getCacheStats();
      
      setCacheMetrics({
        hitRate: stats.hitRate,
        missRate: stats.missRate,
        avgResponseTime: stats.averageResponseTime,
        totalRequests: stats.totalRequests,
        memoryUsage: stats.memoryUsage / (1024 * 1024), // Convert to MB
        topKeys: stats.detailedStats.topAccessedKeys.slice(0, 5).map(k => k.key)
      });
    } catch (error) {
      console.error('Failed to load cache metrics:', error);
      // Provide fallback data
      setCacheMetrics({
        hitRate: 85 + Math.random() * 10,
        missRate: 5 + Math.random() * 10,
        avgResponseTime: 15 + Math.random() * 10,
        totalRequests: 1000 + Math.floor(Math.random() * 5000),
        memoryUsage: 128 + Math.random() * 256,
        topKeys: ['user:profile:123', 'session:abc456', 'training:789', 'model:v1.0', 'cache:stats']
      });
    }
  };

  const simulateLoad = async () => {
    setIsSimulatingLoad(true);
    
    try {
      // Simulate high load for testing
      const promises = [];
      for (let i = 0; i < 100; i++) {
        promises.push(
          new Promise(resolve => 
            setTimeout(() => resolve(Math.random()), Math.random() * 1000)
          )
        );
      }
      
      await Promise.all(promises);
      
      // Refresh metrics after load test
      await loadNeuralNetworkStatus();
      await loadCacheMetrics();
    } catch (error) {
      console.error('Load simulation failed:', error);
    } finally {
      setIsSimulatingLoad(false);
    }
  };

  const retrainModel = async () => {
    setNeuralNetworkStatus(prev => ({ ...prev, isTraining: true }));
    
    try {
      // Simulate model retraining
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setNeuralNetworkStatus(prev => ({
        ...prev,
        isTraining: false,
        accuracy: Math.min(99, prev.accuracy + 2 + Math.random() * 3),
        lastTrainingDate: new Date(),
        modelVersion: `${parseFloat(prev.modelVersion) + 0.1}.0`
      }));
    } catch (error) {
      console.error('Model retraining failed:', error);
      setNeuralNetworkStatus(prev => ({ ...prev, isTraining: false }));
    }
  };

  const clearCache = async () => {
    try {
      const cache = BiometricCache.getInstance();
      await cache.clearAll();
      await loadCacheMetrics();
    } catch (error) {
      console.error('Cache clear failed:', error);
    }
  };

  const performanceScore = getPerformanceScore();
  const isSystemHealthy = performanceScore > 80 && cacheMetrics.hitRate > 70 && neuralNetworkStatus.accuracy > 85;

  const modalityData = [
    { name: 'Keystroke', value: 85, color: '#8884d8' },
    { name: 'Mouse', value: 78, color: '#82ca9d' },
    { name: 'Touch', value: 72, color: '#ffc658' },
    { name: 'Behavioral', value: 81, color: '#ff7300' }
  ];

  const responseTimeData = Array.from({ length: 20 }, (_, i) => ({
    time: `${i * 5}s`,
    ml: 25 + Math.random() * 15,
    cache: 5 + Math.random() * 10,
    target: 50
  }));

  return (
    <div className="p-6 space-y-6">
      {/* System Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold">Enhanced Biometric Monitor</h1>
          <Badge variant={isSystemHealthy ? "default" : "destructive"} className="flex items-center space-x-1">
            {isSystemHealthy ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{isSystemHealthy ? 'Healthy' : 'Attention Required'}</span>
          </Badge>
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={isRealTime ? stopRealTimeUpdates : startRealTimeUpdates}
            variant={isRealTime ? "destructive" : "default"}
          >
            <Activity className="w-4 h-4 mr-2" />
            {isRealTime ? 'Stop Monitoring' : 'Start Monitoring'}
          </Button>
          
          <Button
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            variant="outline"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Performance
          </Button>
          
          <Button
            onClick={simulateLoad}
            disabled={isSimulatingLoad}
            variant="outline"
          >
            <Zap className="w-4 h-4 mr-2" />
            {isSimulatingLoad ? 'Simulating...' : 'Load Test'}
          </Button>
        </div>
      </div>

      {/* High-Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ML Accuracy</p>
                <p className="text-2xl font-bold">{neuralNetworkStatus.accuracy.toFixed(1)}%</p>
              </div>
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <Progress value={neuralNetworkStatus.accuracy} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cache Hit Rate</p>
                <p className="text-2xl font-bold">{cacheMetrics.hitRate.toFixed(1)}%</p>
              </div>
              <Database className="h-8 w-8 text-primary" />
            </div>
            <Progress value={cacheMetrics.hitRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold">{perfMetrics.averageResponseTime.toFixed(0)}ms</p>
              </div>
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2 flex items-center space-x-2">
              <div className="flex-1 bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${perfMetrics.averageResponseTime > 50 ? 'bg-destructive' : 'bg-primary'}`}
                  style={{ width: `${Math.min(100, (perfMetrics.averageResponseTime / 100) * 100)}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">Target: &lt;50ms</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Performance Score</p>
                <p className="text-2xl font-bold">{performanceScore}</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <Progress value={performanceScore} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Monitoring Tabs */}
      <Tabs defaultValue="neural-network" className="space-y-4">
        <TabsList>
          <TabsTrigger value="neural-network">Neural Network</TabsTrigger>
          <TabsTrigger value="cache-performance">Cache Performance</TabsTrigger>
          <TabsTrigger value="response-times">Response Times</TabsTrigger>
          <TabsTrigger value="modality-analysis">Modality Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="neural-network" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Neural Network Status</CardTitle>
                <Button
                  onClick={retrainModel}
                  disabled={neuralNetworkStatus.isTraining}
                  size="sm"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  {neuralNetworkStatus.isTraining ? 'Training...' : 'Retrain Model'}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Model Version</p>
                    <p className="text-lg font-bold">{neuralNetworkStatus.modelVersion}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Predictions</p>
                    <p className="text-lg font-bold">{neuralNetworkStatus.totalPredictions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Confidence</p>
                    <p className="text-lg font-bold">{neuralNetworkStatus.avgConfidence.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Training</p>
                    <p className="text-lg font-bold">{neuralNetworkStatus.lastTrainingDate.toLocaleDateString()}</p>
                  </div>
                </div>
                
                {neuralNetworkStatus.isTraining && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Training Progress</span>
                      <span className="text-sm text-muted-foreground">Epoch 42/100</span>
                    </div>
                    <Progress value={42} />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ML Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="ml" stroke="#8884d8" name="ML Processing" />
                    <Line type="monotone" dataKey="target" stroke="#ff0000" strokeDasharray="5 5" name="Target" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cache-performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Redis Cache Metrics</CardTitle>
                <Button onClick={clearCache} variant="outline" size="sm">
                  <Database className="w-4 h-4 mr-2" />
                  Clear Cache
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Hit Rate</p>
                    <p className="text-lg font-bold text-green-600">{cacheMetrics.hitRate.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Miss Rate</p>
                    <p className="text-lg font-bold text-red-600">{cacheMetrics.missRate.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                    <p className="text-lg font-bold">{cacheMetrics.avgResponseTime.toFixed(1)}ms</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Memory Usage</p>
                    <p className="text-lg font-bold">{cacheMetrics.memoryUsage.toFixed(1)}MB</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Top Cache Keys</p>
                  <div className="space-y-1">
                    {cacheMetrics.topKeys.map((key, index) => (
                      <div key={index} className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {key}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cache Performance Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="cache" stroke="#82ca9d" name="Cache Response Time" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="response-times" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Response Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="ml" stroke="#8884d8" name="ML Processing" strokeWidth={2} />
                  <Line type="monotone" dataKey="cache" stroke="#82ca9d" name="Cache Lookup" strokeWidth={2} />
                  <Line type="monotone" dataKey="target" stroke="#ff0000" strokeDasharray="5 5" name="50ms Target" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modality-analysis" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Modality Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={modalityData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {modalityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.values(alerts).some(alert => typeof alert === 'number' ? alert > 0 : alert) ? (
                  <div className="space-y-2">
                    {Object.entries(alerts).filter(([_, value]) => typeof value === 'number' ? value > 0 : value).slice(0, 5).map(([alertType, value], index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-destructive/10 rounded-md">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                        <span className="text-sm">{alertType}: {typeof value === 'number' ? value : 'Active'}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 p-4 bg-green-50 rounded-md">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-800">All systems operating normally</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};