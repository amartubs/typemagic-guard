import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FlaskConical, 
  TrendingUp, 
  Brain, 
  Settings, 
  BarChart3,
  Target,
  Zap,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/contexts/auth';
import { useABTest } from '@/hooks/useABTest';

interface ABTestResult {
  testId: string;
  variantId: string;
  metric: string;
  value: number;
  timestamp: string;
  userId: string;
  context: {
    algorithmType: 'neural_network' | 'traditional';
    accuracy: number;
    responseTime: number;
    confidence: number;
  };
}

interface TestConfiguration {
  id: string;
  name: string;
  description: string;
  metrics: string[];
  variants: {
    id: string;
    name: string;
    algorithm: 'neural_network' | 'traditional';
    weight: number;
  }[];
  status: 'draft' | 'running' | 'completed' | 'paused';
  startDate: string;
  endDate?: string;
  targetSampleSize: number;
  currentSampleSize: number;
}

const ABTestingFramework: React.FC = () => {
  const { user } = useAuth();
  const [activeTests, setActiveTests] = useState<TestConfiguration[]>([]);
  const [testResults, setTestResults] = useState<ABTestResult[]>([]);
  const [selectedTest, setSelectedTest] = useState<string>('');

  // A/B test for neural network vs traditional pattern matching
  const biometricAlgorithmTest = useABTest({
    testId: 'biometric_algorithm_comparison',
    variants: [
      { id: 'neural_network', name: 'Neural Network', weight: 0.5 },
      { id: 'traditional', name: 'Traditional Pattern Matching', weight: 0.5 }
    ]
  });

  useEffect(() => {
    // Initialize test configurations
    const mockTests: TestConfiguration[] = [
      {
        id: 'biometric_algorithm_comparison',
        name: 'Neural Network vs Traditional Pattern Matching',
        description: 'Compare accuracy and performance between neural network and traditional biometric algorithms',
        metrics: ['accuracy', 'response_time', 'false_positive_rate', 'confidence_score'],
        variants: [
          { id: 'neural_network', name: 'Neural Network Algorithm', algorithm: 'neural_network', weight: 0.5 },
          { id: 'traditional', name: 'Traditional Pattern Matching', algorithm: 'traditional', weight: 0.5 }
        ],
        status: 'running',
        startDate: new Date().toISOString(),
        targetSampleSize: 1000,
        currentSampleSize: 347
      },
      {
        id: 'anomaly_detection_threshold',
        name: 'Anomaly Detection Sensitivity',
        description: 'Test different sensitivity thresholds for behavioral anomaly detection',
        metrics: ['detection_rate', 'false_positive_rate', 'user_experience'],
        variants: [
          { id: 'high_sensitivity', name: 'High Sensitivity (85%)', algorithm: 'neural_network', weight: 0.33 },
          { id: 'medium_sensitivity', name: 'Medium Sensitivity (75%)', algorithm: 'neural_network', weight: 0.34 },
          { id: 'low_sensitivity', name: 'Low Sensitivity (65%)', algorithm: 'neural_network', weight: 0.33 }
        ],
        status: 'running',
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        targetSampleSize: 500,
        currentSampleSize: 423
      }
    ];

    setActiveTests(mockTests);
    setSelectedTest(mockTests[0].id);

    // Generate mock test results
    const mockResults: ABTestResult[] = [];
    mockTests.forEach(test => {
      test.variants.forEach(variant => {
        for (let i = 0; i < 50; i++) {
          const baseAccuracy = variant.algorithm === 'neural_network' ? 94 : 87;
          const baseResponseTime = variant.algorithm === 'neural_network' ? 45 : 120;
          
          mockResults.push({
            testId: test.id,
            variantId: variant.id,
            metric: 'accuracy',
            value: baseAccuracy + (Math.random() - 0.5) * 10,
            timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            userId: `user_${Math.floor(Math.random() * 100)}`,
            context: {
              algorithmType: variant.algorithm,
              accuracy: baseAccuracy + (Math.random() - 0.5) * 10,
              responseTime: baseResponseTime + Math.random() * 50,
              confidence: 85 + Math.random() * 15
            }
          });
        }
      });
    });

    setTestResults(mockResults);
  }, []);

  const getTestStatistics = (testId: string) => {
    const results = testResults.filter(r => r.testId === testId);
    const test = activeTests.find(t => t.id === testId);
    
    if (!test) return null;

    const variantStats = test.variants.map(variant => {
      const variantResults = results.filter(r => r.variantId === variant.id);
      const accuracyResults = variantResults.filter(r => r.metric === 'accuracy');
      
      return {
        ...variant,
        sampleSize: variantResults.length,
        avgAccuracy: accuracyResults.reduce((sum, r) => sum + r.value, 0) / accuracyResults.length || 0,
        avgResponseTime: variantResults.reduce((sum, r) => sum + r.context.responseTime, 0) / variantResults.length || 0,
        avgConfidence: variantResults.reduce((sum, r) => sum + r.context.confidence, 0) / variantResults.length || 0
      };
    });

    return { test, variantStats };
  };

  const getStatisticalSignificance = (testId: string) => {
    const stats = getTestStatistics(testId);
    if (!stats || stats.variantStats.length < 2) return null;

    const [variantA, variantB] = stats.variantStats;
    const accuracyDiff = Math.abs(variantA.avgAccuracy - variantB.avgAccuracy);
    const responseDiff = Math.abs(variantA.avgResponseTime - variantB.avgResponseTime);
    
    // Simplified statistical significance calculation
    const significanceThreshold = 2.0; // 95% confidence
    const isSignificant = accuracyDiff > significanceThreshold || responseDiff > 10;
    
    return {
      isSignificant,
      confidenceLevel: isSignificant ? 95 : 80,
      winner: variantA.avgAccuracy > variantB.avgAccuracy ? variantA : variantB,
      improvement: accuracyDiff,
      responseDiff
    };
  };

  const currentTest = activeTests.find(t => t.id === selectedTest);
  const statistics = getTestStatistics(selectedTest);
  const significance = getStatisticalSignificance(selectedTest);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FlaskConical className="h-6 w-6" />
          <h2 className="text-2xl font-bold">A/B Testing Framework</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {biometricAlgorithmTest ? `Variant: ${biometricAlgorithmTest}` : 'Not Assigned'}
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure Tests
          </Button>
        </div>
      </div>

      {/* Test Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Tests</p>
                <p className="text-2xl font-bold">{activeTests.filter(t => t.status === 'running').length}</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Samples</p>
                <p className="text-2xl font-bold">{activeTests.reduce((sum, t) => sum + t.currentSampleSize, 0)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Significant Results</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Improvement</p>
                <p className="text-2xl font-bold">+7.2%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Test Overview</TabsTrigger>
          <TabsTrigger value="results">Detailed Results</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Test Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Test</CardTitle>
              <CardDescription>Choose a test to view detailed analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeTests.map((test) => (
                  <Card 
                    key={test.id} 
                    className={`cursor-pointer transition-colors ${
                      selectedTest === test.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedTest(test.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{test.name}</h4>
                        <Badge 
                          variant={test.status === 'running' ? 'default' : 'secondary'}
                        >
                          {test.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{test.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{test.currentSampleSize}/{test.targetSampleSize}</span>
                        </div>
                        <Progress 
                          value={(test.currentSampleSize / test.targetSampleSize) * 100} 
                          className="h-2" 
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Test Results */}
          {currentTest && statistics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5" />
                    <span>{currentTest.name}</span>
                  </CardTitle>
                  <CardDescription>{currentTest.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {statistics.variantStats.map((variant) => (
                      <div key={variant.id} className="p-4 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{variant.name}</h4>
                          <Badge variant="outline">
                            {variant.sampleSize} samples
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Accuracy</p>
                            <p className="font-bold">{variant.avgAccuracy.toFixed(1)}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Response Time</p>
                            <p className="font-bold">{variant.avgResponseTime.toFixed(0)}ms</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Confidence</p>
                            <p className="font-bold">{variant.avgConfidence.toFixed(1)}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statistical Significance</CardTitle>
                  <CardDescription>Test reliability and confidence levels</CardDescription>
                </CardHeader>
                <CardContent>
                  {significance ? (
                    <div className="space-y-4">
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          {significance.isSignificant 
                            ? `Test results are statistically significant with ${significance.confidenceLevel}% confidence.`
                            : 'Test results are not yet statistically significant. Continue collecting data.'
                          }
                        </AlertDescription>
                      </Alert>

                      {significance.isSignificant && (
                        <div className="p-4 rounded-lg bg-muted">
                          <h4 className="font-medium mb-2">Winner: {significance.winner.name}</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Accuracy Improvement</p>
                              <p className="font-bold text-green-600">+{significance.improvement.toFixed(1)}%</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Response Time Difference</p>
                              <p className="font-bold">{significance.responseDiff.toFixed(0)}ms</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Confidence Level</span>
                          <span>{significance.confidenceLevel}%</span>
                        </div>
                        <Progress value={significance.confidenceLevel} className="h-2" />
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No statistical analysis available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Comparison</CardTitle>
              <CardDescription>Real-time performance metrics comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={testResults.filter(r => r.testId === selectedTest).slice(-20)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" tickFormatter={(time) => new Date(time).toLocaleTimeString()} />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    name="Accuracy"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Configuration</CardTitle>
              <CardDescription>Configure and manage A/B testing parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    A/B testing configuration allows you to compare different biometric algorithms, 
                    security thresholds, and user experience optimizations in real-time.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Test Duration</label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded" 
                      placeholder="14 days" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target Sample Size</label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded" 
                      placeholder="1000 users" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confidence Level</label>
                    <select className="w-full p-2 border rounded">
                      <option>95%</option>
                      <option>90%</option>
                      <option>99%</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Traffic Split</label>
                    <select className="w-full p-2 border rounded">
                      <option>50/50</option>
                      <option>70/30</option>
                      <option>80/20</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ABTestingFramework;