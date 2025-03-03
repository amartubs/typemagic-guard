
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, UserCheck, Clock, LogOut } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
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
          <Button variant="ghost" onClick={handleLogout} className="gap-2">
            <LogOut size={16} />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Welcome, {user.name}</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
          <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Button variant="outline" className="h-auto p-4 justify-start" onClick={() => navigate('/profile')}>
              <div className="flex flex-col items-start text-left">
                <span className="font-medium">Update Your Profile</span>
                <span className="text-sm text-muted-foreground">Manage your account settings and security preferences</span>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 justify-start" onClick={() => navigate('/demo')}>
              <div className="flex flex-col items-start text-left">
                <span className="font-medium">Explore Demo</span>
                <span className="text-sm text-muted-foreground">See how biometric authentication works with interactive demos</span>
              </div>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
