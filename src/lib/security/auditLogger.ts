
import { supabase } from '@/integrations/supabase/client';

export interface AuditLogEntry {
  action: string;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, any>;
  userId?: string;
}

export class AuditLogger {
  static async log(entry: AuditLogEntry): Promise<void> {
    try {
      const { error } = await supabase
        .from('audit_logs')
        .insert({
          user_id: entry.userId || null,
          action: entry.action,
          resource_type: entry.resourceType,
          resource_id: entry.resourceId || null,
          details: entry.details || {},
          ip_address: await this.getClientIP(),
          user_agent: navigator.userAgent
        });

      if (error) {
        console.error('Failed to log audit entry:', error);
      }
    } catch (error) {
      console.error('Error in audit logging:', error);
    }
  }

  static async logUserAction(action: string, userId: string, details?: Record<string, any>): Promise<void> {
    await this.log({
      action,
      resourceType: 'user',
      resourceId: userId,
      details,
      userId
    });
  }

  static async logSecurityEvent(action: string, details?: Record<string, any>): Promise<void> {
    await this.log({
      action,
      resourceType: 'security',
      details
    });
  }

  static async logSystemEvent(action: string, details?: Record<string, any>): Promise<void> {
    await this.log({
      action,
      resourceType: 'system',
      details
    });
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
