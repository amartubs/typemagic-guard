
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Settings } from 'lucide-react';
import { useSecuritySettings } from '@/hooks/useSecuritySettings';
import SecurityOverviewSection from './SecurityOverviewSection';
import BiometricSettingsSection from './BiometricSettingsSection';
import SecurityLevelSection from './SecurityLevelSection';
import AdditionalSecuritySection from './AdditionalSecuritySection';

const AdvancedSettings: React.FC = () => {
  const {
    loading,
    formData,
    setFormData,
    handleSaveSettings,
    resetToDefaults,
  } = useSecuritySettings();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Advanced Security Configuration
          </CardTitle>
          <CardDescription>
            Fine-tune your biometric authentication and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Security Level Overview */}
          <SecurityOverviewSection securityLevel={formData.security_level} />

          <Separator />

          {/* Biometric Configuration */}
          <BiometricSettingsSection 
            formData={formData}
            setFormData={setFormData}
          />

          <Separator />

          {/* Security Level Configuration */}
          <SecurityLevelSection 
            formData={formData}
            setFormData={setFormData}
          />

          <Separator />

          {/* Additional Security Options */}
          <AdditionalSecuritySection 
            formData={formData}
            setFormData={setFormData}
          />

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleSaveSettings} disabled={loading}>
              {loading ? 'Saving...' : 'Save Configuration'}
            </Button>
            <Button variant="outline" onClick={resetToDefaults}>
              Reset to Defaults
            </Button>
          </div>

          {/* Warning */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Changes to security settings will take effect immediately. Higher security levels may require 
              re-authentication and could temporarily impact system usability while learning new patterns.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedSettings;
