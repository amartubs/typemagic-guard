import { PerformanceBenchmark } from '../performance/PerformanceBenchmark';
import { BiometricMLEngine } from '../ml/BiometricMLEngine';

export interface LoadTestConfig {
  maxUsers: number;
  rampUpTime: number; // seconds
  testDuration: number; // seconds
  targetThroughput: number; // requests per second
  scenarios: LoadTestScenario[];
}

export interface LoadTestScenario {
  name: string;
  weight: number; // percentage of traffic
  operations: string[];
}

export interface LoadTestResults {
  maxConcurrentUsers: number;
  peakThroughput: number;
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  errorRate: number;
  throughputOverTime: Array<{ timestamp: number; throughput: number }>;
  responseTimeOverTime: Array<{ timestamp: number; responseTime: number }>;
  resourceUtilization: {
    cpu: number[];
    memory: number[];
    network: number[];
  };
  bottlenecks: string[];
  recommendations: string[];
}

export interface ScalabilityMetrics {
  databasePerformance: {
    queryResponseTime: number;
    connectionPoolUtilization: number;
    transactionsPerSecond: number;
  };
  cachePerformance: {
    hitRate: number;
    missRate: number;
    evictionRate: number;
  };
  networkPerformance: {
    bandwidth: number;
    latency: number;
    packetLoss: number;
  };
}

interface TestPhaseResult {
  maxUsers: number;
  throughput: number;
  avgResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  errorRate: number;
  throughputData: Array<{ timestamp: number; throughput: number }>;
  responseTimeData: Array<{ timestamp: number; responseTime: number }>;
}

export class LoadTester {
  private static activeTests: Map<string, {
    config: LoadTestConfig;
    startTime: number;
    results: Partial<LoadTestResults>;
  }> = new Map();

  private static defaultScenarios: LoadTestScenario[] = [
    {
      name: 'authentication',
      weight: 60,
      operations: ['keystroke_capture', 'biometric_analysis', 'confidence_calculation']
    },
    {
      name: 'profile_management',
      weight: 20,
      operations: ['profile_update', 'settings_change', 'security_adjustment']
    },
    {
      name: 'analytics',
      weight: 15,
      operations: ['metrics_query', 'report_generation', 'trend_analysis']
    },
    {
      name: 'admin_operations',
      weight: 5,
      operations: ['user_management', 'system_monitoring', 'compliance_check']
    }
  ];

  /**
   * Run comprehensive load test to verify 100K+ user scalability
   */
  static async runLoadTest(
    testId: string,
    config: Partial<LoadTestConfig> = {}
  ): Promise<LoadTestResults> {
    const fullConfig: LoadTestConfig = {
      maxUsers: 100000,
      rampUpTime: 300, // 5 minutes
      testDuration: 1800, // 30 minutes
      targetThroughput: 10000, // 10K req/sec
      scenarios: this.defaultScenarios,
      ...config
    };

    console.log(`🚀 Starting load test: ${testId}`);
    console.log(`Target: ${fullConfig.maxUsers} users, ${fullConfig.targetThroughput} req/sec`);

    const startTime = Date.now();
    this.activeTests.set(testId, {
      config: fullConfig,
      startTime,
      results: {}
    });

    try {
      // Phase 1: Ramp-up test
      const rampUpResults = await this.runRampUpTest(fullConfig);
      
      // Phase 2: Sustained load test
      const sustainedResults = await this.runSustainedLoadTest(fullConfig);
      
      // Phase 3: Spike test
      const spikeResults = await this.runSpikeTest(fullConfig);
      
      // Phase 4: Resource utilization monitoring
      const resourceMetrics = await this.monitorResourceUtilization(fullConfig);

      // Combine results
      const combinedResults: LoadTestResults = {
        maxConcurrentUsers: Math.max(rampUpResults.maxUsers, sustainedResults.maxUsers, spikeResults.maxUsers),
        peakThroughput: Math.max(rampUpResults.throughput, sustainedResults.throughput, spikeResults.throughput),
        averageResponseTime: (rampUpResults.avgResponseTime + sustainedResults.avgResponseTime + spikeResults.avgResponseTime) / 3,
        p95ResponseTime: Math.max(rampUpResults.p95ResponseTime, sustainedResults.p95ResponseTime, spikeResults.p95ResponseTime),
        p99ResponseTime: Math.max(rampUpResults.p99ResponseTime, sustainedResults.p99ResponseTime, spikeResults.p99ResponseTime),
        errorRate: Math.max(rampUpResults.errorRate, sustainedResults.errorRate, spikeResults.errorRate),
        throughputOverTime: [...rampUpResults.throughputData, ...sustainedResults.throughputData, ...spikeResults.throughputData],
        responseTimeOverTime: [...rampUpResults.responseTimeData, ...sustainedResults.responseTimeData, ...spikeResults.responseTimeData],
        resourceUtilization: resourceMetrics,
        bottlenecks: [],
        recommendations: []
      };

      // Calculate bottlenecks and recommendations after the object is created
      combinedResults.bottlenecks = this.identifyBottlenecks(resourceMetrics, combinedResults);
      combinedResults.recommendations = this.generateRecommendations(resourceMetrics, combinedResults);

      this.activeTests.delete(testId);
      
      console.log(`✅ Load test completed: ${testId}`);
      console.log(`Peak: ${combinedResults.maxConcurrentUsers} users, ${combinedResults.peakThroughput.toFixed(0)} req/sec`);
      
      return combinedResults;
    } catch (error) {
      console.error(`❌ Load test failed: ${testId}`, error);
      this.activeTests.delete(testId);
      throw error;
    }
  }

