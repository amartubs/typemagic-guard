export interface BehavioralPattern {
  type: 'timing' | 'location' | 'network' | 'app_usage';
  timestamp: number;
  data: any;
  context: string;
}

export interface TimingPattern extends BehavioralPattern {
  type: 'timing';
  data: {
    hourOfDay: number;
    dayOfWeek: number;
    sessionDuration: number;
    activityLevel: 'low' | 'medium' | 'high';
    typingRhythm: number[];
    breakPatterns: number[];
    peakActivityHours: number[];
  };
}

export interface LocationPattern extends BehavioralPattern {
  type: 'location';
  data: {
    timezone: string;
    estimatedLocation?: {
      country?: string;
      city?: string;
      latitude?: number;
      longitude?: number;
    };
    networkType: string;
    connectionStability: number;
    locationConsistency: number;
  };
}

export interface NetworkPattern extends BehavioralPattern {
  type: 'network';
  data: {
    connectionType: string;
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
    ipAddress?: string;
    dnsServers?: string[];
    networkStability: number;
    bandwidthPattern: number[];
  };
}

export interface AppUsagePattern extends BehavioralPattern {
  type: 'app_usage';
  data: {
    pageViews: string[];
    interactionFrequency: number;
    sessionLength: number;
    navigationPatterns: string[];
    featureUsage: Record<string, number>;
    timeSpentPerSection: Record<string, number>;
  };
}

export class BehavioralAnalysis {
  private sessionStartTime = Date.now();
  private pageViews: string[] = [];
  private interactions: { timestamp: number; type: string; target: string }[] = [];
  private networkInfo: any = null;
  private locationInfo: any = null;

  constructor() {
    this.initializeTracking();
  }

