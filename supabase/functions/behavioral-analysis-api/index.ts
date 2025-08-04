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

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) {
      throw new Error('Unauthorized')
    }

    const url = new URL(req.url)

    if (req.method === 'GET') {
      // Get behavioral analysis sessions
      const { data, error } = await supabaseClient
        .from('behavioral_analysis_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      return new Response(
        JSON.stringify({ data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    if (req.method === 'POST') {
      const body = await req.json()
      
      // Analyze behavioral patterns
      const analysis = await analyzeBehavioralPatterns(
        body.currentPatterns,
        body.baselinePatterns,
        supabaseClient,
        user.id
      )
      
      // Store analysis session
      const { data, error } = await supabaseClient
        .from('behavioral_analysis_sessions')
        .insert([{
          user_id: user.id,
          session_start: new Date().toISOString(),
          baseline_patterns: body.baselinePatterns,
          deviation_metrics: analysis.deviations,
          anomaly_score: analysis.anomalyScore,
          risk_factors: analysis.riskFactors,
          ml_model_version: '1.0.0',
          analysis_confidence: analysis.confidence
        }])
        .select()

      if (error) throw error

      return new Response(
        JSON.stringify({ 
          data,
          analysis: {
            anomalyScore: analysis.anomalyScore,
            riskLevel: getRiskLevel(analysis.anomalyScore),
            recommendations: analysis.recommendations
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    if (req.method === 'PUT') {
      const sessionId = url.searchParams.get('sessionId')
      if (!sessionId) {
        throw new Error('Session ID required')
      }

      // End session
      const { data, error } = await supabaseClient
        .from('behavioral_analysis_sessions')
        .update({
          session_end: new Date().toISOString()
        })
        .eq('id', sessionId)
        .eq('user_id', user.id)
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

async function analyzeBehavioralPatterns(
  currentPatterns: any,
  baselinePatterns: any,
  supabaseClient: any,
  userId: string
) {
  // Simple behavioral analysis algorithm
  let anomalyScore = 0
  const deviations: any = {}
  const riskFactors: any[] = []

  // Analyze typing speed deviation
  if (currentPatterns.typingSpeed && baselinePatterns.averageTypingSpeed) {
    const speedDeviation = Math.abs(
      currentPatterns.typingSpeed - baselinePatterns.averageTypingSpeed
    ) / baselinePatterns.averageTypingSpeed

    deviations.typingSpeed = speedDeviation
    
    if (speedDeviation > 0.3) {
      anomalyScore += 25
      riskFactors.push({
        type: 'typing_speed_anomaly',
        severity: speedDeviation > 0.5 ? 'high' : 'medium',
        description: 'Typing speed significantly different from baseline'
      })
    }
  }

  // Analyze mouse movement patterns
  if (currentPatterns.mouseMovement && baselinePatterns.mouseMovement) {
    const mouseDeviation = calculateMouseDeviation(
      currentPatterns.mouseMovement,
      baselinePatterns.mouseMovement
    )

    deviations.mouseMovement = mouseDeviation
    
    if (mouseDeviation > 0.4) {
      anomalyScore += 20
      riskFactors.push({
        type: 'mouse_movement_anomaly',
        severity: mouseDeviation > 0.6 ? 'high' : 'medium',
        description: 'Mouse movement patterns unusual'
      })
    }
  }

  // Analyze session timing patterns
  if (currentPatterns.sessionTiming && baselinePatterns.sessionTiming) {
    const timingDeviation = Math.abs(
      currentPatterns.sessionTiming.hour - baselinePatterns.sessionTiming.averageHour
    ) / 24

    deviations.sessionTiming = timingDeviation
    
    if (timingDeviation > 0.2) {
      anomalyScore += 15
      riskFactors.push({
        type: 'timing_anomaly',
        severity: timingDeviation > 0.4 ? 'high' : 'low',
        description: 'Login at unusual time'
      })
    }
  }

  // Calculate confidence based on data quality
  const confidence = Math.min(100, 
    (Object.keys(currentPatterns).length / 5) * 100
  )

  const recommendations = generateRecommendations(anomalyScore, riskFactors)

  return {
    anomalyScore: Math.min(100, anomalyScore),
    deviations,
    riskFactors,
    confidence,
    recommendations
  }
}

function calculateMouseDeviation(current: any, baseline: any): number {
  // Simple mouse movement deviation calculation
  const speedDiff = Math.abs((current.averageSpeed || 0) - (baseline.averageSpeed || 0))
  const accelerationDiff = Math.abs((current.averageAcceleration || 0) - (baseline.averageAcceleration || 0))
  
  return (speedDiff + accelerationDiff) / 2
}

function getRiskLevel(anomalyScore: number): string {
  if (anomalyScore < 20) return 'low'
  if (anomalyScore < 50) return 'medium'
  if (anomalyScore < 80) return 'high'
  return 'critical'
}

function generateRecommendations(anomalyScore: number, riskFactors: any[]): any[] {
  const recommendations = []

  if (anomalyScore > 50) {
    recommendations.push({
      type: 'authentication',
      priority: 'high',
      action: 'Require multi-factor authentication',
      reason: 'High anomaly score detected'
    })
  }

  if (riskFactors.some(f => f.type === 'typing_speed_anomaly')) {
    recommendations.push({
      type: 'monitoring',
      priority: 'medium',
      action: 'Monitor keystroke patterns closely',
      reason: 'Typing behavior deviation detected'
    })
  }

  if (anomalyScore > 80) {
    recommendations.push({
      type: 'security',
      priority: 'critical',
      action: 'Temporarily restrict access',
      reason: 'Critical anomaly score - potential security threat'
    })
  }

  return recommendations
}