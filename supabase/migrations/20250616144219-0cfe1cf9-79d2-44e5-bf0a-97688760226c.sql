
-- Add missing columns to api_keys table for rate limiting
ALTER TABLE public.api_keys ADD COLUMN IF NOT EXISTS rate_limit INTEGER DEFAULT 1000;

-- Create table for admin settings if it doesn't exist
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  setting_key TEXT NOT NULL,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, setting_key)
);

-- Enable RLS for admin_settings
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin_settings
CREATE POLICY "Users can manage their own admin settings" ON public.admin_settings
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for white_label_configs if not exists
DROP POLICY IF EXISTS "Users can manage their own white label configs" ON public.white_label_configs;
CREATE POLICY "Users can manage their own white label configs" ON public.white_label_configs
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for api_keys if not exists  
DROP POLICY IF EXISTS "Users can manage their own API keys" ON public.api_keys;
CREATE POLICY "Users can manage their own API keys" ON public.api_keys
  FOR ALL USING (auth.uid() = user_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at if they don't exist
DROP TRIGGER IF EXISTS update_admin_settings_updated_at ON public.admin_settings;
CREATE TRIGGER update_admin_settings_updated_at 
    BEFORE UPDATE ON public.admin_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_white_label_configs_updated_at ON public.white_label_configs;
CREATE TRIGGER update_white_label_configs_updated_at 
    BEFORE UPDATE ON public.white_label_configs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