  private initializeTracking(): void {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.recordInteraction('visibility_change', document.visibilityState);
    });

    // Track network changes
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.networkInfo = {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
      };

      connection.addEventListener('change', () => {
        this.networkInfo = {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
        };
        this.recordInteraction('network_change', this.networkInfo);
      });
    }

    // Track location/timezone info
    this.locationInfo = {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      languages: navigator.languages,
    };

    // Track route changes if using React Router
    this.trackPageViews();
  }

  private trackPageViews(): void {
    // Track initial page
    this.pageViews.push(window.location.pathname);

    // Listen for route changes
    const observer = new MutationObserver(() => {
      const currentPath = window.location.pathname;
      const lastPath = this.pageViews[this.pageViews.length - 1];
      if (currentPath !== lastPath) {
        this.pageViews.push(currentPath);
        this.recordInteraction('page_view', currentPath);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  recordInteraction(type: string, target: string): void {
    this.interactions.push({
      timestamp: Date.now(),
      type,
      target
    });
  }

  generateTimingPattern(): TimingPattern {
    const now = new Date();
    const sessionDuration = Date.now() - this.sessionStartTime;

    // Analyze interaction timing
    const interactionIntervals = this.interactions
      .slice(1)
      .map((interaction, index) => 
        interaction.timestamp - this.interactions[index].timestamp
      );

    const typingRhythm = interactionIntervals.filter(interval => interval < 1000);
    const breakPatterns = interactionIntervals.filter(interval => interval > 5000);

    // Determine activity level based on interaction frequency
    const interactionsPerMinute = this.interactions.length / (sessionDuration / 60000);
    let activityLevel: 'low' | 'medium' | 'high' = 'low';
    if (interactionsPerMinute > 10) activityLevel = 'high';
    else if (interactionsPerMinute > 3) activityLevel = 'medium';

    // Analyze peak activity hours (would be more meaningful with historical data)
    const currentHour = now.getHours();
    const peakActivityHours = [currentHour]; // Simplified

    return {
      type: 'timing',
      timestamp: Date.now(),
      data: {
        hourOfDay: now.getHours(),
        dayOfWeek: now.getDay(),
        sessionDuration,
        activityLevel,
        typingRhythm,
        breakPatterns,
        peakActivityHours,
      },
      context: 'session_analysis'
    };
  }

  generateLocationPattern(): LocationPattern {
    return {
      type: 'location',
      timestamp: Date.now(),
      data: {
        timezone: this.locationInfo.timezone,
        networkType: this.networkInfo?.effectiveType || 'unknown',
        connectionStability: this.calculateConnectionStability(),
        locationConsistency: 0.8, // Would need historical data
      },
      context: 'location_analysis'
    };
  }

  generateNetworkPattern(): NetworkPattern {
    const bandwidthPattern = this.interactions
      .filter(i => i.type === 'network_change')
      .map(i => (i.target as any)?.downlink || 0);

    return {
      type: 'network',
      timestamp: Date.now(),
      data: {
        connectionType: this.networkInfo?.effectiveType || 'unknown',
        effectiveType: this.networkInfo?.effectiveType,
        downlink: this.networkInfo?.downlink,
        rtt: this.networkInfo?.rtt,
        networkStability: this.calculateNetworkStability(),
        bandwidthPattern,
      },
      context: 'network_analysis'
    };
  }

  generateAppUsagePattern(): AppUsagePattern {
    // Calculate time spent per section
    const timeSpentPerSection: Record<string, number> = {};
    const navigationPatterns: string[] = [];

    for (let i = 1; i < this.pageViews.length; i++) {
      const prevPage = this.pageViews[i - 1];
      const currPage = this.pageViews[i];
      navigationPatterns.push(`${prevPage}->${currPage}`);
    }

    // Calculate feature usage based on interactions
    const featureUsage: Record<string, number> = {};
    this.interactions.forEach(interaction => {
      featureUsage[interaction.type] = (featureUsage[interaction.type] || 0) + 1;
    });

    return {
      type: 'app_usage',
      timestamp: Date.now(),
      data: {
        pageViews: [...this.pageViews],
        interactionFrequency: this.interactions.length / (Date.now() - this.sessionStartTime) * 60000,
        sessionLength: Date.now() - this.sessionStartTime,
        navigationPatterns,
        featureUsage,
        timeSpentPerSection,
      },
      context: 'usage_analysis'
    };
  }

  private calculateConnectionStability(): number {
    const networkChanges = this.interactions.filter(i => i.type === 'network_change');
    if (networkChanges.length === 0) return 1.0;
    
    // More changes = less stability
    const sessionHours = (Date.now() - this.sessionStartTime) / (1000 * 60 * 60);
    const changesPerHour = networkChanges.length / Math.max(sessionHours, 1);
    
    return Math.max(0, 1 - (changesPerHour * 0.1));
  }

  private calculateNetworkStability(): number {
    if (!this.networkInfo) return 0.5;
    
    // Simple stability calculation based on RTT and downlink
    const rttStability = this.networkInfo.rtt ? Math.max(0, 1 - (this.networkInfo.rtt / 1000)) : 0.5;
    const downlinkStability = this.networkInfo.downlink ? Math.min(1, this.networkInfo.downlink / 10) : 0.5;
    
    return (rttStability + downlinkStability) / 2;
  }

  getAllPatterns(): BehavioralPattern[] {
    return [
      this.generateTimingPattern(),
      this.generateLocationPattern(),
      this.generateNetworkPattern(),
      this.generateAppUsagePattern(),
    ];
  }

  getSessionMetrics() {
    return {
      sessionDuration: Date.now() - this.sessionStartTime,
      totalInteractions: this.interactions.length,
      uniquePages: new Set(this.pageViews).size,
      averageTimePerPage: this.pageViews.length > 1 ? 
        (Date.now() - this.sessionStartTime) / this.pageViews.length : 0,
    };
  }

  reset(): void {
    this.sessionStartTime = Date.now();
    this.pageViews = [window.location.pathname];
    this.interactions = [];
  }
}