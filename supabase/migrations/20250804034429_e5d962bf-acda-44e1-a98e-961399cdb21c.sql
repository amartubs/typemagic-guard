-- Industry-specific compliance tables
CREATE TABLE public.industry_compliance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  industry TEXT NOT NULL,
  compliance_standard TEXT NOT NULL,
  compliance_data JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending',
  last_assessment_date TIMESTAMP WITH TIME ZONE,
  next_assessment_due TIMESTAMP WITH TIME ZONE,
  assessor_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhanced audit log schema with legal fields (extending existing legal_audit_logs)
ALTER TABLE public.legal_audit_logs 
ADD COLUMN IF NOT EXISTS jurisdiction TEXT,
ADD COLUMN IF NOT EXISTS regulatory_framework TEXT,
ADD COLUMN IF NOT EXISTS data_classification TEXT,
ADD COLUMN IF NOT EXISTS witness_accounts JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS chain_of_custody JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS evidence_integrity_hash TEXT;

-- Behavioral pattern storage for long-term analysis
CREATE TABLE public.behavioral_analysis_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_end TIMESTAMP WITH TIME ZONE,
  baseline_patterns JSONB NOT NULL DEFAULT '{}',
  deviation_metrics JSONB NOT NULL DEFAULT '{}',
  anomaly_score NUMERIC(5,2) DEFAULT 0.0,
  risk_factors JSONB DEFAULT '[]',
  ml_model_version TEXT,
  analysis_confidence NUMERIC(5,2) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Risk assessment history tables
CREATE TABLE public.risk_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  assessment_type TEXT NOT NULL,
  risk_score NUMERIC(5,2) NOT NULL,
  risk_factors JSONB NOT NULL DEFAULT '[]',
  mitigation_recommendations JSONB DEFAULT '[]',
  assessor_type TEXT NOT NULL DEFAULT 'automated',
  assessment_context JSONB DEFAULT '{}',
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.fraud_prediction_models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_name TEXT NOT NULL,
  model_version TEXT NOT NULL,
  industry TEXT NOT NULL,
  model_parameters JSONB NOT NULL,
  training_data_hash TEXT,
  accuracy_metrics JSONB DEFAULT '{}',
  last_trained TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.industry_compliance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.behavioral_analysis_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_prediction_models ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own compliance records" 
ON public.industry_compliance_records 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own compliance records" 
ON public.industry_compliance_records 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own compliance records" 
ON public.industry_compliance_records 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own behavioral analysis" 
ON public.behavioral_analysis_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage behavioral analysis" 
ON public.behavioral_analysis_sessions 
FOR ALL 
USING (true);

CREATE POLICY "Users can view their own risk assessments" 
ON public.risk_assessments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage risk assessments" 
ON public.risk_assessments 
FOR ALL 
USING (true);

CREATE POLICY "Service role can manage fraud models" 
ON public.fraud_prediction_models 
FOR ALL 
USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_industry_compliance_records_updated_at
BEFORE UPDATE ON public.industry_compliance_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_risk_assessments_updated_at
BEFORE UPDATE ON public.risk_assessments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();