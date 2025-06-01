
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import LoginForm from '@/components/auth/LoginForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import TwoFactorForm from '@/components/auth/TwoFactorForm';
import BiometricVerification from '@/components/auth/BiometricVerification';
import SimpleRegistrationForm from '@/components/auth/SimpleRegistrationForm';
import { useAuth, SocialProvider } from '@/contexts/AuthContext';
import { Shield, Mail } from 'lucide-react';

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
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  
  // Login state
  const [loginLoading, setLoginLoading] = useState(false);
  
  // Forgot password state
  const [forgotLoading, setForgotLoading] = useState(false);
  
  // Two-factor authentication state
  const [verifyingCode, setVerifyingCode] = useState(false);
  
  // Registration state
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

  const handleRegisterSubmit = async (
    name: string,
    email: string,
    password: string,
    userType: 'individual' | 'company' | 'charity',
    organizationName?: string,
    organizationSize?: number
  ) => {
    setRegisterLoading(true);
    
    try {
      const success = await register(
        name, 
        email, 
        password, 
        userType,
        'free',
        organizationName,
        organizationSize
      );
      
      if (success) {
        setActiveTab('login');
      }
    } finally {
      setRegisterLoading(false);
    }
  };
  
  const handleBiometricVerify = () => {
    navigate('/dashboard');
  };
  
  const resetBiometricStep = () => {
    setBiometricStep(false);
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
              <SimpleRegistrationForm 
                onSubmit={handleRegisterSubmit}
                loading={registerLoading}
              />
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
