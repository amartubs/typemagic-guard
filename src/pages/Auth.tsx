
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
import { Shield, Mail, CheckCircle } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    login, 
    register, 
    user, 
    loading: authLoading,
    twoFactorRequired, 
    verifyTwoFactorCode, 
    sendTwoFactorCode,
    signInWithProvider,
    resetPassword
  } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  // Individual loading states for different operations
  const [loginLoading, setLoginLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  
  // Biometric state
  const [enableBiometrics, setEnableBiometrics] = useState(true);
  const [biometricStep, setBiometricStep] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    console.log('🔍 Auth page - checking user state:', {
      hasUser: !!user,
      twoFactorRequired,
      authLoading,
      userEmail: user?.email
    });

    if (user && !twoFactorRequired && !authLoading) {
      const from = location.state?.from?.pathname || '/dashboard';
      console.log('✅ User authenticated, redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [user, navigate, location, twoFactorRequired, authLoading]);

  const handleLoginSubmit = async (email: string, password: string) => {
    console.log('📝 Login form submitted for:', email);
    setLoginLoading(true);
    
    try {
      const success = await login(email, password);
      console.log('📝 Login result:', success);
      
      if (success) {
        console.log('✅ Login successful, auth context should handle redirect');
        // Don't manually set loading to false here - let the auth state change handle it
      } else {
        console.log('❌ Login failed');
        setLoginLoading(false);
      }
    } catch (error) {
      console.error('📝 Login submission error:', error);
      setLoginLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (email: string) => {
    if (!resetPassword) {
      return;
    }

    console.log('🔄 Forgot password submitted for:', email);
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
    console.log('🔗 Social login attempted with:', provider);
    const success = await signInWithProvider(provider);
    
    if (success) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from);
    }
  };

  const handleTwoFactorSubmit = async (code: string) => {
    console.log('🔐 Two factor code submitted');
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
    console.log('📨 Resending two factor code');
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
    console.log('📝 Registration form submitted for:', email);
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
        setRegistrationSuccess(true);
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

  // Show loading spinner while auth is initializing
  if (authLoading) {
    console.log('⏳ Showing auth loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show biometric verification if needed
  if (biometricStep) {
    return (
      <BiometricVerification 
        onVerify={() => navigate('/dashboard')}
        onSkip={() => setBiometricStep(false)}
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

  console.log('🎨 Rendering auth page with state:', {
    activeTab,
    showEmailLogin,
    registrationSuccess,
    loginLoading,
    hasUser: !!user
  });

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
          console.log('📑 Tab changed to:', value);
          setActiveTab(value as 'login' | 'register' | 'forgot');
          setShowEmailLogin(false);
          setRegistrationSuccess(false);
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
                    onClick={() => {
                      console.log('📧 Switching to email login form');
                      setShowEmailLogin(true);
                    }}
                  >
                    <Mail className="h-4 w-4" />
                    Sign in with Email
                  </Button>
                </div>
              ) : (
                <LoginForm 
                  onSubmit={handleLoginSubmit}
                  onBackToOptions={() => {
                    console.log('⬅️ Going back to login options');
                    setShowEmailLogin(false);
                  }}
                  onForgotPassword={() => {
                    console.log('🔄 Switching to forgot password');
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
              {registrationSuccess ? (
                <div className="text-center space-y-4">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                  <h2 className="text-xl font-semibold">Check Your Email!</h2>
                  <p className="text-muted-foreground">
                    We've sent you a confirmation link. Please check your email and click the link to activate your account.
                  </p>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => setActiveTab('login')} 
                      className="w-full"
                    >
                      Go to Login
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setRegistrationSuccess(false)}
                      className="w-full"
                    >
                      Register Another Account
                    </Button>
                  </div>
                </div>
              ) : (
                <SimpleRegistrationForm 
                  onSubmit={handleRegisterSubmit}
                  loading={registerLoading}
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
