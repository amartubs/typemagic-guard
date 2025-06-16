
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Shield, Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react';
import { ProductionSecurityManager } from '@/lib/security/productionSecurityManager';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  onSuccess: (email: string) => void;
  onSwitchToLogin: () => void;
}

export const SecureRegistrationForm: React.FC<Props> = ({ onSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ isValid: false, score: 0, feedback: [] });
  const { handleAsyncError } = useErrorHandler();

  const handlePasswordChange = (password: string) => {
    setFormData(prev => ({ ...prev, password }));
    const strength = ProductionSecurityManager.validatePasswordStrength(password);
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.email || !formData.password || !formData.name) {
      setError('All fields are required');
      return;
    }

    if (!passwordStrength.isValid) {
      setError('Please create a stronger password');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    
    const result = await handleAsyncError(async () => {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name
          }
        }
      });

      if (error) {
        throw error;
      }

      await ProductionSecurityManager.logSecurityEvent('user_registration', {
        email: formData.email,
        name: formData.name
      });

      return data;
    }, 'User registration', false);

    if (result) {
      onSuccess(formData.email);
    } else {
      setError('Registration failed. Please try again.');
    }

    setLoading(false);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score >= 80) return 'bg-green-500';
    if (passwordStrength.score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Create Account
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

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="Create a strong password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            
            {formData.password && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Progress 
                    value={passwordStrength.score} 
                    className="flex-1 h-2"
                  />
                  <span className="text-xs text-muted-foreground">
                    {passwordStrength.score}%
                  </span>
                </div>
                
                {passwordStrength.feedback.length > 0 && (
                  <ul className="text-xs space-y-1">
                    {passwordStrength.feedback.map((item, index) => (
                      <li key={index} className="flex items-center gap-1 text-muted-foreground">
                        <AlertTriangle className="h-3 w-3" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                
                {passwordStrength.isValid && (
                  <div className="flex items-center gap-1 text-green-600 text-xs">
                    <CheckCircle className="h-3 w-3" />
                    Strong password
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Confirm your password"
              required
            />
          </div>

          <Button type="submit" disabled={loading || !passwordStrength.isValid} className="w-full">
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <div className="text-center">
            <Button variant="link" onClick={onSwitchToLogin}>
              Already have an account? Sign in
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
