
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { Lock, User as UserIcon, Shield, AlertCircle } from 'lucide-react';
import KeystrokeCapture from '@/components/ui-custom/KeystrokeCapture';
import { KeyTiming, KeystrokePattern } from '@/lib/types';
import { KeystrokeCapture as KeystrokeCaptureService, BiometricAnalyzer } from '@/lib/biometricAuth';
import { DatabaseManager } from '@/lib/biometric/continuousLearning/databaseManager';

const LoginPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, login, loading: authLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginStep, setLoginStep] = useState<'credentials' | 'biometric'>('credentials');
  const [keystrokeTimings, setKeystrokeTimings] = useState<KeyTiming[]>([]);
  const [enableBiometrics, setEnableBiometrics] = useState(true);
  const [biometricResult, setBiometricResult] = useState<any>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  const handleKeystrokeCapture = (timings: KeyTiming[]) => {
    setKeystrokeTimings(timings);
  };

  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(email, password);
      
      if (success && enableBiometrics) {
        setLoginStep('biometric');
      } else if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricSubmit = async () => {
    if (!user || !keystrokeTimings.length) return;
    
    setLoading(true);
    
    try {
      // Create a pattern from captured keystrokes
      const pattern: KeystrokePattern = {
        userId: user.id,
        patternId: `${user.id}-${Date.now()}`,
        timings: keystrokeTimings,
        timestamp: Date.now(),
        context: 'login'
      };

      // Store the pattern in the database
      await DatabaseManager.storePatternAndUpdateProfile(pattern, user.id);
      
      toast({
        title: "Biometric Authentication Complete",
        description: "Your keystroke pattern has been recorded",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Biometric submission error:', error);
      toast({
        title: "Biometric Error",
        description: "Failed to process biometric data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const resetBiometricStep = () => {
    setLoginStep('credentials');
    setKeystrokeTimings([]);
    setBiometricResult(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Biometric Authentication</h1>
          <p className="text-muted-foreground mt-2">
            {loginStep === 'credentials' 
              ? 'Sign in with your credentials' 
              : 'Complete your biometric verification'}
          </p>
        </div>

        {loginStep === 'credentials' ? (
          <>
            <form onSubmit={handleCredentialSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      placeholder="Enter your email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      placeholder="Enter your password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="biometrics"
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                    checked={enableBiometrics}
                    onChange={(e) => setEnableBiometrics(e.target.checked)}
                  />
                  <Label htmlFor="biometrics" className="text-sm cursor-pointer">
                    Enable keystroke biometric verification
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Authenticating...' : 'Continue'}
                </Button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/auth" className="font-medium text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-md">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Type the following sentence:</p>
                  <p className="text-sm mt-1">
                    "My voice is my passport, verify me."
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="biometric-input">Keystroke Verification</Label>
              <KeystrokeCapture
                captureContext="login"
                onCapture={handleKeystrokeCapture}
                autoStart={true}
                inputProps={{
                  placeholder: "Type the verification phrase here...",
                  id: "biometric-input"
                }}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Button 
                onClick={handleBiometricSubmit} 
                disabled={loading || keystrokeTimings.length < 5}
                className="w-full"
              >
                {loading ? "Verifying..." : "Verify Biometrics"}
              </Button>
              
              <Button 
                variant="outline"
                onClick={resetBiometricStep}
                disabled={loading}
              >
                Back to Credentials
              </Button>
            </div>

            {biometricResult && !biometricResult.success && (
              <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                Biometric verification failed. Try typing naturally as you normally would.
                <div className="mt-1 text-xs">
                  Confidence: {biometricResult.confidenceScore.toFixed(1)}%
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default LoginPage;
