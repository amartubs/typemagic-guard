
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  Settings, 
  Shield, 
  AlertTriangle, 
  Database, 
  Clock,
  Target,
  Lock
} from 'lucide-react';

interface SecuritySettings {
  id: string;
  user_id: string;
  min_confidence_threshold: number;
  learning_period: number;
  anomaly_detection_sensitivity: number;
  max_failed_attempts: number;
  security_level: 'low' | 'medium' | 'high';
  enforce_two_factor: boolean;
}

const AdvancedSettings: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SecuritySettings | null>(null);
  const [formData, setFormData] = useState({
    min_confidence_threshold: 65,
    learning_period: 5,
    anomaly_detection_sensitivity: 70,
    max_failed_attempts: 5,
    security_level: 'medium' as const,
    enforce_two_factor: false,
  });

  useEffect(() => {
    fetchSecuritySettings();
  }, [user?.id]);

  const fetchSecuritySettings = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('security_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching security settings:', error);
        return;
      }

      if (data) {
        setSettings(data);
        setFormData({
          min_confidence_threshold: data.min_confidence_threshold,
          learning_period: data.learning_period,
          anomaly_detection_sensitivity: data.anomaly_detection_sensitivity,
          max_failed_attempts: data.max_failed_attempts,
          security_level: data.security_level,
          enforce_two_factor: data.enforce_two_factor,
        });
      }
    } catch (err) {
      console.error('Error in fetchSecuritySettings:', err);
    }
  };

  const handleSaveSettings = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('security_settings')
        .upsert({
          user_id: user.id,
          ...formData,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      if (error) {
        console.error('Error saving security settings:', error);
        toast({
          title: "Error",
          description: "Failed to save security settings",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Security settings saved successfully",
      });
      
      await fetchSecuritySettings();
    } catch (err) {
      console.error('Error in handleSaveSettings:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    setFormData({
      min_confidence_threshold: 65,
      learning_period: 5,
      anomaly_detection_sensitivity: 70,
      max_failed_attempts: 5,
      security_level: 'medium',
      enforce_two_factor: false,
    });
  };

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5" />
              <div>
                <p className="font-medium">Current Security Level</p>
                <p className="text-sm text-muted-foreground">Overall system security configuration</p>
              </div>
            </div>
            <Badge className={getSecurityLevelColor(formData.security_level)}>
              {formData.security_level.charAt(0).toUpperCase() + formData.security_level.slice(1)}
            </Badge>
          </div>

          <Separator />

          {/* Biometric Configuration */}
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

          <Separator />

          {/* Security Level Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Security Level
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['low', 'medium', 'high'].map((level) => (
                <Card 
                  key={level}
                  className={`cursor-pointer transition-colors ${
                    formData.security_level === level ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, security_level: level as any }))}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getSecurityLevelColor(level)}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Badge>
                      {formData.security_level === level && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {level === 'low' && 'Balanced security and usability'}
                      {level === 'medium' && 'Standard security recommended for most users'}
                      {level === 'high' && 'Maximum security with strict authentication'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Additional Security Options */}
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
