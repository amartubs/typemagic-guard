
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Fingerprint, Check, X, AlertTriangle, Shield, RefreshCw } from 'lucide-react';
import { SecurityLevelIndicator, SecurityLevelSlider } from '@/components/ui-custom/SecurityLevel';
import KeystrokeCapture from '@/components/ui-custom/KeystrokeCapture';
import BiometricVisualizer from '@/components/ui-custom/BiometricVisualizer';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { KeyTiming, KeystrokePattern, BiometricProfile, AuthenticationResult } from '@/lib/types';
import { KeystrokeCapture as KeystrokeService, BiometricAnalyzer, createBiometricProfile } from '@/lib/biometricAuth';
import { createDemoProfile } from '@/lib/demoData';

const Demo = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('demo');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLearning, setIsLearning] = useState(false);
  const [learningProgress, setLearningProgress] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authResult, setAuthResult] = useState<AuthenticationResult | null>(null);
  const [biometricProfile, setBiometricProfile] = useState<BiometricProfile | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  
  // Initialize with demo profile
  useEffect(() => {
    // Create a demo profile
    const profile = createDemoProfile('demo-user');
    setBiometricProfile(profile);
  }, []);
  
  // Handle password keystroke capture
  const handleKeystrokeCapture = (timings: KeyTiming[]) => {
    if (!biometricProfile) return;
    
    // Create a pattern from the captured keystrokes
    const keystrokeService = new KeystrokeService('login');
    keystrokeService.startCapture();
    timings.forEach(timing => {
      // Simulate the keystrokes
      const downEvent = new KeyboardEvent('keydown', { key: timing.key });
      const upEvent = new KeyboardEvent('keyup', { key: timing.key });
      keystrokeService.handleKeyDown(downEvent);
      keystrokeService.handleKeyUp(upEvent);
    });
    const capturedTimings = keystrokeService.stopCapture();
    const newPattern = keystrokeService.createPattern(biometricProfile.userId);
    
    if (isLearning) {
      // Add to profile during learning phase
      const updatedProfile = BiometricAnalyzer.updateProfile(biometricProfile, newPattern);
      setBiometricProfile(updatedProfile);
      
      // Update learning progress
      const newProgress = Math.min(100, learningProgress + 20);
      setLearningProgress(newProgress);
      
      if (newProgress >= 100) {
        setIsLearning(false);
        toast({
          title: "Learning Complete",
          description: "Your biometric profile has been created successfully.",
          duration: 5000,
        });
      } else {
        toast({
          title: "Learning in Progress",
          description: `${newProgress}% complete. Please continue typing to build your profile.`,
          duration: 3000,
        });
      }
    } else if (username && password) {
      // Authenticate during normal usage
      const result = BiometricAnalyzer.authenticate(biometricProfile, newPattern);
      setAuthResult(result);
      
      if (result.success) {
        setIsAuthenticated(true);
        toast({
          title: "Authentication Successful",
          description: `Welcome back! Confidence score: ${result.confidenceScore.toFixed(0)}%`,
          duration: 5000,
        });
      } else {
        setIsAuthenticated(false);
        toast({
          title: "Authentication Failed",
          description: `Unusual typing pattern detected. Confidence: ${result.confidenceScore.toFixed(0)}%`,
          variant: "destructive",
          duration: 5000,
        });
      }
      
      // Update profile with new pattern if confident enough
      if (result.confidenceScore > 50) {
        const updatedProfile = BiometricAnalyzer.updateProfile(biometricProfile, newPattern);
        setBiometricProfile(updatedProfile);
      }
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLearning) {
      toast({
        title: "Still Learning",
        description: "Please continue typing to complete your biometric profile.",
        duration: 3000,
      });
      return;
    }
    
    if (!username || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both username and password.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    if (!authResult) {
      toast({
        title: "No Biometric Data",
        description: "Please type your password to analyze your keystroke pattern.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    // Authentication result already handled in keystroke capture
  };
  
  const startLearningMode = () => {
    setIsLearning(true);
    setLearningProgress(0);
    setUsername('');
    setPassword('');
    setIsAuthenticated(false);
    setAuthResult(null);
    
    toast({
      title: "Learning Mode Activated",
      description: "Type in the password field to build your biometric profile.",
      duration: 5000,
    });
  };
  
  const resetDemo = () => {
    setIsResetting(true);
    
    setTimeout(() => {
      // Reset the state
      setUsername('');
      setPassword('');
      setIsLearning(false);
      setLearningProgress(0);
      setIsAuthenticated(false);
      setAuthResult(null);
      
      // Create a new demo profile
      const profile = createDemoProfile('demo-user');
      setBiometricProfile(profile);
      
      setIsResetting(false);
      
      toast({
        title: "Demo Reset",
        description: "All biometric data has been reset.",
        duration: 3000,
      });
    }, 1000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Interactive Demo</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience how KeyGuard's biometric authentication works in real-time
            </p>
          </div>
          
          <Tabs defaultValue="demo" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="demo">Login Demo</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="demo" className="animate-scale-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="mr-2 h-5 w-5 text-primary" />
                      Biometric Login Demo
                    </CardTitle>
                    <CardDescription>
                      {isLearning 
                        ? "Type in the password field to build your biometric profile" 
                        : "Enter your credentials and we'll verify your typing pattern"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLearning && (
                      <div className="mb-6">
                        <p className="text-sm text-muted-foreground mb-2">Learning progress</p>
                        <div className="w-full bg-secondary rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full transition-all duration-500" 
                            style={{ width: `${learningProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {learningProgress < 100 
                            ? `${learningProgress}% complete - Continue typing to build your profile` 
                            : "Learning complete! Try authenticating now."}
                        </p>
                      </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input 
                          id="username" 
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter your username"
                          disabled={isResetting}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <KeystrokeCapture 
                            onCapture={handleKeystrokeCapture}
                            captureContext="login"
                            inputProps={{
                              id: "password",
                              type: "password",
                              value: password,
                              onChange: (e) => setPassword(e.target.value),
                              placeholder: "Enter your password",
                              disabled: isResetting,
                            }}
                          />
                          {authResult && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              {authResult.success ? (
                                <Check className="h-5 w-5 text-green-500" />
                              ) : (
                                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {authResult && (
                        <div className="rounded-lg border p-3 bg-muted/30">
                          <p className="text-sm font-medium mb-1">Authentication confidence</p>
                          <SecurityLevelSlider value={authResult.confidenceScore} />
                          <p className="text-xs text-muted-foreground mt-2">
                            {authResult.success
                              ? "Your typing pattern matches your profile"
                              : authResult.anomalyDetails?.description || "Unusual typing pattern detected"}
                          </p>
                        </div>
                      )}
                      
                      <div className="pt-2">
                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={isLearning || isResetting}
                        >
                          <Fingerprint className="mr-2 h-4 w-4" />
                          Sign In with Biometrics
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <div className="w-full flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={startLearningMode}
                        disabled={isLearning || isResetting}
                      >
                        {isLearning ? "Learning..." : "Start Learning Mode"}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={resetDemo}
                        disabled={isResetting}
                      >
                        <RefreshCw className={`mr-2 h-4 w-4 ${isResetting ? 'animate-spin' : ''}`} />
                        Reset Demo
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
                
                <div className="space-y-6">
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle>How It Works</CardTitle>
                      <CardDescription>
                        Understanding the biometric authentication process
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm">
                        KeyGuard analyzes your unique typing rhythm, speed, and pattern to create a 
                        biometric profile that serves as an additional layer of authentication.
                      </p>
                      
                      <div className="space-y-4 pt-2">
                        <div className="flex items-start space-x-3">
                          <div className="bg-primary/10 text-primary rounded-full p-1.5 mt-0.5">
                            <Fingerprint className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Behavioral Biometrics</h4>
                            <p className="text-xs text-muted-foreground">
                              Unlike physical biometrics, behavioral biometrics analyze patterns
                              in how you type for a non-intrusive security layer.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="bg-primary/10 text-primary rounded-full p-1.5 mt-0.5">
                            <Shield className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Seamless Integration</h4>
                            <p className="text-xs text-muted-foreground">
                              KeyGuard works alongside existing authentication methods without adding 
                              extra steps for users.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="bg-primary/10 text-primary rounded-full p-1.5 mt-0.5">
                            <Check className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Continuous Learning</h4>
                            <p className="text-xs text-muted-foreground">
                              The system adapts to subtle changes in your typing patterns over time
                              while maintaining security.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle>Current Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Profile Status:</span>
                          <span className="text-sm font-medium">
                            {isLearning ? "Learning" : biometricProfile?.status || "Not Available"}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Security Level:</span>
                          <SecurityLevelIndicator level="high" size="sm" />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Authentication Status:</span>
                          <span className={`text-sm font-medium ${
                            isAuthenticated ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {isAuthenticated ? "Authenticated" : "Not Authenticated"}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Confidence Score:</span>
                          <span className="text-sm font-medium">
                            {authResult ? `${authResult.confidenceScore.toFixed(0)}%` : "N/A"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="analysis" className="animate-scale-in">
              {biometricProfile && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <BiometricVisualizer 
                    data={BiometricAnalyzer.getVisualizationData(biometricProfile)} 
                    type="confidence"
                    title="Confidence Score History"
                    className="shadow-md"
                  />
                  
                  <BiometricVisualizer 
                    data={BiometricAnalyzer.getVisualizationData(biometricProfile)} 
                    type="typing-speed"
                    title="Typing Speed Analysis"
                    className="shadow-md"
                  />
                  
                  <BiometricVisualizer 
                    data={BiometricAnalyzer.getVisualizationData(biometricProfile)} 
                    type="heatmap"
                    title="Key Usage Distribution"
                    className="shadow-md md:col-span-2"
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Demo;
