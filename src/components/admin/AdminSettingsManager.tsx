
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { Settings, Shield, Users, Database, Bell, Clock } from 'lucide-react';

interface AdminSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  created_at: string;
  updated_at: string;
}

const AdminSettingsManager = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Default settings structure
  const defaultSettings = {
    // System Settings
    system_maintenance_mode: false,
    system_max_users: 10000,
    system_session_timeout: 24,
    system_backup_enabled: true,
    system_backup_frequency: 'daily',
    
    // Security Settings
    security_force_2fa: false,
    security_password_expiry: 90,
    security_max_login_attempts: 5,
    security_ip_whitelist: '',
    security_audit_logging: true,
    
    // User Management
    user_auto_approval: true,
    user_default_role: 'user',
    user_max_sessions: 3,
    user_profile_required_fields: ['name', 'email'],
    
    // Notifications
    notification_email_enabled: true,
    notification_sms_enabled: false,
    notification_slack_webhook: '',
    notification_admin_alerts: true,
    
    // Analytics
    analytics_retention_days: 365,
    analytics_anonymous_tracking: false,
    analytics_export_enabled: true,
    
    // API Settings
    api_rate_limit_global: 10000,
    api_cors_origins: '*',
    api_webhook_timeout: 30,
    api_webhook_retries: 3,
  };

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Convert array to object
      const settingsObj = data?.reduce((acc, setting) => {
        acc[setting.setting_key] = setting.setting_value;
        return acc;
      }, {} as Record<string, any>) || {};

      // Merge with defaults
      setSettings({ ...defaultSettings, ...settingsObj });
    } catch (error) {
      console.error('Error loading admin settings:', error);
      toast({
        title: "Error",
        description: "Failed to load admin settings",
        variant: "destructive",
      });
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const saveSetting = async (key: string, value: any) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          user_id: user.id,
          setting_key: key,
          setting_value: value,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,setting_key' });

      if (error) throw error;

      setSettings(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error('Error saving setting:', error);
      toast({
        title: "Error",
        description: `Failed to save ${key}`,
        variant: "destructive",
      });
    }
  };

  const saveAllSettings = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        user_id: user.id,
        setting_key: key,
        setting_value: value,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('admin_settings')
        .upsert(settingsArray, { onConflict: 'user_id,setting_key' });

      if (error) throw error;

      toast({
        title: "Success",
        description: "All admin settings saved successfully",
      });
    } catch (error) {
      console.error('Error saving all settings:', error);
      toast({
        title: "Error",
        description: "Failed to save admin settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to defaults. Don't forget to save!",
    });
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Admin Settings</h2>
          <p className="text-muted-foreground">
            Configure system-wide settings and policies
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
          <Button onClick={saveAllSettings} disabled={saving}>
            {saving ? 'Saving...' : 'Save All Settings'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="system" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable to prevent new user registrations and logins
                  </p>
                </div>
                <Switch
                  checked={settings.system_maintenance_mode}
                  onCheckedChange={(checked) => updateSetting('system_maintenance_mode', checked)}
                />
              </div>

              <div>
                <Label htmlFor="max-users">Maximum Users</Label>
                <Input
                  id="max-users"
                  type="number"
                  value={settings.system_max_users}
                  onChange={(e) => updateSetting('system_max_users', parseInt(e.target.value))}
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="session-timeout">Session Timeout (hours)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  value={settings.system_session_timeout}
                  onChange={(e) => updateSetting('system_session_timeout', parseInt(e.target.value))}
                  min="1"
                  max="720"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Automatic Backups</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable automatic database backups
                  </p>
                </div>
                <Switch
                  checked={settings.system_backup_enabled}
                  onCheckedChange={(checked) => updateSetting('system_backup_enabled', checked)}
                />
              </div>

              <div>
                <Label htmlFor="backup-frequency">Backup Frequency</Label>
                <Select 
                  value={settings.system_backup_frequency}
                  onValueChange={(value) => updateSetting('system_backup_frequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Force Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require all users to enable 2FA
                  </p>
                </div>
                <Switch
                  checked={settings.security_force_2fa}
                  onCheckedChange={(checked) => updateSetting('security_force_2fa', checked)}
                />
              </div>

              <div>
                <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                <Input
                  id="password-expiry"
                  type="number"
                  value={settings.security_password_expiry}
                  onChange={(e) => updateSetting('security_password_expiry', parseInt(e.target.value))}
                  min="0"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Set to 0 to disable password expiry
                </p>
              </div>

              <div>
                <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                <Input
                  id="max-login-attempts"
                  type="number"
                  value={settings.security_max_login_attempts}
                  onChange={(e) => updateSetting('security_max_login_attempts', parseInt(e.target.value))}
                  min="1"
                  max="20"
                />
              </div>

              <div>
                <Label htmlFor="ip-whitelist">IP Whitelist</Label>
                <Textarea
                  id="ip-whitelist"
                  value={settings.security_ip_whitelist}
                  onChange={(e) => updateSetting('security_ip_whitelist', e.target.value)}
                  placeholder="192.168.1.0/24&#10;10.0.0.0/8"
                  rows={3}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  One IP range per line. Leave empty to allow all IPs.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Audit Logging</Label>
                  <p className="text-sm text-muted-foreground">
                    Log all security-related events
                  </p>
                </div>
                <Switch
                  checked={settings.security_audit_logging}
                  onCheckedChange={(checked) => updateSetting('security_audit_logging', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-approve New Users</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically approve user registrations
                  </p>
                </div>
                <Switch
                  checked={settings.user_auto_approval}
                  onCheckedChange={(checked) => updateSetting('user_auto_approval', checked)}
                />
              </div>

              <div>
                <Label htmlFor="default-role">Default User Role</Label>
                <Select 
                  value={settings.user_default_role}
                  onValueChange={(value) => updateSetting('user_default_role', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="max-sessions">Max Concurrent Sessions</Label>
                <Input
                  id="max-sessions"
                  type="number"
                  value={settings.user_max_sessions}
                  onChange={(e) => updateSetting('user_max_sessions', parseInt(e.target.value))}
                  min="1"
                  max="10"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable email notifications for users
                  </p>
                </div>
                <Switch
                  checked={settings.notification_email_enabled}
                  onCheckedChange={(checked) => updateSetting('notification_email_enabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable SMS notifications for critical alerts
                  </p>
                </div>
                <Switch
                  checked={settings.notification_sms_enabled}
                  onCheckedChange={(checked) => updateSetting('notification_sms_enabled', checked)}
                />
              </div>

              <div>
                <Label htmlFor="slack-webhook">Slack Webhook URL</Label>
                <Input
                  id="slack-webhook"
                  value={settings.notification_slack_webhook}
                  onChange={(e) => updateSetting('notification_slack_webhook', e.target.value)}
                  placeholder="https://hooks.slack.com/..."
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Admin Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Send notifications for admin-level events
                  </p>
                </div>
                <Switch
                  checked={settings.notification_admin_alerts}
                  onCheckedChange={(checked) => updateSetting('notification_admin_alerts', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Analytics Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="retention-days">Data Retention (days)</Label>
                <Input
                  id="retention-days"
                  type="number"
                  value={settings.analytics_retention_days}
                  onChange={(e) => updateSetting('analytics_retention_days', parseInt(e.target.value))}
                  min="30"
                  max="3650"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Anonymous Tracking</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable anonymous usage analytics
                  </p>
                </div>
                <Switch
                  checked={settings.analytics_anonymous_tracking}
                  onCheckedChange={(checked) => updateSetting('analytics_anonymous_tracking', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Data Export</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow users to export their analytics data
                  </p>
                </div>
                <Switch
                  checked={settings.analytics_export_enabled}
                  onCheckedChange={(checked) => updateSetting('analytics_export_enabled', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                API Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="global-rate-limit">Global Rate Limit (requests/hour)</Label>
                <Input
                  id="global-rate-limit"
                  type="number"
                  value={settings.api_rate_limit_global}
                  onChange={(e) => updateSetting('api_rate_limit_global', parseInt(e.target.value))}
                  min="100"
                />
              </div>

              <div>
                <Label htmlFor="cors-origins">CORS Origins</Label>
                <Input
                  id="cors-origins"
                  value={settings.api_cors_origins}
                  onChange={(e) => updateSetting('api_cors_origins', e.target.value)}
                  placeholder="https://example.com, https://app.example.com"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Use * for all origins, or specify comma-separated domains
                </p>
              </div>

              <div>
                <Label htmlFor="webhook-timeout">Webhook Timeout (seconds)</Label>
                <Input
                  id="webhook-timeout"
                  type="number"
                  value={settings.api_webhook_timeout}
                  onChange={(e) => updateSetting('api_webhook_timeout', parseInt(e.target.value))}
                  min="5"
                  max="300"
                />
              </div>

              <div>
                <Label htmlFor="webhook-retries">Webhook Retries</Label>
                <Input
                  id="webhook-retries"
                  type="number"
                  value={settings.api_webhook_retries}
                  onChange={(e) => updateSetting('api_webhook_retries', parseInt(e.target.value))}
                  min="0"
                  max="10"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettingsManager;
