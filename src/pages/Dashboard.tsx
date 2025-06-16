
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import {
  Shield,
  Users,
  BarChart3,
  Key,
  Settings,
  Building2,
  Crown,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import KeystrokeAnalytics from '@/components/dashboard/KeystrokeAnalytics';
import ProtectedLayout from '@/components/layout/ProtectedLayout';

const Dashboard = () => {
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'admin';
  const isEnterprise = user?.subscription?.tier === 'enterprise';
  const isProfessionalOrHigher = ['professional', 'enterprise'].includes(user?.subscription?.tier || '');

  return (
    <ProtectedLayout>
      <div className="container mx-auto py-8 px-4">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.name || 'User'}!
              </h1>
              <p className="text-muted-foreground">
                Here's your security overview and system status.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Badge variant="default" className="bg-yellow-500">
                  <Crown className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              )}
              {isEnterprise && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  <Building2 className="h-3 w-3 mr-1" />
                  Enterprise
                </Badge>
              )}
              <Badge variant="outline">
                {user?.subscription?.tier?.charAt(0).toUpperCase() + user?.subscription?.tier?.slice(1) || 'Free'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Score</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">98%</div>
              <p className="text-xs text-muted-foreground">
                +2% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                Across 2 devices
              </p>
            </CardContent>
          </Card>

          {isProfessionalOrHigher && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Threat Detection</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">0</div>
                <p className="text-xs text-muted-foreground">
                  No threats detected
                </p>
              </CardContent>
            </Card>
          )}

          {isEnterprise && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">API Calls</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">
                  +12% from yesterday
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Main Analytics */}
          <div className="lg:col-span-2">
            <KeystrokeAnalytics />
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Manage your account and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start">
                  <Link to="/profile" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Manage Profile
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to="/settings" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Security Settings
                  </Link>
                </Button>

                {isEnterprise && (
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link to="/enterprise" className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      API Management
                    </Link>
                  </Button>
                )}

                {isAdmin && (
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link to="/admin" className="flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      Admin Panel
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Biometric Engine</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Online
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Security Monitoring</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>

                {isEnterprise && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Gateway</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Operational
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature Access Cards for Different Tiers */}
        {isProfessionalOrHigher && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Advanced Analytics
                </CardTitle>
                <CardDescription>
                  Deep insights into user behavior patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/dashboard">View Analytics</Link>
                </Button>
              </CardContent>
            </Card>

            {isEnterprise && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Enterprise Portal
                    </CardTitle>
                    <CardDescription>
                      API management, white-labeling, and more
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link to="/enterprise">Open Portal</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      API Keys
                    </CardTitle>
                    <CardDescription>
                      Manage your API keys and integrations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/enterprise">Manage Keys</Link>
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}

            {isAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    Admin Panel
                  </CardTitle>
                  <CardDescription>
                    System administration and user management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/admin">Admin Dashboard</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
};

export default Dashboard;
