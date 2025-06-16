
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
import RealTimeMetricsCard from '@/components/dashboard/RealTimeMetricsCard';
import ExportManager from '@/components/dashboard/ExportManager';
import ProtectedLayout from '@/components/layout/ProtectedLayout';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useRealTimeMetrics } from '@/hooks/useRealTimeMetrics';

const Dashboard = () => {
  const { user } = useAuth();
  const { metrics, recentActivity, loading } = useDashboardData();
  const { 
    metrics: realTimeMetrics, 
    isRealTime, 
    startRealTimeUpdates, 
    stopRealTimeUpdates 
  } = useRealTimeMetrics(metrics);
  
  const isAdmin = user?.role === 'admin';
  const isEnterprise = user?.subscription?.tier === 'enterprise';
  const isProfessionalOrHigher = ['professional', 'enterprise'].includes(user?.subscription?.tier || '');

  const handleToggleRealTime = () => {
    if (isRealTime) {
      stopRealTimeUpdates();
    } else {
      startRealTimeUpdates();
    }
  };

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="container mx-auto py-4 px-4 sm:py-8">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="container mx-auto py-4 px-4 sm:py-8">
        {/* Welcome Section - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
                Welcome back, {user?.name || 'User'}!
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Here's your security overview and system status.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {isAdmin && (
                <Badge variant="default" className="bg-yellow-500 text-xs sm:text-sm">
                  <Crown className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              )}
              {isEnterprise && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs sm:text-sm">
                  <Building2 className="h-3 w-3 mr-1" />
                  Enterprise
                </Badge>
              )}
              <Badge variant="outline" className="text-xs sm:text-sm">
                {user?.subscription?.tier?.charAt(0).toUpperCase() + user?.subscription?.tier?.slice(1) || 'Free'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats - Mobile Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="p-3 sm:p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium">Security Score</CardTitle>
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0 pt-1">
              <div className="text-lg sm:text-2xl font-bold text-green-600">
                {realTimeMetrics?.securityScore.toFixed(1) || 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Based on recent activity
              </p>
            </CardContent>
          </Card>

          <Card className="p-3 sm:p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium">Active Sessions</CardTitle>
              <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0 pt-1">
              <div className="text-lg sm:text-2xl font-bold">{realTimeMetrics?.activeSessions || 0}</div>
              <p className="text-xs text-muted-foreground">
                Current device
              </p>
            </CardContent>
          </Card>

          {isProfessionalOrHigher && (
            <Card className="p-3 sm:p-4">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-0">
                <CardTitle className="text-xs sm:text-sm font-medium">Threat Detection</CardTitle>
                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-0 pt-1">
                <div className={`text-lg sm:text-2xl font-bold ${realTimeMetrics?.threatLevel === 'low' ? 'text-green-600' : realTimeMetrics?.threatLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                  {realTimeMetrics?.fraudDetections || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {realTimeMetrics?.threatLevel || 'low'} threat level
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="p-3 sm:p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-0">
              <CardTitle className="text-xs sm:text-sm font-medium">Authentications</CardTitle>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0 pt-1">
              <div className="text-lg sm:text-2xl font-bold">{realTimeMetrics?.authenticationsToday || 0}</div>
              <p className="text-xs text-muted-foreground">
                Today's attempts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Real-Time Metrics Card */}
        {isProfessionalOrHigher && (
          <div className="mb-6 sm:mb-8">
            <RealTimeMetricsCard
              metrics={realTimeMetrics}
              isRealTime={isRealTime}
              onToggleRealTime={handleToggleRealTime}
            />
          </div>
        )}

        {/* Main Content - Mobile Stack */}
        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6 mb-6 sm:mb-8">
          {/* Left Column - Main Analytics */}
          <div className="lg:col-span-2">
            <KeystrokeAnalytics />
          </div>

          {/* Right Column - Quick Actions & Export */}
          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-sm">
                  Manage your account and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <Button asChild size="sm" className="w-full justify-start h-9 sm:h-10">
                  <Link to="/profile" className="flex items-center gap-2">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-sm">Manage Profile</span>
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="sm" className="w-full justify-start h-9 sm:h-10">
                  <Link to="/settings" className="flex items-center gap-2">
                    <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-sm">Security Settings</span>
                  </Link>
                </Button>

                {isEnterprise && (
                  <Button asChild variant="outline" size="sm" className="w-full justify-start h-9 sm:h-10">
                    <Link to="/enterprise" className="flex items-center gap-2">
                      <Key className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-sm">API Management</span>
                    </Link>
                  </Button>
                )}

                {isAdmin && (
                  <Button asChild variant="outline" size="sm" className="w-full justify-start h-9 sm:h-10">
                    <Link to="/admin" className="flex items-center gap-2">
                      <Crown className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-sm">Admin Panel</span>
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Export Manager for Enterprise Users */}
            <ExportManager metrics={realTimeMetrics} recentActivity={recentActivity || []} />

            {/* System Status */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Biometric Engine</span>
                  <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Online
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Security Monitoring</span>
                  <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>

                {isEnterprise && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Gateway</span>
                    <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Operational
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature Access Cards for Different Tiers - Mobile Grid */}
        {isProfessionalOrHigher && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                  Advanced Analytics
                </CardTitle>
                <CardDescription className="text-sm">
                  Deep insights into user behavior patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild size="sm" className="w-full">
                  <Link to="/analytics">View Analytics</Link>
                </Button>
              </CardContent>
            </Card>

            {isEnterprise && (
              <>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      Enterprise Portal
                    </CardTitle>
                    <CardDescription className="text-sm">
                      API management, white-labeling, and more
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button asChild size="sm" className="w-full">
                      <Link to="/enterprise">Open Portal</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Key className="h-4 w-4 sm:h-5 sm:w-5" />
                      API Keys
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Manage your API keys and integrations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link to="/enterprise">Manage Keys</Link>
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}

            {isAdmin && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Crown className="h-4 w-4 sm:h-5 sm:w-5" />
                    Admin Panel
                  </CardTitle>
                  <CardDescription className="text-sm">
                    System administration and user management
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button asChild variant="outline" size="sm" className="w-full">
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
