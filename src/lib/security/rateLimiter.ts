
interface RateLimitConfig {
  windowMs: number;
  maxAttempts: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private static limits: Map<string, RateLimitEntry> = new Map();
  
  private static configs: Record<string, RateLimitConfig> = {
    login: { windowMs: 15 * 60 * 1000, maxAttempts: 5 }, // 5 attempts per 15 minutes
    biometric: { windowMs: 5 * 60 * 1000, maxAttempts: 10 }, // 10 attempts per 5 minutes
    api: { windowMs: 60 * 1000, maxAttempts: 100 } // 100 requests per minute
  };

  static isAllowed(identifier: string, type: keyof typeof this.configs): boolean {
    const config = this.configs[type];
    const now = Date.now();
    const key = `${type}:${identifier}`;
    
    let entry = this.limits.get(key);
    
    if (!entry || now > entry.resetTime) {
      entry = {
        count: 1,
        resetTime: now + config.windowMs
      };
      this.limits.set(key, entry);
      return true;
    }
    
    if (entry.count >= config.maxAttempts) {
      return false;
    }
    
    entry.count++;
    this.limits.set(key, entry);
    return true;
  }

  static getRemainingAttempts(identifier: string, type: keyof typeof this.configs): number {
    const config = this.configs[type];
    const key = `${type}:${identifier}`;
    const entry = this.limits.get(key);
    
    if (!entry || Date.now() > entry.resetTime) {
      return config.maxAttempts;
    }
    
    return Math.max(0, config.maxAttempts - entry.count);
  }

  static getResetTime(identifier: string, type: keyof typeof this.configs): number {
    const key = `${type}:${identifier}`;
    const entry = this.limits.get(key);
    
    if (!entry || Date.now() > entry.resetTime) {
      return 0;
    }
    
    return entry.resetTime;
  }

  static reset(identifier: string, type: keyof typeof this.configs): void {
    const key = `${type}:${identifier}`;
    this.limits.delete(key);
  }
}
