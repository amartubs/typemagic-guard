
import { z } from 'zod';

export class SecurityValidator {
  // Email validation with security considerations
  static readonly emailSchema = z
    .string()
    .email('Invalid email format')
    .min(5, 'Email too short')
    .max(254, 'Email too long')
    .refine(email => !email.includes('..'), 'Invalid email format')
    .refine(email => !/[<>]/.test(email), 'Invalid characters in email');

  // Password validation
  static readonly passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .refine(pwd => /[A-Z]/.test(pwd), 'Password must contain uppercase letter')
    .refine(pwd => /[a-z]/.test(pwd), 'Password must contain lowercase letter')
    .refine(pwd => /\d/.test(pwd), 'Password must contain number')
    .refine(pwd => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), 'Password must contain special character');

  // Name validation
  static readonly nameSchema = z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .refine(name => !/[<>]/.test(name), 'Invalid characters in name')
    .refine(name => name.trim().length > 0, 'Name cannot be empty');

  // Organization name validation
  static readonly organizationSchema = z
    .string()
    .min(2, 'Organization name too short')
    .max(200, 'Organization name too long')
    .refine(name => !/[<>]/.test(name), 'Invalid characters in organization name')
    .optional();

  // Confidence score validation
  static readonly confidenceSchema = z
    .number()
    .int('Confidence must be integer')
    .min(0, 'Confidence cannot be negative')
    .max(100, 'Confidence cannot exceed 100');

  // IP address validation
  static readonly ipSchema = z
    .string()
    .refine(ip => {
      const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
      return ipv4Regex.test(ip) || ipv6Regex.test(ip);
    }, 'Invalid IP address format');

  // User agent validation
  static readonly userAgentSchema = z
    .string()
    .max(500, 'User agent too long')
    .refine(ua => !/[<>]/.test(ua), 'Invalid characters in user agent');

  // Sanitize input to prevent XSS
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  // Validate and sanitize form data
  static validateProfileData(data: {
    name: string;
    email: string;
    organizationName?: string;
  }) {
    const result = z.object({
      name: this.nameSchema,
      email: this.emailSchema,
      organizationName: this.organizationSchema
    }).safeParse({
      name: this.sanitizeInput(data.name),
      email: data.email.toLowerCase().trim(),
      organizationName: data.organizationName ? this.sanitizeInput(data.organizationName) : undefined
    });

    if (!result.success) {
      throw new Error(result.error.errors[0].message);
    }

    return result.data;
  }
}
