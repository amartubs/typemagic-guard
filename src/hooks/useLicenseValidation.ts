import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { licenseManager, LicenseValidationResult } from '@/lib/licensing/licenseManager';
import { toast } from '@/hooks/use-toast';

export const useLicenseValidation = () => {
  const { user } = useAuth();
  const [validation, setValidation] = useState<LicenseValidationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const validateLicense = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const tier = user.subscription?.tier || 'free';
      const result = await licenseManager.validateLicense(user.id, tier);
      setValidation(result);

      // Show warnings as toasts
      result.warnings.forEach(warning => {
        toast({
          title: "License Warning",
          description: warning,
          variant: "default",
        });
      });

      // Show errors as destructive toasts
      result.errors.forEach(error => {
        toast({
          title: "License Error",
          description: error,
          variant: "destructive",
        });
      });

      return result;
    } catch (error) {
      console.error('License validation error:', error);
      const errorResult: LicenseValidationResult = {
        valid: false,
        errors: ['Failed to validate license'],
        warnings: [],
        currentUsage: { users: 0, devices: 0, dailyAuth: 0, monthlyAuth: 0 }
      };
      setValidation(errorResult);
      return errorResult;
    } finally {
      setLoading(false);
    }
  };

  const checkAuthenticationLimit = async (): Promise<boolean> => {
    if (!user?.id) return false;
    
    const tier = user.subscription?.tier || 'free';
    return await licenseManager.isWithinAuthLimits(user.id, tier);
  };

  const canAccessFeature = (feature: string): boolean => {
    if (!user) return false;
    
    const tier = user.subscription?.tier || 'free';
    return licenseManager.canAccessFeature(feature as any, tier);
  };

  const isFeatureEnabled = (feature: string): boolean => {
    if (!user) return false;
    
    const tier = user.subscription?.tier || 'free';
    return licenseManager.isFeatureEnabled(feature as any, tier);
  };

  const getLicenseLimits = () => {
    if (!user) return null;
    
    const tier = user.subscription?.tier || 'free';
    return licenseManager.getLicenseLimits(tier);
  };

  const getDeploymentMode = () => {
    return licenseManager.getDeploymentMode();
  };

  // Auto-validate on mount and when user changes
  useEffect(() => {
    if (user?.id) {
      validateLicense();
    }
  }, [user?.id]);

  return {
    validation,
    loading,
    validateLicense,
    checkAuthenticationLimit,
    canAccessFeature,
    isFeatureEnabled,
    getLicenseLimits,
    getDeploymentMode,
    isValid: validation?.valid || false,
    currentUsage: validation?.currentUsage || { users: 0, devices: 0, dailyAuth: 0, monthlyAuth: 0 },
    errors: validation?.errors || [],
    warnings: validation?.warnings || []
  };
};