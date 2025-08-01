-- Create compliance configuration table
CREATE TABLE public.compliance_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  industry TEXT NOT NULL CHECK (industry IN ('financial', 'healthcare', 'legal', 'government', 'education', 'general')),
  standards TEXT[] NOT NULL DEFAULT '{}',
  data_retention_days INTEGER NOT NULL DEFAULT 1095,
  audit_level TEXT NOT NULL DEFAULT 'enhanced' CHECK (audit_level IN ('basic', 'enhanced', 'forensic')),
  encryption_required BOOLEAN NOT NULL DEFAULT false,
  anonymization_required BOOLEAN NOT NULL DEFAULT false,
  legal_hold_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create legal-grade audit logs table
CREATE TABLE public.legal_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB DEFAULT '{}',
  compliance_standards TEXT[] NOT NULL DEFAULT '{}',
  legal_significance TEXT NOT NULL CHECK (legal_significance IN ('low', 'medium', 'high', 'critical')),
  hash_chain_previous TEXT,
  cryptographic_signature TEXT,
  tamper_evidence JSONB,
  retention_required_until TIMESTAMP WITH TIME ZONE,
  legal_hold BOOLEAN DEFAULT false,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create session monitoring table
CREATE TABLE public.session_monitoring (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id UUID,
  behavioral_data JSONB NOT NULL DEFAULT '{}',
  trust_score INTEGER,
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  deviations JSONB DEFAULT '[]',
  context_sensitivity TEXT DEFAULT 'medium' CHECK (context_sensitivity IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.compliance_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_monitoring ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for compliance_configs
CREATE POLICY "Users can view their own compliance config" 
ON public.compliance_configs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own compliance config" 
ON public.compliance_configs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own compliance config" 
ON public.compliance_configs 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for legal_audit_logs
CREATE POLICY "Users can view their own legal audit logs" 
ON public.legal_audit_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert legal audit logs" 
ON public.legal_audit_logs 
FOR INSERT 
WITH CHECK (true);

-- Create RLS policies for session_monitoring
CREATE POLICY "Users can view their own session monitoring data" 
ON public.session_monitoring 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own session monitoring data" 
ON public.session_monitoring 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own session monitoring data" 
ON public.session_monitoring 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_compliance_configs_user_id ON public.compliance_configs(user_id);
CREATE INDEX idx_legal_audit_logs_user_id ON public.legal_audit_logs(user_id);
CREATE INDEX idx_legal_audit_logs_created_at ON public.legal_audit_logs(created_at);
CREATE INDEX idx_legal_audit_logs_compliance_standards ON public.legal_audit_logs USING GIN(compliance_standards);
CREATE INDEX idx_session_monitoring_user_id ON public.session_monitoring(user_id);
CREATE INDEX idx_session_monitoring_created_at ON public.session_monitoring(created_at);

-- Create trigger for updated_at timestamps
CREATE TRIGGER update_compliance_configs_updated_at
  BEFORE UPDATE ON public.compliance_configs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_session_monitoring_updated_at
  BEFORE UPDATE ON public.session_monitoring
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();