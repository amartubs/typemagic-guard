
import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import KeystrokeAnalytics from '@/components/dashboard/KeystrokeAnalytics';
import AdvancedAnalytics from '@/components/analytics/AdvancedAnalytics';
import SecurityLevel from '@/components/ui-custom/SecurityLevel';
import PerformanceMonitor from '@/components/monitoring/PerformanceMonitor';
import EnterpriseSettings from '@/components/enterprise/EnterpriseSettings';
import { useSubscription } from '@/hooks/useSubscription';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';
import { 
  LayoutDashboard, 
  BarChart3, 
  Activity, 
  Shield, 
  Settings,
  KeyRound,
  Users,
  Clock,
  AlertTriangle, 
  CheckCircle
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { subscription, canAccessFeature } = useSubscription();
  const { metrics } = useSecurityMonitoring();
  const [activeTab, setActiveTab] = useState('overview');
  
  const isEnterprise = subscription?.tier === 'enterprise';
  const isProfessional = subscription?.tier === 'professional' || isEnterprise;
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="mb-4">Please log in to access your dashboard.</p>
          <Button asChild>
            <a href="/login">Log In</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your security status and system performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Shield className={`h-8 w-8 ${
                metrics.averageConfidence > 80 ? 'text-green-500' :
                metrics.averageConfidence > 60 ? 'text-amber-500' : 
                'text-red-500'
              }`} />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Security Confidence</p>
                <p className="text-2xl font-bold">{metrics.averageConfidence}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <KeyRound className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Authentication Events</p>
                <p className="text-2xl font-bold">
                  {metrics.recentFailedAttempts > 0 ? (
                    <span className="text-red-500">
                      {metrics.recentFailedAttempts} failed
                    </span>
                  ) : (
                    <span className="text-green-500">All secure</span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-indigo-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Users Protected</p>
                <p className="text-2xl font-bold">
                  {(Math.floor(Math.random() * 10) + 1) * (
                    isEnterprise ? 100 : 
                    isProfessional ? 10 : 
                    1
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Last Login</p>
                <p className="text-2xl font-bold">
                  {metrics.lastSuccessfulLogin ? 
                    new Date(metrics.lastSuccessfulLogin).toLocaleDateString() : 
                    "Never"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Enterprise
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Security Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security Status
              </CardTitle>
              <CardDescription>
                Current security level and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <SecurityLevel
                  score={metrics.averageConfidence || 75}
                  caption={
                    metrics.averageConfidence > 80 
                      ? "Your account is well protected" 
                      : "Room for improvement"
                  }
                />
              </div>
              {metrics.recentFailedAttempts > 0 ? (
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-800 mb-1">
                          {metrics.recentFailedAttempts} Failed Authentication Attempts Detected
                        </p>
                        <p className="text-sm text-red-700">
                          There have been unsuccessful login attempts to your account in the last 24 hours.
                          Consider reviewing your security settings and changing your password.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-800 mb-1">
                          No Security Issues Detected
                        </p>
                        <p className="text-sm text-green-700">
                          Your account is secure with no failed authentication attempts or suspicious activities 
                          detected in the last 24 hours.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* KeyStroke Analytics Sample */}
          <KeystrokeAnalytics condensed />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AdvancedAnalytics />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <PerformanceMonitor />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <KeystrokeAnalytics />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <EnterpriseSettings isEnterprise={isEnterprise} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
