import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, XCircle, Users, Smartphone, Activity } from 'lucide-react';
import { useLicenseValidation } from '@/hooks/useLicenseValidation';

export const LicenseStatusCard: React.FC = () => {
  const { validation, loading, currentUsage, getLicenseLimits, getDeploymentMode } = useLicenseValidation();
  const limits = getLicenseLimits();
  const deploymentMode = getDeploymentMode();

  if (loading || !validation || !limits) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>License Status</CardTitle>
          <CardDescription>Loading license information...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getProgressValue = (current: number, max: number) => {
    if (max === -1) return 0; // unlimited
    return Math.min((current / max) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-destructive';
    if (percentage >= 75) return 'bg-warning';
    return 'bg-primary';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="flex items-center gap-2">
            {validation.valid ? (
              <CheckCircle className="h-5 w-5 text-success" />
            ) : (
              <XCircle className="h-5 w-5 text-destructive" />
            )}
            License Status
          </CardTitle>
          <CardDescription>
            {deploymentMode} mode • {validation.valid ? 'Valid' : 'Issues detected'}
          </CardDescription>
        </div>
        <Badge variant={validation.valid ? 'default' : 'destructive'}>
          {validation.valid ? 'Active' : 'Limited'}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Usage Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Users */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Users</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{currentUsage.users}</span>
                <span className="text-muted-foreground">
                  {limits.maxUsers === -1 ? '∞' : limits.maxUsers}
                </span>
              </div>
              {limits.maxUsers !== -1 && (
                <Progress 
                  value={getProgressValue(currentUsage.users, limits.maxUsers)}
                  className="h-2"
                />
              )}
            </div>
          </div>

          {/* Devices */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Devices</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{currentUsage.devices}</span>
                <span className="text-muted-foreground">
                  {limits.maxDevices === -1 ? '∞' : limits.maxDevices}
                </span>
              </div>
              {limits.maxDevices !== -1 && (
                <Progress 
                  value={getProgressValue(currentUsage.devices, limits.maxDevices)}
                  className="h-2"
                />
              )}
            </div>
          </div>

          {/* Daily Auth */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Daily Auth</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{currentUsage.dailyAuth}</span>
                <span className="text-muted-foreground">
                  {limits.maxDailyAuth === -1 ? '∞' : limits.maxDailyAuth}
                </span>
              </div>
              {limits.maxDailyAuth !== -1 && (
                <Progress 
                  value={getProgressValue(currentUsage.dailyAuth, limits.maxDailyAuth)}
                  className="h-2"
                />
              )}
            </div>
          </div>
        </div>

        {/* Errors */}
        {validation.errors.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="h-4 w-4" />
              <span className="font-medium">License Violations</span>
            </div>
            <ul className="space-y-1">
              {validation.errors.map((error, index) => (
                <li key={index} className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Warnings */}
        {validation.warnings.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Warnings</span>
            </div>
            <ul className="space-y-1">
              {validation.warnings.map((warning, index) => (
                <li key={index} className="text-sm text-warning bg-warning/10 p-2 rounded">
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Features Summary */}
        <div className="space-y-2">
          <span className="font-medium">Enabled Features</span>
          <div className="flex flex-wrap gap-2">
            <Badge variant={limits.advancedAnalytics ? 'default' : 'secondary'}>
              Advanced Analytics
            </Badge>
            <Badge variant={limits.prioritySupport ? 'default' : 'secondary'}>
              Priority Support
            </Badge>
            <Badge variant={limits.customSecurity ? 'default' : 'secondary'}>
              Custom Security
            </Badge>
            <Badge variant={limits.apiAccess ? 'default' : 'secondary'}>
              API Access
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};