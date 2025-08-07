-- Performance Optimization Indexes for Biometric Authentication System
-- Critical indexes for production scalability and <50ms response times

-- Biometric Profiles Table Indexes
CREATE INDEX IF NOT EXISTS idx_biometric_profiles_user_id_status 
ON biometric_profiles(user_id, status) WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_biometric_profiles_confidence_score 
ON biometric_profiles(confidence_score DESC) WHERE confidence_score > 70;

CREATE INDEX IF NOT EXISTS idx_biometric_profiles_updated_at 
ON biometric_profiles(updated_at DESC);

-- Keystroke Patterns Table Indexes (Most Critical for Performance)
CREATE INDEX IF NOT EXISTS idx_keystroke_patterns_user_biometric_profile 
ON keystroke_patterns(user_id, biometric_profile_id);

CREATE INDEX IF NOT EXISTS idx_keystroke_patterns_created_at 
ON keystroke_patterns(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_keystroke_patterns_confidence_context 
ON keystroke_patterns(confidence_score DESC, context) WHERE confidence_score > 50;

-- Partial index for recent patterns (last 30 days)
CREATE INDEX IF NOT EXISTS idx_keystroke_patterns_recent 
ON keystroke_patterns(user_id, created_at DESC) 
WHERE created_at > NOW() - INTERVAL '30 days';

-- Authentication Attempts Table Indexes
CREATE INDEX IF NOT EXISTS idx_auth_attempts_user_success_time 
ON authentication_attempts(user_id, success, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_auth_attempts_ip_time 
ON authentication_attempts(ip_address, created_at DESC) 
WHERE created_at > NOW() - INTERVAL '24 hours';

CREATE INDEX IF NOT EXISTS idx_auth_attempts_pattern_id 
ON authentication_attempts(pattern_id) WHERE pattern_id IS NOT NULL;

-- Security Settings Indexes
CREATE INDEX IF NOT EXISTS idx_security_settings_user_level 
ON security_settings(user_id, security_level);

-- Subscriptions and Plans Indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status 
ON subscriptions(user_id, status) WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_subscription_plans_tier_active 
ON subscription_plans(tier, active) WHERE active = true;

-- Multi-Modal Authentication Indexes
CREATE INDEX IF NOT EXISTS idx_multimodal_auth_user_device 
ON multimodal_auth_attempts(user_id, device_fingerprint);

CREATE INDEX IF NOT EXISTS idx_multimodal_auth_success_time 
ON multimodal_auth_attempts(success, created_at DESC);

-- Touch and Mouse Patterns Indexes
CREATE INDEX IF NOT EXISTS idx_touch_patterns_user_device 
ON touch_patterns(user_id, device_fingerprint);

CREATE INDEX IF NOT EXISTS idx_mouse_patterns_user_device 
ON mouse_patterns(user_id, device_fingerprint);

-- Behavioral Patterns Indexes
CREATE INDEX IF NOT EXISTS idx_behavioral_patterns_user_type 
ON behavioral_patterns(user_id, pattern_type);

-- Performance Monitoring Function
CREATE OR REPLACE FUNCTION public.get_performance_stats()
RETURNS TABLE(
  table_name text,
  total_size text,
  index_size text,
  table_rows bigint
) 
LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    schemaname||'.'||tablename as table_name,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
    pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) as index_size,
    (SELECT n_tup_ins + n_tup_upd + n_tup_del FROM pg_stat_user_tables 
     WHERE schemaname||'.'||tablename = relid::regclass::text LIMIT 1) as table_rows
  FROM pg_tables 
  WHERE schemaname = 'public'
  ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
END;
$function$;

-- Query Performance Analysis Function
CREATE OR REPLACE FUNCTION public.analyze_slow_queries()
RETURNS TABLE(
  query_type text,
  avg_time numeric,
  calls bigint,
  total_time numeric
) 
LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    CASE 
      WHEN query ILIKE '%biometric_profiles%' THEN 'biometric_lookup'
      WHEN query ILIKE '%keystroke_patterns%' THEN 'keystroke_analysis'
      WHEN query ILIKE '%authentication_attempts%' THEN 'auth_verification'
      ELSE 'other'
    END as query_type,
    ROUND(mean_exec_time::numeric, 2) as avg_time,
    calls,
    ROUND(total_exec_time::numeric, 2) as total_time
  FROM pg_stat_statements 
  WHERE mean_exec_time > 50 -- Focus on queries > 50ms
  ORDER BY mean_exec_time DESC
  LIMIT 20;
END;
$function$;