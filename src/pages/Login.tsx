
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, KeyTiming, KeystrokePattern, AuthenticationResult } from '@/lib/types';
import { KeystrokeCapture, BiometricAnalyzer, createBiometricProfile } from '@/lib/biometricAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import KeystrokeCapture from '@/components/ui-custom/KeystrokeCapture';
import { Lock, User as UserIcon, Shield, AlertCircle } from 'lucide-react';

// Mock user data for demonstration
const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'demo@example.com',
    name: 'Demo User',
    role: 'user',
    biometricProfile: {
      userId: 'user-1',
      keystrokePatterns: [],
      confidenceScore: 0,
      lastUpdated: Date.now(),
      status: 'learning'
    },
    securitySettings: {
      minConfidenceThreshold: 65,
      learningPeriod: 5,
      anomalyDetectionSensitivity: 70,
      securityLevel: 'medium',
      enforceTwoFactor: false,
      maxFailedAttempts: 5
    },
    lastLogin: null,
    status: 'active'
  }
];

const LoginPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginStep, setLoginStep] = useState<'credentials' | 'biometric'>('credentials');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [biometricResult, setBiometricResult] = useState<AuthenticationResult | null>(null);
  const [keystrokeTimings, setKeystrokeTimings] = useState<KeyTiming[]>([]);
  const [enableBiometrics, setEnableBiometrics] = useState(true);

  const handleKeystrokeCapture = (timings: KeyTiming[]) => {
    setKeystrokeTimings(timings);
  };

  const handleCredentialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      // Find user by email for demonstration
      const user = mockUsers.find(u => u.email === email);
      
      if (user && password === 'demo') { // Simple password check for demo
        setCurrentUser(user);
        
        if (enableBiometrics && user.biometricProfile) {
          setLoginStep('biometric');
        } else {
          // Skip biometric verification if not enabled
          completeLogin(user);
        }
      } else {
        toast({
          title: "Authentication Failed",
          description: "Invalid email or password",
          variant: "destructive"
        });
      }
      
      setLoading(false);
    }, 1000);
  };

  const handleBiometricSubmit = () => {
    if (!currentUser || !keystrokeTimings.length) return;
    
    setLoading(true);
    
    // Create a pattern from captured keystrokes
    const keystrokeService = new KeystrokeCapture('login');
    const pattern: KeystrokePattern = {
      userId: currentUser.id,
      patternId: `${currentUser.id}-${Date.now()}`,
      timings: keystrokeTimings,
      timestamp: Date.now(),
      context: 'login'
    };
    
    // If user doesn't have a biometric profile yet, create one
    if (!currentUser.biometricProfile) {
      currentUser.biometricProfile = createBiometricProfile(currentUser.id);
    }
    
    // For demo users with empty profiles, the first login adds the pattern to their profile
    if (currentUser.biometricProfile.keystrokePatterns.length === 0) {
      currentUser.biometricProfile = BiometricAnalyzer.updateProfile(
        currentUser.biometricProfile,
        pattern
      );
      
      toast({
        title: "Biometric Profile Created",
        description: "Your keystroke pattern has been recorded for future verification",
      });
      
      completeLogin(currentUser);
      return;
    }
    
    // Verify the keystroke pattern against the user's profile
    const result = BiometricAnalyzer.authenticate(currentUser.biometricProfile, pattern);
    setBiometricResult(result);
    
    // Update the user's profile with the new pattern if authentication was successful
    if (result.success) {
      currentUser.biometricProfile = BiometricAnalyzer.updateProfile(
        currentUser.biometricProfile,
        pattern
      );
      
      completeLogin(currentUser);
    } else {
      // Failed biometric verification
      toast({
        title: "Biometric Verification Failed",
        description: `Confidence score: ${result.confidenceScore.toFixed(1)}%. Threshold: ${currentUser.securitySettings.minConfidenceThreshold}%`,
        variant: "destructive"
      });
    }
    
    setLoading(false);
  };
  
  const completeLogin = (user: User) => {
    // Store user in localStorage (in a real app, this would be handled by a secure auth provider)
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    toast({
      title: "Login Successful",
      description: `Welcome back, ${user.name}!`,
    });
    
    // Redirect to dashboard
    navigate('/dashboard');
  };
  
  const resetBiometricStep = () => {
    setLoginStep('credentials');
    setKeystrokeTimings([]);
    setBiometricResult(null);
  };

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
          <form onSubmit={handleCredentialSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    placeholder="demo@example.com"
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
                    placeholder="••••••••"
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

            <div className="text-center text-xs text-muted-foreground mt-4">
              <p>
                For demo: use email "demo@example.com" and password "demo"
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default LoginPage;
