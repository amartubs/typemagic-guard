import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, Eye, Command, Lock } from 'lucide-react';
import { GovernmentSecurityEngine } from '@/lib/security/governmentSecurityEngine';
import { InsiderThreatDetection, CoercionDetection, CommandControlVerification, CriticalSystemAccess, ThreatLevel } from '@/types/advancedSecurity';
import { useAuth } from '@/contexts/auth';

export const GovernmentSecurityDashboard: React.FC = () => {
  const { user } = useAuth();
  const [insiderThreats, setInsiderThreats] = useState<InsiderThreatDetection[]>([]);
  const [coercionDetections, setCoercionDetections] = useState<CoercionDetection[]>([]);
  const [commandVerifications, setCommandVerifications] = useState<CommandControlVerification[]>([]);
  const [criticalAccess, setCriticalAccess] = useState<CriticalSystemAccess[]>([]);
  const [monitoring, setMonitoring] = useState(false);

  useEffect(() => {
    if (monitoring) {
      const interval = setInterval(() => {
        setInsiderThreats(GovernmentSecurityEngine.getAllInsiderThreats());
        setCoercionDetections(GovernmentSecurityEngine.getAllCoercionDetections());
        setCommandVerifications(GovernmentSecurityEngine.getAllCommandVerifications());
        setCriticalAccess(GovernmentSecurityEngine.getAllCriticalAccess());
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [monitoring]);

  const startInsiderThreatMonitoring = async () => {
    if (!user?.id) return;
    await GovernmentSecurityEngine.initializeInsiderThreatMonitoring(user.id, 'classified');
    setMonitoring(true);
  };

  const startCoercionDetection = async () => {
    if (!user?.id) return;
    const sessionId = crypto.randomUUID();
    await GovernmentSecurityEngine.initializeCoercionDetection(user.id, sessionId);
  };

  const requestCriticalAccess = async () => {
    if (!user?.id) return;
    const systemId = `system-${Date.now()}`;
    await GovernmentSecurityEngine.authorizeCriticalSystemAccess(user.id, systemId, 'admin');
  };

  const getThreatLevelColor = (level: ThreatLevel): string => {
    switch (level) {
      case 'critical': return 'text-destructive';
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-warning';
      default: return 'text-success';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Government Security</h2>
          <p className="text-muted-foreground">Critical infrastructure and insider threat monitoring</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={startInsiderThreatMonitoring} className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Start Monitoring
          </Button>
          <Button onClick={startCoercionDetection} variant="outline">Coercion Detection</Button>
          <Button onClick={requestCriticalAccess} variant="outline">Request Access</Button>
        </div>
      </div>

      <Tabs defaultValue="threats" className="space-y-4">
        <TabsList>
          <TabsTrigger value="threats">Insider Threats</TabsTrigger>
          <TabsTrigger value="coercion">Coercion Detection</TabsTrigger>
          <TabsTrigger value="commands">Command Control</TabsTrigger>
          <TabsTrigger value="access">Critical Access</TabsTrigger>
        </TabsList>

        <TabsContent value="threats" className="space-y-4">
          {insiderThreats.map((threat) => (
            <Card key={threat.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Employee: {threat.employee_id}</CardTitle>
                  <Badge variant={threat.risk_level === 'critical' ? 'destructive' : threat.risk_level === 'high' ? 'destructive' : 'secondary'}>
                    {threat.risk_level} risk
                  </Badge>
                </div>
                <CardDescription>Access Level: {threat.access_level}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Anomaly Score</div>
                    <Progress value={threat.anomaly_score} className="h-2" />
                    <div className="text-xs text-muted-foreground">{threat.anomaly_score.toFixed(1)}%</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Investigation Priority</div>
                    <div className="text-lg font-semibold">{threat.investigation_priority}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Escalation</div>
                    <div className={threat.escalation_required ? 'text-destructive' : 'text-success'}>
                      {threat.escalation_required ? 'Required' : 'None'}
                    </div>
                  </div>
                </div>
                {threat.threat_indicators.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Threat Indicators</div>
                    <div className="flex flex-wrap gap-2">
                      {threat.threat_indicators.slice(0, 3).map((indicator, index) => (
                        <Badge key={index} variant="outline">{indicator}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="coercion" className="space-y-4">
          {coercionDetections.map((detection) => (
            <Card key={detection.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Coercion Detection</CardTitle>
                  <Badge variant={detection.duress_probability > 75 ? 'destructive' : detection.duress_probability > 50 ? 'secondary' : 'default'}>
                    Duress: {detection.duress_probability.toFixed(1)}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Behavioral Distress</div>
                    <Progress value={detection.behavioral_distress_score} className="h-2" />
                    <div className="text-xs text-muted-foreground">{detection.behavioral_distress_score.toFixed(1)}%</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Typing Pressure</div>
                    <div className="text-lg font-semibold">{detection.typing_pressure_anomalies}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Hesitation</div>
                    <div className="text-lg font-semibold">{detection.hesitation_patterns}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Emergency Protocol</div>
                    <div className={detection.emergency_protocol_triggered ? 'text-destructive' : 'text-success'}>
                      {detection.emergency_protocol_triggered ? 'Triggered' : 'Normal'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="commands" className="space-y-4">
          {commandVerifications.map((verification) => (
            <Card key={verification.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Command: {verification.command_type}</CardTitle>
                  <Badge variant={
                    verification.verification_status === 'authorized' ? 'default' :
                    verification.verification_status === 'denied' ? 'destructive' : 'secondary'
                  }>
                    {verification.verification_status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Biometric Score</div>
                    <Progress value={verification.biometric_verification} className="h-2" />
                    <div className="text-xs text-muted-foreground">{verification.biometric_verification.toFixed(1)}%</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Stress Analysis</div>
                    <Progress value={verification.stress_analysis} className="h-2" />
                    <div className="text-xs text-muted-foreground">{verification.stress_analysis.toFixed(1)}%</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Dual Person</div>
                    <div className={verification.dual_person_integrity ? 'text-success' : 'text-destructive'}>
                      {verification.dual_person_integrity ? 'Verified' : 'Failed'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Timing</div>
                    <div className={verification.timing_verification ? 'text-success' : 'text-destructive'}>
                      {verification.timing_verification ? 'Valid' : 'Invalid'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          {criticalAccess.map((access) => (
            <Card key={access.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>System: {access.system_id}</CardTitle>
                  <Badge variant={access.access_granted ? 'default' : 'destructive'}>
                    {access.access_granted ? 'Granted' : 'Denied'}
                  </Badge>
                </div>
                <CardDescription>Access Level: {access.access_level}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Trust Score</div>
                    <Progress value={access.behavioral_trust_score} className="h-2" />
                    <div className="text-xs text-muted-foreground">{access.behavioral_trust_score.toFixed(1)}%</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Session Integrity</div>
                    <Progress value={access.session_integrity} className="h-2" />
                    <div className="text-xs text-muted-foreground">{access.session_integrity.toFixed(1)}%</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Multi-Factor</div>
                    <div className={access.multi_factor_status ? 'text-success' : 'text-destructive'}>
                      {access.multi_factor_status ? 'Verified' : 'Failed'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Monitoring</div>
                    <div className={access.monitoring_active ? 'text-success' : 'text-muted-foreground'}>
                      {access.monitoring_active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};