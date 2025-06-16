
-- Add missing subscription columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trial',
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ;

-- Update security_level enum to include 'very-high' if it doesn't exist
DO $$ BEGIN
    CREATE TYPE security_level AS ENUM ('low', 'medium', 'high', 'very-high');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Recreate the security_settings table with the correct enum
DROP TABLE IF EXISTS public.security_settings CASCADE;
CREATE TABLE public.security_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  min_confidence_threshold INTEGER NOT NULL DEFAULT 65,
  learning_period INTEGER NOT NULL DEFAULT 5,
  anomaly_detection_sensitivity INTEGER NOT NULL DEFAULT 70,
  max_failed_attempts INTEGER NOT NULL DEFAULT 5,
  security_level security_level NOT NULL DEFAULT 'medium',
  enforce_two_factor BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS and create policies
ALTER TABLE public.security_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own security settings" ON public.security_settings
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own security settings" ON public.security_settings
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own security settings" ON public.security_settings
FOR INSERT WITH CHECK (auth.uid() = user_id);
