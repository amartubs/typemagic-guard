import { supabase } from '@/integrations/supabase/client';
import { ComplianceConfig, ComplianceStandard, IndustryType, DataRetentionPolicy, ComplianceRule } from '@/types/compliance';

export class ComplianceManager {
  private static readonly COMPLIANCE_RULES: Record<ComplianceStandard, ComplianceRule[]> = {
    GDPR: [
      {
        standard: 'GDPR',
        requirement: 'Data minimization',
        description: 'Collect only necessary personal data',
        mandatory: true,
        implementation_status: 'implemented'
      },
      {
        standard: 'GDPR',
        requirement: 'Right to be forgotten',
        description: 'Users can request data deletion',
        mandatory: true,
        implementation_status: 'implemented'
      },
      {
        standard: 'GDPR',
        requirement: 'Data portability',
        description: 'Users can export their data',
        mandatory: true,
        implementation_status: 'implemented'
      }
    ],
    HIPAA: [
      {
        standard: 'HIPAA',
        requirement: 'Access controls',
        description: 'Restrict access to authorized personnel only',
        mandatory: true,
        implementation_status: 'implemented'
      },
      {
        standard: 'HIPAA',
        requirement: 'Audit logging',
        description: 'Log all PHI access and modifications',
        mandatory: true,
        implementation_status: 'implemented'
      },
      {
        standard: 'HIPAA',
        requirement: 'Encryption',
        description: 'Encrypt PHI at rest and in transit',
        mandatory: true,
        implementation_status: 'implemented'
      }
    ],
    SOX: [
      {
        standard: 'SOX',
        requirement: 'Financial controls',
        description: 'Implement controls over financial reporting',
        mandatory: true,
        implementation_status: 'implemented'
      },
      {
        standard: 'SOX',
        requirement: 'Audit trail integrity',
        description: 'Maintain tamper-evident audit logs',
        mandatory: true,
        implementation_status: 'implemented'
      }
    ],
    'PCI-DSS': [
      {
        standard: 'PCI-DSS',
        requirement: 'Secure authentication',
        description: 'Multi-factor authentication required',
        mandatory: true,
        implementation_status: 'implemented'
      },
      {
        standard: 'PCI-DSS',
        requirement: 'Access monitoring',
        description: 'Monitor and log access to cardholder data',
        mandatory: true,
        implementation_status: 'implemented'
      }
    ],
    NIST: [
      {
        standard: 'NIST',
        requirement: 'Identity verification',
        description: 'Continuous identity verification',
        mandatory: true,
        implementation_status: 'implemented'
      }
    ],
    ISO27001: [
      {
        standard: 'ISO27001',
        requirement: 'Information security management',
        description: 'Systematic approach to managing sensitive information',
        mandatory: true,
        implementation_status: 'implemented'
      }
    ]
  };

  private static readonly INDUSTRY_DEFAULTS: Record<IndustryType, { standards: ComplianceStandard[], retention_days: number }> = {
    financial: { standards: ['SOX', 'PCI-DSS', 'GDPR'], retention_days: 2555 }, // 7 years
    healthcare: { standards: ['HIPAA', 'GDPR'], retention_days: 2190 }, // 6 years
    legal: { standards: ['GDPR', 'SOX'], retention_days: 3650 }, // 10 years
    government: { standards: ['NIST', 'GDPR'], retention_days: 3650 }, // 10 years
    education: { standards: ['GDPR'], retention_days: 1825 }, // 5 years
    general: { standards: ['GDPR'], retention_days: 1095 } // 3 years
  };

  static async getComplianceConfig(userId: string): Promise<ComplianceConfig | null> {
    try {
      // For now, simulate with admin_settings table until types are updated
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('user_id', userId)
        .eq('setting_key', 'compliance_config')
        .maybeSingle();

      if (error) throw error;
      
      if (data && data.setting_value) {
        return data.setting_value as any as ComplianceConfig;
      }
      return null;
    } catch (error) {
      console.error('Error fetching compliance config:', error);
      return null;
    }
  }

  static async createComplianceConfig(
    userId: string, 
    industry: IndustryType,
    customStandards?: ComplianceStandard[]
  ): Promise<ComplianceConfig | null> {
    try {
      const defaults = this.INDUSTRY_DEFAULTS[industry];
      const standards = customStandards || defaults.standards;

      const config: ComplianceConfig = {
        id: crypto.randomUUID(),
        user_id: userId,
        industry,
        standards,
        data_retention_days: defaults.retention_days,
        audit_level: industry === 'financial' || industry === 'healthcare' ? 'forensic' : 'enhanced',
        encryption_required: industry !== 'general',
        anonymization_required: industry === 'healthcare',
        legal_hold_enabled: industry === 'legal' || industry === 'government',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Store in admin_settings until types are updated
      const { data, error } = await supabase
        .from('admin_settings')
        .insert({
          user_id: userId,
          setting_key: 'compliance_config',
          setting_value: config as any
        })
        .select()
        .single();

      if (error) throw error;
      return config;
    } catch (error) {
      console.error('Error creating compliance config:', error);
      return null;
    }
  }

  static async updateComplianceConfig(
    userId: string, 
    updates: Partial<ComplianceConfig>
  ): Promise<ComplianceConfig | null> {
    try {
      const existing = await this.getComplianceConfig(userId);
      if (!existing) return null;

      const updatedConfig = { ...existing, ...updates, updated_at: new Date().toISOString() };

      const { data, error } = await supabase
        .from('admin_settings')
        .update({
          setting_value: updatedConfig as any
        })
        .eq('user_id', userId)
        .eq('setting_key', 'compliance_config')
        .select()
        .single();

      if (error) throw error;
      return updatedConfig;
    } catch (error) {
      console.error('Error updating compliance config:', error);
      return null;
    }
  }

  static getComplianceRules(standards: ComplianceStandard[]): ComplianceRule[] {
    return standards.flatMap(standard => this.COMPLIANCE_RULES[standard] || []);
  }

  static getDataRetentionPolicy(industry: IndustryType): DataRetentionPolicy[] {
    const baseRetention = this.INDUSTRY_DEFAULTS[industry].retention_days;
    
    return [
      {
        data_type: 'authentication_logs',
        retention_days: baseRetention,
        archive_after_days: Math.floor(baseRetention * 0.8),
        deletion_method: 'secure_delete',
        legal_hold_override: industry === 'legal' || industry === 'government'
      },
      {
        data_type: 'biometric_patterns',
        retention_days: industry === 'healthcare' ? 2190 : baseRetention,
        archive_after_days: Math.floor(baseRetention * 0.6),
        deletion_method: industry === 'healthcare' ? 'anonymize' : 'secure_delete',
        legal_hold_override: false
      },
      {
        data_type: 'audit_logs',
        retention_days: baseRetention,
        archive_after_days: baseRetention, // Never archive audit logs
        deletion_method: 'archive',
        legal_hold_override: true
      }
    ];
  }

  static validateCompliance(config: ComplianceConfig, auditData: any[]): number {
    const rules = this.getComplianceRules(config.standards);
    const implementedRules = rules.filter(rule => rule.implementation_status === 'implemented');
    
    // Basic compliance score calculation
    const baseScore = (implementedRules.length / rules.length) * 100;
    
    // Adjust based on audit findings
    const recentViolations = auditData.filter(
      entry => entry.severity === 'high' || entry.severity === 'critical'
    ).length;
    
    const penalty = Math.min(recentViolations * 5, 30); // Max 30% penalty
    
    return Math.max(0, Math.round(baseScore - penalty));
  }
}