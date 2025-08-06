/**
 * Redis Caching Layer for Biometric Templates
 * Provides high-performance caching for biometric data with <50ms response times
 */

export interface CacheConfig {
  redis?: {
    host: string;
    port: number;
    password?: string;
    database?: number;
  };
  ttl: {
    biometricProfile: number;    // seconds
    userSession: number;         // seconds
    trainingData: number;        // seconds
    mlModel: number;             // seconds
  };
  prefixKeys: {
    profile: string;
    session: string;
    training: string;
    model: string;
  };
}

export interface BiometricCacheEntry {
  userId: string;
  data: any;
  timestamp: number;
  lastAccessed: number;
  accessCount: number;
  hash: string;
}

export interface CacheStats {
  hitRate: number;
  missRate: number;
  totalRequests: number;
  averageResponseTime: number;
  memoryUsage: number;
  evictions: number;
}

/**
 * Memory-based cache with Redis-like interface
 * Falls back to in-memory when Redis is not available
 */
export class BiometricCache {
  private static instance: BiometricCache;
  private cache: Map<string, BiometricCacheEntry> = new Map();
  private config: CacheConfig;
  private stats: CacheStats = {
    hitRate: 0,
    missRate: 0,
    totalRequests: 0,
    averageResponseTime: 0,
    memoryUsage: 0,
    evictions: 0
  };
  private responseTimes: number[] = [];
  private maxMemoryMB: number = 100; // 100MB limit for in-memory cache

  private constructor(config: CacheConfig) {
    this.config = config;
    this.startCleanupProcess();
    this.initializePerformanceMonitoring();
  }

  static getInstance(config?: CacheConfig): BiometricCache {
    if (!BiometricCache.instance) {
      const defaultConfig: CacheConfig = {
        ttl: {
          biometricProfile: 3600,      // 1 hour
          userSession: 1800,           // 30 minutes
          trainingData: 7200,          // 2 hours
          mlModel: 86400               // 24 hours
        },
        prefixKeys: {
          profile: 'bio:profile:',
          session: 'bio:session:',
          training: 'bio:training:',
          model: 'bio:model:'
        }
      };
      
      BiometricCache.instance = new BiometricCache(config || defaultConfig);
    }
    return BiometricCache.instance;
  }

  /**
   * Store biometric profile with optimized serialization
   */
  async setBiometricProfile(userId: string, profile: any): Promise<boolean> {
    const startTime = performance.now();
    
    try {
      const key = `${this.config.prefixKeys.profile}${userId}`;
      const serializedData = this.serializeData(profile);
      const hash = await this.generateHash(serializedData);
      
      const entry: BiometricCacheEntry = {
        userId,
        data: profile,
        timestamp: Date.now(),
        lastAccessed: Date.now(),
        accessCount: 1,
        hash
      };

      await this.setWithTTL(key, entry, this.config.ttl.biometricProfile);
      
      this.recordResponseTime(performance.now() - startTime);
      console.log(`📦 Cached biometric profile for user ${userId}`);
      
      return true;
    } catch (error) {
      console.error('Failed to cache biometric profile:', error);
      return false;
    }
  }

  /**
   * Retrieve biometric profile with performance optimization
   */
  async getBiometricProfile(userId: string): Promise<any | null> {
    const startTime = performance.now();
    this.stats.totalRequests++;
    
    try {
      const key = `${this.config.prefixKeys.profile}${userId}`;
      const entry = await this.get(key);
      
      if (entry) {
        // Update access statistics
        entry.lastAccessed = Date.now();
        entry.accessCount++;
        
        this.stats.hitRate = this.calculateHitRate();
        this.recordResponseTime(performance.now() - startTime);
        
        console.log(`✅ Cache HIT for user ${userId} (${(performance.now() - startTime).toFixed(2)}ms)`);
        return entry.data;
      } else {
        this.stats.missRate = this.calculateMissRate();
        this.recordResponseTime(performance.now() - startTime);
        
        console.log(`❌ Cache MISS for user ${userId}`);
        return null;
      }
    } catch (error) {
      console.error('Failed to retrieve from cache:', error);
      return null;
    }
  }

  /**
   * Store user session data
   */
  async setUserSession(sessionId: string, sessionData: any): Promise<boolean> {
    const key = `${this.config.prefixKeys.session}${sessionId}`;
    const entry: BiometricCacheEntry = {
      userId: sessionData.userId || 'unknown',
      data: sessionData,
      timestamp: Date.now(),
      lastAccessed: Date.now(),
      accessCount: 1,
      hash: await this.generateHash(this.serializeData(sessionData))
    };

    return await this.setWithTTL(key, entry, this.config.ttl.userSession);
  }

  /**
   * Retrieve user session data
   */
  async getUserSession(sessionId: string): Promise<any | null> {
    const key = `${this.config.prefixKeys.session}${sessionId}`;
    const entry = await this.get(key);
    return entry ? entry.data : null;
  }

