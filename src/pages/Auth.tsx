
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { KeyTiming, SubscriptionPlan, UserType } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import LoginForm from '@/components/auth/LoginForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import UserInfoStep from '@/components/auth/UserInfoStep';
import UserTypeStep from '@/components/auth/UserTypeStep';
import SubscriptionStep from '@/components/auth/SubscriptionStep';
import TwoFactorForm from '@/components/auth/TwoFactorForm';
import BiometricVerification from '@/components/auth/BiometricVerification';
import { useAuth, SocialProvider } from '@/contexts/AuthContext';
import { Shield, Mail } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    login, 
    register, 
    user, 
    twoFactorRequired, 
    verifyTwoFactorCode, 
    sendTwoFactorCode,
    signInWithProvider,
    loading: authLoading,
    resetPassword
  } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [registrationStep, setRegistrationStep] = useState<'userInfo' | 'userType' | 'subscription'>('userInfo');
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  
  // Login state
  const [loginLoading, setLoginLoading] = useState(false);
  
  // Forgot password state
  const [forgotLoading, setForgotLoading] = useState(false);
  
  // Two-factor authentication state
  const [verifyingCode, setVerifyingCode] = useState(false);
  
  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('individual');
  const [organizationName, setOrganizationName] = useState('');
  const [organizationSize, setOrganizationSize] = useState<number | undefined>(undefined);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [registerLoading, setRegisterLoading] = useState(false);
  
  // Biometric state
  const [enableBiometrics, setEnableBiometrics] = useState(true);
  const [biometricStep, setBiometricStep] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !twoFactorRequired) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from);
    }
  }, [user, navigate, location, twoFactorRequired]);

  const handleLoginSubmit = async (email: string, password: string) => {
    setLoginLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from);
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (email: string) => {
    if (!resetPassword) {
      toast({
        title: "Feature Not Available",
        description: "Password reset is not available at this time.",
        variant: "destructive",
      });
      return;
    }

    setForgotLoading(true);
    
    try {
      const success = await resetPassword(email);
      
      if (success) {
        setActiveTab('login');
      }
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSocialLogin = async (provider: SocialProvider) => {
    const success = await signInWithProvider(provider);
    
    if (success) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from);
    }
  };

  const handleTwoFactorSubmit = async (code: string) => {
    setVerifyingCode(true);
    
    try {
      const success = await verifyTwoFactorCode(code);
      
      if (success) {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from);
      }
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleResendCode = async () => {
    await sendTwoFactorCode();
  };

  const handleRegisterSubmit = async () => {
    if (registerPassword !== registerConfirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
        variant: "destructive"
      });
      return;
    }
    
    setRegisterLoading(true);
    
    try {
      if (!selectedPlan) {
        toast({
          title: "No Plan Selected",
          description: "Please select a subscription plan",
          variant: "destructive"
        });
        return;
      }
      
      const success = await register(
        registerName, 
        registerEmail, 
        registerPassword, 
        userType,
        selectedPlan.tier,
        userType !== 'individual' ? organizationName : undefined,
        userType === 'company' ? organizationSize : undefined
      );
      
      if (success) {
        toast({
          title: "Registration Successful",
          description: "Welcome to Shoale! Please check your email to verify your account."
        });
        setActiveTab('login');
      }
    } finally {
      setRegisterLoading(false);
    }
  };
  
  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    console.log("Selected plan:", plan.name, plan.tier);
  };
  
  const handleBiometricVerify = () => {
    navigate('/dashboard');
  };
  
  const resetBiometricStep = () => {
    setBiometricStep(false);
  };

  const nextRegistrationStep = () => {
    if (registrationStep === 'userInfo') {
      if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
        toast({
          title: "Missing Information",
          description: "Please fill out all fields",
          variant: "destructive"
        });
        return;
      }
      
      if (registerPassword !== registerConfirmPassword) {
        toast({
          title: "Passwords do not match",
          description: "Please ensure your passwords match",
          variant: "destructive"
        });
        return;
      }
      
      setRegistrationStep('userType');
    } else if (registrationStep === 'userType') {
      if (userType !== 'individual' && !organizationName) {
        toast({
          title: "Missing Information",
          description: "Please enter your organization name",
          variant: "destructive"
        });
        return;
      }
      
      if (userType === 'company' && !organizationSize) {
        toast({
          title: "Missing Information",
          description: "Please enter your organization size",
          variant: "destructive"
        });
        return;
      }
      
      setRegistrationStep('subscription');
    } else if (registrationStep === 'subscription') {
      if (!selectedPlan) {
        toast({
          title: "No Plan Selected",
          description: "Please select a subscription plan",
          variant: "destructive"
        });
        return;
      }
      
      handleRegisterSubmit();
    }
  };

  const prevRegistrationStep = () => {
    if (registrationStep === 'userType') {
      setRegistrationStep('userInfo');
    } else if (registrationStep === 'subscription') {
      setRegistrationStep('userType');
    }
  };

  // Show biometric verification if needed
  if (biometricStep) {
    return (
      <BiometricVerification 
        onVerify={handleBiometricVerify}
        onSkip={resetBiometricStep}
      />
    );
  }

  // Show 2FA verification if required
  if (twoFactorRequired) {
    return (
      <TwoFactorForm 
        onSubmit={handleTwoFactorSubmit}
        onResendCode={handleResendCode}
        loading={verifyingCode}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="mb-4 text-center pt-6 px-6">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Shoale</h1>
          <p className="text-muted-foreground mt-2">
            Secure authentication with keystroke biometrics
          </p>
        </div>

        <Tabs defaultValue="login" value={activeTab} onValueChange={(value) => {
          setActiveTab(value as 'login' | 'register' | 'forgot');
          setShowEmailLogin(false);
        }}>
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
              <TabsTrigger value="forgot">Reset</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="login" className="m-0">
            <CardContent className="p-6">
              {!showEmailLogin ? (
                <div className="space-y-4">
                  <SocialLoginButtons 
                    onProviderClick={handleSocialLogin} 
                    isLoading={authLoading} 
                  />
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with email
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2"
                    onClick={() => setShowEmailLogin(true)}
                  >
                    <Mail className="h-4 w-4" />
                    Sign in with Email
                  </Button>
                  
                  <div className="flex items-center space-x-2 mt-4">
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
                </div>
              ) : (
                <LoginForm 
                  onSubmit={handleLoginSubmit}
                  onBackToOptions={() => setShowEmailLogin(false)}
                  onForgotPassword={() => {
                    setActiveTab('forgot');
                    setShowEmailLogin(false);
                  }}
                  loading={loginLoading}
                  enableBiometrics={enableBiometrics}
                  onBiometricsChange={setEnableBiometrics}
                />
              )}
            </CardContent>
          </TabsContent>

          <TabsContent value="forgot" className="m-0">
            <CardContent className="p-6">
              <ForgotPasswordForm 
                onSubmit={handleForgotPasswordSubmit}
                onBackToLogin={() => setActiveTab('login')}
                loading={forgotLoading}
              />
            </CardContent>
          </TabsContent>

          <TabsContent value="register" className="m-0">
            <CardContent className="p-6">
              {registrationStep === 'userInfo' && (
                <UserInfoStep 
                  name={registerName}
                  email={registerEmail}
                  password={registerPassword}
                  confirmPassword={registerConfirmPassword}
                  onNameChange={setRegisterName}
                  onEmailChange={setRegisterEmail}
                  onPasswordChange={setRegisterPassword}
                  onConfirmPasswordChange={setRegisterConfirmPassword}
                  onContinue={nextRegistrationStep}
                />
              )}

              {registrationStep === 'userType' && (
                <UserTypeStep 
                  userType={userType}
                  organizationName={organizationName}
                  organizationSize={organizationSize}
                  onUserTypeChange={setUserType}
                  onOrganizationNameChange={setOrganizationName}
                  onOrganizationSizeChange={setOrganizationSize}
                  onBack={prevRegistrationStep}
                  onContinue={nextRegistrationStep}
                />
              )}

              {registrationStep === 'subscription' && (
                <SubscriptionStep 
                  userType={userType}
                  selectedPlan={selectedPlan}
                  loading={registerLoading}
                  onSelectPlan={handleSelectPlan}
                  onBack={prevRegistrationStep}
                  onCreateAccount={nextRegistrationStep}
                />
              )}
            </CardContent>
          </TabsContent>
        </Tabs>

        <CardFooter className="pb-6 pt-0 px-6 flex flex-col">
          <div className="text-center mt-2">
            <Button variant="link" className="text-xs text-muted-foreground" onClick={() => navigate('/')}>
              Return to Home
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthPage;
