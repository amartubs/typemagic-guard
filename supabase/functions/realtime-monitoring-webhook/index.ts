import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const body = await req.json()
    const { type, payload } = body

    console.log('Webhook received:', { type, payload })

    switch (type) {
      case 'high_risk_authentication':
        await handleHighRiskAuthentication(payload, supabaseClient)
        break
      
      case 'behavioral_anomaly_detected':
        await handleBehavioralAnomaly(payload, supabaseClient)
        break
      
      case 'compliance_violation':
        await handleComplianceViolation(payload, supabaseClient)
        break
      
      case 'fraud_prediction_alert':
        await handleFraudPredictionAlert(payload, supabaseClient)
        break
      
      default:
        console.log('Unknown webhook type:', type)
    }

    // Trigger real-time notifications to relevant webhooks
    await triggerWebhookNotifications(type, payload, supabaseClient)

    return new Response(
      JSON.stringify({ success: true, message: `Processed ${type} webhook` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Webhook processing error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function handleHighRiskAuthentication(payload: any, supabaseClient: any) {
  // Log high-risk authentication attempt
  await supabaseClient
    .from('legal_audit_logs')
    .insert([{
      user_id: payload.userId,
      action: 'high_risk_authentication',
      resource_type: 'authentication',
      legal_significance: 'high',
      details: payload,
      compliance_standards: ['ISO27001', 'SOC2'],
      ip_address: payload.ipAddress,
      user_agent: payload.userAgent
    }])

  // Create risk assessment
  await supabaseClient
    .from('risk_assessments')
    .insert([{
      user_id: payload.userId,
      assessment_type: 'authentication_risk',
      risk_score: payload.riskScore,
      risk_factors: payload.riskFactors,
      assessor_type: 'automated',
      assessment_context: payload
    }])
}

async function handleBehavioralAnomaly(payload: any, supabaseClient: any) {
  // Create behavioral analysis session
  await supabaseClient
    .from('behavioral_analysis_sessions')
    .insert([{
      user_id: payload.userId,
      baseline_patterns: payload.baselinePatterns,
      deviation_metrics: payload.deviations,
      anomaly_score: payload.anomalyScore,
      risk_factors: payload.riskFactors,
      analysis_confidence: payload.confidence
    }])

  // Log the anomaly
  await supabaseClient
    .from('audit_logs')
    .insert([{
      user_id: payload.userId,
      action: 'behavioral_anomaly_detected',
      resource_type: 'behavioral_analysis',
      details: payload
    }])
}

async function handleComplianceViolation(payload: any, supabaseClient: any) {
  // Update compliance record
  await supabaseClient
    .from('industry_compliance_records')
    .update({
      status: 'violation_detected',
      compliance_data: {
        ...payload.complianceData,
        violation: payload.violation,
        detected_at: new Date().toISOString()
      }
    })
    .eq('user_id', payload.userId)
    .eq('compliance_standard', payload.standard)

  // Create legal audit log
  await supabaseClient
    .from('legal_audit_logs')
    .insert([{
      user_id: payload.userId,
      action: 'compliance_violation',
      resource_type: 'compliance',
      legal_significance: 'critical',
      details: payload,
      compliance_standards: [payload.standard],
      legal_hold: true
    }])
}

async function handleFraudPredictionAlert(payload: any, supabaseClient: any) {
  // Create high-priority risk assessment
  await supabaseClient
    .from('risk_assessments')
    .insert([{
      user_id: payload.userId,
      assessment_type: 'fraud_prediction',
      risk_score: payload.fraudScore,
      risk_factors: payload.indicators,
      assessor_type: 'ml_model',
      assessment_context: payload
    }])

  // Log the fraud alert
  await supabaseClient
    .from('legal_audit_logs')
    .insert([{
      user_id: payload.userId,
      action: 'fraud_alert',
      resource_type: 'fraud_detection',
      legal_significance: 'critical',
      details: payload,
      compliance_standards: ['PCI-DSS', 'SOX'],
      tamper_evidence: {
        model_version: payload.modelVersion,
        prediction_timestamp: payload.timestamp,
        data_hash: payload.dataHash
      }
    }])
}

async function triggerWebhookNotifications(type: string, payload: any, supabaseClient: any) {
  // Get active webhook configurations for the user
  const { data: webhooks } = await supabaseClient
    .from('webhook_configs')
    .select('*')
    .eq('user_id', payload.userId)
    .eq('is_active', true)
    .contains('events', [type])

  // Send notifications to configured webhooks
  for (const webhook of webhooks || []) {
    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': await generateWebhookSignature(payload, webhook.secret)
        },
        body: JSON.stringify({
          type,
          payload,
          timestamp: new Date().toISOString(),
          webhook_id: webhook.id
        })
      })

      // Update webhook stats
      if (response.ok) {
        await supabaseClient
          .from('webhook_configs')
          .update({
            success_count: webhook.success_count + 1,
            last_triggered: new Date().toISOString()
          })
          .eq('id', webhook.id)
      } else {
        await supabaseClient
          .from('webhook_configs')
          .update({
            failure_count: webhook.failure_count + 1
          })
          .eq('id', webhook.id)
      }
    } catch (error) {
      console.error(`Webhook ${webhook.id} failed:`, error)
    }
  }
}

async function generateWebhookSignature(payload: any, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(JSON.stringify(payload))
  const key = encoder.encode(secret)
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, data)
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}