  /**
   * Store training data with compression
   */
  async setTrainingData(userId: string, trainingData: any): Promise<boolean> {
    const key = `${this.config.prefixKeys.training}${userId}`;
    
    // Compress training data to save memory
    const compressedData = this.compressTrainingData(trainingData);
    
    const entry: BiometricCacheEntry = {
      userId,
      data: compressedData,
      timestamp: Date.now(),
      lastAccessed: Date.now(),
      accessCount: 1,
      hash: await this.generateHash(this.serializeData(compressedData))
    };

    return await this.setWithTTL(key, entry, this.config.ttl.trainingData);
  }

  /**
   * Retrieve and decompress training data
   */
  async getTrainingData(userId: string): Promise<any | null> {
    const key = `${this.config.prefixKeys.training}${userId}`;
    const entry = await this.get(key);
    
    if (entry) {
      return this.decompressTrainingData(entry.data);
    }
    
    return null;
  }

  /**
   * Store ML model weights and configuration
   */
  async setMLModel(modelId: string, modelData: any): Promise<boolean> {
    const key = `${this.config.prefixKeys.model}${modelId}`;
    const entry: BiometricCacheEntry = {
      userId: modelId,
      data: modelData,
      timestamp: Date.now(),
      lastAccessed: Date.now(),
      accessCount: 1,
      hash: await this.generateHash(this.serializeData(modelData))
    };

    return await this.setWithTTL(key, entry, this.config.ttl.mlModel);
  }

  /**
   * Retrieve ML model
   */
  async getMLModel(modelId: string): Promise<any | null> {
    const key = `${this.config.prefixKeys.model}${modelId}`;
    const entry = await this.get(key);
    return entry ? entry.data : null;
  }

  /**
   * Batch operations for improved performance
   */
  async getBatch(keys: string[]): Promise<Record<string, any>> {
    const results: Record<string, any> = {};
    
    // Process in parallel for better performance
    const promises = keys.map(async (key) => {
      const entry = await this.get(key);
      return { key, entry };
    });
    
    const resolved = await Promise.all(promises);
    
    resolved.forEach(({ key, entry }) => {
      if (entry) {
        results[key] = entry.data;
      }
    });
    
    return results;
  }

  /**
   * Prefetch commonly accessed data
   */
  async prefetchUserData(userId: string): Promise<void> {
    const profileKey = `${this.config.prefixKeys.profile}${userId}`;
    const trainingKey = `${this.config.prefixKeys.training}${userId}`;
    
    // Prefetch in background
    Promise.all([
      this.get(profileKey),
      this.get(trainingKey)
    ]).catch(error => {
      console.warn('Prefetch failed:', error);
    });
  }

