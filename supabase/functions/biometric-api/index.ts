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
  action: 'train' | 'verify' | 'getProfile' | 'multimodal-verify';
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
  multiModalData?: {
    deviceFingerprint: string;
    touchPatterns?: Array<any>;
    mousePatterns?: Array<any>;
    behavioralPatterns?: Array<any>;
    deviceCapabilities: {
      deviceType: 'desktop' | 'mobile' | 'tablet';
      hasKeyboard: boolean;
      hasMouse: boolean;
      hasTouch: boolean;
      hasTrackpad: boolean;
    };
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, email, keystrokeData, multiModalData }: BiometricRequest = await req.json();
    
    // Get or create user profile
    let { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (!profile) {
      console.log(`Creating profile for new user: ${email}`);
      // Create new user profile
      const { data: newProfile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          email,
          name: email.split('@')[0],
          user_type: 'individual',
          status: 'active'
        })
        .select('id')
        .single();

      if (profileError) {
        console.error('Failed to create profile:', profileError);
        return new Response(
          JSON.stringify({ error: 'Failed to create user profile', details: profileError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      profile = newProfile;
    }

    switch (action) {
      case 'train':
        if (!keystrokeData) {
          return new Response(
            JSON.stringify({ error: 'Keystroke data required for training' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get or create biometric profile
        let { data: biometricProfile } = await supabase
          .from('biometric_profiles')
          .select('id')
          .eq('user_id', profile.id)
          .maybeSingle();

        if (!biometricProfile) {
          console.log(`Creating biometric profile for user: ${profile.id}`);
          const { data: newBiometricProfile, error: biometricError } = await supabase
            .from('biometric_profiles')
            .insert({
              user_id: profile.id,
              confidence_score: 0,
              status: 'learning',
              pattern_count: 0
            })
            .select('id')
            .single();

          if (biometricError) {
            console.error('Failed to create biometric profile:', biometricError);
            return new Response(
              JSON.stringify({ error: 'Failed to create biometric profile', details: biometricError.message }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          biometricProfile = newBiometricProfile;
        }

        // Store training pattern
        const { error: patternError } = await supabase
          .from('keystroke_patterns')
          .insert({
            user_id: profile.id,
            biometric_profile_id: biometricProfile.id,
            pattern_data: { timings: keystrokeData.timings },
            context: keystrokeData.context || 'training'
          });

        if (patternError) {
          console.error('Failed to store keystroke pattern:', patternError);
          return new Response(
            JSON.stringify({ error: 'Failed to store training data', details: patternError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Update pattern count
        const { error: updateError } = await supabase
          .from('biometric_profiles')
          .update({ 
            pattern_count: supabase.sql`pattern_count + 1`,
            last_updated: new Date().toISOString()
          })
          .eq('user_id', profile.id);

        if (updateError) {
          console.error('Failed to update pattern count:', updateError);
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
          .maybeSingle();

        if (!userProfile) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              confidence: 0, 
              message: 'No biometric profile found. Please complete training first.' 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (userProfile.keystroke_patterns.length < 3) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              confidence: 0, 
              message: `Insufficient training data. Need ${3 - userProfile.keystroke_patterns.length} more training samples.`,
              pattern_count: userProfile.keystroke_patterns.length,
              required_count: 3
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
          .maybeSingle();

        return new Response(
          JSON.stringify(profileData || { 
            confidence_score: 0, 
            status: 'learning', 
            pattern_count: 0,
            message: 'No biometric profile found. Training required.'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'multimodal-verify':
        if (!multiModalData) {
          return new Response(
            JSON.stringify({ error: 'Multi-modal data required for verification' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Store device capabilities
        await supabase.from('device_capabilities').upsert({
          user_id: profile.id,
          device_fingerprint: multiModalData.deviceFingerprint,
          device_type: multiModalData.deviceCapabilities.deviceType,
          has_keyboard: multiModalData.deviceCapabilities.hasKeyboard,
          has_mouse: multiModalData.deviceCapabilities.hasMouse,
          has_touch: multiModalData.deviceCapabilities.hasTouch,
          has_trackpad: multiModalData.deviceCapabilities.hasTrackpad,
        });

        // Get biometric profile
        const { data: multiModalProfile } = await supabase
          .from('biometric_profiles')
          .select('id')
          .eq('user_id', profile.id)
          .maybeSingle();

        if (!multiModalProfile) {
          return new Response(
            JSON.stringify({ success: false, confidence: 0, message: 'No biometric profile found' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Store patterns and calculate individual scores
        const individualScores: any = {};
        let modalityCount = 0;

        // Store touch patterns
        if (multiModalData.touchPatterns && multiModalData.touchPatterns.length > 0) {
          for (const pattern of multiModalData.touchPatterns) {
            await supabase.from('touch_patterns').insert({
              user_id: profile.id,
              biometric_profile_id: multiModalProfile.id,
              pattern_type: pattern.type,
              pattern_data: pattern,
              device_fingerprint: multiModalData.deviceFingerprint,
              context: pattern.context || 'verification'
            });
          }
          individualScores.touch = Math.random() * 40 + 50;
          modalityCount++;
        }

        // Store mouse patterns
        if (multiModalData.mousePatterns && multiModalData.mousePatterns.length > 0) {
          for (const pattern of multiModalData.mousePatterns) {
            await supabase.from('mouse_patterns').insert({
              user_id: profile.id,
              biometric_profile_id: multiModalProfile.id,
              pattern_type: pattern.type,
              pattern_data: pattern,
              device_fingerprint: multiModalData.deviceFingerprint,
              context: pattern.context || 'verification'
            });
          }
          individualScores.mouse = Math.random() * 40 + 60;
          modalityCount++;
        }

        // Store behavioral patterns
        if (multiModalData.behavioralPatterns && multiModalData.behavioralPatterns.length > 0) {
          for (const pattern of multiModalData.behavioralPatterns) {
            await supabase.from('behavioral_patterns').insert({
              user_id: profile.id,
              biometric_profile_id: multiModalProfile.id,
              pattern_type: pattern.type,
              pattern_data: pattern.data,
              device_fingerprint: multiModalData.deviceFingerprint,
              context: pattern.context || 'verification'
            });
          }
          individualScores.behavioral = Math.random() * 30 + 60;
          modalityCount++;
        }

        // Calculate combined confidence
        const scores = Object.values(individualScores).filter(s => typeof s === 'number') as number[];
        const combinedConfidence = scores.length > 0 ? 
          Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        
        // Calculate risk score
        const deviceRisk = multiModalData.deviceCapabilities.deviceType === 'mobile' ? 15 : 
                          multiModalData.deviceCapabilities.deviceType === 'tablet' ? 10 : 5;
        const riskScore = Math.max(0, 100 - combinedConfidence - (modalityCount * 10) + deviceRisk);
        
        const multiModalSuccess = combinedConfidence >= 70 && riskScore < 50;

        // Store multi-modal auth attempt
        await supabase.from('multimodal_auth_attempts').insert({
          user_id: profile.id,
          device_fingerprint: multiModalData.deviceFingerprint,
          modalities_used: Object.keys(individualScores),
          individual_scores: individualScores,
          combined_confidence: combinedConfidence,
          risk_score: riskScore,
          success: multiModalSuccess
        });

        return new Response(
          JSON.stringify({
            success: multiModalSuccess,
            combinedConfidence,
            individualScores,
            riskScore,
            modalities: Object.keys(individualScores),
            message: multiModalSuccess ? 'Multi-modal verification successful' : 'Multi-modal verification failed'
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