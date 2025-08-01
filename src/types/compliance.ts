// Compliance and regulatory framework types

export type ComplianceStandard = 'GDPR' | 'HIPAA' | 'SOX' | 'PCI-DSS' | 'NIST' | 'ISO27001';

export type IndustryType = 'financial' | 'healthcare' | 'legal' | 'government' | 'education' | 'general';

export interface ComplianceConfig {
  id: string;
  user_id: string;
  industry: IndustryType;
  standards: ComplianceStandard[];
  data_retention_days: number;
  audit_level: 'basic' | 'enhanced' | 'forensic';
  encryption_required: boolean;
  anonymization_required: boolean;
  legal_hold_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface ComplianceRule {
  standard: ComplianceStandard;
  requirement: string;
  description: string;
  mandatory: boolean;
  implementation_status: 'pending' | 'implemented' | 'verified' | 'failed';
}

export interface AuditTrailFormat {
  standard: ComplianceStandard;
  required_fields: string[];
  retention_period: number;
  signature_required: boolean;
  tamper_protection: boolean;
}

export interface ComplianceReport {
  id: string;
  user_id: string;
  standard: ComplianceStandard;
  period_start: string;
  period_end: string;
  compliance_score: number;
  violations: ComplianceViolation[];
  recommendations: string[];
  generated_at: string;
  signed_hash: string;
}

export interface ComplianceViolation {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  affected_records: number;
  remediation_required: boolean;
}

export interface DataRetentionPolicy {
  data_type: string;
  retention_days: number;
  archive_after_days: number;
  deletion_method: 'secure_delete' | 'anonymize' | 'archive';
  legal_hold_override: boolean;
}