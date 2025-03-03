import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import KeystrokeCapture from '@/components/ui-custom/KeystrokeCapture';
import { Shield, User as UserIcon, Bell, Fingerprint, ArrowLeft, Save, RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUser, updateUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [securityLevel, setSecurityLevel] = useState<'low' | 'medium' | 'high' | 'very-high'>('medium');
  const [enforceTwoFactor, setEnforceTwoFactor] = useState(false);
  const [minConfidenceThreshold, setMinConfidenceThreshold] = useState(60);
  const [isTrainingMode, setIsTrainingMode] = useState(false);
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false);

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      setName(authUser.name);
      setEmail(authUser.email);
      setSecurityLevel(authUser.securitySettings.securityLevel);
      setEnforceTwoFactor(authUser.securitySettings.enforceTwoFactor);
      setMinConfidenceThreshold(authUser.securitySettings.minConfidenceThreshold);
    } else {
      navigate('/login');
    }
  }, [authUser, navigate]);

  const handleSaveProfile = () => {
    if (!user) return;

    const twoFactorChanged = enforceTwoFactor !== user.securitySettings.enforceTwoFactor;

    const updatedUser = {
      ...user,
      name,
      email,
      securitySettings: {
        ...user.securitySettings,
        securityLevel,
        enforceTwoFactor,
        minConfidenceThreshold
      }
    };

    updateUser(updatedUser);
    setUser(updatedUser);
    
    if (twoFactorChanged) {
      if (enforceTwoFactor) {
        toast({
          title: "Two-Factor Authentication Enabled",
          description: "Your account is now more secure with two-factor authentication.",
        });
      } else {
        toast({
          title: "Two-Factor Authentication Disabled",
          description: "Two-factor authentication has been turned off for your account.",
        });
      }
    } else {
      toast({
        title: "Profile Updated",
        description: "Your profile changes have been saved successfully.",
      });
    }
  };

  const handleToggleTwoFactor = (checked: boolean) => {
    setEnforceTwoFactor(checked);
    
    if (checked) {
      toast({
        title: "Two-Factor Authentication",
        description: "When enabled, you'll need to verify your identity with a code sent to your email during login.",
        duration: 5000,
      });
    }
  };

  const handleBiometricTraining = () => {
    setIsTrainingMode(true);
    toast({
      title: "Training Mode Activated",
      description: "Type a few sentences to collect biometric data.",
    });
  };

  const handleKeystrokeCapture = (timings: any) => {
    if (!user || !isTrainingMode) return;

    const newPattern = {
      userId: user.id,
      patternId: `pattern-${Date.now()}`,
      timings,
      timestamp: Date.now(),
      context: 'profile-training'
    };

    const existingPatterns = user.biometricProfile?.keystrokePatterns || [];
    
    const biometricStatus: 'learning' | 'active' | 'locked' = 
      existingPatterns.length > 2 ? 'active' : 'learning';
    
    const updatedUser = {
      ...user,
      biometricProfile: {
        userId: user.id,
        keystrokePatterns: [...existingPatterns, newPattern],
        confidenceScore: Math.min(100, (existingPatterns.length + 1) * 10),
        lastUpdated: Date.now(),
        status: biometricStatus
      }
    };

    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsTrainingMode(false);
    
    toast({
      title: "Biometric Sample Collected",
      description: `You now have ${updatedUser.biometricProfile.keystrokePatterns.length} patterns recorded.`,
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading user data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Biometric Auth</span>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
        
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              <span>Account</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="biometrics" className="flex items-center gap-2">
              <Fingerprint className="h-4 w-4" />
              <span>Biometrics</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Update your personal details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Account Status</Label>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={user.status === 'active' ? "default" : "destructive"}
                    >
                      {user.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your security preferences and authentication methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="security-level">Security Level</Label>
                  <select 
                    id="security-level"
                    value={securityLevel}
                    onChange={(e) => setSecurityLevel(e.target.value as any)}
                    className="w-full p-2 rounded-md border border-input bg-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="very-high">Very High</option>
                  </select>
                  <p className="text-sm text-muted-foreground mt-1">
                    {securityLevel === 'low' && "Basic protection with minimal verification steps."}
                    {securityLevel === 'medium' && "Standard protection with reasonable security measures."}
                    {securityLevel === 'high' && "Enhanced protection with strict verification requirements."}
                    {securityLevel === 'very-high' && "Maximum protection with multiple verification layers."}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">Require Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account with email verification
                    </p>
                  </div>
                  <Switch
                    id="two-factor"
                    checked={enforceTwoFactor}
                    onCheckedChange={handleToggleTwoFactor}
                  />
                </div>
                
                {enforceTwoFactor && (
                  <div className="p-4 border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/50 rounded-md flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-800 dark:text-amber-300">
                      <p className="font-semibold">Two-Factor Authentication Info</p>
                      <p className="mt-1">
                        When enabled, you'll need to enter a verification code sent to your email 
                        when logging in. For demo purposes, the code will be shown directly in the app.
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="confidence-threshold">
                    Minimum Confidence Threshold: {minConfidenceThreshold}%
                  </Label>
                  <Input 
                    id="confidence-threshold" 
                    type="range" 
                    min="30" 
                    max="95" 
                    value={minConfidenceThreshold} 
                    onChange={(e) => setMinConfidenceThreshold(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Sets how closely your typing must match your profile to be accepted
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="biometrics">
            <Card>
              <CardHeader>
                <CardTitle>Biometric Profile</CardTitle>
                <CardDescription>
                  Manage your keystroke biometric data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Profile Status</Label>
                    <Badge 
                      variant={user.biometricProfile?.status === 'active' ? "default" : "secondary"}
                    >
                      {user.biometricProfile?.status?.toUpperCase() || 'NOT CREATED'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm">Confidence Score:</span>
                    <span className="font-medium">{user.biometricProfile?.confidenceScore || 0}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Samples Collected:</span>
                    <span className="font-medium">{user.biometricProfile?.keystrokePatterns?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Updated:</span>
                    <span className="font-medium">
                      {user.biometricProfile?.lastUpdated 
                        ? new Date(user.biometricProfile.lastUpdated).toLocaleString() 
                        : 'Never'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Train Your Biometric Profile</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Type a few sentences to train your biometric profile. We recommend collecting at least 3 samples.
                  </p>
                  
                  {isTrainingMode ? (
                    <div className="space-y-4">
                      <div className="p-4 border rounded-md bg-muted/50">
                        <p className="text-sm mb-4">
                          Please type the following text:
                          <br />
                          <span className="font-medium text-primary">
                            The quick brown fox jumps over the lazy dog. Security systems rely on multiple factors for authentication.
                          </span>
                        </p>
                        <KeystrokeCapture 
                          onCapture={handleKeystrokeCapture}
                          captureContext="profile-training"
                        />
                      </div>
                    </div>
                  ) : (
                    <Button 
                      onClick={handleBiometricTraining} 
                      variant="outline" 
                      className="w-full gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Start Training Session
                    </Button>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to reset your biometric profile? This will delete all your keystroke patterns.")) {
                      const updatedUser = {
                        ...user,
                        biometricProfile: undefined
                      };
                      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                      setUser(updatedUser);
                      toast({
                        title: "Biometric Profile Reset",
                        description: "Your biometric profile has been reset successfully.",
                      });
                    }
                  }}
                >
                  Reset Profile
                </Button>
                <Button onClick={() => navigate('/dashboard')} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ProfilePage;
