
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth';
import { useSubscription } from '@/hooks/useSubscription';
import { toast } from '@/hooks/use-toast';
import { 
  Settings, 
  Save, 
  Upload,
  Monitor,
  Shield,
  Lock,
  UserCog,
  Layers,
  FileJson,
  Database,
  RefreshCw,
  CircleSlashed
} from 'lucide-react';

interface EnterpriseSettingsProps {
  isEnterprise?: boolean;
}

const EnterpriseSettings: React.FC<EnterpriseSettingsProps> = ({ isEnterprise = false }) => {
  const { user } = useAuth();
  const { subscription, canAccessFeature } = useSubscription();

  const [settings, setSettings] = useState({
    enableAuditLogging: true,
    retentionPeriod: '90',
    dataEncryptionLevel: 'high',
    ipRestrictions: '',
    allowedDomains: '',
    enforceStrictValidation: true,
    multiFactorRequired: false,
    loggingMode: 'complete',
    customApiUrl: '',
    enableBulkOperations: false,
    disableThirdPartyIntegrations: false,
    customUserRoles: false,
    maxSessionLength: '24',
  });

  const [loading, setLoading] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real implementation, this would call your API to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Saved",
        description: "Your enterprise settings have been updated.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (!isEnterprise && !canAccessFeature('customSecurity')) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-muted-foreground" />
            Enterprise Settings
          </CardTitle>
          <CardDescription>
            Advanced configuration options for enterprise users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CircleSlashed className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Enterprise Feature</h3>
            <p className="text-muted-foreground">
              Enterprise settings are available for Enterprise subscribers only.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSaveSettings}>
        {/* Security Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Advanced Security Settings
            </CardTitle>
            <CardDescription>
              Configure enterprise-grade security options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableAuditLogging">Enhanced Audit Logging</Label>
                  <p className="text-sm text-muted-foreground">
                    Capture detailed logs of all system activities
                  </p>
                </div>
                <Switch
                  id="enableAuditLogging"
                  checked={settings.enableAuditLogging}
                  onCheckedChange={(value) => handleChange('enableAuditLogging', value)}
                />
              </div>
              
              <Separator />

              <div className="space-y-2">
                <Label>Audit Log Retention Period</Label>
                <RadioGroup 
                  value={settings.retentionPeriod} 
                  onValueChange={(value) => handleChange('retentionPeriod', value)}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="30" id="r-30" />
                    <Label htmlFor="r-30">30 days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="90" id="r-90" />
                    <Label htmlFor="r-90">90 days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="180" id="r-180" />
                    <Label htmlFor="r-180">180 days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="365" id="r-365" />
                    <Label htmlFor="r-365">365 days</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Data Encryption Level</Label>
                <RadioGroup 
                  value={settings.dataEncryptionLevel} 
                  onValueChange={(value) => handleChange('dataEncryptionLevel', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="standard" id="e-standard" />
                    <Label htmlFor="e-standard">Standard</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="high" id="e-high" />
                    <Label htmlFor="e-high">High</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="military" id="e-military" />
                    <Label htmlFor="e-military">Military-grade</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="multiFactorRequired">Require Multi-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Force all users to set up MFA for their accounts
                  </p>
                </div>
                <Switch
                  id="multiFactorRequired"
                  checked={settings.multiFactorRequired}
                  onCheckedChange={(value) => handleChange('multiFactorRequired', value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access Control */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Access Control & Restrictions
            </CardTitle>
            <CardDescription>
              Configure IP restrictions and domain access controls
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ipRestrictions">IP Address Restrictions</Label>
              <p className="text-sm text-muted-foreground">
                Limit access to specific IP addresses or ranges (comma separated)
              </p>
              <Input
                id="ipRestrictions"
                placeholder="e.g., 192.168.1.1, 10.0.0.0/24"
                value={settings.ipRestrictions}
                onChange={(e) => handleChange('ipRestrictions', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="allowedDomains">Allowed Email Domains</Label>
              <p className="text-sm text-muted-foreground">
                Restrict user registration to specific email domains (comma separated)
              </p>
              <Input
                id="allowedDomains"
                placeholder="e.g., yourcompany.com, partner.com"
                value={settings.allowedDomains}
                onChange={(e) => handleChange('allowedDomains', e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enforceStrictValidation">Enforce Strict Data Validation</Label>
                <p className="text-sm text-muted-foreground">
                  Apply enhanced validation to all input data
                </p>
              </div>
              <Switch
                id="enforceStrictValidation"
                checked={settings.enforceStrictValidation}
                onCheckedChange={(value) => handleChange('enforceStrictValidation', value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Advanced Configuration */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Advanced Configuration
            </CardTitle>
            <CardDescription>
              Configure advanced enterprise features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Logging Mode</Label>
              <RadioGroup 
                value={settings.loggingMode} 
                onValueChange={(value) => handleChange('loggingMode', value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="minimal" id="l-minimal" />
                  <Label htmlFor="l-minimal">Minimal</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="standard" id="l-standard" />
                  <Label htmlFor="l-standard">Standard</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="complete" id="l-complete" />
                  <Label htmlFor="l-complete">Complete</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="debug" id="l-debug" />
                  <Label htmlFor="l-debug">Debug</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customApiUrl">Custom API Endpoint</Label>
              <p className="text-sm text-muted-foreground">
                Configure a custom API endpoint for enterprise integrations
              </p>
              <Input
                id="customApiUrl"
                placeholder="https://api.yourdomain.com/v1"
                value={settings.customApiUrl}
                onChange={(e) => handleChange('customApiUrl', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxSessionLength">Maximum Session Length (hours)</Label>
              <Input
                id="maxSessionLength"
                type="number"
                min="1"
                max="72"
                value={settings.maxSessionLength}
                onChange={(e) => handleChange('maxSessionLength', e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableBulkOperations">Enable Bulk Operations</Label>
                <p className="text-sm text-muted-foreground">
                  Allow bulk import/export of users and data
                </p>
              </div>
              <Switch
                id="enableBulkOperations"
                checked={settings.enableBulkOperations}
                onCheckedChange={(value) => handleChange('enableBulkOperations', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="disableThirdPartyIntegrations">Disable 3rd Party Integrations</Label>
                <p className="text-sm text-muted-foreground">
                  Prevent connections to external third-party services
                </p>
              </div>
              <Switch
                id="disableThirdPartyIntegrations"
                checked={settings.disableThirdPartyIntegrations}
                onCheckedChange={(value) => handleChange('disableThirdPartyIntegrations', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="customUserRoles">Enable Custom User Roles</Label>
                <p className="text-sm text-muted-foreground">
                  Create and manage custom user roles and permissions
                </p>
              </div>
              <Switch
                id="customUserRoles"
                checked={settings.customUserRoles}
                onCheckedChange={(value) => handleChange('customUserRoles', value)}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Export/Import Options */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Import/Export Configuration
            </CardTitle>
            <CardDescription>
              Backup and restore system configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                type="button" 
                variant="outline" 
                className="gap-2"
                onClick={() => {
                  // Mock export functionality
                  const configData = JSON.stringify(settings, null, 2);
                  const blob = new Blob([configData], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "enterprise-settings.json";
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
              >
                <Upload className="h-4 w-4" />
                Export Configuration
              </Button>
              
              <Button 
                type="button" 
                variant="outline"
                className="gap-2"
                onClick={() => {
                  toast({
                    title: "Import Feature",
                    description: "Configuration import will be available soon.",
                  });
                }}
              >
                <FileJson className="h-4 w-4" />
                Import Configuration
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              // Reset to default values
              setSettings({
                enableAuditLogging: true,
                retentionPeriod: '90',
                dataEncryptionLevel: 'high',
                ipRestrictions: '',
                allowedDomains: '',
                enforceStrictValidation: true,
                multiFactorRequired: false,
                loggingMode: 'complete',
                customApiUrl: '',
                enableBulkOperations: false,
                disableThirdPartyIntegrations: false,
                customUserRoles: false,
                maxSessionLength: '24',
              });
            }}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset to Defaults
          </Button>
          
          <Button 
            type="submit" 
            disabled={loading}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EnterpriseSettings;
