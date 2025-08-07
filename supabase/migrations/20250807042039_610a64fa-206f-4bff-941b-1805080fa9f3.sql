-- Performance Optimization Indexes for Biometric Authentication System
-- Critical indexes for production scalability and <50ms response times

-- Biometric Profiles Table Indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_biometric_profiles_user_id_status 
ON biometric_profiles(user_id, status) WHERE status = 'active';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_biometric_profiles_confidence_score 
ON biometric_profiles(confidence_score DESC) WHERE confidence_score > 70;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_biometric_profiles_updated_at 
ON biometric_profiles(updated_at DESC);

-- Keystroke Patterns Table Indexes (Most Critical for Performance)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_keystroke_patterns_user_biometric_profile 
ON keystroke_patterns(user_id, biometric_profile_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_keystroke_patterns_created_at 
ON keystroke_patterns(created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_keystroke_patterns_confidence_context 
ON keystroke_patterns(confidence_score DESC, context) WHERE confidence_score > 50;

-- Partial index for recent patterns (last 30 days)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_keystroke_patterns_recent 
ON keystroke_patterns(user_id, created_at DESC) 
WHERE created_at > NOW() - INTERVAL '30 days';

-- Authentication Attempts Table Indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_auth_attempts_user_success_time 
ON authentication_attempts(user_id, success, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_auth_attempts_ip_time 
ON authentication_attempts(ip_address, created_at DESC) 
WHERE created_at > NOW() - INTERVAL '24 hours';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_auth_attempts_pattern_id 
ON authentication_attempts(pattern_id) WHERE pattern_id IS NOT NULL;

-- Security Settings Indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_security_settings_user_level 
ON security_settings(user_id, security_level);

-- Subscriptions and Plans Indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscriptions_user_status 
ON subscriptions(user_id, status) WHERE status = 'active';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscription_plans_tier_active 
ON subscription_plans(tier, active) WHERE active = true;

-- Multi-Modal Authentication Indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_multimodal_auth_user_device 
ON multimodal_auth_attempts(user_id, device_fingerprint);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_multimodal_auth_success_time 
ON multimodal_auth_attempts(success, created_at DESC);

-- Touch and Mouse Patterns Indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_touch_patterns_user_device 
ON touch_patterns(user_id, device_fingerprint);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_mouse_patterns_user_device 
ON mouse_patterns(user_id, device_fingerprint);

-- Behavioral Patterns Indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_behavioral_patterns_user_type 
ON behavioral_patterns(user_id, pattern_type);

-- Database Statistics Update for Query Planner
ANALYZE biometric_profiles;
ANALYZE keystroke_patterns;
ANALYZE authentication_attempts;
ANALYZE security_settings;
ANALYZE subscriptions;
ANALYZE multimodal_auth_attempts;

-- Performance Monitoring Function
CREATE OR REPLACE FUNCTION public.get_performance_stats()
RETURNS TABLE(
  table_name text,
  total_size text,
  index_size text,
  avg_query_time numeric
) 
LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    schemaname||'.'||tablename as table_name,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
    pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) as index_size,
    COALESCE(
      (SELECT mean_exec_time FROM pg_stat_statements 
       WHERE query LIKE '%' || tablename || '%' 
       LIMIT 1), 0
    ) as avg_query_time
  FROM pg_tables 
  WHERE schemaname = 'public'
  ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
END;
$function$;

-- Connection Pooling Configuration Function
CREATE OR REPLACE FUNCTION public.optimize_connection_settings()
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Optimize for high-concurrency biometric authentication
  PERFORM set_config('max_connections', '200', false);
  PERFORM set_config('shared_buffers', '256MB', false);
  PERFORM set_config('effective_cache_size', '1GB', false);
  PERFORM set_config('work_mem', '4MB', false);
  PERFORM set_config('maintenance_work_mem', '64MB', false);
  PERFORM set_config('checkpoint_completion_target', '0.7', false);
  PERFORM set_config('wal_buffers', '16MB', false);
  PERFORM set_config('default_statistics_target', '100', false);
  
  -- Biometric-specific optimizations
  PERFORM set_config('random_page_cost', '1.1', false); -- SSD optimized
  PERFORM set_config('cpu_tuple_cost', '0.01', false);
  PERFORM set_config('cpu_index_tuple_cost', '0.005', false);
  
  RAISE NOTICE 'Database optimized for biometric authentication workload';
END;
$function$;