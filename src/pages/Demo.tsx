
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { KeystrokeCapture } from '@/lib/biometricAuth';
import KeystrokeCaptureComponent from '@/components/ui-custom/KeystrokeCapture';
import { ChevronRight, Key, Shield, ArrowRight, Fingerprint, Lock } from 'lucide-react';
import { KeyTiming } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const Demo = () => {
  const [step, setStep] = useState<number>(1);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [patterns, setPatterns] = useState<KeyTiming[]>([]);
  const [confidenceScore, setConfidenceScore] = useState<number>(0);
  const [phrase] = useState<string>("The quick brown fox jumps over the lazy dog");
  const [userInput, setUserInput] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCapture = (timings: KeyTiming[]) => {
    setPatterns(timings);
    
    // Simulate some time passing for analysis
    setTimeout(() => {
      const randomConfidence = Math.floor(65 + Math.random() * 30); // 65-95%
      setConfidenceScore(randomConfidence);
      setShowResults(true);
    }, 1500);
  };

  const resetDemo = () => {
    setStep(1);
    setIsTyping(false);
    setShowResults(false);
    setPatterns([]);
    setConfidenceScore(0);
    setUserInput("");
  };

  const handleStartAuthentication = () => {
    setStep(2);
  };

  const handleTypeVerification = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setUserInput(newValue);
    
    if (!isTyping) {
      setIsTyping(true);
    }
    
    // Check if user typed the full phrase
    if (newValue.length >= phrase.length) {
      setIsTyping(false);
    }
  };

  const redirectToDashboard = () => {
    toast({
      title: "Demo Completed",
      description: "Redirecting to login page...",
    });
    
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12">
      <div className="container mx-auto px-4">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Keystroke Biometrics Demo</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience how our advanced keystroke analysis technology works to verify your identity through your unique typing patterns.
          </p>
        </header>

        <div className="max-w-3xl mx-auto">
          {/* Step indicators */}
          <div className="flex items-center justify-center mb-8 gap-2">
            <div className={`rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'} h-3 w-3`} />
            <div className="h-0.5 w-12 bg-muted" />
            <div className={`rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'} h-3 w-3`} />
            <div className="h-0.5 w-12 bg-muted" />
            <div className={`rounded-full ${step >= 3 ? 'bg-primary' : 'bg-muted'} h-3 w-3`} />
          </div>

          {/* Step 1: Introduction */}
          {step === 1 && (
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Fingerprint className="h-6 w-6 text-primary" />
                  <Badge variant="outline">Step 1</Badge>
                </div>
                <CardTitle>Understanding Keystroke Biometrics</CardTitle>
                <CardDescription>
                  Learn how our technology analyzes your unique typing pattern to create a biometric profile.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-md">
                    <h3 className="font-semibold flex items-center gap-2 mb-2">
                      <Key className="h-4 w-4 text-primary" />
                      How It Works
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Keystroke biometrics analyzes patterns in your typing behavior, including how long you press keys, 
                      the time between keypresses, and common typing rhythms. These patterns are as unique as a fingerprint!
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="p-3 border rounded-md text-center">
                      <Shield className="h-5 w-5 text-primary mx-auto mb-2" />
                      <h4 className="text-sm font-medium">Enhanced Security</h4>
                      <p className="text-xs text-muted-foreground">
                        Adds a layer no one can steal
                      </p>
                    </div>
                    <div className="p-3 border rounded-md text-center">
                      <Lock className="h-5 w-5 text-primary mx-auto mb-2" />
                      <h4 className="text-sm font-medium">Continuous Verification</h4>
                      <p className="text-xs text-muted-foreground">
                        Works while you type normally
                      </p>
                    </div>
                    <div className="p-3 border rounded-md text-center">
                      <Fingerprint className="h-5 w-5 text-primary mx-auto mb-2" />
                      <h4 className="text-sm font-medium">AI-Powered</h4>
                      <p className="text-xs text-muted-foreground">
                        Learns and adapts over time
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleStartAuthentication} className="gap-2">
                  Try It Yourself
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 2: Typing Test */}
          {step === 2 && (
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Key className="h-6 w-6 text-primary" />
                  <Badge variant="outline">Step 2</Badge>
                </div>
                <CardTitle>Type the Phrase</CardTitle>
                <CardDescription>
                  Type the following phrase to analyze your keystroke pattern.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-primary/5 border border-primary/10 rounded-md">
                    <p className="font-medium text-center">{phrase}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="typing-input">Type the phrase exactly as shown:</Label>
                    <KeystrokeCaptureComponent
                      onCapture={handleCapture}
                      autoStart={false}
                      inputProps={{
                        value: userInput,
                        onChange: handleTypeVerification,
                        id: "typing-input",
                        placeholder: "Start typing the phrase...",
                      }}
                    />
                    
                    <p className="text-xs text-muted-foreground">
                      {isTyping ? (
                        <span className="text-primary">Analyzing your typing pattern...</span>
                      ) : patterns.length > 0 ? (
                        <span className="text-green-500">Pattern captured! Analyzing results...</span>
                      ) : (
                        "We'll analyze your keystroke dynamics as you type."
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline" onClick={resetDemo}>
                  Start Over
                </Button>
                {patterns.length > 0 && !showResults && (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-sm">Analyzing pattern...</span>
                  </div>
                )}
                {showResults && (
                  <Button onClick={() => setStep(3)}>
                    View Results
                  </Button>
                )}
              </CardFooter>
            </Card>
          )}

          {/* Step 3: Results */}
          {step === 3 && (
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-6 w-6 text-primary" />
                  <Badge variant="outline">Step 3</Badge>
                </div>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>
                  Here's how our system analyzed your unique typing pattern.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-6 border rounded-md bg-card">
                    <h3 className="text-xl font-semibold text-center mb-4">Authentication Confidence</h3>
                    
                    <div className="relative h-4 bg-muted rounded-full mb-6">
                      <div 
                        className={`absolute top-0 left-0 h-4 rounded-full ${
                          confidenceScore > 80 ? 'bg-green-500' : 
                          confidenceScore > 65 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${confidenceScore}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Low Confidence</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{confidenceScore}%</span>
                        <Badge className={
                          confidenceScore > 80 ? 'bg-green-500' : 
                          confidenceScore > 65 ? 'bg-amber-500' : 'bg-red-500'
                        }>
                          {confidenceScore > 80 ? 'High Match' : 
                          confidenceScore > 65 ? 'Moderate Match' : 'Low Match'}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">High Confidence</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">Keystroke Metrics</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Typing rhythm consistency:</span>
                          <span className="font-medium">
                            {confidenceScore > 75 ? 'High' : 'Moderate'}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Key press duration pattern:</span>
                          <span className="font-medium">
                            {confidenceScore > 70 ? 'Strong Match' : 'Partial Match'}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Typing speed:</span>
                          <span className="font-medium">
                            {Math.floor(30 + Math.random() * 40)} WPM
                          </span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">Security Assessment</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className={`h-3 w-3 rounded-full ${confidenceScore > 80 ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                          <span className="text-sm">
                            {confidenceScore > 80 ? 'Authentication successful' : 'Additional verification recommended'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Based on your typing pattern, our system has created a unique biometric profile that can be used to verify your identity in the future.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline" onClick={resetDemo}>
                  Try Again
                </Button>
                <Button onClick={redirectToDashboard}>
                  Continue to Login
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Want to learn more about how keystroke biometrics can secure your applications?
            </p>
            <div className="mt-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
