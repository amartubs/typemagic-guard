
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';

export const useAnalyticsData = (timeRange: '7d' | '30d' | '90d' = '30d') => {
  const { user } = useAuth();

  const getDaysBack = () => {
    switch (timeRange) {
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      default: return 30;
    }
  };

  const { data: authTrends, isLoading: trendsLoading } = useQuery({
    queryKey: ['auth-trends', user?.id, timeRange],
    queryFn: async () => {
      if (!user) return [];

      const daysBack = getDaysBack();
      const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

      const { data } = await supabase
        .from('authentication_attempts')
        .select('success, created_at, confidence_score, anomaly_details')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (!data) return [];

      // Group by date
      const dateGroups: Record<string, any[]> = {};
      data.forEach(attempt => {
        const date = new Date(attempt.created_at).toISOString().split('T')[0];
        if (!dateGroups[date]) dateGroups[date] = [];
        dateGroups[date].push(attempt);
      });

      return Object.entries(dateGroups).map(([date, attempts]) => ({
        date,
        successful: attempts.filter(a => a.success).length,
        failed: attempts.filter(a => !a.success).length,
        suspicious: attempts.filter(a => a.anomaly_details && Object.keys(a.anomaly_details).length > 0).length,
        avgConfidence: attempts.length ? 
          Math.round(attempts.reduce((sum, a) => sum + (a.confidence_score || 0), 0) / attempts.length) : 0
      }));
    },
    enabled: !!user
  });

  const { data: userBehavior, isLoading: behaviorLoading } = useQuery({
    queryKey: ['user-behavior', user?.id, timeRange],
    queryFn: async () => {
      if (!user) return null;

      const daysBack = getDaysBack();
      const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

      // Fetch usage analytics
      const { data: analytics } = await supabase
        .from('usage_analytics')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString());

      // Fetch authentication attempts for device analysis
      const { data: authAttempts } = await supabase
        .from('authentication_attempts')
        .select('user_agent, ip_address, created_at')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString());

      // Process device types from user agents with proper typing
      const deviceTypes = authAttempts?.reduce((acc: Record<string, number>, attempt) => {
        const userAgent = attempt.user_agent || 'Unknown';
        let deviceName = 'Unknown Device';
        
        if (userAgent.includes('Chrome')) deviceName = 'Desktop - Chrome';
        else if (userAgent.includes('Firefox')) deviceName = 'Desktop - Firefox';
        else if (userAgent.includes('Safari') && userAgent.includes('Mobile')) deviceName = 'Mobile - Safari';
        else if (userAgent.includes('Chrome') && userAgent.includes('Mobile')) deviceName = 'Mobile - Chrome';
        
        acc[deviceName] = (acc[deviceName] || 0) + 1;
        return acc;
      }, {}) || {};

      // Convert to chart format with proper risk typing
      const deviceData = Object.entries(deviceTypes).map(([name, value]) => ({
        name,
        value,
        risk: (value < 5 ? 'high' : value < 20 ? 'medium' : 'low') as 'low' | 'medium' | 'high'
      }));

      // Process login patterns by hour
      const hourlyLogins = authAttempts?.reduce((acc: Record<number, number>, attempt) => {
        const hour = new Date(attempt.created_at).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {}) || {};

      const loginPatterns = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        logins: hourlyLogins[hour] || 0
      }));

      return {
        deviceTypes: deviceData,
        loginPatterns,
        keystrokePatterns: {
          avgTypingSpeed: 67, // Would need keystroke analysis
          consistencyScore: 84,
          uniquePatterns: Object.keys(deviceTypes).length
        }
      };
    },
    enabled: !!user
  });

  return {
    authTrends,
    userBehavior,
    loading: trendsLoading || behaviorLoading
  };
};
