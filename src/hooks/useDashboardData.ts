
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export interface DashboardMetrics {
  securityScore: number;
  activeSessions: number;
  authenticationsToday: number;
  threatLevel: 'low' | 'medium' | 'high';
  avgResponseTime: number;
  systemUptime: number;
  fraudDetections: number;
  confidenceScore: number;
}

export const useDashboardData = () => {
  const { user } = useAuth();

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['dashboard-metrics', user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Fetch biometric profile
      const { data: biometricProfile } = await supabase
        .from('biometric_profiles')
        .select('confidence_score, status')
        .eq('user_id', user.id)
        .single();

      // Fetch recent authentication attempts
      const { data: authAttempts } = await supabase
        .from('authentication_attempts')
        .select('success, created_at, confidence_score')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      // Fetch security settings
      const { data: securitySettings } = await supabase
        .from('security_settings')
        .select('min_confidence_threshold, security_level')
        .eq('user_id', user.id)
        .single();

      // Calculate metrics
      const totalAttempts = authAttempts?.length || 0;
      const successfulAttempts = authAttempts?.filter(a => a.success).length || 0;
      const failedAttempts = totalAttempts - successfulAttempts;
      
      const securityScore = biometricProfile?.confidence_score || 0;
      const avgConfidence = authAttempts?.length ? 
        authAttempts.reduce((sum, a) => sum + (a.confidence_score || 0), 0) / authAttempts.length : 0;

      const threatLevel = failedAttempts > 3 ? 'high' : failedAttempts > 1 ? 'medium' : 'low';

      return {
        securityScore: Math.min(100, securityScore + (successfulAttempts * 2)),
        activeSessions: 1, // Current session
        authenticationsToday: totalAttempts,
        threatLevel,
        avgResponseTime: 145 + Math.random() * 50, // Simulated with some variance
        systemUptime: 99.8,
        fraudDetections: failedAttempts,
        confidenceScore: avgConfidence
      } as DashboardMetrics;
    },
    enabled: !!user,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['recent-activity', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data } = await supabase
        .from('authentication_attempts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      return data || [];
    },
    enabled: !!user
  });

  return {
    metrics,
    recentActivity,
    loading: metricsLoading
  };
};
