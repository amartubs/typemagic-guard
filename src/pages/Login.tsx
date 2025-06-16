
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { Lock, User as UserIcon, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EnhancedBiometricAuth from '@/components/biometric/EnhancedBiometricAuth';

const LoginPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, login, loading: authLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginStep, setLoginStep] = useState<'credentials' | 'biometric'>('credentials');
  const [enableBiometrics, setEnableBiometrics] = useState(true);
  const [biometricResult, setBiometricResult] = useState<{success: boolean, confidence: number} | null>(null);
  const [credentialsValid, setCredentialsValid] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(email, password);
      
      if (success) {
        setCredentialsValid(true);
        
        if (enableBiometrics) {
          setLoginStep('biometric');
          toast({
            title: "Credentials Verified",
            description: "Please complete biometric verification",
          });
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricResult = (success: boolean, confidence: number) => {
    setBiometricResult({ success, confidence });
    
    if (success && confidence >= 70) {
      toast({
        title: "Biometric Authentication Complete",
        description: `Identity verified with ${confidence.toFixed(1)}% confidence`,
      });
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } else {
      toast({
        title: "Biometric Verification Failed",
        description: "Please try again or proceed without biometrics",
        variant: "destructive"
      });
    }
  };
  
  const proceedWithoutBiometrics = () => {
    if (credentialsValid) {
      navigate('/dashboard');
    } else {
      setLoginStep('credentials');
    }
  };

  const resetToCredentials = () => {
    setLoginStep('credentials');
    setBiometricResult(null);
    setCredentialsValid(false);
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
                    Enable enhanced biometric verification
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
          <div className="space-y-6">
            {credentialsValid && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Credentials verified successfully. Complete biometric verification to continue.
                </AlertDescription>
              </Alert>
            )}

            <EnhancedBiometricAuth
              mode="verification"
              onAuthentication={handleBiometricResult}
            />

            <div className="flex flex-col space-y-2">
              <Button 
                onClick={() => credentialsValid && navigate('/dashboard')} 
                disabled={!credentialsValid}
                variant="outline"
                className="w-full"
              >
                Proceed Without Biometrics
              </Button>
              
              <Button 
                variant="ghost"
                onClick={resetToCredentials}
                disabled={loading}
                className="w-full"
              >
                Back to Credentials
              </Button>
            </div>

            {biometricResult && !biometricResult.success && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Biometric verification failed. Confidence: {biometricResult.confidence.toFixed(1)}%
                  <br />
                  <span className="text-xs">Try typing naturally as you normally would.</span>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default LoginPage;
