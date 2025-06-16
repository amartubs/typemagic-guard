import { supabase } from '@/integrations/supabase/client';
import { globalErrorHandler } from '@/lib/errorHandling/globalErrorHandler';
import { AuditLogger } from './auditLogger';

export class ProductionSecurityManager {
  private static readonly MAX_LOGIN_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
  private static readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

  static async validateSession(): Promise<boolean> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        globalErrorHandler.handleError(error, 'Session validation');
        return false;
      }

      if (!session) {
        return false;
      }

      // Check if session is expired using expires_at
      if (session.expires_at) {
        const now = Math.floor(Date.now() / 1000); // Convert to seconds
        if (now >= session.expires_at) {
          await this.logoutUser();
          await AuditLogger.logSecurityEvent('session_expired', {
            userId: session.user?.id,
            expiresAt: session.expires_at
          });
          return false;
        }
      }

      return true;
    } catch (error) {
      globalErrorHandler.handleError(error as Error, 'Session validation error');
      return false;
    }
  }

  static async logSecurityEvent(
    eventType: string,
    details: Record<string, any>
  ): Promise<void> {
    try {
      await AuditLogger.logSecurityEvent(eventType, details);
    } catch (error) {
      globalErrorHandler.handleError(error as Error, 'Security event logging');
    }
  }

  static async checkAccountLockout(email: string): Promise<boolean> {
    try {
      const fifteenMinutesAgo = new Date(Date.now() - this.LOCKOUT_DURATION).toISOString();
      
      const { data: attempts } = await supabase
        .from('authentication_attempts')
        .select('*')
        .eq('user_id', email) // Using email as identifier for failed attempts
        .eq('success', false)
        .gte('created_at', fifteenMinutesAgo);

      const isLockedOut = (attempts?.length || 0) >= this.MAX_LOGIN_ATTEMPTS;
      
      if (isLockedOut) {
        await this.logSecurityEvent('account_lockout_triggered', {
          email,
          attemptCount: attempts?.length || 0
        });
      }

      return isLockedOut;
    } catch (error) {
      globalErrorHandler.handleError(error as Error, 'Account lockout check');
      return false;
    }
  }

  static async recordAuthenticationAttempt(
    email: string,
    success: boolean,
    confidenceScore?: number,
    anomalyDetails?: any
  ): Promise<void> {
    try {
      await supabase.from('authentication_attempts').insert({
        user_id: email, // Using email as identifier
        success,
        confidence_score: confidenceScore,
        anomaly_details: anomalyDetails,
        ip_address: await this.getClientIP(),
        user_agent: navigator.userAgent
      });

      await this.logSecurityEvent('authentication_attempt', {
        email,
        success,
        confidenceScore,
        hasAnomalies: !!anomalyDetails
      });
    } catch (error) {
      globalErrorHandler.handleError(error as Error, 'Authentication attempt recording');
    }
  }

  static async logoutUser(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.auth.signOut();
      
      if (user) {
        await this.logSecurityEvent('user_logout', { userId: user.id });
      }
    } catch (error) {
      globalErrorHandler.handleError(error as Error, 'User logout');
    }
  }

  static async refreshSession(): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        globalErrorHandler.handleError(error, 'Session refresh');
        return false;
      }

      if (data.session?.user) {
        await this.logSecurityEvent('session_refreshed', { userId: data.session.user.id });
      }

      return !!data.session;
    } catch (error) {
      globalErrorHandler.handleError(error as Error, 'Session refresh error');
      return false;
    }
  }

  private static async getClientIP(): Promise<string> {
    try {
      // In production, this would get the real client IP
      // For now, we'll use a placeholder
      return 'client-ip-placeholder';
    } catch {
      return 'unknown';
    }
  }

  static validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 20;
    else feedback.push('Password must be at least 8 characters long');

    if (/[A-Z]/.test(password)) score += 20;
    else feedback.push('Include at least one uppercase letter');

    if (/[a-z]/.test(password)) score += 20;
    else feedback.push('Include at least one lowercase letter');

    if (/\d/.test(password)) score += 20;
    else feedback.push('Include at least one number');

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 20;
    else feedback.push('Include at least one special character');

    return {
      isValid: score >= 80,
      score,
      feedback
    };
  }

  static async getSecurityMetrics(userId: string): Promise<{
    failedAttemptsToday: number;
    lastSuccessfulLogin: Date | null;
    accountLockoutStatus: boolean;
  }> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: attempts } = await supabase
        .from('authentication_attempts')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', today.toISOString());

      const failedAttempts = attempts?.filter(a => !a.success) || [];
      const successfulAttempts = attempts?.filter(a => a.success) || [];
      
      const lastSuccessful = successfulAttempts.length > 0 
        ? new Date(successfulAttempts[0].created_at)
        : null;

      const isLockedOut = await this.checkAccountLockout(userId);

      return {
        failedAttemptsToday: failedAttempts.length,
        lastSuccessfulLogin: lastSuccessful,
        accountLockoutStatus: isLockedOut
      };
    } catch (error) {
      globalErrorHandler.handleError(error as Error, 'Security metrics retrieval');
      return {
        failedAttemptsToday: 0,
        lastSuccessfulLogin: null,
        accountLockoutStatus: false
      };
    }
  }
}