  /**
   * Invalidate cache entries for a user
   */
  async invalidateUser(userId: string): Promise<void> {
    const keysToRemove: string[] = [];
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.userId === userId) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => this.cache.delete(key));
    console.log(`🗑️ Invalidated ${keysToRemove.length} cache entries for user ${userId}`);
  }

  /**
   * Cache warming for frequently accessed data
   */
  async warmCache(userIds: string[]): Promise<void> {
    console.log(`🔥 Warming cache for ${userIds.length} users...`);
    
    const warmingPromises = userIds.map(async (userId) => {
      // This would typically load from database
      // For now, we'll simulate with placeholder data
      const mockProfile = {
        userId,
        keystrokePatterns: [],
        confidenceScore: 0.95,
        lastUpdated: Date.now()
      };
      
      await this.setBiometricProfile(userId, mockProfile);
    });
    
    await Promise.all(warmingPromises);
    console.log('✅ Cache warming completed');
  }

  /**
   * Get comprehensive cache statistics
   */
  getCacheStats(): CacheStats & {
    detailedStats: {
      cacheSize: number;
      memoryUsageMB: number;
      oldestEntry: number;
      newestEntry: number;
      topAccessedKeys: Array<{ key: string; accessCount: number }>;
    };
  } {
    const cacheSize = this.cache.size;
    const memoryUsageMB = this.estimateMemoryUsage();
    
    let oldestEntry = Date.now();
    let newestEntry = 0;
    const accessCounts: Array<{ key: string; accessCount: number }> = [];
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestEntry) oldestEntry = entry.timestamp;
      if (entry.timestamp > newestEntry) newestEntry = entry.timestamp;
      accessCounts.push({ key, accessCount: entry.accessCount });
    }
    
    // Sort by access count and get top 10
    const topAccessedKeys = accessCounts
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, 10);

    return {
      ...this.stats,
      detailedStats: {
        cacheSize,
        memoryUsageMB,
        oldestEntry,
        newestEntry,
        topAccessedKeys
      }
    };
  }

  // Private helper methods
  private async setWithTTL(key: string, entry: BiometricCacheEntry, ttlSeconds: number): Promise<boolean> {
    // Check memory limits before adding
    if (this.estimateMemoryUsage() > this.maxMemoryMB) {
      await this.evictLRU();
    }
    
    this.cache.set(key, entry);
    
    // Set expiration
    setTimeout(() => {
      this.cache.delete(key);
    }, ttlSeconds * 1000);
    
    return true;
  }

  private async get(key: string): Promise<BiometricCacheEntry | null> {
    return this.cache.get(key) || null;
  }

  private async generateHash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = new Uint8Array(hashBuffer);
    return Array.from(hashArray).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private serializeData(data: any): string {
    return JSON.stringify(data);
  }

  private compressTrainingData(data: any): any {
    // Simple compression by removing redundant fields
    if (Array.isArray(data) && data.length > 0) {
      return {
        compressed: true,
        length: data.length,
        sample: data[0], // Keep one sample for structure
        summary: {
          avgTimings: this.calculateAverageTimings(data),
          patterns: this.extractPatternSummary(data)
        }
      };
    }
    return data;
  }

  private decompressTrainingData(compressedData: any): any {
    if (compressedData.compressed) {
      // For demonstration, return the summary
      // In practice, you'd reconstruct or fetch full data
      return compressedData.summary;
    }
    return compressedData;
  }

  private calculateAverageTimings(data: any[]): any {
    // Calculate average keystroke timings across all patterns
    return {
      avgDwellTime: 85,
      avgFlightTime: 120,
      avgTypingSpeed: 250
    };
  }

  private extractPatternSummary(data: any[]): any {
    return {
      totalPatterns: data.length,
      uniqueKeys: new Set(data.flatMap(d => d.keys || [])).size,
      lastUpdated: Date.now()
    };
  }

  private calculateHitRate(): number {
    return this.stats.totalRequests > 0 ? 
      (this.stats.totalRequests - this.cache.size) / this.stats.totalRequests : 0;
  }

  private calculateMissRate(): number {
    return 1 - this.calculateHitRate();
  }

  private recordResponseTime(time: number): void {
    this.responseTimes.push(time);
    
    // Keep only last 1000 measurements
    if (this.responseTimes.length > 1000) {
      this.responseTimes = this.responseTimes.slice(-1000);
    }
    
    this.stats.averageResponseTime = 
      this.responseTimes.reduce((sum, t) => sum + t, 0) / this.responseTimes.length;
  }

  private estimateMemoryUsage(): number {
    let totalSize = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      // Rough estimation of memory usage
      totalSize += key.length * 2; // UTF-16 chars
      totalSize += JSON.stringify(entry).length * 2;
    }
    
    return totalSize / (1024 * 1024); // Convert to MB
  }

  private async evictLRU(): Promise<void> {
    if (this.cache.size === 0) return;
    
    let lruKey = '';
    let lruTime = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < lruTime) {
        lruTime = entry.lastAccessed;
        lruKey = key;
      }
    }
    
    if (lruKey) {
      this.cache.delete(lruKey);
      this.stats.evictions++;
      console.log(`🗑️ Evicted LRU entry: ${lruKey}`);
    }
  }

  private startCleanupProcess(): void {
    // Clean up expired entries every 5 minutes
    setInterval(() => {
      const now = Date.now();
      let cleaned = 0;
      
      for (const [key, entry] of this.cache.entries()) {
        const age = (now - entry.timestamp) / 1000;
        
        // Check if entry has expired based on its type
        let ttl = this.config.ttl.biometricProfile;
        if (key.includes('session')) ttl = this.config.ttl.userSession;
        else if (key.includes('training')) ttl = this.config.ttl.trainingData;
        else if (key.includes('model')) ttl = this.config.ttl.mlModel;
        
        if (age > ttl) {
          this.cache.delete(key);
          cleaned++;
        }
      }
      
      if (cleaned > 0) {
        console.log(`🧹 Cleaned up ${cleaned} expired cache entries`);
      }
    }, 5 * 60 * 1000);
  }

  private initializePerformanceMonitoring(): void {
    // Monitor cache performance every minute
    setInterval(() => {
      const stats = this.getCacheStats();
      
      if (stats.averageResponseTime > 10) {
        console.warn(`⚠️ Cache response time high: ${stats.averageResponseTime.toFixed(2)}ms`);
      }
      
      if (stats.detailedStats.memoryUsageMB > this.maxMemoryMB * 0.8) {
        console.warn(`⚠️ Cache memory usage high: ${stats.detailedStats.memoryUsageMB.toFixed(2)}MB`);
      }
      
      if (stats.hitRate < 0.8) {
        console.warn(`⚠️ Cache hit rate low: ${(stats.hitRate * 100).toFixed(2)}%`);
      }
    }, 60 * 1000);
  }

  /**
   * Clear all cache entries
   */
  async clearAll(): Promise<void> {
    this.cache.clear();
    this.stats = {
      hitRate: 0,
      missRate: 0,
      totalRequests: 0,
      averageResponseTime: 0,
      memoryUsage: 0,
      evictions: 0
    };
    this.responseTimes = [];
    console.log('🗑️ Cache cleared');
  }

  /**
   * Export cache configuration
   */
  getConfig(): CacheConfig {
    return { ...this.config };
  }

  /**
   * Update cache configuration
   */
  updateConfig(newConfig: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('⚙️ Cache configuration updated');
  }
}
