import { useState, useCallback } from 'react';
import { LoadTester, LoadTestResults, LoadTestConfig } from '@/lib/scalability/LoadTester';

export interface LoadTestStatus {
  isRunning: boolean;
  testId: string | null;
  startTime: number | null;
  progress: number;
  currentPhase: 'idle' | 'ramp-up' | 'sustained' | 'spike' | 'analysis';
}

export const useLoadTesting = () => {
  const [status, setStatus] = useState<LoadTestStatus>({
    isRunning: false,
    testId: null,
    startTime: null,
    progress: 0,
    currentPhase: 'idle'
  });

  const [results, setResults] = useState<LoadTestResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runLoadTest = useCallback(async (config?: Partial<LoadTestConfig>) => {
    const testId = `load-test-${Date.now()}`;
    
    setStatus({
      isRunning: true,
      testId,
      startTime: Date.now(),
      progress: 0,
      currentPhase: 'ramp-up'
    });
    
    setError(null);
    setResults(null);

    try {
      console.log('🚀 Starting comprehensive load test for 100K+ users...');
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setStatus(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 5, 90)
        }));
      }, 2000);

      // Phase updates
      setTimeout(() => setStatus(prev => ({ ...prev, currentPhase: 'sustained' })), 5000);
      setTimeout(() => setStatus(prev => ({ ...prev, currentPhase: 'spike' })), 15000);
      setTimeout(() => setStatus(prev => ({ ...prev, currentPhase: 'analysis' })), 25000);

      const testResults = await LoadTester.runLoadTest(testId, {
        maxUsers: 100000,
        rampUpTime: 300,
        testDuration: 1800,
        targetThroughput: 10000,
        ...config
      });

      clearInterval(progressInterval);
      
      setResults(testResults);
      setStatus({
        isRunning: false,
        testId,
        startTime: null,
        progress: 100,
        currentPhase: 'idle'
      });

      console.log('✅ Load test completed successfully');
      
      return testResults;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Load test failed';
      setError(errorMessage);
      setStatus({
        isRunning: false,
        testId: null,
        startTime: null,
        progress: 0,
        currentPhase: 'idle'
      });
      
      console.error('❌ Load test failed:', errorMessage);
      throw err;
    }
  }, []);

  const testDatabaseScalability = useCallback(async () => {
    try {
      console.log('🗄️ Testing database scalability...');
      const dbResults = await LoadTester.testDatabaseScalability(1000, 10000);
      return dbResults;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Database test failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const testCachingPerformance = useCallback(async () => {
    try {
      console.log('🚀 Testing caching performance...');
      const cacheResults = await LoadTester.testCachingPerformance();
      return cacheResults;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Cache test failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const testHorizontalScaling = useCallback(async () => {
    try {
      console.log('🔗 Testing horizontal scaling...');
      const scalingResults = await LoadTester.testHorizontalScaling(5, 20000);
      return scalingResults;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Scaling test failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const generateReport = useCallback(() => {
    if (!results) return null;
    
    return LoadTester.generateLoadTestReport(status.testId || 'unknown', results);
  }, [results, status.testId]);

  return {
    status,
    results,
    error,
    runLoadTest,
    testDatabaseScalability,
    testCachingPerformance,
    testHorizontalScaling,
    generateReport
  };
};