import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Smartphone, 
  Mouse, 
  Keyboard, 
  Brain, 
  Monitor,
  Activity,
  Shield,
  Fingerprint,
  Eye,
  Info
} from 'lucide-react';
import MultiModalBiometricAuth from '@/components/biometric/MultiModalBiometricAuth';
import { deviceFingerprinting } from '@/lib/biometric/deviceFingerprinting';

const BiometricDemo: React.FC = () => {
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [fingerprint, setFingerprint] = useState<any>(null);
  const [authResults, setAuthResults] = useState<any[]>([]);

  React.useEffect(() => {
    loadDeviceInfo();
  }, []);

  const loadDeviceInfo = async () => {
    try {
      const capabilities = await deviceFingerprinting.detectDeviceCapabilities();
      const fp = await deviceFingerprinting.generateDeviceFingerprint();
      setDeviceInfo(capabilities);
      setFingerprint(fp);
    } catch (error) {
      console.error('Failed to load device info:', error);
    }
  };

  const handleAuthResult = (success: boolean, confidence: number, details: any) => {
    const result = {
      timestamp: new Date().toLocaleTimeString(),
      success,
      confidence,
      details,
      id: Date.now()
    };
    setAuthResults(prev => [result, ...prev.slice(0, 4)]); // Keep last 5 results
  };

  const ModalityCard = ({ icon, title, description, available, details }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    available: boolean;
    details: string;
  }) => (
    <Card className="p-4">
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-full ${available ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold">{title}</h3>
            <Badge variant={available ? "default" : "secondary"}>
              {available ? "Available" : "Unavailable"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{description}</p>
          <p className="text-xs text-muted-foreground">{details}</p>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Multi-Modal Biometric Authentication Demo</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience advanced biometric authentication that adapts to your device capabilities. 
            Test keystroke dynamics, touch patterns, mouse behavior, and behavioral analysis.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="demo">Live Demo</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="device">Device Info</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                This demo showcases adaptive biometric authentication that automatically detects your device 
                capabilities and uses the most appropriate biometric modalities for enhanced security.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ModalityCard
                icon={<Keyboard className="h-5 w-5" />}
                title="Keystroke Dynamics"
                description="Analyzes your unique typing rhythm, timing, and pressure patterns"
                available={deviceInfo?.hasKeyboard || false}
                details="Measures dwell time, flight time, and typing cadence for user identification"
              />

              <ModalityCard
                icon={<Smartphone className="h-5 w-5" />}
                title="Touch Dynamics"
                description="Captures touch pressure, swipe patterns, and gesture characteristics"
                available={deviceInfo?.hasTouch || false}
                details="Analyzes tap duration, pressure variance, and multi-touch gestures"
              />

              <ModalityCard
                icon={<Mouse className="h-5 w-5" />}
                title="Mouse Dynamics"
                description="Tracks mouse movement patterns, click behavior, and scroll dynamics"
                available={deviceInfo?.hasMouse || false}
                details="Studies velocity curves, acceleration patterns, and click timing"
              />

              <ModalityCard
                icon={<Brain className="h-5 w-5" />}
                title="Behavioral Analysis"
                description="Monitors usage patterns, timing, and contextual behavior"
                available={true}
                details="Tracks session timing, navigation patterns, and interaction frequency"
              />
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                How Multi-Modal Authentication Works
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <Monitor className="h-8 w-8 mx-auto text-primary" />
                  <h4 className="font-medium">1. Device Detection</h4>
                  <p className="text-sm text-muted-foreground">
                    Automatically detects device capabilities and available input methods
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <Fingerprint className="h-8 w-8 mx-auto text-primary" />
                  <h4 className="font-medium">2. Multi-Modal Capture</h4>
                  <p className="text-sm text-muted-foreground">
                    Simultaneously captures data from all available biometric modalities
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <Eye className="h-8 w-8 mx-auto text-primary" />
                  <h4 className="font-medium">3. Intelligent Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Combines individual scores using weighted algorithms for final decision
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Live Demo Tab */}
          <TabsContent value="demo" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Training Demo */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Biometric Training</h3>
                <MultiModalBiometricAuth
                  mode="training"
                  userEmail="demo-training@example.com"
                  onTraining={(success, patterns) => {
                    console.log('Training completed:', { success, patterns });
                  }}
                />
              </div>

              {/* Verification Demo */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Biometric Verification</h3>
                <MultiModalBiometricAuth
                  mode="verification"
                  userEmail="demo-verify@example.com"
                  onAuthentication={handleAuthResult}
                />
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Authentication Results</h3>
              {authResults.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No authentication attempts yet. Try the live demo above!
                </p>
              ) : (
                <div className="space-y-3">
                  {authResults.map((result) => (
                    <div key={result.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant={result.success ? "default" : "destructive"}>
                            {result.success ? "Success" : "Failed"}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{result.timestamp}</span>
                        </div>
                        <span className="font-semibold">{result.confidence}%</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Risk Score:</span> {result.details?.riskScore}%
                        </div>
                        <div>
                          <span className="font-medium">Modalities:</span> {result.details?.modalities?.join(', ')}
                        </div>
                      </div>
                      {result.details?.individualScores && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {Object.entries(result.details.individualScores).map(([modality, score]) => (
                            <Badge key={modality} variant="outline" className="text-xs">
                              {modality}: {Math.round(score as number)}%
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Device Info Tab */}
          <TabsContent value="device" className="space-y-6">
            {deviceInfo && fingerprint && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Device Capabilities</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Device Type:</span>
                      <Badge>{deviceInfo.deviceType}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Has Keyboard:</span>
                      <Badge variant={deviceInfo.hasKeyboard ? "default" : "secondary"}>
                        {deviceInfo.hasKeyboard ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Has Touch:</span>
                      <Badge variant={deviceInfo.hasTouch ? "default" : "secondary"}>
                        {deviceInfo.hasTouch ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Has Mouse:</span>
                      <Badge variant={deviceInfo.hasMouse ? "default" : "secondary"}>
                        {deviceInfo.hasMouse ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Screen Resolution:</span>
                      <span className="text-sm">{deviceInfo.screenResolution}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform:</span>
                      <span className="text-sm">{deviceInfo.platform}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Device Fingerprint</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Fingerprint ID:</span>
                      <p className="text-xs font-mono bg-muted p-2 rounded mt-1">
                        {fingerprint.id}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <span>Entropy Score:</span>
                      <Badge>{fingerprint.entropy.toFixed(2)}</Badge>
                    </div>
                    <div>
                      <span className="font-medium">Components Detected:</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {Object.keys(fingerprint.components).length} unique browser/device characteristics
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BiometricDemo;