import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Brain, Clock, AlertTriangle, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { AdaptiveSecurityEngine } from '@/lib/auth/adaptiveSecurityEngine';
import { AdaptiveSecurityConfig, AuthenticationLevel } from '@/types/advancedAuth';
import { toast } from 'sonner';

export const AdaptiveSecurityPanel = () => {
  const { user } = useAuth();
  const [config, setConfig] = useState<AdaptiveSecurityConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadSecurityConfig();
    }
  }, [user?.id]);

  const loadSecurityConfig = async () => {
    try {
      setLoading(true);
      const securityConfig = await AdaptiveSecurityEngine.getSecurityConfigForUser(user!.id);
      setConfig(securityConfig);
    } catch (error) {
      console.error('Error loading security config:', error);
      toast.error('Failed to load security configuration');
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    if (!config || !user?.id) return;

    try {
      setSaving(true);
      await AdaptiveSecurityEngine.updateSecurityConfig(user.id, config);
      toast.success('Security configuration updated successfully');
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Failed to save security configuration');
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (updates: Partial<AdaptiveSecurityConfig>) => {
    if (config) {
      setConfig({ ...config, ...updates });
    }
  };

  const getSecurityLevelColor = (level: AuthenticationLevel) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Adaptive Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!config) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Adaptive Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Unable to load security configuration. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Adaptive Security Configuration
          </CardTitle>
          <CardDescription>
            Configure how the system adapts to your behavior and responds to security threats
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Authentication Level */}
          <div className="space-y-2">
            <Label>Minimum Authentication Level</Label>
            <Select
              value={config.min_authentication_level}
              onValueChange={(value: AuthenticationLevel) => 
                updateConfig({ min_authentication_level: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    Low - Basic verification
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    Medium - Standard security
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    High - Enhanced verification
                  </div>
                </SelectItem>
                <SelectItem value="critical">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    Critical - Maximum security
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Risk Tolerance */}
          <div className="space-y-3">
            <Label>Risk Tolerance: {config.risk_tolerance}%</Label>
            <Slider
              value={[config.risk_tolerance]}
              onValueChange={([value]) => updateConfig({ risk_tolerance: value })}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Conservative</span>
              <span>Balanced</span>
              <span>Permissive</span>
            </div>
          </div>

          {/* Max Risk Score */}
          <div className="space-y-3">
            <Label>Maximum Risk Score: {config.max_risk_score}%</Label>
            <Slider
              value={[config.max_risk_score]}
              onValueChange={([value]) => updateConfig({ max_risk_score: value })}
              max={100}
              min={30}
              step={5}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Sessions exceeding this risk score will be blocked
            </p>
          </div>

          {/* Session Timeout */}
          <div className="space-y-3">
            <Label>Session Timeout: {config.session_timeout_minutes} minutes</Label>
            <Slider
              value={[config.session_timeout_minutes]}
              onValueChange={([value]) => updateConfig({ session_timeout_minutes: value })}
              max={120}
              min={5}
              step={5}
              className="w-full"
            />
          </div>

          {/* Feature Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Adaptive Learning
                </Label>
                <p className="text-sm text-muted-foreground">
                  System learns and adapts to your behavior patterns
                </p>
              </div>
              <Switch
                checked={config.adaptive_learning}
                onCheckedChange={(checked) => updateConfig({ adaptive_learning: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Challenge Escalation
                </Label>
                <p className="text-sm text-muted-foreground">
                  Require additional verification when risk increases
                </p>
              </div>
              <Switch
                checked={config.challenge_escalation}
                onCheckedChange={(checked) => updateConfig({ challenge_escalation: checked })}
              />
            </div>
          </div>

          <Button onClick={saveConfig} disabled={saving} className="w-full">
            {saving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </CardContent>
      </Card>

      {/* Security Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Current Security Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className={`w-12 h-12 rounded-full ${getSecurityLevelColor(config.min_authentication_level)} mx-auto mb-2 flex items-center justify-center`}>
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-medium">Security Level</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {config.min_authentication_level}
              </p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 rounded-full bg-blue-500 mx-auto mb-2 flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-medium">Adaptive Learning</h3>
              <Badge variant={config.adaptive_learning ? "default" : "secondary"}>
                {config.adaptive_learning ? "Active" : "Disabled"}
              </Badge>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 rounded-full bg-purple-500 mx-auto mb-2 flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-medium">Session Timeout</h3>
              <p className="text-sm text-muted-foreground">
                {config.session_timeout_minutes} min
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};