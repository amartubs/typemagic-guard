
interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs?: number;
}

interface RateLimitEntry {
  attempts: number;
  firstAttempt: number;
  blockedUntil?: number;
}

export class RateLimiter {
  private static storage = new Map<string, RateLimitEntry>();

  private static getKey(userId: string, action: string): string {
    return `${userId}:${action}`;
  }

  static checkLimit(
    userId: string, 
    action: string, 
    config: RateLimitConfig
  ): { allowed: boolean; remainingAttempts: number; resetTime?: number } {
    const key = this.getKey(userId, action);
    const now = Date.now();
    const entry = this.storage.get(key);

    // Check if user is currently blocked
    if (entry?.blockedUntil && now < entry.blockedUntil) {
      return {
        allowed: false,
        remainingAttempts: 0,
        resetTime: entry.blockedUntil
      };
    }

    // Clean up expired or reset window
    if (!entry || (now - entry.firstAttempt) > config.windowMs) {
      this.storage.set(key, {
        attempts: 1,
        firstAttempt: now
      });
      return {
        allowed: true,
        remainingAttempts: config.maxAttempts - 1
      };
    }

    // Increment attempts
    entry.attempts++;

    // Check if limit exceeded
    if (entry.attempts > config.maxAttempts) {
      entry.blockedUntil = now + (config.blockDurationMs || config.windowMs);
      this.storage.set(key, entry);
      
      return {
        allowed: false,
        remainingAttempts: 0,
        resetTime: entry.blockedUntil
      };
    }

    this.storage.set(key, entry);
    return {
      allowed: true,
      remainingAttempts: config.maxAttempts - entry.attempts
    };
  }

  static resetLimit(userId: string, action: string): void {
    const key = this.getKey(userId, action);
    this.storage.delete(key);
  }

  // Predefined rate limit configurations
  static readonly configs = {
    login: { maxAttempts: 5, windowMs: 15 * 60 * 1000, blockDurationMs: 30 * 60 * 1000 }, // 5 attempts per 15min, block for 30min
    biometric: { maxAttempts: 3, windowMs: 5 * 60 * 1000, blockDurationMs: 10 * 60 * 1000 }, // 3 attempts per 5min, block for 10min
    api: { maxAttempts: 100, windowMs: 60 * 1000 }, // 100 requests per minute
    sensitive: { maxAttempts: 2, windowMs: 60 * 1000, blockDurationMs: 5 * 60 * 1000 } // 2 attempts per minute, block for 5min
  };
}
