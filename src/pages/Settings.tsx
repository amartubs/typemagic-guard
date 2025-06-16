
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { SecurityLevel } from '@/lib/types';
import { 
  Shield, 
  User as UserIcon, 
  Bell, 
  Settings as SettingsIcon, 
  Fingerprint, 
  ArrowLeft, 
  Save, 
  RefreshCw, 
  Lock, 
  Key, 
  ChevronLeft,
  AlertTriangle,
  Smartphone,
  Palette,
  Database
} from 'lucide-react';
import EnhancedWhiteLabelManager from '@/components/enterprise/EnhancedWhiteLabelManager';
import EnhancedApiKeyManager from '@/components/enterprise/EnhancedApiKeyManager';
import AdminSettingsManager from '@/components/admin/AdminSettingsManager';

const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, updateUser, loading } = useAuth();
  
  // User settings
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [securityLevel, setSecurityLevel] = useState<SecurityLevel>('medium');
  const [enforceTwoFactor, setEnforceTwoFactor] = useState(false);
  const [minConfidenceThreshold, setMinConfidenceThreshold] = useState(60);
  const [anomalyDetectionSensitivity, setAnomalyDetectionSensitivity] = useState(50);
  const [maxFailedAttempts, setMaxFailedAttempts] = useState(5);
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  
  // Device settings
  const [rememberDevices, setRememberDevices] = useState(true);
  const [trustedDeviceExpiry, setTrustedDeviceExpiry] = useState(30);

  // Load user settings
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setSecurityLevel(user.securitySettings.securityLevel);
      setEnforceTwoFactor(user.securitySettings.enforceTwoFactor);
      setMinConfidenceThreshold(user.securitySettings.minConfidenceThreshold);
      setAnomalyDetectionSensitivity(user.securitySettings.anomalyDetectionSensitivity);
      setMaxFailedAttempts(user.securitySettings.maxFailedAttempts);
    }
  }, [user]);

  // Handle saving user profile
  const handleSaveProfile = () => {
    if (!user) return;

    updateUser({
      name,
      email
    });
    
    toast({
      title: "Profile Updated",
      description: "Your profile changes have been saved successfully.",
    });
  };

  // Handle saving security settings
  const handleSaveSecuritySettings = () => {
    if (!user) return;

    updateUser({
      securitySettings: {
        ...user.securitySettings,
        securityLevel,
        enforceTwoFactor,
        minConfidenceThreshold,
        anomalyDetectionSensitivity,
        maxFailedAttempts
      }
    });
    
    toast({
      title: "Security Settings Updated",
      description: "Your security settings have been updated successfully.",
    });
  };

  // Handle saving notification settings
  const handleSaveNotificationSettings = () => {
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  // Handle saving device settings
  const handleSaveDeviceSettings = () => {
    toast({
      title: "Device Settings Updated",
      description: "Your device settings have been saved.",
    });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">TypeMagic Guard</span>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="gap-2"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </Button>
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full max-w-4xl grid-cols-7 mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <span className="hidden sm:inline">Devices</span>
            </TabsTrigger>
            <TabsTrigger value="whitelabel" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Branding</span>
            </TabsTrigger>
            <TabsTrigger value="apikeys" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              <span className="hidden sm:inline">API Keys</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="max-w-4xl mx-auto">
            {/* Profile Settings */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-primary" />
                    Profile Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your personal information and account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="account-id">Account ID</Label>
                    <div className="flex">
                      <Input 
                        id="account-id" 
                        value={user.id} 
                        readOnly
                        className="bg-muted/50"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">This is your unique account identifier.</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveProfile} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Profile
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Security Settings */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Configure your security preferences and authentication methods
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="security-level">Security Level</Label>
                    <Select 
                      value={securityLevel}
                      onValueChange={(value) => setSecurityLevel(value as SecurityLevel)}
                    >
                      <SelectTrigger id="security-level" className="w-full">
                        <SelectValue placeholder="Select security level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="very-high">Very High</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-1">
                      {securityLevel === 'low' && "Basic protection with minimal verification steps."}
                      {securityLevel === 'medium' && "Standard protection with reasonable security measures."}
                      {securityLevel === 'high' && "Enhanced protection with strict verification requirements."}
                      {securityLevel === 'very-high' && "Maximum protection with multiple verification layers."}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require additional verification when logging in
                      </p>
                    </div>
                    <Switch
                      id="two-factor"
                      checked={enforceTwoFactor}
                      onCheckedChange={setEnforceTwoFactor}
                    />
                  </div>
                  
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="anomaly-detection">
                      Anomaly Detection Sensitivity: {anomalyDetectionSensitivity}%
                    </Label>
                    <Input 
                      id="anomaly-detection" 
                      type="range" 
                      min="10" 
                      max="90" 
                      value={anomalyDetectionSensitivity} 
                      onChange={(e) => setAnomalyDetectionSensitivity(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-sm text-muted-foreground">
                      Higher values detect subtle anomalies but may increase false rejections
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max-attempts">Maximum Failed Attempts</Label>
                    <Select 
                      value={maxFailedAttempts.toString()}
                      onValueChange={(value) => setMaxFailedAttempts(parseInt(value))}
                    >
                      <SelectTrigger id="max-attempts" className="w-full">
                        <SelectValue placeholder="Select maximum attempts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 attempts</SelectItem>
                        <SelectItem value="5">5 attempts</SelectItem>
                        <SelectItem value="10">10 attempts</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Account will be temporarily locked after this many consecutive failed attempts
                    </p>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center gap-2 text-amber-500 mb-4">
                      <AlertTriangle className="h-5 w-5" />
                      <h3 className="font-medium">Advanced Security Options</h3>
                    </div>
                    
                    <Button variant="outline" className="w-full justify-start gap-2 mb-2">
                      <Key className="h-4 w-4" />
                      Change Password
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start gap-2 mb-2">
                      <Lock className="h-4 w-4" />
                      Reset Biometric Profile
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveSecuritySettings} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Security Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Notification Settings */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your notification preferences and alerts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive important updates about your account via email
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="login-alerts">Login Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when someone logs into your account
                      </p>
                    </div>
                    <Switch
                      id="login-alerts"
                      checked={loginAlerts}
                      onCheckedChange={setLoginAlerts}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="security-alerts">Security Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about suspicious activities or security issues
                      </p>
                    </div>
                    <Switch
                      id="security-alerts"
                      checked={securityAlerts}
                      onCheckedChange={setSecurityAlerts}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveNotificationSettings} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Notification Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Device Settings */}
            <TabsContent value="devices">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-primary" />
                    Device Management
                  </CardTitle>
                  <CardDescription>
                    Manage your trusted devices and sessions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="remember-devices">Remember Trusted Devices</Label>
                      <p className="text-sm text-muted-foreground">
                        Skip additional verification on devices you've previously used
                      </p>
                    </div>
                    <Switch
                      id="remember-devices"
                      checked={rememberDevices}
                      onCheckedChange={setRememberDevices}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="device-expiry">Trusted Device Expiry</Label>
                    <Select 
                      value={trustedDeviceExpiry.toString()}
                      onValueChange={(value) => setTrustedDeviceExpiry(parseInt(value))}
                    >
                      <SelectTrigger id="device-expiry" className="w-full">
                        <SelectValue placeholder="Select expiry period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Trusted devices will be remembered for this period
                    </p>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-4">Currently Active Sessions</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <p className="font-medium">Current Device</p>
                          <p className="text-sm text-muted-foreground">Last active: Just now</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                          <span className="text-sm">Active</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="mt-4 w-full">
                      Manage All Devices & Sessions
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveDeviceSettings} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Device Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* White Label Settings */}
            <TabsContent value="whitelabel">
              <EnhancedWhiteLabelManager />
            </TabsContent>

            {/* API Key Management */}
            <TabsContent value="apikeys">
              <EnhancedApiKeyManager />
            </TabsContent>

            {/* Admin Settings */}
            <TabsContent value="admin">
              <AdminSettingsManager />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default SettingsPage;
