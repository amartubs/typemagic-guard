
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

interface SecurityMetrics {
  recentFailedAttempts: number;
  averageConfidence: number;
  anomalyCount: number;
  lastSuccessfulLogin: string | null;
}

export const useSecurityMonitoring = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    recentFailedAttempts: 0,
    averageConfidence: 0,
    anomalyCount: 0,
    lastSuccessfulLogin: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchSecurityMetrics = async () => {
      try {
        // Get recent authentication attempts (last 24 hours)
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        
        const { data: attempts } = await supabase
          .from('authentication_attempts')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', twentyFourHoursAgo)
          .order('created_at', { ascending: false });

        if (attempts) {
          const failedAttempts = attempts.filter(a => !a.success).length;
          const successfulAttempts = attempts.filter(a => a.success);
          
          const avgConfidence = successfulAttempts.length > 0
            ? successfulAttempts.reduce((sum, a) => sum + (a.confidence_score || 0), 0) / successfulAttempts.length
            : 0;

          const anomalies = attempts.filter(a => a.anomaly_details).length;
          const lastSuccess = successfulAttempts[0]?.created_at || null;

          setMetrics({
            recentFailedAttempts: failedAttempts,
            averageConfidence: Math.round(avgConfidence),
            anomalyCount: anomalies,
            lastSuccessfulLogin: lastSuccess
          });
        }
      } catch (error) {
        console.error('Error fetching security metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSecurityMetrics();

    // Set up real-time subscription for new authentication attempts
    const channel = supabase
      .channel('security-monitoring')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'authentication_attempts',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchSecurityMetrics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { metrics, loading };
};
