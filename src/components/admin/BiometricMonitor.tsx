
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { Activity, Brain, TrendingUp, AlertTriangle, Eye, Shield } from 'lucide-react';
import { AdvancedBiometricAnalyzer, AnalysisMetrics, FraudIndicators } from '@/lib/biometric/advancedAnalyzer';
import { ContinuousLearningEngine, LearningMetrics } from '@/lib/biometric/continuousLearning';
import { BiometricProfile, KeystrokePattern } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

interface UserProfileAnalysis {
  userId: string;
  userEmail: string;
  profile: BiometricProfile;
  metrics: AnalysisMetrics;
  fraudIndicators: FraudIndicators;
  learningMetrics: LearningMetrics;
  riskScore: number;
}

interface SystemMetrics {
  totalProfiles: number;
  averageConfidence: number;
  fraudDetectionRate: number;
  learningProfiles: number;
  activeProfiles: number;
  lockedProfiles: number;
}

const BiometricMonitor: React.FC = () => {
  const [userAnalyses, setUserAnalyses] = useState<UserProfileAnalysis[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBiometricData();
  }, []);

  const loadBiometricData = async () => {
    try {
      setLoading(true);
      console.log('Loading biometric data...');
      
      // Load all biometric profiles with user data
      const { data: profiles, error } = await supabase
        .from('biometric_profiles')
        .select(`
          *,
          profiles!biometric_profiles_user_id_fkey(id, email, name),
          keystroke_patterns!keystroke_patterns_biometric_profile_id_fkey(*)
        `);

      if (error) {
        console.error('Error loading biometric profiles:', error);
        return;
      }

      console.log('Loaded profiles:', profiles);

      if (!profiles || profiles.length === 0) {
        console.log('No biometric profiles found');
        setUserAnalyses([]);
        setSystemMetrics({
          totalProfiles: 0,
          averageConfidence: 0,
          fraudDetectionRate: 0,
          learningProfiles: 0,
          activeProfiles: 0,
          lockedProfiles: 0
        });
        return;
      }

      const analyses: UserProfileAnalysis[] = [];
      
      for (const dbProfile of profiles) {
        console.log('Processing profile:', dbProfile);
        
        if (!dbProfile.profiles?.email) {
          console.log('Skipping profile without user email:', dbProfile.user_id);
          continue;
        }
        
        // Reconstruct BiometricProfile object
        const profile: BiometricProfile = {
          userId: dbProfile.user_id,
          keystrokePatterns: dbProfile.keystroke_patterns?.map((kp: any) => ({
            userId: dbProfile.user_id,
            patternId: kp.id,
            timings: kp.pattern_data?.timings || [],
            timestamp: new Date(kp.created_at).getTime(),
            context: kp.context || 'unknown'
          })) || [],
          confidenceScore: dbProfile.confidence_score || 0,
          lastUpdated: new Date(dbProfile.last_updated).getTime(),
          status: dbProfile.status || 'learning'
        };

        console.log('Reconstructed profile for user:', profile.userId, 'patterns:', profile.keystrokePatterns.length);

        // Create mock pattern for analysis if no patterns exist
        const mockPattern: KeystrokePattern = {
          userId: profile.userId,
          patternId: 'analysis-mock',
          timings: [100, 150, 120, 80, 200], // Mock timing data
          timestamp: Date.now(),
          context: 'analysis'
        };

        // Calculate metrics using advanced analyzer
        const analysisResult = AdvancedBiometricAnalyzer.analyzePatternWithFraudDetection(
          profile, 
          mockPattern
        );

        const learningMetrics = ContinuousLearningEngine.calculateLearningMetrics(profile);
        
        // Calculate risk score based on various factors
        let riskScore = 0;
        if (analysisResult.fraudIndicators.machineGeneratedPattern) riskScore += 40;
        if (analysisResult.fraudIndicators.suspiciousTimingPatterns) riskScore += 30;
        if (analysisResult.fraudIndicators.copyPasteDetected) riskScore += 20;
        if (profile.confidenceScore < 50) riskScore += 20;
        if (profile.status === 'locked') riskScore += 50;
        
        const userAnalysis: UserProfileAnalysis = {
          userId: profile.userId,
          userEmail: dbProfile.profiles.email,
          profile,
          metrics: analysisResult.metrics,
          fraudIndicators: analysisResult.fraudIndicators,
          learningMetrics,
          riskScore: Math.min(100, riskScore)
        };
        
        analyses.push(userAnalysis);
        console.log('Added analysis for user:', userAnalysis.userEmail);
      }

      console.log('Total analyses created:', analyses.length);
      setUserAnalyses(analyses);
      
      // Calculate system metrics
      if (analyses.length > 0) {
        const systemMetrics: SystemMetrics = {
          totalProfiles: analyses.length,
          averageConfidence: analyses.reduce((sum, a) => sum + a.profile.confidenceScore, 0) / analyses.length,
          fraudDetectionRate: (analyses.filter(a => 
            a.fraudIndicators.machineGeneratedPattern || 
            a.fraudIndicators.suspiciousTimingPatterns
          ).length / analyses.length) * 100,
          learningProfiles: analyses.filter(a => a.profile.status === 'learning').length,
          activeProfiles: analyses.filter(a => a.profile.status === 'active').length,
          lockedProfiles: analyses.filter(a => a.profile.status === 'locked').length
        };
        setSystemMetrics(systemMetrics);
      } else {
        setSystemMetrics({
          totalProfiles: 0,
          averageConfidence: 0,
          fraudDetectionRate: 0,
          learningProfiles: 0,
          activeProfiles: 0,
          lockedProfiles: 0
        });
      }
      
    } catch (error) {
      console.error('Error loading biometric data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshData = () => {
    setRefreshing(true);
    loadBiometricData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'learning': return 'bg-blue-500';
      case 'locked': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 70) return 'text-red-600';
    if (risk >= 40) return 'text-orange-600';
    if (risk >= 20) return 'text-yellow-600';
    return 'text-green-600';
  };

  const selectedUserAnalysis = userAnalyses.find(u => u.userId === selectedUser);

  // Chart data
  const confidenceDistribution = userAnalyses.map((analysis, index) => ({
    x: index,
    y: analysis.profile.confidenceScore,
    status: analysis.profile.status,
    email: analysis.userEmail
  }));

  const learningProgressData = selectedUserAnalysis?.profile.keystrokePatterns
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((pattern, index) => ({
      session: index + 1,
      confidence: Math.min(100, 30 + (index * 5)), // Simulated confidence growth
      stability: selectedUserAnalysis.learningMetrics.stabilityScore * 100
    })) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-pulse">Loading biometric analysis...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profiles</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics?.totalProfiles || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Confidence</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemMetrics ? Math.round(systemMetrics.averageConfidence) : 0}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fraud Detection Rate</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemMetrics ? systemMetrics.fraudDetectionRate.toFixed(1) : 0}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Profiles</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics?.activeProfiles || 0}</div>
            <p className="text-xs text-muted-foreground">
              {systemMetrics?.learningProfiles || 0} learning, {systemMetrics?.lockedProfiles || 0} locked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Confidence Distribution Chart */}
      {userAnalyses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Confidence Score Distribution</CardTitle>
            <CardDescription>
              Each point represents a user's biometric profile confidence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={confidenceDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" hide />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value}%`,
                    'Confidence',
                    props.payload?.email
                  ]}
                />
                <Scatter dataKey="y" fill="hsl(var(--primary))" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* User Selection and Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Selection</CardTitle>
            <CardDescription>Select a user to view detailed biometric analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder={userAnalyses.length > 0 ? "Select a user to analyze" : "No users available"} />
                </SelectTrigger>
                <SelectContent>
                  {userAnalyses.length > 0 ? (
                    userAnalyses.map((analysis) => (
                      <SelectItem key={analysis.userId} value={analysis.userId}>
                        {analysis.userEmail} ({analysis.profile.status})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-users" disabled>
                      No biometric profiles found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              
              <Button onClick={refreshData} disabled={refreshing} className="w-full">
                {refreshing ? 'Refreshing...' : 'Refresh Data'}
              </Button>

              {userAnalyses.length === 0 && (
                <div className="text-sm text-muted-foreground p-4 border rounded-lg">
                  <p>No biometric profiles found in the database.</p>
                  <p className="mt-2">Users need to complete the biometric enrollment process to appear here.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {selectedUserAnalysis && (
          <Card>
            <CardHeader>
              <CardTitle>User Profile Analysis</CardTitle>
              <CardDescription>{selectedUserAnalysis.userEmail}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <Badge className={getStatusColor(selectedUserAnalysis.profile.status)}>
                    {selectedUserAnalysis.profile.status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Confidence Score:</span>
                  <span className="font-bold">{selectedUserAnalysis.profile.confidenceScore}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Risk Score:</span>
                  <span className={`font-bold ${getRiskColor(selectedUserAnalysis.riskScore)}`}>
                    {selectedUserAnalysis.riskScore}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Pattern Count:</span>
                  <span>{selectedUserAnalysis.profile.keystrokePatterns.length}</span>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Fraud Indicators</h4>
                  <div className="space-y-1 text-sm">
                    {selectedUserAnalysis.fraudIndicators.machineGeneratedPattern && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-3 w-3" />
                        Machine-generated pattern detected
                      </div>
                    )}
                    {selectedUserAnalysis.fraudIndicators.suspiciousTimingPatterns && (
                      <div className="flex items-center gap-2 text-orange-600">
                        <AlertTriangle className="h-3 w-3" />
                        Suspicious timing patterns
                      </div>
                    )}
                    {selectedUserAnalysis.fraudIndicators.copyPasteDetected && (
                      <div className="flex items-center gap-2 text-yellow-600">
                        <AlertTriangle className="h-3 w-3" />
                        Copy-paste behavior detected
                      </div>
                    )}
                    {!Object.values(selectedUserAnalysis.fraudIndicators).some(Boolean) && (
                      <div className="text-green-600">No fraud indicators detected</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Learning Progress Chart */}
      {selectedUserAnalysis && learningProgressData.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
            <CardDescription>
              Confidence and stability progression for {selectedUserAnalysis.userEmail}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={learningProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="session" />
                <YAxis domain={[0, 100]} />
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
                  dataKey="stability" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  name="Stability"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* User List with Risk Assessment */}
      {userAnalyses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment Overview</CardTitle>
            <CardDescription>Users sorted by risk score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {userAnalyses
                .sort((a, b) => b.riskScore - a.riskScore)
                .slice(0, 10)
                .map((analysis) => (
                  <div 
                    key={analysis.userId} 
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => setSelectedUser(analysis.userId)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(analysis.profile.status)}`} />
                      <div>
                        <p className="font-medium">{analysis.userEmail}</p>
                        <p className="text-sm text-muted-foreground">
                          {analysis.profile.keystrokePatterns.length} patterns, 
                          {analysis.profile.confidenceScore}% confidence
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getRiskColor(analysis.riskScore)}`}>
                        {analysis.riskScore}%
                      </div>
                      <p className="text-xs text-muted-foreground">Risk</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BiometricMonitor;
