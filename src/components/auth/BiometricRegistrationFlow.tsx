
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import UserInfoForm from './registration/UserInfoForm';
import BiometricSetupStep from './registration/BiometricSetupStep';
import RegistrationComplete from './registration/RegistrationComplete';
import RegistrationProgress from './registration/RegistrationProgress';

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
        'individual',
        'free'
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <RegistrationProgress step={step} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 'info' && (
            <UserInfoForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleInfoSubmit}
              loading={loading}
              onBackToLogin={onBackToLogin}
            />
          )}

          {step === 'biometric' && (
            <BiometricSetupStep
              onBiometricResult={handleBiometricResult}
              onSkip={skipBiometric}
            />
          )}

          {step === 'complete' && (
            <RegistrationComplete
              biometricComplete={biometricComplete}
              biometricConfidence={biometricConfidence}
              onComplete={onComplete}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BiometricRegistrationFlow;
