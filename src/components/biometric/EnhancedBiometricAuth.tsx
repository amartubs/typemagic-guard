
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Activity
} from 'lucide-react';
import KeystrokeCapture from '@/components/ui-custom/KeystrokeCapture';
import { AdvancedBiometricAnalyzer } from '@/lib/biometric/advancedAnalyzer';
import { ContinuousLearningEngine } from '@/lib/biometric/continuousLearning';
import { KeyTiming, KeystrokePattern, BiometricProfile } from '@/lib/types';
import { useAuth } from '@/contexts/auth';

interface EnhancedBiometricAuthProps {
  onAuthentication: (success: boolean, confidence: number) => void;
  mode: 'verification' | 'enrollment' | 'continuous';
  className?: string;
}

const EnhancedBiometricAuth: React.FC<EnhancedBiometricAuthProps> = ({
  onAuthentication,
  mode,
  className = ''
}) => {
  const { user } = useAuth();
  const [keystrokeTimings, setKeystrokeTimings] = useState<KeyTiming[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [profile, setProfile] = useState<BiometricProfile | null>(null);
  const [progress, setProgress] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    if (user?.biometricProfile) {
      setProfile(user.biometricProfile);
      setSessionCount(user.biometricProfile.keystrokePatterns.length);
    }
  }, [user]);

  const handleKeystrokeCapture = async (timings: KeyTiming[]) => {
    if (timings.length < 5) return; // Need sufficient data
    
    setKeystrokeTimings(timings);
    setIsAnalyzing(true);

    try {
      // Create pattern from captured timings
      const pattern: KeystrokePattern = {
        userId: user?.id || 'unknown',
        patternId: `pattern-${Date.now()}`,
        timings,
        timestamp: Date.now(),
        context: mode
      };

      if (mode === 'enrollment' || !profile) {
        // Enrollment mode: add to profile
        await handleEnrollment(pattern);
      } else {
        // Verification mode: analyze against profile
        await handleVerification(pattern);
      }
    } catch (error) {
      console.error('Biometric analysis error:', error);
      setAnalysisResult({
        success: false,
        error: 'Analysis failed. Please try again.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleEnrollment = async (pattern: KeystrokePattern) => {
    if (!profile) {
      // Create new profile
      const newProfile: BiometricProfile = {
        userId: user?.id || 'unknown',
        keystrokePatterns: [pattern],
        confidenceScore: 25, // Starting confidence
        lastUpdated: Date.now(),
        status: 'learning'
      };
      setProfile(newProfile);
      setSessionCount(1);
      setProgress(20);
    } else {
      // Update existing profile using continuous learning
      const updatedProfile = await ContinuousLearningEngine.updateProfileWithLearning(
        profile,
        pattern,
        { 
          success: true, 
          confidenceScore: 75, 
          timestamp: Date.now(), 
          userId: pattern.userId, 
          patternId: pattern.patternId 
        }
      );
      
      setProfile(updatedProfile);
      setSessionCount(updatedProfile.keystrokePatterns.length);
      setProgress(Math.min(100, (updatedProfile.keystrokePatterns.length / 10) * 100));
    }

    setAnalysisResult({
      success: true,
      mode: 'enrollment',
      message: `Training session ${sessionCount + 1} completed. Continue typing to improve accuracy.`
    });

    onAuthentication(true, profile?.confidenceScore || 25);
  };

  const handleVerification = async (pattern: KeystrokePattern) => {
    if (!profile) {
      setAnalysisResult({
        success: false,
        error: 'No biometric profile found. Please complete enrollment first.'
      });
      onAuthentication(false, 0);
      return;
    }

    // Use advanced analyzer with fraud detection
    const result = AdvancedBiometricAnalyzer.analyzePatternWithFraudDetection(
      profile,
      pattern
    );

    // Update profile with continuous learning if authentication was successful
    if (result.success) {
      const updatedProfile = await ContinuousLearningEngine.updateProfileWithLearning(
        profile,
        pattern,
        result
      );
      setProfile(updatedProfile);
    }

    setAnalysisResult({
      ...result,
      mode: 'verification'
    });

    onAuthentication(result.success, result.confidenceScore);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'learning': return 'bg-blue-500';
      case 'locked': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPromptText = () => {
    switch (mode) {
      case 'enrollment':
        return `Training Session ${sessionCount + 1}: Type the sentence below to train your biometric profile.`;
      case 'verification':
        return 'Type the sentence below to verify your identity using biometric authentication.';
      case 'continuous':
        return 'Continue typing normally. Your biometric profile is being continuously updated.';
      default:
        return 'Type to begin biometric analysis.';
    }
  };

  const getSampleText = () => {
    const texts = [
      "The quick brown fox jumps over the lazy dog.",
      "Biometric authentication provides enhanced security through unique typing patterns.",
      "Machine learning algorithms analyze keystroke dynamics for user identification.",
      "Advanced fraud detection systems protect against automated attacks.",
      "Continuous learning improves authentication accuracy over time."
    ];
    return texts[sessionCount % texts.length];
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <CardTitle>Enhanced Biometric Authentication</CardTitle>
            </div>
            {profile && (
              <Badge className={getStatusColor(profile.status)}>
                {profile.status}
              </Badge>
            )}
          </div>
          <CardDescription>{getPromptText()}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Profile Status */}
          {profile && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getConfidenceColor(profile.confidenceScore)}`}>
                  {profile.confidenceScore}%
                </div>
                <p className="text-sm text-muted-foreground">Confidence</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{profile.keystrokePatterns.length}</div>
                <p className="text-sm text-muted-foreground">Training Sessions</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  {profile.status === 'active' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Activity className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Status</p>
              </div>
            </div>
          )}

          {/* Training Progress */}
          {mode === 'enrollment' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Training Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-muted-foreground">
                Complete 10 training sessions for optimal accuracy
              </p>
            </div>
          )}

          {/* Sample Text */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-4 border-blue-500">
            <p className="font-medium text-blue-900 dark:text-blue-100">
              {getSampleText()}
            </p>
          </div>

          {/* Keystroke Capture */}
          <KeystrokeCapture
            onCapture={handleKeystrokeCapture}
            captureContext={mode}
            autoStart={true}
            className="min-h-[60px]"
            inputProps={{
              placeholder: "Type the sample text here...",
              disabled: isAnalyzing
            }}
          />

          {/* Analysis Status */}
          {isAnalyzing && (
            <div className="flex items-center gap-2 text-blue-600">
              <Activity className="h-4 w-4 animate-spin" />
              <span>Analyzing keystroke pattern...</span>
            </div>
          )}

          {/* Results */}
          {analysisResult && (
            <Alert className={analysisResult.success ? 'border-green-500' : 'border-red-500'}>
              <div className="flex items-center gap-2">
                {analysisResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <div className="flex-1">
                  <AlertDescription>
                    {analysisResult.error || analysisResult.message || 
                      `${analysisResult.mode === 'verification' ? 'Authentication' : 'Training'} ${
                        analysisResult.success ? 'successful' : 'failed'
                      }. Confidence: ${analysisResult.confidenceScore}%`
                    }
                  </AlertDescription>
                  
                  {/* Fraud Indicators */}
                  {analysisResult.fraudIndicators && Object.values(analysisResult.fraudIndicators).some(Boolean) && (
                    <div className="mt-2 space-y-1">
                      <p className="text-sm font-medium text-orange-600">Security Alerts:</p>
                      <div className="text-xs space-y-1">
                        {analysisResult.fraudIndicators.machineGeneratedPattern && (
                          <div className="flex items-center gap-1 text-red-600">
                            <AlertTriangle className="h-3 w-3" />
                            Machine-generated pattern detected
                          </div>
                        )}
                        {analysisResult.fraudIndicators.suspiciousTimingPatterns && (
                          <div className="flex items-center gap-1 text-orange-600">
                            <AlertTriangle className="h-3 w-3" />
                            Suspicious timing patterns
                          </div>
                        )}
                        {analysisResult.fraudIndicators.copyPasteDetected && (
                          <div className="flex items-center gap-1 text-yellow-600">
                            <AlertTriangle className="h-3 w-3" />
                            Copy-paste behavior detected
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={() => setAnalysisResult(null)}
              variant="outline"
              disabled={isAnalyzing}
            >
              Clear Results
            </Button>
            
            {mode === 'enrollment' && profile?.status === 'active' && (
              <Button 
                onClick={() => onAuthentication(true, profile.confidenceScore)}
                className="ml-auto"
              >
                Complete Enrollment
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedBiometricAuth;
