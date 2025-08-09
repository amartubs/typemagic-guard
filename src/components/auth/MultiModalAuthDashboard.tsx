import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Fingerprint, 
  Mouse, 
  Keyboard, 
  Smartphone, 
  Brain,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { MultiModalBiometricEngine } from '@/lib/auth/multiModalBiometricEngine';
import { MultiModalProfile, BiometricModality } from '@/types/advancedAuth';
import { toast } from 'sonner';

const MODALITY_ICONS = {
  keystroke: Keyboard,
  mouse: Mouse,
  touch: Smartphone,
  behavioral: Brain,
  device: Fingerprint
};

const MODALITY_COLORS = {
  keystroke: 'hsl(var(--primary))',
  mouse: 'hsl(var(--secondary))',
  touch: 'hsl(var(--accent))',
  behavioral: 'hsl(var(--muted-foreground))',
  device: 'hsl(var(--ring))'
};

export const MultiModalAuthDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadAnalytics();
    }
  }, [user?.id]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await MultiModalBiometricEngine.getProfileAnalytics(user!.id);
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load biometric analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5" />
            Multimodal Biometrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const profile = analytics?.profile;
  const recentAttempts = analytics?.recent_attempts || [];
  const recommendations = analytics?.learning_recommendations || [];

const modalityData = (() => {
  const modalities: BiometricModality[] = profile?.modalities || [];
  const attempts = recentAttempts as any[];
  const totalAttempts = attempts.length || 0;

  return modalities.map((modality) => {
    const weight = Math.round((profile?.confidence_weights?.[modality] || 0) * 100);

    const scores: number[] = attempts
      .map((a: any) => {
        const raw = a.individual_scores?.[modality];
        if (typeof raw !== 'number') return null;
        const pct = raw <= 1 ? raw * 100 : raw;
        return Math.max(0, Math.min(100, pct));
      })
      .filter((v: number | null): v is number => v !== null);

    const performance = scores.length
      ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length)
      : 0;

    let consistency = 0;
    if (scores.length >= 2) {
      const mean = scores.reduce((s, v) => s + v, 0) / scores.length;
      const variance = scores.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / scores.length;
      const std = Math.sqrt(variance);
      const cv = mean > 0 ? Math.min(1, std / mean) : 1;
      consistency = Math.round((1 - cv) * 100);
    } else {
      consistency = scores.length === 1 ? 80 : 0;
    }

    const presentCount = scores.length;
    const reliability = totalAttempts > 0 ? Math.round((presentCount / totalAttempts) * 100) : 0;

    return { modality, weight, performance, consistency, reliability };
  });
})();

  const confidenceTrendData = recentAttempts.slice(0, 20).reverse().map((attempt, index) => ({
    attempt: index + 1,
    confidence: attempt.combined_confidence,
    risk: attempt.risk_score
  }));

  const modalityDistribution = modalityData.map(item => ({
    name: item.modality,
    value: item.weight,
    color: MODALITY_COLORS[item.modality as BiometricModality]
  }));

  return (
    <div className="space-y-6">
      {/* Profile Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Learning Progress</p>
                <p className="text-2xl font-bold">{profile?.learning_progress || 0}%</p>
              </div>
              <Brain className="h-8 w-8 text-blue-500" />
            </div>
            <Progress 
              value={profile?.learning_progress || 0} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Modalities</p>
                <p className="text-2xl font-bold">{profile?.modalities.length || 0}</p>
              </div>
              <Fingerprint className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Baseline Status</p>
                <Badge variant={profile?.baseline_established ? "default" : "secondary"}>
                  {profile?.baseline_established ? "Established" : "Learning"}
                </Badge>
              </div>
              {profile?.baseline_established ? (
                <CheckCircle className="h-8 w-8 text-green-500" />
              ) : (
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recent Attempts</p>
                <p className="text-2xl font-bold">{recentAttempts.length}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="modalities" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="modalities">Modalities</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="modalities" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Modality Weights</CardTitle>
                <CardDescription>
                  How much each biometric modality contributes to authentication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={modalityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="modality" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="weight" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Modality Distribution</CardTitle>
                <CardDescription>
                  Relative contribution of each biometric method
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={modalityDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {modalityDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Modality Details */}
          <Card>
            <CardHeader>
              <CardTitle>Modality Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {modalityData.map((item) => {
                  const Icon = MODALITY_ICONS[item.modality as BiometricModality];
                  return (
                    <div key={item.modality} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Icon className="h-6 w-6" style={{ color: MODALITY_COLORS[item.modality as BiometricModality] }} />
                        <span className="font-medium capitalize">{item.modality}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Weight</span>
                          <span>{item.weight}%</span>
                        </div>
                        <Progress value={item.weight} />
                        <div className="flex justify-between text-sm">
                          <span>Performance</span>
                          <span>{item.performance}%</span>
                        </div>
                        <Progress value={item.performance} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Confidence Trends</CardTitle>
              <CardDescription>
                Recent authentication attempts and confidence scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={confidenceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="attempt" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="confidence" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Confidence"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="risk" 
                    stroke="hsl(var(--destructive))" 
                    strokeWidth={2}
                    name="Risk Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Detailed performance analysis across all modalities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {modalityData.map((item) => {
                  const Icon = MODALITY_ICONS[item.modality as BiometricModality];
                  return (
                    <div key={item.modality} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <Icon className="h-6 w-6" style={{ color: MODALITY_COLORS[item.modality as BiometricModality] }} />
                        <h3 className="font-medium capitalize">{item.modality} Analysis</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Accuracy</p>
                          <div className="flex items-center gap-2">
                            <Progress value={item.performance} className="flex-1" />
                            <span className="text-sm font-medium">{item.performance}%</span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Consistency</p>
                          <div className="flex items-center gap-2">
                            <Progress value={item.consistency} className="flex-1" />
                            <span className="text-sm font-medium">{item.consistency}%</span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Reliability</p>
                          <div className="flex items-center gap-2">
                            <Progress value={item.reliability} className="flex-1" />
                            <span className="text-sm font-medium">{item.reliability}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Learning Recommendations
              </CardTitle>
              <CardDescription>
                AI-generated suggestions to improve your biometric profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.length > 0 ? (
                  recommendations.map((rec, index) => {
                    const Icon = MODALITY_ICONS[rec.modality];
                    return (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Icon className="h-6 w-6 mt-1" style={{ color: MODALITY_COLORS[rec.modality] }} />
                          <div className="flex-1">
                            <h4 className="font-medium capitalize">{rec.modality} Optimization</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {rec.improvement_score > 0.8 
                                ? `Excellent progress! Your ${rec.modality} patterns are highly stable.`
                                : rec.improvement_score > 0.6
                                ? `Good progress. Continue using this device to improve ${rec.modality} recognition.`
                                : `Your ${rec.modality} patterns need more training. Try to maintain consistent behavior.`
                              }
                            </p>
                            <div className="flex items-center gap-4 mt-3">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Improvement</span>
                                <Progress value={rec.improvement_score * 100} className="w-20" />
                                <span className="text-xs">{Math.round(rec.improvement_score * 100)}%</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Stability</span>
                                <Progress value={rec.pattern_stability * 100} className="w-20" />
                                <span className="text-xs">{Math.round(rec.pattern_stability * 100)}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium">No recommendations yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Keep using the system to receive personalized optimization suggestions
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};