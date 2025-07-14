import { supabase } from '@/integrations/supabase/client';

export interface LicenseLimits {
  maxUsers: number;
  maxDevices: number;
  maxDailyAuth: number;
  maxMonthlyAuth: number;
  advancedAnalytics: boolean;
  prioritySupport: boolean;
  customSecurity: boolean;
  apiAccess: boolean;
}

export interface LicenseValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  currentUsage: {
    users: number;
    devices: number;
    dailyAuth: number;
    monthlyAuth: number;
  };
}

export interface DeploymentConfig {
  mode: 'saas' | 'self-hosted' | 'hybrid';
  licenseKey?: string;
  licenseExpiry?: string;
  customLimits?: Partial<LicenseLimits>;
}

export class LicenseManager {
  private static instance: LicenseManager;
  private config: DeploymentConfig | null = null;

  private constructor() {
    this.loadConfig();
  }

  public static getInstance(): LicenseManager {
    if (!LicenseManager.instance) {
      LicenseManager.instance = new LicenseManager();
    }
    return LicenseManager.instance;
  }

  private loadConfig(): void {
    try {
      const stored = localStorage.getItem('customDeploymentConfig');
      if (stored) {
        this.config = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load deployment config:', error);
    }
  }

  public saveConfig(config: DeploymentConfig): void {
    this.config = config;
    localStorage.setItem('customDeploymentConfig', JSON.stringify(config));
  }

  public getConfig(): DeploymentConfig | null {
    return this.config;
  }

  public getLicenseLimits(tier: string): LicenseLimits {
    // If custom limits are set in deployment config, use them
    if (this.config?.customLimits) {
      return {
        ...this.getDefaultLimits(tier),
        ...this.config.customLimits
      };
    }

    return this.getDefaultLimits(tier);
  }

  private getDefaultLimits(tier: string): LicenseLimits {
    switch (tier) {
      case 'basic':
        return {
          maxUsers: 100,
          maxDevices: 50,
          maxDailyAuth: 1000,
          maxMonthlyAuth: 10000,
          advancedAnalytics: false,
          prioritySupport: false,
          customSecurity: true,
          apiAccess: false
        };
      case 'professional':
        return {
          maxUsers: 1000,
          maxDevices: 500,
          maxDailyAuth: 10000,
          maxMonthlyAuth: 100000,
          advancedAnalytics: true,
          prioritySupport: true,
          customSecurity: true,
          apiAccess: true
        };
      case 'enterprise':
        return {
          maxUsers: -1, // unlimited
          maxDevices: -1, // unlimited
          maxDailyAuth: -1, // unlimited
          maxMonthlyAuth: -1, // unlimited
          advancedAnalytics: true,
          prioritySupport: true,
          customSecurity: true,
          apiAccess: true
        };
      default: // free
        return {
          maxUsers: 10,
          maxDevices: 5,
          maxDailyAuth: 100,
          maxMonthlyAuth: 1000,
          advancedAnalytics: false,
          prioritySupport: false,
          customSecurity: false,
          apiAccess: false
        };
    }
  }

  public async validateLicense(userId: string, tier: string): Promise<LicenseValidationResult> {
    const limits = this.getLicenseLimits(tier);
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Get current usage
      const currentUsage = await this.getCurrentUsage(userId);

      // Validate user limits
      if (limits.maxUsers !== -1 && currentUsage.users > limits.maxUsers) {
        errors.push(`User limit exceeded: ${currentUsage.users}/${limits.maxUsers}`);
      }

      // Validate device limits
      if (limits.maxDevices !== -1 && currentUsage.devices > limits.maxDevices) {
        errors.push(`Device limit exceeded: ${currentUsage.devices}/${limits.maxDevices}`);
      }

      // Validate daily authentication limits
      if (limits.maxDailyAuth !== -1 && currentUsage.dailyAuth > limits.maxDailyAuth) {
        errors.push(`Daily authentication limit exceeded: ${currentUsage.dailyAuth}/${limits.maxDailyAuth}`);
      }

      // Validate monthly authentication limits
      if (limits.maxMonthlyAuth !== -1 && currentUsage.monthlyAuth > limits.maxMonthlyAuth) {
        errors.push(`Monthly authentication limit exceeded: ${currentUsage.monthlyAuth}/${limits.maxMonthlyAuth}`);
      }

      // Check license expiry if in self-hosted mode
      if (this.config?.mode === 'self-hosted' && this.config.licenseExpiry) {
        const expiryDate = new Date(this.config.licenseExpiry);
        if (expiryDate < new Date()) {
          errors.push('License has expired');
        } else if (expiryDate.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000) {
          warnings.push('License expires within 7 days');
        }
      }

      // Add warnings for approaching limits
      if (limits.maxUsers !== -1 && currentUsage.users > limits.maxUsers * 0.8) {
        warnings.push(`Approaching user limit: ${currentUsage.users}/${limits.maxUsers}`);
      }

      if (limits.maxDevices !== -1 && currentUsage.devices > limits.maxDevices * 0.8) {
        warnings.push(`Approaching device limit: ${currentUsage.devices}/${limits.maxDevices}`);
      }

      return {
        valid: errors.length === 0,
        errors,
        warnings,
        currentUsage
      };

    } catch (error) {
      console.error('License validation error:', error);
      return {
        valid: false,
        errors: ['Failed to validate license'],
        warnings: [],
        currentUsage: { users: 0, devices: 0, dailyAuth: 0, monthlyAuth: 0 }
      };
    }
  }

  private async getCurrentUsage(userId: string) {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get user count (for organization)
    const { count: userCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('organization_name', 'current_org'); // You'll need to implement org-based filtering

    // Get device count
    const { count: deviceCount } = await supabase
      .from('device_capabilities')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Get daily authentication count
    const { count: dailyAuthCount } = await supabase
      .from('authentication_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', todayStart.toISOString());

    // Get monthly authentication count
    const { count: monthlyAuthCount } = await supabase
      .from('authentication_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', monthStart.toISOString());

    return {
      users: userCount || 0,
      devices: deviceCount || 0,
      dailyAuth: dailyAuthCount || 0,
      monthlyAuth: monthlyAuthCount || 0
    };
  }

  public canAccessFeature(feature: keyof LicenseLimits, tier: string): boolean {
    const limits = this.getLicenseLimits(tier);
    return limits[feature] === true;
  }

  public async isWithinAuthLimits(userId: string, tier: string): Promise<boolean> {
    const validation = await this.validateLicense(userId, tier);
    return !validation.errors.some(error => 
      error.includes('authentication limit exceeded')
    );
  }

  public getDeploymentMode(): 'saas' | 'self-hosted' | 'hybrid' {
    return this.config?.mode || 'saas';
  }

  public isFeatureEnabled(feature: keyof LicenseLimits, tier: string): boolean {
    const limits = this.getLicenseLimits(tier);
    
    // For boolean features, return the value directly
    if (typeof limits[feature] === 'boolean') {
      return limits[feature] as boolean;
    }
    
    // For numeric limits, return true if not zero/unlimited
    const numericValue = limits[feature] as number;
    return numericValue !== 0;
  }
}

export const licenseManager = LicenseManager.getInstance();