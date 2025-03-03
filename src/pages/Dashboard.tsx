
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, VisualizationData } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, UserCheck, Clock, LogOut, Settings, ChevronRight } from 'lucide-react';
import KeystrokeAnalytics from '@/components/dashboard/KeystrokeAnalytics';
import { BiometricAnalyzer } from '@/lib/biometricAuth';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [analyticsData, setAnalyticsData] = useState<VisualizationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Generate visualization data if user has a biometric profile
      if (parsedUser.biometricProfile) {
        // Simulate a loading delay for better UX
        setTimeout(() => {
          const data = BiometricAnalyzer.getVisualizationData(parsedUser.biometricProfile);
          setAnalyticsData(data);
          setIsLoading(false);
        }, 1000);
      } else {
        setIsLoading(false);
      }
    } else {
      // Redirect to login if no user is stored
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
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
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/profile')} 
              className="gap-2"
            >
              <Settings size={16} />
              <span className="hidden sm:inline">Settings</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout} 
              className="gap-2"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
          
          <div className="mt-4 sm:mt-0 flex items-center">
            <span className="text-sm text-muted-foreground mr-3">Security Level:</span>
            <Badge variant={
              user.securitySettings.securityLevel === 'high' || user.securitySettings.securityLevel === 'very-high' 
                ? 'success' 
                : user.securitySettings.securityLevel === 'medium' 
                  ? 'warning' 
                  : 'danger'
            }>
              {user.securitySettings.securityLevel.toUpperCase()}
            </Badge>
          </div>
        </div>
        
        {/* Analytics Dashboard */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Biometric Analytics</h2>
          
          {user.biometricProfile ? (
            <KeystrokeAnalytics 
              visualizationData={analyticsData} 
              isLoading={isLoading} 
            />
          ) : (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Biometric Data Available</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't trained your biometric profile yet. Complete your profile to see analytics.
                  </p>
                  <Button onClick={() => navigate('/profile')}>
                    Set Up Biometric Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </section>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                Account Status
              </CardTitle>
              <CardDescription>Your current account security status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium">{user.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role:</span>
                  <span className="font-medium capitalize">{user.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Security Level:</span>
                  <span className="font-medium capitalize">{user.securitySettings.securityLevel}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Biometric Profile
              </CardTitle>
              <CardDescription>Your keystroke biometric status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Profile Status:</span>
                  <span className="font-medium capitalize">{user.biometricProfile?.status || 'Not Created'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Patterns Recorded:</span>
                  <span className="font-medium">{user.biometricProfile?.keystrokePatterns.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Confidence Score:</span>
                  <span className="font-medium">{user.biometricProfile?.confidenceScore || 0}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your recent login activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Login:</span>
                  <span className="font-medium">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'First Login'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Profile Update:</span>
                  <span className="font-medium">
                    {user.biometricProfile?.lastUpdated 
                      ? new Date(user.biometricProfile.lastUpdated).toLocaleString() 
                      : 'Never'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="overflow-hidden transition-all hover:border-primary/50">
              <Button 
                variant="ghost" 
                className="h-auto p-0 justify-start w-full"
                onClick={() => navigate('/profile')}
              >
                <div className="flex items-center justify-between w-full p-6">
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium">Update Your Profile</span>
                    <span className="text-sm text-muted-foreground">Manage your account settings and security preferences</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </Button>
            </Card>
            
            <Card className="overflow-hidden transition-all hover:border-primary/50">
              <Button 
                variant="ghost" 
                className="h-auto p-0 justify-start w-full"
                onClick={() => navigate('/demo')}
              >
                <div className="flex items-center justify-between w-full p-6">
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium">Explore Demo</span>
                    <span className="text-sm text-muted-foreground">See how biometric authentication works with interactive demos</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

// Create a Badge component for security level
const Badge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' }) => {
  const variantClasses = {
    default: 'bg-primary/10 text-primary',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};

export default Dashboard;
