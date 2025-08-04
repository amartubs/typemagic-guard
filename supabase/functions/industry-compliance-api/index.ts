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
    const industry = url.searchParams.get('industry')
    const standard = url.searchParams.get('standard')

    if (req.method === 'GET') {
      // Get compliance records
      let query = supabaseClient
        .from('industry_compliance_records')
        .select('*')
        .eq('user_id', user.id)

      if (industry) {
        query = query.eq('industry', industry)
      }
      if (standard) {
        query = query.eq('compliance_standard', standard)
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
      
      // Create compliance record
      const { data, error } = await supabaseClient
        .from('industry_compliance_records')
        .insert([{
          user_id: user.id,
          industry: body.industry,
          compliance_standard: body.standard,
          compliance_data: body.data,
          status: body.status || 'pending',
          last_assessment_date: body.assessmentDate,
          next_assessment_due: body.nextDue
        }])
        .select()

      if (error) throw error

      return new Response(
        JSON.stringify({ data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    if (req.method === 'PUT') {
      const body = await req.json()
      const recordId = url.searchParams.get('id')

      if (!recordId) {
        throw new Error('Record ID required')
      }

      // Update compliance record
      const { data, error } = await supabaseClient
        .from('industry_compliance_records')
        .update({
          compliance_data: body.data,
          status: body.status,
          last_assessment_date: body.assessmentDate,
          next_assessment_due: body.nextDue
        })
        .eq('id', recordId)
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