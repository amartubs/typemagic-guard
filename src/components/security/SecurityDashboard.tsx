
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  TrendingDown,
  Eye,
  Lock,
  Unlock,
  Globe,
  MapPin,
  Clock,
  Activity
} from 'lucide-react';

interface SecurityEvent {
  id: string;
  type: 'login_success' | 'login_failure' | 'suspicious_activity' | 'data_access' | 'api_usage';
  timestamp: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  ipAddress: string;
  userAgent: string;
  resolved: boolean;
}

interface ThreatIntel {
  id: string;
  source: string;
  threatType: string;
  confidence: number;
  description: string;
  mitigation: string;
  timestamp: string;
}

const SecurityDashboard: React.FC = () => {
  const [securityEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'suspicious_activity',
      timestamp: '2024-01-15T14:30:00Z',
      description: 'Multiple failed login attempts from unusual location',
      severity: 'high',
      location: 'Moscow, Russia',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      resolved: false
    },
    {
      id: '2',
      type: 'login_success',
      timestamp: '2024-01-15T14:25:00Z',
      description: 'Successful biometric authentication',
      severity: 'low',
      location: 'New York, USA',
      ipAddress: '10.0.0.1',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      resolved: true
    }
  ]);

  const [threatIntel] = useState<ThreatIntel[]>([
    {
      id: '1',
      source: 'Internal Analysis',
      threatType: 'Brute Force Attack',
      confidence: 85,
      description: 'Coordinated login attempts detected from multiple IP addresses',
      mitigation: 'Rate limiting enabled, suspicious IPs blocked',
      timestamp: '2024-01-15T14:30:00Z'
    },
    {
      id: '2',
      source: 'External Feed',
      threatType: 'Known Malicious IP',
      confidence: 95,
      description: 'IP address 192.168.1.100 flagged in threat intelligence feeds',
      mitigation: 'Automatic blocking rule applied',
      timestamp: '2024-01-15T14:15:00Z'
    }
  ]);

  const securityScore = 78;
  const activeThreats = threatIntel.filter(t => t.confidence > 70).length;
  const unresolved = securityEvents.filter(e => !e.resolved && e.severity !== 'low').length;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <Eye className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      critical: 'destructive',
      high: 'destructive',
      medium: 'default',
      low: 'secondary'
    } as const;
    
    return <Badge variant={variants[severity as keyof typeof variants] || 'secondary'}>{severity}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Security Score</p>
                <p className="text-2xl font-bold">{securityScore}%</p>
              </div>
              <Shield className={`h-8 w-8 ${securityScore > 80 ? 'text-green-500' : securityScore > 60 ? 'text-yellow-500' : 'text-red-500'}`} />
            </div>
            <Progress value={securityScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Threats</p>
                <p className="text-2xl font-bold text-red-500">{activeThreats}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-500">+2 from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unresolved Events</p>
                <p className="text-2xl font-bold text-orange-500">{unresolved}</p>
              </div>
              <Eye className="h-8 w-8 text-orange-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">-1 from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Protection Status</p>
                <p className="text-2xl font-bold text-green-500">Active</p>
              </div>
              <Lock className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">All systems operational</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="threats">Threat Intelligence</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Recent Security Events
              </CardTitle>
              <CardDescription>
                Real-time monitoring of security-related activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityEvents.map((event) => (
                  <Card key={event.id} className="border-l-4 border-l-primary">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getSeverityIcon(event.severity)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{event.description}</h4>
                              {getSeverityBadge(event.severity)}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(event.timestamp).toLocaleString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Globe className="h-3 w-3" />
                                {event.ipAddress}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {event.resolved ? (
                            <Badge variant="secondary">Resolved</Badge>
                          ) : (
                            <Button size="sm" variant="outline">
                              Investigate
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Threat Intelligence
              </CardTitle>
              <CardDescription>
                External and internal threat analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {threatIntel.map((threat) => (
                  <Card key={threat.id} className="border-l-4 border-l-orange-500">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{threat.threatType}</h4>
                            <Badge variant="outline">{threat.source}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Confidence:</span>
                            <Badge variant={threat.confidence > 80 ? 'destructive' : 'default'}>
                              {threat.confidence}%
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{threat.description}</p>
                        
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Mitigation:</strong> {threat.mitigation}
                          </AlertDescription>
                        </Alert>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(threat.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Security Analysis
              </CardTitle>
              <CardDescription>
                Advanced security metrics and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Risk Assessment</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Authentication Security</span>
                        <div className="flex items-center gap-2">
                          <Progress value={85} className="w-20" />
                          <span className="text-sm text-green-600">85%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Data Protection</span>
                        <div className="flex items-center gap-2">
                          <Progress value={92} className="w-20" />
                          <span className="text-sm text-green-600">92%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Network Security</span>
                        <div className="flex items-center gap-2">
                          <Progress value={76} className="w-20" />
                          <span className="text-sm text-yellow-600">76%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Compliance</span>
                        <div className="flex items-center gap-2">
                          <Progress value={88} className="w-20" />
                          <span className="text-sm text-green-600">88%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Recommendations</h4>
                    <div className="space-y-2">
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          Enable additional rate limiting for API endpoints
                        </AlertDescription>
                      </Alert>
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          Two-factor authentication compliance is excellent
                        </AlertDescription>
                      </Alert>
                      <Alert>
                        <Eye className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          Consider implementing geo-blocking for high-risk regions
                        </AlertDescription>
                      </Alert>
                    </div>
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

export default SecurityDashboard;
