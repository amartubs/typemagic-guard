import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth';
import { AdvancedSessionMonitor, TrustScore, BehavioralDeviation } from '@/lib/monitoring/advancedSessionMonitor';
import { Shield, Activity, AlertTriangle, Users, Clock, Brain } from 'lucide-react';

export const SessionMonitoringDashboard: React.FC = () => {
  const { user } = useAuth();
  const [trustScore, setTrustScore] = useState<TrustScore | null>(null);
  const [deviations, setDeviations] = useState<BehavioralDeviation[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (!user || !isMonitoring) return;

    const interval = setInterval(async () => {
      // Calculate current trust score
      const score = AdvancedSessionMonitor.calculateAdaptiveTrustScore(user.id, 'medium');
      setTrustScore(score);

      // Check for behavioral deviations
      const behavioralDeviations = await AdvancedSessionMonitor.detectBehavioralDeviations(user.id, ['GDPR']);
      setDeviations(behavioralDeviations);
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [user, isMonitoring]);

  const startMonitoring = async () => {
    if (!user) return;
    
    await AdvancedSessionMonitor.initializeSession(user.id);
    setIsMonitoring(true);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    setTrustScore(null);
    setDeviations([]);
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  const getRiskLevelVariant = (level: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (level) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'secondary';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-blue-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Advanced Session Monitoring</h2>
          <p className="text-muted-foreground">Real-time behavioral analysis and trust scoring</p>
        </div>
        <div className="space-x-2">
          {!isMonitoring ? (
            <Button onClick={startMonitoring}>
              <Activity className="h-4 w-4 mr-2" />
              Start Monitoring
            </Button>
          ) : (
            <Button variant="outline" onClick={stopMonitoring}>
              <Activity className="h-4 w-4 mr-2" />
              Stop Monitoring
            </Button>
          )}
        </div>
      </div>

      {!isMonitoring && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Session Monitoring Features
            </CardTitle>
            <CardDescription>Advanced behavioral analysis and continuous authentication</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-semibold">Real-time Analysis</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Typing pattern analysis</li>
                  <li>• Behavioral deviation detection</li>
                  <li>• Session sharing detection</li>
                  <li>• Coercion indicators</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Trust Scoring</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Adaptive risk assessment</li>
                  <li>• Context-aware thresholds</li>
                  <li>• Multi-factor trust calculation</li>
                  <li>• Automated recommendations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isMonitoring && trustScore && (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Trust Score
                </CardTitle>
                <CardDescription>Current session trust level based on behavioral analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">{trustScore.current_score}</div>
                    <Badge variant={getRiskLevelVariant(trustScore.risk_level)} className="mb-4">
                      Risk Level: {trustScore.risk_level.toUpperCase()}
                    </Badge>
                    <Progress value={trustScore.current_score} className="h-3" />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold">Trust Factors</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Behavioral Consistency</span>
                        <span className="text-sm font-medium">{trustScore.factors.behavioral_consistency}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Session Legitimacy</span>
                        <span className="text-sm font-medium">{trustScore.factors.session_legitimacy}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Device Trust</span>
                        <span className="text-sm font-medium">{trustScore.factors.device_trust}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Time Context</span>
                        <span className="text-sm font-medium">{trustScore.factors.time_context}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Security Recommendations
                </CardTitle>
                <CardDescription>AI-generated security recommendations based on current risk level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trustScore.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  ))}
                </div>
                
                {trustScore.risk_level === 'critical' && (
                  <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm font-medium text-destructive mb-1">Critical Risk Detected</p>
                    <p className="text-xs text-destructive/80">Immediate security intervention may be required.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Behavioral Deviations
                {deviations.length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {deviations.length} Active
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Real-time detection of unusual behavioral patterns</CardDescription>
            </CardHeader>
            <CardContent>
              {deviations.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 mx-auto text-green-600 mb-3" />
                  <p className="text-sm text-muted-foreground">No behavioral deviations detected</p>
                  <p className="text-xs text-muted-foreground">Session appears normal</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {deviations.map((deviation, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className={`h-4 w-4 ${getSeverityColor(deviation.severity)}`} />
                          <h4 className="font-medium text-sm">{deviation.type.replace('_', ' ')}</h4>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {deviation.confidence}% confidence
                          </Badge>
                          <Badge variant={deviation.severity === 'critical' ? 'destructive' : 'secondary'} className="text-xs">
                            {deviation.severity}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{deviation.description}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(deviation.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};