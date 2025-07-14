import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { licenseManager, DeploymentConfig, LicenseLimits } from '@/lib/licensing/licenseManager';
import { Settings, Save, RefreshCw } from 'lucide-react';

export const DeploymentConfigManager: React.FC = () => {
  const [config, setConfig] = useState<DeploymentConfig>({
    mode: 'saas'
  });
  const [customLimits, setCustomLimits] = useState<Partial<LicenseLimits>>({});
  const [loading, setSaving] = useState(false);

  useEffect(() => {
    const currentConfig = licenseManager.getConfig();
    if (currentConfig) {
      setConfig(currentConfig);
      setCustomLimits(currentConfig.customLimits || {});
    }
  }, []);

  const handleSaveConfig = () => {
    setSaving(true);
    try {
      const finalConfig: DeploymentConfig = {
        ...config,
        customLimits: Object.keys(customLimits).length > 0 ? customLimits : undefined
      };
      
      licenseManager.saveConfig(finalConfig);
      
      toast({
        title: "Configuration Saved",
        description: "Deployment configuration has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (updates: Partial<DeploymentConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const updateCustomLimit = (key: keyof LicenseLimits, value: any) => {
    setCustomLimits(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Deployment Configuration
        </CardTitle>
        <CardDescription>
          Configure licensing and deployment settings for your biometric authentication system
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="limits">Custom Limits</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            {/* Deployment Mode */}
            <div className="space-y-2">
              <Label htmlFor="mode">Deployment Mode</Label>
              <Select
                value={config.mode}
                onValueChange={(value: 'saas' | 'self-hosted' | 'hybrid') => 
                  updateConfig({ mode: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select deployment mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saas">SaaS (Cloud-based)</SelectItem>
                  <SelectItem value="self-hosted">Self-hosted</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* License Key (for self-hosted) */}
            {config.mode === 'self-hosted' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="licenseKey">License Key</Label>
                  <Input
                    id="licenseKey"
                    type="password"
                    value={config.licenseKey || ''}
                    onChange={(e) => updateConfig({ licenseKey: e.target.value })}
                    placeholder="Enter your license key"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseExpiry">License Expiry Date</Label>
                  <Input
                    id="licenseExpiry"
                    type="date"
                    value={config.licenseExpiry || ''}
                    onChange={(e) => updateConfig({ licenseExpiry: e.target.value })}
                  />
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="limits" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* User Limits */}
              <div className="space-y-2">
                <Label htmlFor="maxUsers">Max Users (-1 for unlimited)</Label>
                <Input
                  id="maxUsers"
                  type="number"
                  value={customLimits.maxUsers || ''}
                  onChange={(e) => updateCustomLimit('maxUsers', parseInt(e.target.value) || 0)}
                  placeholder="Leave empty for default"
                />
              </div>

              {/* Device Limits */}
              <div className="space-y-2">
                <Label htmlFor="maxDevices">Max Devices (-1 for unlimited)</Label>
                <Input
                  id="maxDevices"
                  type="number"
                  value={customLimits.maxDevices || ''}
                  onChange={(e) => updateCustomLimit('maxDevices', parseInt(e.target.value) || 0)}
                  placeholder="Leave empty for default"
                />
              </div>

              {/* Daily Auth Limits */}
              <div className="space-y-2">
                <Label htmlFor="maxDailyAuth">Max Daily Authentications</Label>
                <Input
                  id="maxDailyAuth"
                  type="number"
                  value={customLimits.maxDailyAuth || ''}
                  onChange={(e) => updateCustomLimit('maxDailyAuth', parseInt(e.target.value) || 0)}
                  placeholder="Leave empty for default"
                />
              </div>

              {/* Monthly Auth Limits */}
              <div className="space-y-2">
                <Label htmlFor="maxMonthlyAuth">Max Monthly Authentications</Label>
                <Input
                  id="maxMonthlyAuth"
                  type="number"
                  value={customLimits.maxMonthlyAuth || ''}
                  onChange={(e) => updateCustomLimit('maxMonthlyAuth', parseInt(e.target.value) || 0)}
                  placeholder="Leave empty for default"
                />
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="space-y-4">
              <h4 className="font-medium">Feature Overrides</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Advanced Analytics</Label>
                  <Select
                    value={customLimits.advancedAnalytics?.toString() || 'default'}
                    onValueChange={(value) => 
                      updateCustomLimit('advancedAnalytics', value === 'default' ? undefined : value === 'true')
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Use Default</SelectItem>
                      <SelectItem value="true">Enabled</SelectItem>
                      <SelectItem value="false">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>API Access</Label>
                  <Select
                    value={customLimits.apiAccess?.toString() || 'default'}
                    onValueChange={(value) => 
                      updateCustomLimit('apiAccess', value === 'default' ? undefined : value === 'true')
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Use Default</SelectItem>
                      <SelectItem value="true">Enabled</SelectItem>
                      <SelectItem value="false">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSaveConfig} disabled={loading}>
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};