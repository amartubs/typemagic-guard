
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
import { useAuth } from '@/contexts/AuthContext';
import { Lock, User as UserIcon, Shield, AlertCircle, Mail, Building, Users, Heart } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [registrationStep, setRegistrationStep] = useState<'userInfo' | 'userType' | 'subscription' | 'payment'>('userInfo');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
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
    if (user) {
      // Get the intended destination or default to dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from);
    }
  }, [user, navigate, location]);

  const handleKeystrokeCapture = (timings: KeyTiming[]) => {
    setKeystrokeTimings(timings);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    
    try {
      const success = await login(loginEmail, loginPassword);
      
      if (success && enableBiometrics) {
        setBiometricStep(true);
      } else if (success) {
        // Navigate to the intended destination or dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from);
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (registerPassword !== registerConfirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setRegisterLoading(true);
    
    try {
      if (!selectedPlan) {
        alert('Please select a subscription plan');
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
        // Navigate to dashboard after successful registration
        navigate('/dashboard');
      }
    } finally {
      setRegisterLoading(false);
    }
  };
  
  const handleBiometricVerify = () => {
    // For demo purposes, we'll just redirect to dashboard
    // In a real app, you'd verify the keystroke pattern here
    navigate('/dashboard');
  };
  
  const resetBiometricStep = () => {
    setBiometricStep(false);
  };

  const nextRegistrationStep = () => {
    if (registrationStep === 'userInfo') {
      if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
        alert('Please fill out all fields');
        return;
      }
      
      if (registerPassword !== registerConfirmPassword) {
        alert('Passwords do not match');
        return;
      }
      
      setRegistrationStep('userType');
    } else if (registrationStep === 'userType') {
      if (userType !== 'individual' && !organizationName) {
        alert('Please enter your organization name');
        return;
      }
      
      if (userType === 'company' && !organizationSize) {
        alert('Please enter your organization size');
        return;
      }
      
      setRegistrationStep('subscription');
    } else if (registrationStep === 'subscription') {
      if (!selectedPlan) {
        alert('Please select a subscription plan');
        return;
      }
      
      // For demo purposes, we'll skip the payment step
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="mb-4 text-center pt-6 px-6">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">TypeMagic Guard</h1>
          <p className="text-muted-foreground mt-2">
            Secure authentication with keystroke biometrics
          </p>
        </div>

        <Tabs defaultValue="login" value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')}>
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="login" className="m-0">
            <CardContent className="p-6">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      placeholder="demo@example.com"
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
                      placeholder="••••••••"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
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
                    Enable keystroke biometric verification
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={loginLoading}>
                  {loginLoading ? 'Authenticating...' : 'Sign In'}
                </Button>
                
                <div className="text-center text-xs text-muted-foreground mt-4">
                  <p>
                    For demo: use email "demo@example.com" and password "demo"
                  </p>
                </div>
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
                    onSelectPlan={(plan) => setSelectedPlan(plan)}
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
                      disabled={!selectedPlan}
                    >
                      Complete Registration
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
