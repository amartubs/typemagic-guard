
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Shield, User, Mail, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import EnhancedBiometricAuth from '@/components/biometric/EnhancedBiometricAuth';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';

interface BiometricRegistrationFlowProps {
  onComplete: () => void;
  onBackToLogin: () => void;
}

const BiometricRegistrationFlow: React.FC<BiometricRegistrationFlowProps> = ({
  onComplete,
  onBackToLogin
}) => {
  const { register } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState<'info' | 'biometric' | 'complete'>('info');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [biometricComplete, setBiometricComplete] = useState(false);
  const [biometricConfidence, setBiometricConfidence] = useState(0);

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const success = await register(
        formData.name,
        formData.email,
        formData.password,
        'individual'
      );
      
      if (success) {
        setStep('biometric');
        toast({
          title: "Account Created",
          description: "Now let's set up your biometric profile",
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricResult = (success: boolean, confidence: number) => {
    if (success) {
      setBiometricComplete(true);
      setBiometricConfidence(confidence);
      setStep('complete');
      
      toast({
        title: "Biometric Profile Created",
        description: `Your typing pattern has been recorded with ${confidence.toFixed(1)}% confidence`,
      });
    } else {
      toast({
        title: "Biometric Setup Failed",
        description: "Please try again or skip this step",
        variant: "destructive"
      });
    }
  };

  const skipBiometric = () => {
    setStep('complete');
    toast({
      title: "Registration Complete",
      description: "You can set up biometrics later in your profile",
    });
  };

  const getStepProgress = () => {
    switch (step) {
      case 'info': return 33;
      case 'biometric': return 66;
      case 'complete': return 100;
      default: return 0;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Create Your Secure Account
          </CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {step === 'info' ? 1 : step === 'biometric' ? 2 : 3} of 3</span>
              <span>{getStepProgress()}% Complete</span>
            </div>
            <Progress value={getStepProgress()} className="h-2" />
          </div>
        </CardHeader>
        <CardContent>
          {step === 'info' && (
            <form onSubmit={handleInfoSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button type="button" variant="ghost" onClick={onBackToLogin} className="w-full">
                Already have an account? Sign in
              </Button>
            </form>
          )}

          {step === 'biometric' && (
            <div className="space-y-6">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Set up your biometric profile for enhanced security. This creates a unique 
                  typing signature based on your keystroke patterns.
                </AlertDescription>
              </Alert>

              <EnhancedBiometricAuth
                mode="registration"
                onAuthentication={handleBiometricResult}
              />

              <div className="flex gap-2">
                <Button onClick={skipBiometric} variant="outline" className="flex-1">
                  Skip for Now
                </Button>
              </div>
            </div>
          )}

          {step === 'complete' && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold">Registration Complete!</h3>
                <p className="text-muted-foreground mt-2">
                  {biometricComplete 
                    ? `Your account and biometric profile have been created with ${biometricConfidence.toFixed(1)}% confidence.`
                    : 'Your account has been created. You can set up biometrics later in your profile.'
                  }
                </p>
              </div>

              <Button onClick={onComplete} className="w-full">
                Continue to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BiometricRegistrationFlow;
