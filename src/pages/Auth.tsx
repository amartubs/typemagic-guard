
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import TwoFactorForm from '@/components/auth/TwoFactorForm';
import BiometricVerification from '@/components/auth/BiometricVerification';
import SimpleRegistrationForm from '@/components/auth/SimpleRegistrationForm';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthTabs from '@/components/auth/AuthTabs';
import EmailLoginSection from '@/components/auth/EmailLoginSection';
import RegistrationSuccess from '@/components/auth/RegistrationSuccess';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthHandlers } from '@/hooks/useAuthHandlers';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    user, 
    loading: authLoading,
    twoFactorRequired
  } = useAuth();
  
  const {
    loginLoading,
    forgotLoading,
    verifyingCode,
    registerLoading,
    handleLoginSubmit,
    handleForgotPasswordSubmit,
    handleSocialLogin,
    handleTwoFactorSubmit,
    handleResendCode,
    handleRegisterSubmit
  } = useAuthHandlers();
  
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
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

  const handleTabChange = (value: 'login' | 'register' | 'forgot') => {
    console.log('📑 Tab changed to:', value);
    setActiveTab(value);
    setShowEmailLogin(false);
    setRegistrationSuccess(false);
  };

  const handleForgotPasswordFlow = async (email: string) => {
    const success = await handleForgotPasswordSubmit(email);
    if (success) {
      setActiveTab('login');
    }
  };

  const handleRegisterFlow = async (
    name: string,
    email: string,
    password: string,
    userType: 'individual' | 'company' | 'charity',
    organizationName?: string,
    organizationSize?: number
  ) => {
    const success = await handleRegisterSubmit(name, email, password, userType, organizationName, organizationSize);
    if (success) {
      setRegistrationSuccess(true);
    }
  };
  
  const handleBiometricVerify = () => {
    navigate('/dashboard');
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
        <AuthHeader />

        <Tabs defaultValue="login" value={activeTab} onValueChange={handleTabChange}>
          <AuthTabs activeTab={activeTab} onTabChange={handleTabChange} />

          <TabsContent value="login" className="m-0">
            <CardContent className="p-6">
              {!showEmailLogin ? (
                <EmailLoginSection
                  showEmailLogin={showEmailLogin}
                  authLoading={authLoading}
                  onSocialLogin={handleSocialLogin}
                  onShowEmailLogin={() => {
                    console.log('📧 Switching to email login form');
                    setShowEmailLogin(true);
                  }}
                />
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
                onSubmit={handleForgotPasswordFlow}
                onBackToLogin={() => setActiveTab('login')}
                loading={forgotLoading}
              />
            </CardContent>
          </TabsContent>

          <TabsContent value="register" className="m-0">
            <CardContent className="p-6">
              {registrationSuccess ? (
                <RegistrationSuccess
                  onGoToLogin={() => setActiveTab('login')}
                  onRegisterAnother={() => setRegistrationSuccess(false)}
                />
              ) : (
                <SimpleRegistrationForm 
                  onSubmit={handleRegisterFlow}
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
