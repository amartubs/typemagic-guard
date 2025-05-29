import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { KeyTiming, SubscriptionPlan, UserType } from '@/lib/types';
import { KeystrokeCapture as KeystrokeCaptureService, BiometricAnalyzer } from '@/lib/biometricAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import KeystrokeCapture from '@/components/ui-custom/KeystrokeCapture';
import SubscriptionPlans from '@/components/subscription/SubscriptionPlans';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import { useAuth, SocialProvider } from '@/contexts/AuthContext';
import { 
  Lock, 
  User as UserIcon, 
  Shield, 
  AlertCircle, 
  Mail, 
  Building, 
  Users, 
  Heart,
  KeyRound,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
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
  const [registrationStep, setRegistrationStep] = useState<'userInfo' | 'userType' | 'subscription' | 'payment'>('userInfo');
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  
  // Two-factor authentication state
  const [twoFactorCode, setTwoFactorCode] = useState('');
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
  const [keystrokeTimings, setKeystrokeTimings] = useState<KeyTiming[]>([]);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !twoFactorRequired) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from);
    }
  }, [user, navigate, location, twoFactorRequired]);

  const handleKeystrokeCapture = (timings: KeyTiming[]) => {
    setKeystrokeTimings(timings);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    
    try {
      const success = await login(loginEmail, loginPassword);
      
      if (success) {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from);
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      const success = await resetPassword(forgotEmail);
      
      if (success) {
        setActiveTab('login');
        setForgotEmail('');
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

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyingCode(true);
    
    try {
      const success = await verifyTwoFactorCode(twoFactorCode);
      
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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      
      handleRegisterSubmit(new Event('submit') as any);
    }
  };

  const prevRegistrationStep = () => {
    if (registrationStep === 'userType') {
      setRegistrationStep('userInfo');
    } else if (registrationStep === 'subscription') {
      setRegistrationStep('userType');
    } else if (registrationStep === 'payment') {
      setRegistrationStep('subscription');
    }
  };

  // If we're in the biometric verification step
  if (biometricStep) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md p-6 shadow-lg">
          <div className="mb-6 text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Biometric Verification</h1>
            <p className="text-muted-foreground mt-2">
              Complete your biometric verification to continue
            </p>
          </div>

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
                onClick={handleBiometricVerify} 
                disabled={keystrokeTimings.length < 5}
                className="w-full"
              >
                Verify Biometrics
              </Button>
              
              <Button 
                variant="outline"
                onClick={resetBiometricStep}
              >
                Skip Biometric Verification
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Show the 2FA verification screen if two-factor authentication is required
  if (twoFactorRequired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md p-6 shadow-lg">
          <div className="mb-6 text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Two-Factor Verification</h1>
            <p className="text-muted-foreground mt-2">
              Enter the verification code sent to your email
            </p>
          </div>

          <form onSubmit={handleTwoFactorSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verification-code">Verification Code</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="verification-code"
                  placeholder="Enter 6-digit code"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={verifyingCode}
            >
              {verifyingCode ? 'Verifying...' : 'Verify Code'}
            </Button>
            
            <Button 
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleResendCode}
            >
              <RefreshCw className="h-4 w-4" />
              Resend Code
            </Button>
          </form>
        </Card>
      </div>
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
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex items-center gap-2 -mt-2 -ml-2 mb-2"
                    onClick={() => setShowEmailLogin(false)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to login options
                  </Button>
                
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        placeholder="Enter your email"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
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
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="biometrics"
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                        checked={enableBiometrics}
                        onChange={(e) => setEnableBiometrics(e.target.checked)}
                      />
                      <Label htmlFor="biometrics" className="text-sm cursor-pointer">
                        Enable biometrics
                      </Label>
                    </div>
                    
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm p-0 h-auto"
                      onClick={() => {
                        setActiveTab('forgot');
                        setShowEmailLogin(false);
                      }}
                    >
                      Forgot password?
                    </Button>
                  </div>

                  <Button type="submit" className="w-full" disabled={loginLoading}>
                    {loginLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              )}
            </CardContent>
          </TabsContent>

          <TabsContent value="forgot" className="m-0">
            <CardContent className="p-6">
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-medium">Reset Your Password</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="forgot-email"
                      placeholder="Enter your email address"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={forgotLoading}>
                  {forgotLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => setActiveTab('login')}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sign In
                </Button>
              </form>
            </CardContent>
          </TabsContent>

          <TabsContent value="register" className="m-0">
            <CardContent className="p-6">
              {registrationStep === 'userInfo' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Full Name</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="register-name"
                        placeholder="John Doe"
                        type="text"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="register-email"
                        placeholder="john@example.com"
                        type="email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="register-password"
                        placeholder="••••••••"
                        type="password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        placeholder="••••••••"
                        type="password"
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={nextRegistrationStep} 
                    className="w-full"
                  >
                    Continue
                  </Button>
                </div>
              )}

              {registrationStep === 'userType' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Select Account Type</h2>
                  
                  <RadioGroup 
                    value={userType} 
                    onValueChange={(value) => setUserType(value as UserType)}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual" className="flex items-center gap-2 cursor-pointer">
                        <UserIcon className="h-5 w-5 text-primary" />
                        <div>
                          <div>Individual</div>
                          <p className="text-sm text-muted-foreground">Personal use account</p>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted">
                      <RadioGroupItem value="company" id="company" />
                      <Label htmlFor="company" className="flex items-center gap-2 cursor-pointer">
                        <Building className="h-5 w-5 text-primary" />
                        <div>
                          <div>Company</div>
                          <p className="text-sm text-muted-foreground">Business or organization account</p>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted">
                      <RadioGroupItem value="charity" id="charity" />
                      <Label htmlFor="charity" className="flex items-center gap-2 cursor-pointer">
                        <Heart className="h-5 w-5 text-primary" />
                        <div>
                          <div>Charity / Non-profit</div>
                          <p className="text-sm text-muted-foreground">Special rates for non-profits</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  {userType !== 'individual' && (
                    <div className="space-y-2">
                      <Label htmlFor="organization-name">Organization Name</Label>
                      <Input
                        id="organization-name"
                        placeholder="Organization Name"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        required
                      />
                    </div>
                  )}
                  
                  {userType === 'company' && (
                    <div className="space-y-2">
                      <Label htmlFor="organization-size">Organization Size</Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="organization-size"
                          placeholder="Number of employees"
                          type="number"
                          min={1}
                          value={organizationSize || ''}
                          onChange={(e) => setOrganizationSize(Number(e.target.value))}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between pt-2">
                    <Button 
                      variant="outline" 
                      onClick={prevRegistrationStep}
                    >
                      Back
                    </Button>
                    
                    <Button onClick={nextRegistrationStep}>
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {registrationStep === 'subscription' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Choose a Subscription Plan</h2>
                  
                  <SubscriptionPlans 
                    userType={userType}
                    onSelectPlan={handleSelectPlan}
                    selectedPlanId={selectedPlan?.id}
                    className="mb-4"
                  />
                  
                  {selectedPlan && (
                    <div className="p-4 bg-muted rounded-md mt-4">
                      <h3 className="font-medium">Selected Plan: {selectedPlan.name}</h3>
                      <p className="text-sm mt-1">
                        ${selectedPlan.price[userType]}/month
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-between pt-2">
                    <Button 
                      variant="outline" 
                      onClick={prevRegistrationStep}
                    >
                      Back
                    </Button>
                    
                    <Button 
                      onClick={nextRegistrationStep}
                      disabled={!selectedPlan || registerLoading}
                    >
                      {registerLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </div>
                </div>
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
