
import { toast } from '@/hooks/use-toast';

export interface SecurityError {
  code: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
}

export class SecurityErrorHandler {
  private static logError(error: SecurityError, userId?: string) {
    console.error('Security Error:', {
      ...error,
      userId,
      timestamp: new Date().toISOString()
    });
    
    // In production, this would send to a logging service
    if (error.severity === 'critical' || error.severity === 'high') {
      // Alert administrators
      console.warn('High severity security error detected');
    }
  }

  static handleAuthenticationError(error: any, userId?: string) {
    const securityError: SecurityError = {
      code: 'AUTH_FAILED',
      message: 'Authentication failed',
      severity: 'medium',
      context: { originalError: error.message }
    };

    this.logError(securityError, userId);
    
    toast({
      title: "Authentication Failed",
      description: "Please check your credentials and try again.",
      variant: "destructive",
    });
  }

  static handleBiometricError(error: any, userId?: string) {
    const securityError: SecurityError = {
      code: 'BIOMETRIC_FAILED',
      message: 'Biometric authentication failed',
      severity: 'high',
      context: { originalError: error.message }
    };

    this.logError(securityError, userId);
    
    toast({
      title: "Biometric Authentication Failed",
      description: "Your typing pattern doesn't match. Please try again or use an alternative method.",
      variant: "destructive",
    });
  }

  static handleRateLimitError(userId?: string) {
    const securityError: SecurityError = {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Rate limit exceeded',
      severity: 'medium',
      context: { userId }
    };

    this.logError(securityError, userId);
    
    toast({
      title: "Too Many Attempts",
      description: "Please wait before trying again.",
      variant: "destructive",
    });
  }

  static handleDataValidationError(field: string, value: any, userId?: string) {
    const securityError: SecurityError = {
      code: 'DATA_VALIDATION_FAILED',
      message: `Invalid data for field: ${field}`,
      severity: 'low',
      context: { field, value: typeof value }
    };

    this.logError(securityError, userId);
    
    toast({
      title: "Invalid Data",
      description: `Please check the ${field} field and try again.`,
      variant: "destructive",
    });
  }

  static handleEncryptionError(operation: string, userId?: string) {
    const securityError: SecurityError = {
      code: 'ENCRYPTION_FAILED',
      message: `Encryption operation failed: ${operation}`,
      severity: 'critical',
      context: { operation }
    };

    this.logError(securityError, userId);
    
    toast({
      title: "Security Error",
      description: "A security error occurred. Please contact support.",
      variant: "destructive",
    });
  }
}
