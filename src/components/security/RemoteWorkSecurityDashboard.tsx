import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Monitor, Wifi, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { RemoteWorkSecurityEngine } from '@/lib/security/remoteWorkSecurityEngine';
import { VDISessionMonitor, BYODTrustVerification, DeviceTrustLevel } from '@/types/advancedSecurity';
import { useAuth } from '@/contexts/auth';

export const RemoteWorkSecurityDashboard: React.FC = () => {
  const { user } = useAuth();
  const [vdiSessions, setVdiSessions] = useState<VDISessionMonitor[]>([]);
  const [byodDevices, setBYODDevices] = useState<BYODTrustVerification[]>([]);
  const [monitoring, setMonitoring] = useState(false);

  useEffect(() => {
    if (monitoring) {
      const interval = setInterval(() => {
        setVdiSessions(RemoteWorkSecurityEngine.getAllVDISessions());
        setBYODDevices(RemoteWorkSecurityEngine.getAllBYODDevices());
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [monitoring]);

  const startVDISession = async () => {
    if (!user?.id) return;
    
    const sessionId = crypto.randomUUID();
    const vdiInstanceId = `vdi-${Math.random().toString(36).substr(2, 9)}`;
    
    await RemoteWorkSecurityEngine.startVDISessionMonitoring(user.id, sessionId, vdiInstanceId);
    setMonitoring(true);
  };

  const verifyBYODDevice = async () => {
    if (!user?.id) return;
    
    const deviceFingerprint = `device-${Math.random().toString(36).substr(2, 12)}`;
    await RemoteWorkSecurityEngine.verifyBYODDevice(user.id, deviceFingerprint);
  };

  const getTrustLevelColor = (level: DeviceTrustLevel): string => {
    switch (level) {
      case 'highly_trusted': return 'text-success';
      case 'trusted': return 'text-success';
      case 'verified': return 'text-warning';
      case 'limited': return 'text-destructive';
      case 'untrusted': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getTrustLevelBadgeVariant = (level: DeviceTrustLevel) => {
    switch (level) {
      case 'highly_trusted': return 'default';
      case 'trusted': return 'secondary';
      case 'verified': return 'outline';
      case 'limited': return 'destructive';
      case 'untrusted': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Remote Work Security</h2>
          <p className="text-muted-foreground">
            Monitor VDI sessions, BYOD devices, and remote access security
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={startVDISession} className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Start VDI Session
          </Button>
          <Button onClick={verifyBYODDevice} variant="outline" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Verify BYOD Device
          </Button>
        </div>
      </div>

      <Tabs defaultValue="vdi" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vdi">VDI Sessions</TabsTrigger>
          <TabsTrigger value="byod">BYOD Devices</TabsTrigger>
          <TabsTrigger value="vpn">VPN Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="vdi" className="space-y-4">
          <div className="grid gap-4">
            {vdiSessions.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Active VDI Sessions</h3>
                    <p className="text-muted-foreground mb-4">Start a VDI session to begin monitoring</p>
                    <Button onClick={startVDISession}>Start VDI Session</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              vdiSessions.map((session) => (
                <Card key={session.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Monitor className="h-5 w-5" />
                        VDI Session: {session.vdi_instance_id}
                      </CardTitle>
                      <Badge variant={session.zero_trust_score > 80 ? 'default' : session.zero_trust_score > 60 ? 'secondary' : 'destructive'}>
                        Trust Score: {session.zero_trust_score}%
                      </Badge>
                    </div>
                    <CardDescription>
                      Session ID: {session.session_id}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Connection Quality</div>
                        <Progress value={session.connection_quality} className="h-2" />
                        <div className="text-xs text-muted-foreground">{session.connection_quality.toFixed(1)}%</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Latency</div>
                        <div className="text-lg font-semibold">{session.latency_ms.toFixed(0)}ms</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Bandwidth Usage</div>
                        <div className="text-lg font-semibold">{session.bandwidth_usage.toFixed(1)} MB/s</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Device Trust</div>
                        <Badge variant={getTrustLevelBadgeVariant(session.device_trust_level)}>
                          {session.device_trust_level.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        {session.vpn_verified ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                        <span className="text-sm">VPN Verified</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {session.screen_sharing_detected ? (
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-success" />
                        )}
                        <span className="text-sm">Screen Sharing: {session.screen_sharing_detected ? 'Detected' : 'None'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Shoulder Surfing Risk: {session.shoulder_surfing_risk}%</span>
                      </div>
                    </div>

                    {session.shoulder_surfing_risk > 50 && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          High shoulder surfing risk detected. Consider moving to a more secure location.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="byod" className="space-y-4">
          <div className="grid gap-4">
            {byodDevices.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No BYOD Devices Verified</h3>
                    <p className="text-muted-foreground mb-4">Verify your device to begin BYOD monitoring</p>
                    <Button onClick={verifyBYODDevice}>Verify Device</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              byodDevices.map((device) => (
                <Card key={device.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        {device.device_type}
                      </CardTitle>
                      <Badge variant={getTrustLevelBadgeVariant(device.trust_level)}>
                        {device.trust_level.replace('_', ' ')}
                      </Badge>
                    </div>
                    <CardDescription>
                      OS: {device.os_version} | Compliance: {device.compliance_score}%
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        {device.security_patches_up_to_date ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                        <span className="text-sm">Security Patches</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {device.antivirus_status === 'active' ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                        <span className="text-sm">Antivirus: {device.antivirus_status}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {device.firewall_enabled ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                        <span className="text-sm">Firewall</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {device.encryption_enabled ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                        <span className="text-sm">Encryption</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Compliance Score</div>
                      <Progress value={device.compliance_score} className="h-2" />
                      <div className="text-xs text-muted-foreground">{device.compliance_score}% compliant</div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Last verified: {new Date(device.last_verification).toLocaleString()}
                      <br />
                      Expires: {new Date(device.expiry_date).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="vpn" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                VPN Continuous Authentication
              </CardTitle>
              <CardDescription>
                Monitor VPN connections and continuous authentication status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Wifi className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">VPN Monitoring</h3>
                <p className="text-muted-foreground">
                  VPN monitoring features will be available when a VPN connection is detected
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};