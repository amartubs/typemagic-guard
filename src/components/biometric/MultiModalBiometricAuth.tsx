import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Smartphone, 
  Mouse, 
  Keyboard, 
  Brain, 
  CheckCircle, 
  AlertCircle,
  Activity,
  Fingerprint
} from 'lucide-react';
import { multiModalProcessor } from '@/lib/biometric/multiModalProcessor';
import { deviceFingerprinting } from '@/lib/biometric/deviceFingerprinting';
import KeystrokeCapture from '@/components/ui-custom/KeystrokeCapture';

interface MultiModalBiometricAuthProps {
  mode: 'training' | 'verification';
  onAuthentication?: (success: boolean, confidence: number, details?: any) => void;
  onTraining?: (success: boolean, patterns: number) => void;
  className?: string;
  userEmail?: string;
}

interface ModalityStatus {
  name: string;
  icon: React.ReactNode;
  active: boolean;
  confidence?: number;
  status: 'idle' | 'capturing' | 'analyzing' | 'complete' | 'error';
}

const MultiModalBiometricAuth: React.FC<MultiModalBiometricAuthProps> = ({
  mode,
  onAuthentication,
  onTraining,
  className = '',
  userEmail = 'demo@example.com'
}) => {
  const { toast } = useToast();
  const [isCapturing, setIsCapturing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [deviceCapabilities, setDeviceCapabilities] = useState<any>(null);
  const [modalities, setModalities] = useState<ModalityStatus[]>([]);

  useEffect(() => {
    initializeCapabilities();
  }, []);

  const initializeCapabilities = async () => {
    try {
      const capabilities = await deviceFingerprinting.detectDeviceCapabilities();
      setDeviceCapabilities(capabilities);

      // Initialize modality status based on device capabilities
      const availableModalities: ModalityStatus[] = [];

      if (capabilities.hasKeyboard) {
        availableModalities.push({
          name: 'Keystroke Dynamics',
          icon: <Keyboard className="h-4 w-4" />,
          active: true,
          status: 'idle'
        });
      }

      if (capabilities.hasTouch) {
        availableModalities.push({
          name: 'Touch Dynamics',
          icon: <Smartphone className="h-4 w-4" />,
          active: true,
          status: 'idle'
        });
      }

      if (capabilities.hasMouse) {
        availableModalities.push({
          name: 'Mouse Dynamics',
          icon: <Mouse className="h-4 w-4" />,
          active: true,
          status: 'idle'
        });
      }

      // Behavioral analysis is always available
      availableModalities.push({
        name: 'Behavioral Analysis',
        icon: <Brain className="h-4 w-4" />,
        active: true,
        status: 'idle'
      });

      setModalities(availableModalities);
    } catch (error) {
      console.error('Failed to initialize device capabilities:', error);
      toast({
        title: "Device Detection Failed",
        description: "Could not detect device capabilities. Using basic mode.",
        variant: "destructive"
      });
    }
  };

  const startCapture = async () => {
    if (!deviceCapabilities) {
      toast({
        title: "Device Not Ready",
        description: "Please wait for device capabilities to be detected.",
        variant: "destructive"
      });
      return;
    }

    setIsCapturing(true);
    setProgress(0);
    setResult(null);

    // Update modality status to capturing
    setModalities(prev => prev.map(m => ({ ...m, status: 'capturing' as const })));

    try {
      // Start multi-modal capture
      await multiModalProcessor.startCapture(userEmail);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 300);

      // Auto-stop after 3 seconds for demo
      setTimeout(async () => {
        clearInterval(progressInterval);
        await stopCapture();
      }, 3000);

    } catch (error) {
      console.error('Failed to start capture:', error);
      setIsCapturing(false);
      toast({
        title: "Capture Failed",
        description: "Failed to start biometric capture. Please try again.",
        variant: "destructive"
      });
    }
  };

  const stopCapture = async () => {
    if (!isCapturing) return;

    try {
      // Update status to analyzing
      setModalities(prev => prev.map(m => ({ ...m, status: 'analyzing' as const })));

      // Stop capture and analyze
      const authResult = await multiModalProcessor.stopCaptureAndAnalyze(userEmail);
      
      // Update modality status with results
      setModalities(prev => prev.map(modality => {
        const modalityKey = modality.name.toLowerCase().includes('keystroke') ? 'keystroke' :
                            modality.name.toLowerCase().includes('touch') ? 'touch' :
                            modality.name.toLowerCase().includes('mouse') ? 'mouse' :
                            modality.name.toLowerCase().includes('behavioral') ? 'behavioral' : null;

        return {
          ...modality,
          status: 'complete',
          confidence: modalityKey ? authResult.individualScores[modalityKey] : undefined
        };
      }));

      setResult(authResult);
      setProgress(100);

      // Notify parent components
      if (mode === 'verification' && onAuthentication) {
        onAuthentication(authResult.success, authResult.combinedConfidence, authResult);
      } else if (mode === 'training' && onTraining) {
        onTraining(authResult.success, authResult.modalities.length);
      }

      toast({
        title: authResult.success ? "Authentication Successful" : "Authentication Failed",
        description: `Combined confidence: ${authResult.combinedConfidence}% (Risk: ${authResult.riskScore}%)`,
        variant: authResult.success ? "default" : "destructive"
      });

    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication Error",
        description: "Failed to complete biometric authentication.",
        variant: "destructive"
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'capturing': return 'bg-blue-500';
      case 'analyzing': return 'bg-yellow-500';
      case 'complete': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'capturing': return <Activity className="h-3 w-3 animate-pulse" />;
      case 'analyzing': return <Activity className="h-3 w-3 animate-spin" />;
      case 'complete': return <CheckCircle className="h-3 w-3" />;
      case 'error': return <AlertCircle className="h-3 w-3" />;
      default: return <Shield className="h-3 w-3" />;
    }
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Fingerprint className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">
            Multi-Modal Biometric {mode === 'training' ? 'Training' : 'Authentication'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {deviceCapabilities ? 
              `Using ${modalities.length} biometric modalities on ${deviceCapabilities.deviceType}` :
              'Detecting device capabilities...'}
          </p>
        </div>

        {/* Device Info */}
        {deviceCapabilities && (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Device Type:</strong> {deviceCapabilities.deviceType} | 
              <strong> Capabilities:</strong> {
                [
                  deviceCapabilities.hasKeyboard && 'Keyboard',
                  deviceCapabilities.hasTouch && 'Touch',
                  deviceCapabilities.hasMouse && 'Mouse',
                  'Behavioral'
                ].filter(Boolean).join(', ')
              }
            </AlertDescription>
          </Alert>
        )}

        {/* Modality Status */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Biometric Modalities</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {modalities.map((modality, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {modality.icon}
                  <span className="text-sm font-medium">{modality.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {modality.confidence && (
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(modality.confidence)}%
                    </Badge>
                  )}
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(modality.status)}`} />
                  {getStatusIcon(modality.status)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Keystroke Input (if available) */}
        {deviceCapabilities?.hasKeyboard && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Keystroke Capture</label>
            <KeystrokeCapture 
              captureContext={mode}
              autoStart={false}
              hideVisuals={false}
              inputProps={{
                placeholder: "Type here to capture your keystroke pattern...",
                disabled: !isCapturing
              }}
            />
          </div>
        )}

        {/* Progress */}
        {isCapturing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Capturing biometric data...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Results */}
        {result && (
          <Alert className={result.success ? 'border-green-500' : 'border-red-500'}>
            {result.success ? 
              <CheckCircle className="h-4 w-4 text-green-500" /> : 
              <AlertCircle className="h-4 w-4 text-red-500" />
            }
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-medium">
                  {result.success ? 'Authentication Successful' : 'Authentication Failed'}
                </div>
                <div className="text-sm">
                  <strong>Combined Confidence:</strong> {result.combinedConfidence}%
                </div>
                <div className="text-sm">
                  <strong>Risk Score:</strong> {result.riskScore}%
                </div>
                <div className="text-sm">
                  <strong>Modalities Used:</strong> {result.modalities.join(', ')}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Action Button */}
        <Button 
          onClick={isCapturing ? stopCapture : startCapture}
          disabled={!deviceCapabilities}
          className="w-full"
          variant={isCapturing ? "destructive" : "default"}
        >
          {isCapturing ? 'Stop Capture' : `Start ${mode === 'training' ? 'Training' : 'Authentication'}`}
        </Button>
      </div>
    </Card>
  );
};

export default MultiModalBiometricAuth;