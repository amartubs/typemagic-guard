import { supabase } from '@/integrations/supabase/client';
import { AuditLogEntry } from './auditLogger';
import { ComplianceStandard } from '@/types/compliance';

export interface LegalGradeAuditEntry extends AuditLogEntry {
  compliance_standards: ComplianceStandard[];
  legal_significance: 'low' | 'medium' | 'high' | 'critical';
  hash_chain_previous?: string;
  cryptographic_signature?: string;
  tamper_evidence?: any;
  retention_required_until?: string;
  legal_hold?: boolean;
}

export interface TamperEvidence {
  entry_hash: string;
  previous_hash: string;
  timestamp_signature: string;
  merkle_proof?: string[];
}

export class LegalGradeAuditLogger {
  private static readonly HASH_ALGORITHM = 'SHA-256';
  
  static async logLegalEvent(entry: LegalGradeAuditEntry): Promise<string | null> {
    try {
      // Get the last audit entry for hash chaining
      const { data: lastEntry } = await supabase
        .from('legal_audit_logs')
        .select('id, cryptographic_signature')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Create hash chain
      const entryData = JSON.stringify({
        ...entry,
        timestamp: new Date().toISOString()
      });
      
      const entryHash = await this.createHash(entryData);
      const previousHash = lastEntry?.cryptographic_signature || '0';
      const chainHash = await this.createHash(previousHash + entryHash);

      // Create tamper evidence
      const tamperEvidence: TamperEvidence = {
        entry_hash: entryHash,
        previous_hash: previousHash,
        timestamp_signature: await this.createTimestampSignature(entryData)
      };

      // Insert into database
      const { data, error } = await supabase
        .from('legal_audit_logs')
        .insert({
          user_id: entry.userId || null,
          action: entry.action,
          resource_type: entry.resourceType,
          resource_id: entry.resourceId || null,
          details: entry.details || {},
          compliance_standards: entry.compliance_standards,
          legal_significance: entry.legal_significance,
          hash_chain_previous: previousHash,
          cryptographic_signature: chainHash,
          tamper_evidence: tamperEvidence,
          retention_required_until: entry.retention_required_until,
          legal_hold: entry.legal_hold || false,
          ip_address: await this.getClientIP(),
          user_agent: navigator.userAgent
        })
        .select('id')
        .single();

      if (error) {
        console.error('Failed to log legal audit entry:', error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Error in legal audit logging:', error);
      return null;
    }
  }

  static async logAuthenticationEvent(
    userId: string,
    action: string,
    success: boolean,
    confidenceScore: number,
    complianceStandards: ComplianceStandard[],
    details?: Record<string, any>
  ): Promise<string | null> {
    const significance = this.determineLegalSignificance(action, success, confidenceScore);
    const retentionDate = this.calculateRetentionDate(complianceStandards);

    return this.logLegalEvent({
      userId,
      action,
      resourceType: 'authentication',
      details: {
        success,
        confidence_score: confidenceScore,
        ...details
      },
      compliance_standards: complianceStandards,
      legal_significance: significance,
      retention_required_until: retentionDate,
      legal_hold: significance === 'critical'
    });
  }

  static async logAccessEvent(
    userId: string,
    resourceId: string,
    resourceType: string,
    action: string,
    complianceStandards: ComplianceStandard[],
    details?: Record<string, any>
  ): Promise<string | null> {
    const significance = resourceType === 'financial_data' || resourceType === 'health_record' 
      ? 'high' : 'medium';
    
    return this.logLegalEvent({
      userId,
      action,
      resourceType,
      resourceId,
      details,
      compliance_standards: complianceStandards,
      legal_significance: significance,
      retention_required_until: this.calculateRetentionDate(complianceStandards)
    });
  }

  static async verifyAuditIntegrity(entryId: string): Promise<boolean> {
    try {
      const { data: entry, error } = await supabase
        .from('legal_audit_logs')
        .select('*')
        .eq('id', entryId)
        .single();

      if (error || !entry) return false;

      // Verify hash chain
      const entryData = JSON.stringify({
        action: entry.action,
        resourceType: entry.resource_type,
        resourceId: entry.resource_id,
        details: entry.details,
        timestamp: entry.created_at
      });

      const expectedHash = await this.createHash(entryData);
      const expectedChainHash = await this.createHash(
        entry.hash_chain_previous + expectedHash
      );

      return expectedChainHash === entry.cryptographic_signature;
    } catch (error) {
      console.error('Error verifying audit integrity:', error);
      return false;
    }
  }

  static async generateLegalReport(
    userId: string,
    startDate: string,
    endDate: string,
    complianceStandards: ComplianceStandard[]
  ): Promise<any> {
    try {
      const { data: entries, error } = await supabase
        .from('legal_audit_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .overlaps('compliance_standards', complianceStandards)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Verify integrity of all entries
      const verificationResults = await Promise.all(
        entries.map(async (entry) => ({
          id: entry.id,
          verified: await this.verifyAuditIntegrity(entry.id)
        }))
      );

      const report = {
        user_id: userId,
        period: { start: startDate, end: endDate },
        compliance_standards: complianceStandards,
        total_entries: entries.length,
        integrity_verified: verificationResults.every(r => r.verified),
        failed_verifications: verificationResults.filter(r => !r.verified),
        entries: entries,
        generated_at: new Date().toISOString(),
        report_signature: await this.createHash(JSON.stringify({
          userId,
          startDate,
          endDate,
          entriesCount: entries.length
        }))
      };

      return report;
    } catch (error) {
      console.error('Error generating legal report:', error);
      return null;
    }
  }

  private static async createHash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private static async createTimestampSignature(data: string): Promise<string> {
    const timestamp = Date.now().toString();
    return this.createHash(data + timestamp);
  }

  private static determineLegalSignificance(
    action: string,
    success: boolean,
    confidenceScore: number
  ): 'low' | 'medium' | 'high' | 'critical' {
    if (action.includes('failed') || !success) return 'high';
    if (confidenceScore < 50) return 'critical';
    if (confidenceScore < 70) return 'high';
    if (action.includes('admin') || action.includes('privileged')) return 'medium';
    return 'low';
  }

  private static calculateRetentionDate(standards: ComplianceStandard[]): string {
    // Get the longest retention period required by any standard
    const retentionPeriods: Record<ComplianceStandard, number> = {
      'GDPR': 3, // 3 years
      'HIPAA': 6, // 6 years
      'SOX': 7, // 7 years
      'PCI-DSS': 1, // 1 year
      'NIST': 3, // 3 years
      'ISO27001': 3 // 3 years
    };

    const maxRetentionYears = Math.max(
      ...standards.map(s => retentionPeriods[s] || 3)
    );

    const retentionDate = new Date();
    retentionDate.setFullYear(retentionDate.getFullYear() + maxRetentionYears);
    return retentionDate.toISOString();
  }

  private static async getClientIP(): Promise<string | null> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return null;
    }
  }
}