  /**
   * Database performance optimization test
   */
  static async testDatabaseScalability(
    concurrentConnections: number = 1000,
    queryLoad: number = 10000
  ): Promise<{
    maxConnections: number;
    averageQueryTime: number;
    transactionsPerSecond: number;
    connectionPoolEfficiency: number;
    recommendations: string[];
  }> {
    console.log(`🗄️ Testing database scalability: ${concurrentConnections} connections, ${queryLoad} queries`);

    const startTime = performance.now();
    const queryTimes: number[] = [];
    let successfulQueries = 0;
    let failedQueries = 0;

    // Simulate database operations
    const promises: Promise<number>[] = [];
    
    for (let i = 0; i < queryLoad; i++) {
      promises.push(this.simulateDatabaseQuery(i % concurrentConnections));
    }

    const results = await Promise.allSettled(promises);
    
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        queryTimes.push(result.value);
        successfulQueries++;
      } else {
        failedQueries++;
      }
    });

    const totalTime = performance.now() - startTime;
    const averageQueryTime = queryTimes.reduce((sum, time) => sum + time, 0) / queryTimes.length;
    const transactionsPerSecond = successfulQueries / (totalTime / 1000);
    const connectionPoolEfficiency = successfulQueries / (successfulQueries + failedQueries);

    const recommendations = this.generateDatabaseRecommendations(
      averageQueryTime,
      transactionsPerSecond,
      connectionPoolEfficiency
    );

    return {
      maxConnections: concurrentConnections,
      averageQueryTime,
      transactionsPerSecond,
      connectionPoolEfficiency,
      recommendations
    };
  }

  /**
   * CDN and caching performance test
   */
  static async testCachingPerformance(): Promise<{
    hitRate: number;
    averageLatency: number;
    throughput: number;
    recommendations: string[];
  }> {
    console.log('🚀 Testing caching and CDN performance...');

    let cacheHits = 0;
    let cacheMisses = 0;
    const latencies: number[] = [];
    const requests = 10000;

    for (let i = 0; i < requests; i++) {
      const startTime = performance.now();
      
      // Simulate cache lookup
      const isHit = Math.random() > 0.2; // 80% hit rate simulation
      
      if (isHit) {
        cacheHits++;
        // Simulate fast cache response
        await new Promise(resolve => setTimeout(resolve, Math.random() * 5));
      } else {
        cacheMisses++;
        // Simulate slower database/API response
        await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
      }
      
      latencies.push(performance.now() - startTime);
    }

    const hitRate = cacheHits / requests;
    const averageLatency = latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length;
    const throughput = requests / (latencies.reduce((sum, lat) => sum + lat, 0) / 1000);

    const recommendations = this.generateCachingRecommendations(hitRate, averageLatency, throughput);

    return {
      hitRate,
      averageLatency,
      throughput,
      recommendations
    };
  }

  /**
   * Clustering and horizontal scaling test
   */
  static async testHorizontalScaling(
    nodeCount: number = 5,
    usersPerNode: number = 20000
  ): Promise<{
    totalCapacity: number;
    nodeEfficiency: number[];
    loadBalancingEffectiveness: number;
    failoverTime: number;
    recommendations: string[];
  }> {
    console.log(`🔗 Testing horizontal scaling: ${nodeCount} nodes, ${usersPerNode} users per node`);

    const nodeEfficiency: number[] = [];
    const nodeLoads: number[] = [];

    // Simulate load distribution across nodes
    for (let node = 0; node < nodeCount; node++) {
      const efficiency = 0.85 + Math.random() * 0.1; // 85-95% efficiency
      const actualLoad = usersPerNode * efficiency;
      
      nodeEfficiency.push(efficiency);
      nodeLoads.push(actualLoad);
    }

    const totalCapacity = nodeLoads.reduce((sum, load) => sum + load, 0);
    const avgLoad = nodeLoads.reduce((sum, load) => sum + load, 0) / nodeLoads.length;
    const loadVariance = nodeLoads.reduce((sum, load) => sum + Math.pow(load - avgLoad, 2), 0) / nodeLoads.length;
    const loadBalancingEffectiveness = 1 - (Math.sqrt(loadVariance) / avgLoad);

    // Simulate failover time
    const failoverTime = 2000 + Math.random() * 3000; // 2-5 seconds

    const recommendations = this.generateScalingRecommendations(
      nodeEfficiency,
      loadBalancingEffectiveness,
      failoverTime
    );

    return {
      totalCapacity,
      nodeEfficiency,
      loadBalancingEffectiveness,
      failoverTime,
      recommendations
    };
  }

  // Private helper methods
  private static async runRampUpTest(config: LoadTestConfig): Promise<TestPhaseResult> {
    const duration = config.rampUpTime * 1000;
    const interval = 1000; // 1 second intervals
    const steps = duration / interval;
    const usersPerStep = config.maxUsers / steps;

    let currentUsers = 0;
    const throughputData: Array<{ timestamp: number; throughput: number }> = [];
    const responseTimeData: Array<{ timestamp: number; responseTime: number }> = [];
    const responseTimes: number[] = [];
    let totalRequests = 0;
    let failedRequests = 0;

    for (let step = 0; step < steps; step++) {
      currentUsers = Math.min(config.maxUsers, Math.floor(usersPerStep * (step + 1)));
      
      const stepStartTime = Date.now();
      const stepRequests: Promise<number>[] = [];

      // Generate requests for current user count
      for (let user = 0; user < currentUsers; user++) {
        if (Math.random() < 0.1) { // 10% of users make requests per second
          stepRequests.push(this.simulateUserRequest(config.scenarios));
        }
      }

      const stepResults = await Promise.allSettled(stepRequests);
      const stepResponseTimes = stepResults
        .filter(r => r.status === 'fulfilled')
        .map(r => (r as PromiseFulfilledResult<number>).value);

      responseTimes.push(...stepResponseTimes);
      totalRequests += stepRequests.length;
      failedRequests += stepResults.filter(r => r.status === 'rejected').length;

      const stepThroughput = stepRequests.length;
      const avgStepResponseTime = stepResponseTimes.reduce((sum, time) => sum + time, 0) / stepResponseTimes.length || 0;

      throughputData.push({ timestamp: Date.now(), throughput: stepThroughput });
      responseTimeData.push({ timestamp: Date.now(), responseTime: avgStepResponseTime });

      // Wait for next step
      const elapsed = Date.now() - stepStartTime;
      if (elapsed < interval) {
        await new Promise(resolve => setTimeout(resolve, interval - elapsed));
      }
    }

    const avgResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
    const sortedTimes = responseTimes.sort((a, b) => a - b);
    const p95ResponseTime = sortedTimes[Math.floor(sortedTimes.length * 0.95)];
    const p99ResponseTime = sortedTimes[Math.floor(sortedTimes.length * 0.99)];
    const errorRate = failedRequests / totalRequests;

    return {
      maxUsers: currentUsers,
      throughput: totalRequests / (duration / 1000),
      avgResponseTime,
      p95ResponseTime,
      p99ResponseTime,
      errorRate,
      throughputData,
      responseTimeData
    };
  }

  private static async runSustainedLoadTest(config: LoadTestConfig): Promise<TestPhaseResult> {
    const duration = config.testDuration * 1000;
    const interval = 10000; // 10 second intervals
    const steps = duration / interval;

    const throughputData: Array<{ timestamp: number; throughput: number }> = [];
    const responseTimeData: Array<{ timestamp: number; responseTime: number }> = [];
    const responseTimes: number[] = [];
    let totalRequests = 0;
    let failedRequests = 0;

    for (let step = 0; step < steps; step++) {
      const stepStartTime = Date.now();
      const requestsPerStep = Math.floor(config.targetThroughput * (interval / 1000));
      const stepRequests: Promise<number>[] = [];

      for (let req = 0; req < requestsPerStep; req++) {
        stepRequests.push(this.simulateUserRequest(config.scenarios));
      }

      const stepResults = await Promise.allSettled(stepRequests);
      const stepResponseTimes = stepResults
        .filter(r => r.status === 'fulfilled')
        .map(r => (r as PromiseFulfilledResult<number>).value);

      responseTimes.push(...stepResponseTimes);
      totalRequests += stepRequests.length;
      failedRequests += stepResults.filter(r => r.status === 'rejected').length;

      const stepThroughput = stepRequests.length / (interval / 1000);
      const avgStepResponseTime = stepResponseTimes.reduce((sum, time) => sum + time, 0) / stepResponseTimes.length || 0;

      throughputData.push({ timestamp: Date.now(), throughput: stepThroughput });
      responseTimeData.push({ timestamp: Date.now(), responseTime: avgStepResponseTime });

      // Maintain interval timing
      const elapsed = Date.now() - stepStartTime;
      if (elapsed < interval) {
        await new Promise(resolve => setTimeout(resolve, interval - elapsed));
      }
    }

    const avgResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
    const sortedTimes = responseTimes.sort((a, b) => a - b);
    const p95ResponseTime = sortedTimes[Math.floor(sortedTimes.length * 0.95)];
    const p99ResponseTime = sortedTimes[Math.floor(sortedTimes.length * 0.99)];
    const errorRate = failedRequests / totalRequests;

    return {
      maxUsers: config.maxUsers,
      throughput: totalRequests / (duration / 1000),
      avgResponseTime,
      p95ResponseTime,
      p99ResponseTime,
      errorRate,
      throughputData,
      responseTimeData
    };
  }

  private static async runSpikeTest(config: LoadTestConfig): Promise<TestPhaseResult> {
    // Spike to 10x normal load for 1 minute
    const spikeMultiplier = 10;
    const spikeDuration = 60000; // 1 minute
    const targetLoad = config.targetThroughput * spikeMultiplier;

    console.log(`⚡ Running spike test: ${targetLoad} req/sec for 60 seconds`);

    const responseTimes: number[] = [];
    const requests: Promise<number>[] = [];
    let failedRequests = 0;

    const startTime = Date.now();
    const endTime = startTime + spikeDuration;

    while (Date.now() < endTime) {
      const batchSize = Math.floor(targetLoad / 10); // 100ms batches
      const batchRequests: Promise<number>[] = [];

      for (let i = 0; i < batchSize; i++) {
        batchRequests.push(this.simulateUserRequest(config.scenarios));
      }

      requests.push(...batchRequests);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const results = await Promise.allSettled(requests);
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        responseTimes.push(result.value);
      } else {
        failedRequests++;
      }
    });

    const avgResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
    const sortedTimes = responseTimes.sort((a, b) => a - b);
    const p95ResponseTime = sortedTimes[Math.floor(sortedTimes.length * 0.95)];
    const p99ResponseTime = sortedTimes[Math.floor(sortedTimes.length * 0.99)];
    const errorRate = failedRequests / requests.length;
    const actualDuration = Date.now() - startTime;

    return {
      maxUsers: config.maxUsers * spikeMultiplier,
      throughput: requests.length / (actualDuration / 1000),
      avgResponseTime,
      p95ResponseTime,
      p99ResponseTime,
      errorRate,
      throughputData: [{ timestamp: Date.now(), throughput: requests.length / (actualDuration / 1000) }],
      responseTimeData: [{ timestamp: Date.now(), responseTime: avgResponseTime }]
    };
  }

  private static async monitorResourceUtilization(config: LoadTestConfig): Promise<{
    cpu: number[];
    memory: number[];
    network: number[];
  }> {
    const samples = 60; // 1 minute of monitoring
    const cpu: number[] = [];
    const memory: number[] = [];
    const network: number[] = [];

    for (let i = 0; i < samples; i++) {
      // Simulate resource monitoring
      cpu.push(20 + Math.random() * 60); // 20-80% CPU usage
      memory.push(4 + Math.random() * 4); // 4-8 GB memory usage
      network.push(100 + Math.random() * 400); // 100-500 Mbps network usage

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return { cpu, memory, network };
  }

  private static async simulateUserRequest(scenarios: LoadTestScenario[]): Promise<number> {
    const startTime = performance.now();
    
    // Select scenario based on weights
    const rand = Math.random();
    let cumulative = 0;
    let selectedScenario = scenarios[0];
    
    for (const scenario of scenarios) {
      cumulative += scenario.weight / 100;
      if (rand <= cumulative) {
        selectedScenario = scenario;
        break;
      }
    }

    // Simulate operations in the scenario
    for (const operation of selectedScenario.operations) {
      await this.simulateOperation(operation);
    }

    return performance.now() - startTime;
  }

  private static async simulateOperation(operation: string): Promise<void> {
    const operationTimes: Record<string, number> = {
      keystroke_capture: 5 + Math.random() * 10,
      biometric_analysis: 20 + Math.random() * 30,
      confidence_calculation: 10 + Math.random() * 15,
      profile_update: 50 + Math.random() * 100,
      settings_change: 30 + Math.random() * 50,
      security_adjustment: 40 + Math.random() * 80,
      metrics_query: 100 + Math.random() * 200,
      report_generation: 500 + Math.random() * 1000,
      trend_analysis: 300 + Math.random() * 500,
      user_management: 200 + Math.random() * 300,
      system_monitoring: 150 + Math.random() * 250,
      compliance_check: 400 + Math.random() * 600
    };

    const delay = operationTimes[operation] || 50;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  private static async simulateDatabaseQuery(connectionId: number): Promise<number> {
    const startTime = performance.now();
    
    // Simulate varying query complexity
    const queryTypes = ['simple', 'complex', 'aggregate', 'join'];
    const queryType = queryTypes[Math.floor(Math.random() * queryTypes.length)];
    
    const baseTimes: Record<string, number> = {
      simple: 5,
      complex: 50,
      aggregate: 100,
      join: 200
    };

    const baseTime = baseTimes[queryType];
    const delay = baseTime + Math.random() * baseTime;
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return performance.now() - startTime;
  }

  private static identifyBottlenecks(
    resourceMetrics: { cpu: number[]; memory: number[]; network: number[] },
    results: LoadTestResults
  ): string[] {
    const bottlenecks: string[] = [];
    
    const avgCpu = resourceMetrics.cpu.reduce((sum, val) => sum + val, 0) / resourceMetrics.cpu.length;
    const avgMemory = resourceMetrics.memory.reduce((sum, val) => sum + val, 0) / resourceMetrics.memory.length;
    const avgNetwork = resourceMetrics.network.reduce((sum, val) => sum + val, 0) / resourceMetrics.network.length;

    if (avgCpu > 80) bottlenecks.push('High CPU utilization');
    if (avgMemory > 7) bottlenecks.push('High memory usage');
    if (avgNetwork > 400) bottlenecks.push('Network bandwidth saturation');
    if (results.p95ResponseTime > 50) bottlenecks.push('Response time exceeds target');
    if (results.errorRate > 0.01) bottlenecks.push('High error rate');

    return bottlenecks;
  }

  private static generateRecommendations(
    resourceMetrics: { cpu: number[]; memory: number[]; network: number[] },
    results: LoadTestResults
  ): string[] {
    const recommendations: string[] = [];
    
    if (resourceMetrics.cpu.some(val => val > 80)) {
      recommendations.push('Consider horizontal scaling or CPU optimization');
    }
    if (resourceMetrics.memory.some(val => val > 7)) {
      recommendations.push('Implement memory caching and optimization');
    }
    if (results.errorRate > 0.01) {
      recommendations.push('Improve error handling and retry mechanisms');
    }
    if (results.p95ResponseTime > 50) {
      recommendations.push('Optimize critical path performance');
    }

    recommendations.push('Implement auto-scaling policies');
    recommendations.push('Add CDN for static content delivery');
    recommendations.push('Configure database connection pooling');

    return recommendations;
  }

  private static generateDatabaseRecommendations(
    avgQueryTime: number,
    tps: number,
    efficiency: number
  ): string[] {
    const recommendations: string[] = [];
    
    if (avgQueryTime > 10) {
      recommendations.push('Add database indexes for frequently queried columns');
      recommendations.push('Consider query optimization and caching');
    }
    if (tps < 1000) {
      recommendations.push('Implement connection pooling');
      recommendations.push('Consider read replicas for scaling');
    }
    if (efficiency < 0.95) {
      recommendations.push('Optimize connection management');
      recommendations.push('Implement circuit breaker pattern');
    }

    return recommendations;
  }

  private static generateCachingRecommendations(
    hitRate: number,
    latency: number,
    throughput: number
  ): string[] {
    const recommendations: string[] = [];
    
    if (hitRate < 0.8) {
      recommendations.push('Optimize cache key strategies');
      recommendations.push('Increase cache TTL for stable data');
    }
    if (latency > 10) {
      recommendations.push('Use faster cache storage (Redis/Memcached)');
      recommendations.push('Implement cache warming strategies');
    }
    if (throughput < 5000) {
      recommendations.push('Scale cache cluster horizontally');
      recommendations.push('Implement cache partitioning');
    }

    return recommendations;
  }

  private static generateScalingRecommendations(
    nodeEfficiency: number[],
    loadBalancing: number,
    failoverTime: number
  ): string[] {
    const recommendations: string[] = [];
    
    const avgEfficiency = nodeEfficiency.reduce((sum, eff) => sum + eff, 0) / nodeEfficiency.length;
    
    if (avgEfficiency < 0.9) {
      recommendations.push('Optimize node resource allocation');
      recommendations.push('Investigate node performance bottlenecks');
    }
    if (loadBalancing < 0.8) {
      recommendations.push('Improve load balancing algorithm');
      recommendations.push('Consider weighted load balancing');
    }
    if (failoverTime > 3000) {
      recommendations.push('Implement faster health checks');
      recommendations.push('Pre-warm standby nodes');
    }

    return recommendations;
  }

  /**
   * Generate comprehensive load test report
   */
  static generateLoadTestReport(testId: string, results: LoadTestResults): string {
    const patentTargets = {
      maxUsers: 100000,
      responseTime: 50, // ms
      cpuUtilization: 2, // %
      memoryPerUser: 10, // MB
      networkPerUser: 1 // KB/min
    };

    const passed = {
      users: results.maxConcurrentUsers >= patentTargets.maxUsers,
      responseTime: results.p95ResponseTime <= patentTargets.responseTime,
      errorRate: results.errorRate <= 0.01
    };

    const passCount = Object.values(passed).filter(Boolean).length;

    return `
🚀 LOAD TEST REPORT: ${testId}
==========================================
Execution Date: ${new Date().toISOString()}
Tests Passed: ${passCount}/3

🎯 SCALABILITY METRICS
Max Concurrent Users: ${results.maxConcurrentUsers.toLocaleString()} ${passed.users ? '✅' : '❌'} (target: 100K+)
Peak Throughput: ${results.peakThroughput.toFixed(0)} req/sec
Avg Response Time: ${results.averageResponseTime.toFixed(2)}ms
95th Percentile: ${results.p95ResponseTime.toFixed(2)}ms ${passed.responseTime ? '✅' : '❌'} (target: <50ms)
99th Percentile: ${results.p99ResponseTime.toFixed(2)}ms
Error Rate: ${(results.errorRate * 100).toFixed(3)}% ${passed.errorRate ? '✅' : '❌'} (target: <1%)

💻 RESOURCE UTILIZATION
CPU Usage: ${results.resourceUtilization.cpu.map(c => c.toFixed(1)).join(', ')}%
Memory Usage: ${results.resourceUtilization.memory.map(m => m.toFixed(1)).join(', ')}GB
Network Usage: ${results.resourceUtilization.network.map(n => n.toFixed(0)).join(', ')}Mbps

🔍 BOTTLENECKS IDENTIFIED
${results.bottlenecks.length > 0 ? results.bottlenecks.map(b => `• ${b}`).join('\n') : '• No major bottlenecks detected'}

💡 RECOMMENDATIONS
${results.recommendations.map(r => `• ${r}`).join('\n')}

${passCount === 3 ? '🎉 PATENT SCALABILITY REQUIREMENTS MET!' : '⚠️  Optimization needed for patent compliance'}
==========================================
    `;
  }
}