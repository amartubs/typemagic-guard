
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface AdditionalSecuritySectionProps {
  formData: {
    enforce_two_factor: boolean;
  };
  setFormData: (updater: (prev: any) => any) => void;
}

const AdditionalSecuritySection: React.FC<AdditionalSecuritySectionProps> = ({
  formData,
  setFormData,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Additional Security</h3>
      
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label>Enforce Two-Factor Authentication</Label>
          <p className="text-sm text-muted-foreground">
            Require 2FA for all authentication attempts
          </p>
        </div>
        <Switch
          checked={formData.enforce_two_factor}
          onCheckedChange={(checked) => setFormData(prev => ({ 
            ...prev, 
            enforce_two_factor: checked 
          }))}
        />
      </div>
    </div>
  );
};

export default AdditionalSecuritySection;
