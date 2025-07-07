-- Create device capabilities table to track what each device can capture
CREATE TABLE public.device_capabilities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  device_fingerprint TEXT NOT NULL,
  device_type TEXT NOT NULL CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
  has_keyboard BOOLEAN NOT NULL DEFAULT false,
  has_mouse BOOLEAN NOT NULL DEFAULT false,
  has_touch BOOLEAN NOT NULL DEFAULT false,
  has_trackpad BOOLEAN NOT NULL DEFAULT false,
  screen_resolution TEXT,
  user_agent TEXT,
  platform TEXT,
  capabilities JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create touch patterns table for mobile/tablet biometrics
CREATE TABLE public.touch_patterns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  biometric_profile_id UUID NOT NULL,
  pattern_type TEXT NOT NULL CHECK (pattern_type IN ('tap', 'swipe', 'pinch', 'rotation', 'scroll')),
  pattern_data JSONB NOT NULL,
  confidence_score INTEGER,
  context TEXT NOT NULL,
  device_fingerprint TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mouse patterns table for desktop biometrics
CREATE TABLE public.mouse_patterns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  biometric_profile_id UUID NOT NULL,
  pattern_type TEXT NOT NULL CHECK (pattern_type IN ('movement', 'click', 'scroll', 'drag')),
  pattern_data JSONB NOT NULL,
  confidence_score INTEGER,
  context TEXT NOT NULL,
  device_fingerprint TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create behavioral patterns table for contextual biometrics
CREATE TABLE public.behavioral_patterns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  biometric_profile_id UUID NOT NULL,
  pattern_type TEXT NOT NULL CHECK (pattern_type IN ('timing', 'location', 'network', 'app_usage')),
  pattern_data JSONB NOT NULL,
  confidence_score INTEGER,
  context TEXT NOT NULL,
  device_fingerprint TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create multi-modal authentication attempts table
CREATE TABLE public.multimodal_auth_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  device_fingerprint TEXT NOT NULL,
  modalities_used TEXT[] NOT NULL,
  individual_scores JSONB NOT NULL,
  combined_confidence INTEGER NOT NULL,
  risk_score INTEGER NOT NULL,
  success BOOLEAN NOT NULL,
  anomaly_details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.device_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.touch_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mouse_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.behavioral_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.multimodal_auth_attempts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for device_capabilities
CREATE POLICY "Users can manage their own device capabilities" 
ON public.device_capabilities 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage device capabilities" 
ON public.device_capabilities 
FOR ALL 
USING (true);

-- Create RLS policies for touch_patterns
CREATE POLICY "Users can view their own touch patterns" 
ON public.touch_patterns 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own touch patterns" 
ON public.touch_patterns 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage touch patterns" 
ON public.touch_patterns 
FOR ALL 
USING (true);

-- Create RLS policies for mouse_patterns
CREATE POLICY "Users can view their own mouse patterns" 
ON public.mouse_patterns 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mouse patterns" 
ON public.mouse_patterns 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage mouse patterns" 
ON public.mouse_patterns 
FOR ALL 
USING (true);

-- Create RLS policies for behavioral_patterns
CREATE POLICY "Users can view their own behavioral patterns" 
ON public.behavioral_patterns 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own behavioral patterns" 
ON public.behavioral_patterns 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage behavioral patterns" 
ON public.behavioral_patterns 
FOR ALL 
USING (true);

-- Create RLS policies for multimodal_auth_attempts
CREATE POLICY "Users can view their own multimodal auth attempts" 
ON public.multimodal_auth_attempts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own multimodal auth attempts" 
ON public.multimodal_auth_attempts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage multimodal auth attempts" 
ON public.multimodal_auth_attempts 
FOR ALL 
USING (true);

-- Create foreign key relationships
ALTER TABLE public.touch_patterns 
ADD CONSTRAINT touch_patterns_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id);

ALTER TABLE public.touch_patterns 
ADD CONSTRAINT touch_patterns_biometric_profile_id_fkey 
FOREIGN KEY (biometric_profile_id) REFERENCES public.biometric_profiles(id);

ALTER TABLE public.mouse_patterns 
ADD CONSTRAINT mouse_patterns_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id);

ALTER TABLE public.mouse_patterns 
ADD CONSTRAINT mouse_patterns_biometric_profile_id_fkey 
FOREIGN KEY (biometric_profile_id) REFERENCES public.biometric_profiles(id);

ALTER TABLE public.behavioral_patterns 
ADD CONSTRAINT behavioral_patterns_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id);

ALTER TABLE public.behavioral_patterns 
ADD CONSTRAINT behavioral_patterns_biometric_profile_id_fkey 
FOREIGN KEY (biometric_profile_id) REFERENCES public.biometric_profiles(id);

ALTER TABLE public.device_capabilities 
ADD CONSTRAINT device_capabilities_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id);

ALTER TABLE public.multimodal_auth_attempts 
ADD CONSTRAINT multimodal_auth_attempts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_device_capabilities_updated_at
BEFORE UPDATE ON public.device_capabilities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_device_capabilities_fingerprint ON public.device_capabilities(device_fingerprint);
CREATE INDEX idx_touch_patterns_user_type ON public.touch_patterns(user_id, pattern_type);
CREATE INDEX idx_mouse_patterns_user_type ON public.mouse_patterns(user_id, pattern_type);
CREATE INDEX idx_behavioral_patterns_user_type ON public.behavioral_patterns(user_id, pattern_type);
CREATE INDEX idx_multimodal_auth_attempts_user_device ON public.multimodal_auth_attempts(user_id, device_fingerprint);