
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { RealTimeKeystrokeCapture } from '@/components/biometric/RealTimeKeystrokeCapture';
import { RateLimiter } from '@/lib/security/rateLimiter';
import { AuditLogger } from '@/lib/security/auditLogger';

interface Props {
  onSuccess?: () => void;
}

export const EnhancedLoginForm: React.FC<Props> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [biometricResult, setBiometricResult] = useState<{
    success: boolean;
    confidence: number;
  } | null>(null);

  const handleBiometricResult = (result: { success: boolean; confidence: number }) => {
    setBiometricResult(result);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    // Check rate limiting
    if (!RateLimiter.isAllowed(email, 'login')) {
      const resetTime = RateLimiter.getResetTime(email, 'login');
      const remainingTime = Math.ceil((resetTime - Date.now()) / (1000 * 60));
      setError(`Too many login attempts. Please try again in ${remainingTime} minutes.`);
      return;
    }

    setLoading(true);

    try {
      // Log login attempt
      await AuditLogger.logSecurityEvent('login_attempt', {
        email,
        biometricConfidence: biometricResult?.confidence,
        biometricSuccess: biometricResult?.success
      });

      const success = await login(email, password);

      if (success) {
        await AuditLogger.logSecurityEvent('login_success', {
          email,
          biometricConfidence: biometricResult?.confidence
        });
        
        onSuccess?.();
      } else {
        setError('Invalid email or password');
        await AuditLogger.logSecurityEvent('login_failure', {
          email,
          reason: 'invalid_credentials'
        });
      }
    } catch (err) {
      setError('An error occurred during login');
      await AuditLogger.logSecurityEvent('login_error', {
        email,
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const remainingAttempts = RateLimiter.getRemainingAttempts(email, 'login');
  const showBiometricWarning = biometricResult && !biometricResult.success && biometricResult.confidence < 50;

  return (
    <RealTimeKeystrokeCapture
      onResult={handleBiometricResult}
      enabled={true}
      context="login"
    >
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Secure Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {showBiometricWarning && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Unusual typing pattern detected. Confidence: {biometricResult.confidence}%
                </AlertDescription>
              </Alert>
            )}

            {biometricResult && biometricResult.success && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Biometric verification successful. Confidence: {biometricResult.confidence}%
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="text-sm text-muted-foreground">
              Remaining login attempts: {remainingAttempts}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </RealTimeKeystrokeCapture>
  );
};
