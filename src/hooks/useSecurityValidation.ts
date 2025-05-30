
import { useState } from 'react';
import { SecurityValidator } from '@/lib/security/validation';
import { SecurityErrorHandler } from '@/lib/security/errorHandler';
import { RateLimiter } from '@/lib/security/rateLimiter';
import { useAuth } from '@/contexts/auth';

export const useSecurityValidation = () => {
  const { user } = useAuth();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: any): boolean => {
    try {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));

      switch (field) {
        case 'email':
          SecurityValidator.emailSchema.parse(value);
          break;
        case 'password':
          SecurityValidator.passwordSchema.parse(value);
          break;
        case 'name':
          SecurityValidator.nameSchema.parse(value);
          break;
        case 'organizationName':
          if (value) SecurityValidator.organizationSchema.parse(value);
          break;
        case 'confidence':
          SecurityValidator.confidenceSchema.parse(value);
          break;
        default:
          return true;
      }
      return true;
    } catch (error: any) {
      const errorMessage = error.errors?.[0]?.message || 'Invalid input';
      setValidationErrors(prev => ({ ...prev, [field]: errorMessage }));
      SecurityErrorHandler.handleDataValidationError(field, value, user?.id);
      return false;
    }
  };

  const validateForm = (data: Record<string, any>): boolean => {
    let isValid = true;

    Object.entries(data).forEach(([field, value]) => {
      if (!validateField(field, value)) {
        isValid = false;
      }
    });

    return isValid;
  };

  const checkRateLimit = (action: 'login' | 'biometric' | 'api'): boolean => {
    if (!user?.id) return true;

    const result = RateLimiter.isAllowed(user.id, action);
    
    if (!result) {
      SecurityErrorHandler.handleRateLimitError(user.id);
      return false;
    }

    return true;
  };

  const sanitizeInput = (input: string): string => {
    return SecurityValidator.sanitizeInput(input);
  };

  const clearErrors = () => {
    setValidationErrors({});
  };

  return {
    validateField,
    validateForm,
    checkRateLimit,
    sanitizeInput,
    validationErrors,
    clearErrors
  };
};
