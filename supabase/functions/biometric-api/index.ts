import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface BiometricRequest {
  action: 'train' | 'verify' | 'getProfile';
  email: string;
  keystrokeData?: {
    timings: Array<{
      key: string;
      pressTime: number;
      releaseTime: number;
      duration: number;
    }>;
    context: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, email, keystrokeData }: BiometricRequest = await req.json();
    
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (!profile) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    switch (action) {
      case 'train':
        if (!keystrokeData) {
          return new Response(
            JSON.stringify({ error: 'Keystroke data required for training' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Store training pattern
        const { data: biometricProfile } = await supabase
          .from('biometric_profiles')
          .select('id')
          .eq('user_id', profile.id)
          .single();

        if (biometricProfile) {
          await supabase
            .from('keystroke_patterns')
            .insert({
              user_id: profile.id,
              biometric_profile_id: biometricProfile.id,
              pattern_data: { timings: keystrokeData.timings },
              context: keystrokeData.context || 'training'
            });

          // Update pattern count
          await supabase
            .from('biometric_profiles')
            .update({ 
              pattern_count: supabase.sql`pattern_count + 1`,
              last_updated: new Date().toISOString()
            })
            .eq('user_id', profile.id);
        }

        return new Response(
          JSON.stringify({ success: true, message: 'Training pattern stored' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'verify':
        if (!keystrokeData) {
          return new Response(
            JSON.stringify({ error: 'Keystroke data required for verification' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get user's biometric profile and patterns
        const { data: userProfile } = await supabase
          .from('biometric_profiles')
          .select(`
            *,
            keystroke_patterns(*)
          `)
          .eq('user_id', profile.id)
          .single();

        if (!userProfile || userProfile.keystroke_patterns.length < 3) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              confidence: 0, 
              message: 'Insufficient training data' 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Simple verification logic (you'd use your advanced analyzer here)
        const confidence = Math.random() * 40 + 50; // Mock confidence 50-90%
        const success = confidence > 65;

        // Log authentication attempt
        await supabase
          .from('authentication_attempts')
          .insert({
            user_id: profile.id,
            success,
            confidence_score: Math.round(confidence)
          });

        return new Response(
          JSON.stringify({ 
            success, 
            confidence: Math.round(confidence),
            message: success ? 'Biometric verification successful' : 'Biometric verification failed'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'getProfile':
        const { data: profileData } = await supabase
          .from('biometric_profiles')
          .select('confidence_score, status, pattern_count')
          .eq('user_id', profile.id)
          .single();

        return new Response(
          JSON.stringify(profileData || { 
            confidence_score: 0, 
            status: 'learning', 
            pattern_count: 0 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Biometric API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});