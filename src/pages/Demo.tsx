
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { KeystrokeCapture } from '@/lib/biometricAuth';
import { KeyTiming, BiometricProfile, KeystrokePattern } from '@/lib/types';
import KeystrokeCaptureComponent from '@/components/ui-custom/KeystrokeCapture';
import { BiometricAnalyzer, createBiometricProfile } from '@/lib/biometricAuth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { Shield, Key, Fingerprint, AlertTriangle, CheckCircle2, X, Info } from 'lucide-react';

export default function Demo() {
  const [demoStep, setDemoStep] = useState<'intro' | 'create' | 'test' | 'result'>('intro');
  const [biometricProfile, setBiometricProfile] = useState<BiometricProfile | null>(null);
  const [enrollmentKeystrokes, setEnrollmentKeystrokes] = useState<KeyTiming[]>([]);
  const [testKeystrokes, setTestKeystrokes] = useState<KeyTiming[]>([]);
  const [authResult, setAuthResult] = useState<{
    success: boolean;
    confidenceScore: number;
    message: string;
  } | null>(null);
  const [enrollmentProgress, setEnrollmentProgress] = useState(0);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [testIndex, setTestIndex] = useState(0);

  const demoTexts = [
    "The quick brown fox jumps over the lazy dog.",
    "A journey of a thousand miles begins with a single step.",
    "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment."
  ];

  const [currentEnrollText, setCurrentEnrollText] = useState(demoTexts[0]);
  const [currentTestText, setCurrentTestText] = useState(demoTexts[0]);

  useEffect(() => {
    // Reset the demo when the component mounts
    createNewProfile();
  }, []);

  const createNewProfile = () => {
    const newProfile = createBiometricProfile('demo-user');
    setBiometricProfile(newProfile);
    setEnrollmentKeystrokes([]);
    setTestKeystrokes([]);
    setAuthResult(null);
    setEnrollmentProgress(0);
    setTestIndex(0);
  };

  const handleEnrollmentCapture = (timings: KeyTiming[]) => {
    if (!isEnrolling) return;

    setEnrollmentKeystrokes(prev => [...prev, ...timings]);
    
    // Update enrollment progress
    const newProgress = Math.min(100, Math.round((enrollmentKeystrokes.length + timings.length) / 50 * 100));
    setEnrollmentProgress(newProgress);
    
    // Complete enrollment if we have enough keystrokes
    if (newProgress >= 100) {
      completeEnrollment();
    }
  };

  const completeEnrollment = () => {
    if (!biometricProfile) return;

    const pattern: KeystrokePattern = {
      userId: 'demo-user',
      patternId: `demo-user-${Date.now()}`,
      timings: enrollmentKeystrokes,
      timestamp: Date.now(),
      context: 'enrollment'
    };

    // Update the biometric profile with the new pattern
    const updatedProfile = BiometricAnalyzer.updateProfile(biometricProfile, pattern);
    setBiometricProfile(updatedProfile);
    
    toast({
      title: "Enrollment Complete",
      description: "Your keystroke biometric profile has been created. Now you can test authentication.",
    });
    
    setIsEnrolling(false);
    setDemoStep('test');
  };

  const startEnrollment = () => {
    setIsEnrolling(true);
    setEnrollmentProgress(0);
    setEnrollmentKeystrokes([]);
    setCurrentEnrollText(demoTexts[Math.floor(Math.random() * demoTexts.length)]);
    setDemoStep('create');
  };

  const handleTestCapture = (timings: KeyTiming[]) => {
    setTestKeystrokes(timings);

    if (timings.length > 10 && biometricProfile) {
      // Create a test pattern from the captured keystrokes
      const testPattern: KeystrokePattern = {
        userId: 'demo-user',
        patternId: `demo-test-${Date.now()}`,
        timings: timings,
        timestamp: Date.now(),
        context: 'test'
      };

      // Authenticate against the biometric profile
      const result = BiometricAnalyzer.authenticate(biometricProfile, testPattern);
      
      setAuthResult({
        success: result.success,
        confidenceScore: result.confidenceScore,
        message: result.success 
          ? "Authenticated successfully! Your typing pattern matches your profile."
          : "Authentication failed. The typing pattern doesn't match the enrolled profile."
      });
      
      setDemoStep('result');
    }
  };

  const startTest = () => {
    setTestKeystrokes([]);
    setAuthResult(null);
    setCurrentTestText(demoTexts[testIndex % demoTexts.length]);
    setTestIndex(prev => prev + 1);
    setDemoStep('test');
  };

  const resetDemo = () => {
    createNewProfile();
    setDemoStep('intro');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E5DEFF] to-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link to="/">
              <img 
                src="/lovable-uploads/bc422bbc-9a59-41fd-94f1-c8e5dd865c59.png" 
                alt="Shoal Logo" 
                className="h-10 w-10"
              />
            </Link>
            <span className="font-bold text-xl text-[#9b87f5]">Shoal</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Keystroke Biometrics Demo</h1>
            <p className="text-muted-foreground">
              Experience how our technology can identify you based on your unique typing pattern
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle>Demo Steps</CardTitle>
                </div>
                <div className="flex gap-1">
                  <div className={`h-2 w-8 rounded-full ${demoStep === 'intro' || demoStep === 'create' || demoStep === 'test' || demoStep === 'result' ? 'bg-primary' : 'bg-muted'}`}></div>
                  <div className={`h-2 w-8 rounded-full ${demoStep === 'create' || demoStep === 'test' || demoStep === 'result' ? 'bg-primary' : 'bg-muted'}`}></div>
                  <div className={`h-2 w-8 rounded-full ${demoStep === 'test' || demoStep === 'result' ? 'bg-primary' : 'bg-muted'}`}></div>
                  <div className={`h-2 w-8 rounded-full ${demoStep === 'result' ? 'bg-primary' : 'bg-muted'}`}></div>
                </div>
              </div>
              <CardDescription>
                {demoStep === 'intro' && "Learn how keystroke biometrics can enhance your security"}
                {demoStep === 'create' && "Create your unique typing profile by entering the text below"}
                {demoStep === 'test' && "Test authentication against your newly created profile"}
                {demoStep === 'result' && "See how accurately we can verify your identity"}
              </CardDescription>
            </CardHeader>
          </Card>

          {demoStep === 'intro' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Welcome to the Keystroke Biometrics Demo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Keystroke biometrics is a powerful security technology that identifies users based on their unique typing patterns. 
                  Unlike passwords that can be stolen or shared, your typing behavior is unique to you and difficult to replicate.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-accent/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Key className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Typing Rhythm</h3>
                    </div>
                    <p className="text-sm">We analyze the timing between your keystrokes - as unique as a fingerprint.</p>
                  </div>
                  
                  <div className="bg-accent/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Fingerprint className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Behavioral Pattern</h3>
                    </div>
                    <p className="text-sm">Your dwell time (how long you press each key) creates a unique pattern.</p>
                  </div>
                  
                  <div className="bg-accent/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Continuous Verification</h3>
                    </div>
                    <p className="text-sm">We can verify your identity continuously as you type, not just at login.</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium mb-2">How This Demo Works:</h3>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>First, you'll create a biometric profile by typing sample text</li>
                    <li>Then, we'll ask you to authenticate by typing a new sample</li>
                    <li>Our algorithm will compare the patterns and verify your identity</li>
                    <li>You'll see a detailed report of the authentication result</li>
                  </ol>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={startEnrollment} className="w-full">
                  Start Demo
                </Button>
              </CardFooter>
            </Card>
          )}

          {demoStep === 'create' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fingerprint className="h-5 w-5 text-primary" />
                  Create Your Biometric Profile
                </CardTitle>
                <CardDescription>
                  Type the text below to create your unique keystroke biometric profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-accent/20 rounded-lg mb-4">
                  <p className="font-medium text-center">"{currentEnrollText}"</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type the text above</label>
                  <KeystrokeCaptureComponent 
                    onCapture={handleEnrollmentCapture}
                    captureContext="enrollment"
                    autoStart={true}
                  />
                </div>
                
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-sm">
                    <span>Enrollment progress</span>
                    <span>{enrollmentProgress}%</span>
                  </div>
                  <Progress value={enrollmentProgress} className="h-2" />
                </div>
                
                {enrollmentProgress < 100 && (
                  <p className="text-sm text-muted-foreground mt-4">
                    Keep typing until the enrollment is complete. You can repeat the text multiple times.
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={resetDemo}>
                  Start Over
                </Button>
                {enrollmentProgress >= 100 && (
                  <Button onClick={completeEnrollment}>
                    Continue to Testing
                  </Button>
                )}
              </CardFooter>
            </Card>
          )}

          {demoStep === 'test' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Test Authentication
                </CardTitle>
                <CardDescription>
                  Let's test if we can correctly verify your identity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-accent/20 rounded-lg mb-4">
                  <p className="font-medium text-center">"{currentTestText}"</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type the text above</label>
                  <KeystrokeCaptureComponent 
                    onCapture={handleTestCapture}
                    captureContext="test"
                    autoStart={true}
                  />
                </div>
                
                <p className="text-sm text-muted-foreground mt-4">
                  Type naturally as you would normally. We'll analyze your typing pattern to verify your identity.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={resetDemo}>
                  Start Over
                </Button>
              </CardFooter>
            </Card>
          )}

          {demoStep === 'result' && authResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {authResult.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  )}
                  Authentication {authResult.success ? "Successful" : "Failed"}
                </CardTitle>
                <CardDescription>
                  {authResult.message}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Confidence Score</span>
                    <span className={`text-sm font-medium ${
                      authResult.confidenceScore >= 70 ? 'text-green-500' : 
                      authResult.confidenceScore >= 50 ? 'text-yellow-500' : 
                      'text-red-500'
                    }`}>
                      {authResult.confidenceScore.toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        authResult.confidenceScore >= 70 ? 'bg-green-500' : 
                        authResult.confidenceScore >= 50 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}
                      style={{ width: `${authResult.confidenceScore}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-accent/20 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">How It Works</h3>
                    <p className="text-sm">
                      Our algorithm analyzed your typing pattern across multiple dimensions, including:
                    </p>
                    <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                      <li>Flight time between keystrokes</li>
                      <li>Dwell time (how long each key is pressed)</li>
                      <li>Rhythm consistency across the text</li>
                      <li>Typing speed and error patterns</li>
                    </ul>
                  </div>
                  
                  <div className="bg-accent/20 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Security Impact</h3>
                    <p className="text-sm">
                      In a real-world scenario, this technology would:
                    </p>
                    <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                      <li>Protect against credential theft</li>
                      <li>Detect account takeovers in real-time</li>
                      <li>Provide continuous authentication</li>
                      <li>Add a layer of security that cannot be stolen</li>
                    </ul>
                  </div>
                </div>
                
                {authResult.success ? (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-green-700">Authentication Successful</h3>
                        <p className="text-sm text-green-600 mt-1">
                          Your typing pattern matched your enrolled profile with sufficient confidence.
                          In a real system, you would now be granted access.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <X className="h-5 w-5 text-red-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-red-700">Authentication Failed</h3>
                        <p className="text-sm text-red-600 mt-1">
                          Your typing pattern didn't match the enrolled profile with sufficient confidence.
                          In a real system, this could indicate an unauthorized access attempt.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                <Button variant="outline" onClick={resetDemo} className="w-full sm:w-auto">
                  Restart Demo
                </Button>
                <Button onClick={startTest} className="w-full sm:w-auto">
                  Try Again with New Text
                </Button>
                <Link to="/login" className="w-full sm:w-auto">
                  <Button variant="default" className="w-full">
                    Try the Login Demo
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )}
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Business Applications</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Financial Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Protect banking logins and financial transactions with an additional layer of security that can't be stolen or shared.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Healthcare</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Secure patient data and ensure that only authorized personnel can access sensitive medical information.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Enterprise Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Protect company resources and sensitive data with continuous authentication that verifies user identity throughout sessions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link to="/login">
              <Button size="lg" className="gap-2 bg-[#9b87f5] hover:bg-[#7E69AB]">
                Try the Full Authentication Demo
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t py-8 bg-[#1A1F2C] text-white mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img 
              src="/lovable-uploads/bc422bbc-9a59-41fd-94f1-c8e5dd865c59.png" 
              alt="Shoal Logo" 
              className="h-8 w-8"
            />
            <span className="font-bold text-[#9b87f5]">Shoal</span>
          </div>
          <p className="text-sm text-gray-300">© 2023 Shoal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
