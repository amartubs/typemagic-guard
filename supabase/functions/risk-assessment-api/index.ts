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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) {
      throw new Error('Unauthorized')
    }

    const url = new URL(req.url)

    if (req.method === 'GET') {
      const assessmentType = url.searchParams.get('type')
      const limit = parseInt(url.searchParams.get('limit') || '50')

      // Get risk assessments
      let query = supabaseClient
        .from('risk_assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (assessmentType) {
        query = query.eq('assessment_type', assessmentType)
      }

      const { data, error } = await query

      if (error) throw error

      return new Response(
        JSON.stringify({ data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    if (req.method === 'POST') {
      const body = await req.json()
      
      // Calculate risk score based on factors
      const riskScore = calculateRiskScore(body.riskFactors)
      
      // Create risk assessment
      const { data, error } = await supabaseClient
        .from('risk_assessments')
        .insert([{
          user_id: user.id,
          assessment_type: body.type,
          risk_score: riskScore,
          risk_factors: body.riskFactors,
          mitigation_recommendations: generateMitigationRecommendations(body.riskFactors),
          assessor_type: body.assessorType || 'automated',
          assessment_context: body.context || {},
          valid_until: new Date(Date.now() + (24 * 60 * 60 * 1000)) // 24 hours
        }])
        .select()

      if (error) throw error

      return new Response(
        JSON.stringify({ data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})

function calculateRiskScore(riskFactors: any[]): number {
  if (!riskFactors || riskFactors.length === 0) return 0

  let totalScore = 0
  for (const factor of riskFactors) {
    const weight = factor.weight || 1
    const severity = factor.severity || 1
    totalScore += (severity * weight)
  }

  return Math.min(100, Math.max(0, totalScore))
}

function generateMitigationRecommendations(riskFactors: any[]): any[] {
  const recommendations = []

  for (const factor of riskFactors) {
    switch (factor.type) {
      case 'behavioral_anomaly':
        recommendations.push({
          type: 'authentication',
          priority: 'high',
          action: 'Require additional authentication factors',
          description: 'User behavior deviates from baseline patterns'
        })
        break
      case 'location_anomaly':
        recommendations.push({
          type: 'geolocation',
          priority: 'medium',
          action: 'Verify location through secondary means',
          description: 'Login from unusual geographic location'
        })
        break
      case 'device_anomaly':
        recommendations.push({
          type: 'device_verification',
          priority: 'high',
          action: 'Require device registration and verification',
          description: 'Unknown or suspicious device detected'
        })
        break
      default:
        recommendations.push({
          type: 'general',
          priority: 'medium',
          action: 'Monitor user activity closely',
          description: 'General risk factor detected'
        })
    }
  }

  return recommendations
}