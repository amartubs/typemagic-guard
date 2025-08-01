import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { ComplianceManager } from '@/lib/compliance/complianceManager';
import { ComplianceConfig, IndustryType, ComplianceStandard } from '@/types/compliance';
import { toast } from 'sonner';

export const useCompliance = () => {
  const { user } = useAuth();
  const [config, setConfig] = useState<ComplianceConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchComplianceConfig = async () => {
      try {
        const complianceConfig = await ComplianceManager.getComplianceConfig(user.id);
        setConfig(complianceConfig);
      } catch (error) {
        console.error('Error fetching compliance config:', error);
        toast.error('Failed to load compliance configuration');
      } finally {
        setLoading(false);
      }
    };

    fetchComplianceConfig();
  }, [user]);

  const createConfig = async (industry: IndustryType, standards?: ComplianceStandard[]) => {
    if (!user) return null;

    try {
      setLoading(true);
      const newConfig = await ComplianceManager.createComplianceConfig(user.id, industry, standards);
      if (newConfig) {
        setConfig(newConfig);
        toast.success('Compliance configuration created successfully');
      }
      return newConfig;
    } catch (error) {
      console.error('Error creating compliance config:', error);
      toast.error('Failed to create compliance configuration');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (updates: Partial<ComplianceConfig>) => {
    if (!user) return null;

    try {
      setLoading(true);
      const updatedConfig = await ComplianceManager.updateComplianceConfig(user.id, updates);
      if (updatedConfig) {
        setConfig(updatedConfig);
        toast.success('Compliance configuration updated successfully');
      }
      return updatedConfig;
    } catch (error) {
      console.error('Error updating compliance config:', error);
      toast.error('Failed to update compliance configuration');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getComplianceRules = () => {
    if (!config) return [];
    return ComplianceManager.getComplianceRules(config.standards);
  };

  const getDataRetentionPolicies = () => {
    if (!config) return [];
    return ComplianceManager.getDataRetentionPolicy(config.industry);
  };

  const calculateComplianceScore = (auditData: any[] = []) => {
    if (!config) return 0;
    return ComplianceManager.validateCompliance(config, auditData);
  };

  return {
    config,
    loading,
    createConfig,
    updateConfig,
    getComplianceRules,
    getDataRetentionPolicies,
    calculateComplianceScore
  };
};