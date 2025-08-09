
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Activity, CheckCircle, AlertTriangle } from 'lucide-react';
import { BiometricProfile, KeystrokePattern, KeyTiming } from '@/lib/types';
import { BiometricAnalyzer, KeystrokeCapture } from '@/lib/biometricAuth';
import { useAuth } from '@/contexts/auth';
import KeystrokeVisualizer from '@/components/demo/KeystrokeVisualizer';
import ConfidenceScoreAnimation from '@/components/demo/ConfidenceScoreAnimation';
import { supabase } from '@/integrations/supabase/client';
import { ContinuousLearningEngine } from '@/lib/biometric/continuousLearning';
interface EnhancedBiometricAuthProps {
  mode: 'registration' | 'verification';
  onAuthentication: (success: boolean, confidence: number) => void;
  className?: string;
  requiredPhrase?: string;
}

const EnhancedBiometricAuth: React.FC<EnhancedBiometricAuthProps> = ({
  mode,
  onAuthentication,
  className = '',
  requiredPhrase = "My voice is my passport, verify me."
}) => {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [keystrokes, setKeystrokes] = useState<KeyTiming[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [keystrokeCapture] = useState(() => new KeystrokeCapture('biometric-auth'));
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCapturing) {
        keystrokeCapture.handleKeyDown(e);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isCapturing) {
        keystrokeCapture.handleKeyUp(e);
        
        // Update progress based on input length vs required phrase
        const newProgress = Math.min((input.length / requiredPhrase.length) * 100, 100);
        setProgress(newProgress);
        
        // Analyze if we have enough keystrokes
        if (input.length >= requiredPhrase.length * 0.8) {
          analyzePattern();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [isCapturing, input, requiredPhrase.length]);

  const startCapture = () => {
    setIsCapturing(true);
    setInput('');
    setKeystrokes([]);
    setConfidenceScore(0);
    setAnalysisComplete(false);
    setProgress(0);
    keystrokeCapture.startCapture();
  };

  const stopCapture = () => {
    setIsCapturing(false);
    const capturedKeystrokes = keystrokeCapture.stopCapture();
    setKeystrokes(capturedKeystrokes);
    return capturedKeystrokes;
  };

  const analyzePattern = async () => {
    if (!user) return;

    try {
      const capturedKeystrokes = stopCapture();
      if (capturedKeystrokes.length < 5) return;

      // Build new pattern from captured keystrokes
      const newPattern: KeystrokePattern = keystrokeCapture.createPattern(user.id);

      // Fetch existing biometric profile and related patterns
      const { data: dbProfile, error } = await supabase
        .from('biometric_profiles')
        .select(`*, keystroke_patterns(*)`)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Failed to load biometric profile:', error);
      }

      // Reconstruct profile from DB (patterns may be encrypted; if so, they will be learned over time)
      const existingPatterns: KeystrokePattern[] = (dbProfile?.keystroke_patterns || []).map((kp: any) => ({
        userId: user.id,
        patternId: kp.id,
        timings: kp.pattern_data?.timings || [],
        timestamp: new Date(kp.created_at).getTime(),
        context: kp.context || 'unknown'
      }));

      const profile: BiometricProfile = {
        userId: user.id,
        keystrokePatterns: existingPatterns,
        confidenceScore: dbProfile?.confidence_score || 0,
        lastUpdated: new Date(dbProfile?.last_updated || Date.now()).getTime(),
        status: dbProfile?.status || 'learning'
      };

      // Compute authentication result against existing profile
      const result = BiometricAnalyzer.authenticate(profile, newPattern);

      // Continuous learning will persist successful/high-confidence attempts and update the profile
      await ContinuousLearningEngine.updateProfileWithLearning(profile, newPattern, result);

      // Persist authentication attempt for monitoring
      await supabase.from('authentication_attempts').insert({
        user_id: user.id,
        success: result.success,
        confidence_score: Math.round(result.confidenceScore),
        pattern_id: null,
        anomaly_details: result.anomalyDetails || null,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null
      });

      setConfidenceScore(result.confidenceScore);
      setAnalysisComplete(true);
      onAuthentication(result.success, result.confidenceScore);
    } catch (error) {
      console.error('Error analyzing biometric pattern:', error);
      onAuthentication(false, 0);
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    
    // Auto-analyze when the required phrase is complete
    if (value.length >= requiredPhrase.length && isCapturing) {
      setTimeout(analyzePattern, 500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCapturing) {
      analyzePattern();
    } else {
      startCapture();
    }
  };

  const resetCapture = () => {
    setIsCapturing(false);
    setInput('');
    setKeystrokes([]);
    setConfidenceScore(0);
    setAnalysisComplete(false);
    setProgress(0);
  };

  const getStatusMessage = () => {
    if (!isCapturing && !analysisComplete) {
      return mode === 'registration' 
        ? 'Ready to capture your typing pattern for registration'
        : 'Ready to verify your identity';
    }
    
    if (isCapturing && !analysisComplete) {
      return 'Analyzing your typing pattern...';
    }
    
    if (analysisComplete) {
      const success = confidenceScore >= 70;
      return success 
        ? `${mode === 'registration' ? 'Registration' : 'Verification'} successful!`
        : 'Pattern verification failed. Please try again.';
    }
    
    return '';
  };

  const getStatusIcon = () => {
    if (isCapturing) return <Activity className="h-5 w-5 text-blue-500 animate-pulse" />;
    if (analysisComplete && confidenceScore >= 70) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (analysisComplete && confidenceScore < 70) return <AlertTriangle className="h-5 w-5 text-red-500" />;
    return <Shield className="h-5 w-5 text-muted-foreground" />;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Biometric {mode === 'registration' ? 'Registration' : 'Verification'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              {mode === 'registration' 
                ? 'Type the phrase below to create your unique biometric signature.'
                : 'Type the phrase below to verify your identity.'
              }
            </AlertDescription>
          </Alert>

          <div className="p-4 bg-muted rounded-lg">
            <Label className="text-sm font-medium">Required phrase:</Label>
            <p className="text-lg font-mono mt-1">"{requiredPhrase}"</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="biometric-input">
                {isCapturing ? 'Type the phrase above:' : 'Click Start to begin'}
              </Label>
              <Input
                id="biometric-input"
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={isCapturing ? "Type here..." : "Click Start Capture first"}
                disabled={!isCapturing}
                className="font-mono"
              />
            </div>

            {isCapturing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress:</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            <div className="flex gap-2">
              {!isCapturing && !analysisComplete && (
                <Button type="submit" className="flex-1">
                  Start Capture
                </Button>
              )}
              
              {isCapturing && (
                <Button type="submit" className="flex-1">
                  Complete Analysis
                </Button>
              )}
              
              {analysisComplete && (
                <Button type="button" onClick={resetCapture} variant="outline" className="flex-1">
                  Try Again
                </Button>
              )}
            </div>

            {getStatusMessage() && (
              <Alert variant={analysisComplete && confidenceScore >= 70 ? "default" : "destructive"}>
                <AlertDescription className="flex items-center gap-2">
                  {getStatusIcon()}
                  {getStatusMessage()}
                  {analysisComplete && (
                    <span className="ml-auto font-medium">
                      {confidenceScore.toFixed(1)}% confidence
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Real-time visualization */}
      {isCapturing && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ConfidenceScoreAnimation 
            score={confidenceScore}
            isUpdating={isCapturing}
            label="Real-time Analysis"
          />
          <KeystrokeVisualizer 
            keystrokes={keystrokes}
            isActive={isCapturing}
          />
        </div>
      )}
    </div>
  );
};

export default EnhancedBiometricAuth;
