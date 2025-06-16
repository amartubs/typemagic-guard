
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Target } from 'lucide-react';

interface BiometricSettingsSectionProps {
  formData: {
    min_confidence_threshold: number;
    learning_period: number;
    anomaly_detection_sensitivity: number;
    max_failed_attempts: number;
  };
  setFormData: (updater: (prev: any) => any) => void;
}

const BiometricSettingsSection: React.FC<BiometricSettingsSectionProps> = ({
  formData,
  setFormData,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Target className="h-4 w-4" />
        Biometric Authentication
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="confidence_threshold">
            Minimum Confidence Threshold ({formData.min_confidence_threshold}%)
          </Label>
          <Input
            id="confidence_threshold"
            type="range"
            min="50"
            max="95"
            value={formData.min_confidence_threshold}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              min_confidence_threshold: parseInt(e.target.value) 
            }))}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Higher values = more secure but may increase false rejections
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="learning_period">
            Learning Period (Days)
          </Label>
          <Input
            id="learning_period"
            type="number"
            min="1"
            max="30"
            value={formData.learning_period}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              learning_period: parseInt(e.target.value) || 1 
            }))}
          />
          <p className="text-xs text-muted-foreground">
            Time to learn your typing patterns
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="anomaly_sensitivity">
            Anomaly Detection Sensitivity ({formData.anomaly_detection_sensitivity}%)
          </Label>
          <Input
            id="anomaly_sensitivity"
            type="range"
            min="30"
            max="100"
            value={formData.anomaly_detection_sensitivity}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              anomaly_detection_sensitivity: parseInt(e.target.value) 
            }))}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            How sensitive the system is to unusual typing patterns
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_attempts">
            Max Failed Attempts
          </Label>
          <Input
            id="max_attempts"
            type="number"
            min="1"
            max="10"
            value={formData.max_failed_attempts}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              max_failed_attempts: parseInt(e.target.value) || 1 
            }))}
          />
          <p className="text-xs text-muted-foreground">
            Account lockout after this many failed attempts
          </p>
        </div>
      </div>
    </div>
  );
};

export default BiometricSettingsSection;
