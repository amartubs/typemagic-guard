
import { globalErrorHandler } from '@/lib/errorHandling/globalErrorHandler';

export class SecurityErrorHandler {
  static handleDataValidationError(field: string, value: any, userId?: string): void {
    globalErrorHandler.handleError(
      new Error(`Data validation failed for field: ${field}`),
      'Security Validation',
      userId
    );
  }

  static handleRateLimitError(identifier: string): void {
    globalErrorHandler.handleError(
      new Error(`Rate limit exceeded for: ${identifier}`),
      'Rate Limiting'
    );
  }

  static handleAuthenticationError(error: Error, context: string, userId?: string): void {
    globalErrorHandler.handleError(error, `Authentication Error: ${context}`, userId);
  }

  static handleBiometricError(error: Error, userId?: string): void {
    globalErrorHandler.handleError(error, 'Biometric Authentication', userId);
  }
}
