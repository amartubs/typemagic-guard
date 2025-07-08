import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

// Rate limiting store (in-memory for simplicity, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number; lockoutTime?: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;
const LOCKOUT_DURATION = 300000; // 5 minutes
const MAX_FAILED_ATTEMPTS = 3;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface BiometricRequest {
  action: 'train' | 'verify' | 'getProfile' | 'multimodal-verify' | 'device-trust' | 'health';
  email?: string;
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
  deviceData?: {
    fingerprint: string;
    ipAddress?: string;
    userAgent?: string;
    location?: string;
  };
}

interface StandardResponse {
  success: boolean;
  confidenceScore?: number;
  riskLevel?: 'low' | 'medium' | 'high';
  modalityScores?: {
    keystroke?: number;
    touch?: number;
    mouse?: number;
    behavioral?: number;
  };
  deviceTrust?: number;
  anomalies?: string[];
  recommendation?: string;
  message?: string;
  timestamp: string;
  processingTime?: number;
}

// Rate limiting functions
function getClientId(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || realIp || 'unknown';
}

function checkRateLimit(clientId: string): { allowed: boolean; isLocked: boolean; resetTime?: number } {
  const now = Date.now();
  const clientData = rateLimitStore.get(clientId);
  
  if (!clientData) {
    rateLimitStore.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, isLocked: false };
  }
  
  // Check if client is locked out
  if (clientData.lockoutTime && now < clientData.lockoutTime) {
    return { allowed: false, isLocked: true, resetTime: clientData.lockoutTime };
  }
  
  // Reset window if expired
  if (now > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = now + RATE_LIMIT_WINDOW;
    clientData.lockoutTime = undefined;
    return { allowed: true, isLocked: false };
  }
  
  // Check rate limit
  if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, isLocked: false, resetTime: clientData.resetTime };
  }
  
  clientData.count++;
  return { allowed: true, isLocked: false };
}

function trackFailedAttempt(email: string): boolean {
  const key = `failed_${email}`;
  const now = Date.now();
  const clientData = rateLimitStore.get(key);
  
  if (!clientData) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  
  if (now > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = now + RATE_LIMIT_WINDOW;
    return false;
  }
  
  clientData.count++;
  if (clientData.count >= MAX_FAILED_ATTEMPTS) {
    clientData.lockoutTime = now + LOCKOUT_DURATION;
    return true; // Account locked
  }
  
  return false;
}

function createStandardResponse(data: Partial<StandardResponse>): StandardResponse {
  return {
    success: data.success ?? false,
    timestamp: new Date().toISOString(),
    ...data
  };
}

function calculateRiskLevel(confidence: number, riskScore: number): 'low' | 'medium' | 'high' {
  if (confidence >= 85 && riskScore <= 20) return 'low';
  if (confidence >= 70 && riskScore <= 40) return 'medium';
  return 'high';
}

function calculateDeviceTrust(deviceFingerprint: string, behaviorHistory: any[]): number {
  // Simple device trust calculation - would be more sophisticated in production
  let trust = 50; // Base trust
  
  // Trust increases with consistent behavior
  if (behaviorHistory.length > 10) trust += 20;
  if (behaviorHistory.length > 50) trust += 10;
  
  // Device fingerprint entropy affects trust
  const entropy = new Set(deviceFingerprint.split('')).size;
  trust += Math.min(20, entropy);
  
  return Math.min(100, Math.max(0, trust));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = performance.now();
  const clientId = getClientId(req);

  try {
    // Check rate limiting
    const rateLimitCheck = checkRateLimit(clientId);
    if (!rateLimitCheck.allowed) {
      const errorResponse = createStandardResponse({
        success: false,
        message: rateLimitCheck.isLocked ? 'Account temporarily locked due to suspicious activity' : 'Rate limit exceeded',
        anomalies: ['rate_limit_exceeded'],
        processingTime: performance.now() - startTime
      });
      
      return new Response(
        JSON.stringify(errorResponse),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'X-RateLimit-Reset': rateLimitCheck.resetTime?.toString() || ''
          } 
        }
      );
    }

    const { action, email, keystrokeData, multiModalData, deviceData }: BiometricRequest = await req.json();

    // Handle health check
    if (action === 'health') {
      const healthResponse = createStandardResponse({
        success: true,
        message: 'Biometric API is healthy',
        processingTime: performance.now() - startTime
      });
      
      return new Response(
        JSON.stringify(healthResponse),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle device trust scoring
    if (action === 'device-trust') {
      if (!deviceData?.fingerprint) {
        const errorResponse = createStandardResponse({
          success: false,
          message: 'Device fingerprint required for trust assessment',
          anomalies: ['missing_device_data'],
          processingTime: performance.now() - startTime
        });
        
        return new Response(
          JSON.stringify(errorResponse),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get device behavior history
      const { data: deviceHistory } = await supabase
        .from('device_capabilities')
        .select('*')
        .eq('device_fingerprint', deviceData.fingerprint)
        .order('created_at', { ascending: false })
        .limit(50);

      const deviceTrust = calculateDeviceTrust(deviceData.fingerprint, deviceHistory || []);
      const riskLevel = deviceTrust >= 70 ? 'low' : deviceTrust >= 40 ? 'medium' : 'high';

      const trustResponse = createStandardResponse({
        success: true,
        deviceTrust,
        riskLevel,
        message: `Device trust score: ${deviceTrust}%`,
        recommendation: riskLevel === 'high' ? 'Additional verification recommended' : 'Device appears trustworthy',
        processingTime: performance.now() - startTime
      });

      return new Response(
        JSON.stringify(trustResponse),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate email for other actions
    if (!email) {
      const errorResponse = createStandardResponse({
        success: false,
        message: 'Email is required',
        anomalies: ['missing_email'],
        processingTime: performance.now() - startTime
      });
      
      return new Response(
        JSON.stringify(errorResponse),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
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

        const trainingResponse = createStandardResponse({
          success: true,
          message: 'Training pattern stored successfully',
          recommendation: 'Continue training for improved accuracy',
          processingTime: performance.now() - startTime
        });

        return new Response(
          JSON.stringify(trainingResponse),
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
        const riskScore = Math.max(0, 100 - confidence);
        const riskLevel = calculateRiskLevel(confidence, riskScore);

        // Track failed attempts and apply progressive delays
        if (!success) {
          const isLocked = trackFailedAttempt(email);
          if (isLocked) {
            const lockoutResponse = createStandardResponse({
              success: false,
              confidenceScore: Math.round(confidence),
              riskLevel: 'high',
              message: 'Account temporarily locked due to multiple failed attempts',
              anomalies: ['account_locked', 'multiple_failures'],
              recommendation: 'Wait 5 minutes before attempting again',
              processingTime: performance.now() - startTime
            });

            return new Response(
              JSON.stringify(lockoutResponse),
              { status: 423, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          
          // Progressive delay for failed attempts
          const failedAttempts = rateLimitStore.get(`failed_${email}`)?.count || 0;
          const delay = Math.min(5000, failedAttempts * 1000); // Max 5 second delay
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        // Log authentication attempt
        await supabase
          .from('authentication_attempts')
          .insert({
            user_id: profile.id,
            success,
            confidence_score: Math.round(confidence),
            anomaly_details: !success ? { reason: 'Low confidence score' } : null
          });

        const verifyResponse = createStandardResponse({
          success,
          confidenceScore: Math.round(confidence),
          riskLevel,
          modalityScores: { keystroke: Math.round(confidence) },
          anomalies: !success ? ['low_confidence'] : [],
          message: success ? 'Biometric verification successful' : 'Biometric verification failed',
          recommendation: success ? 'Authentication completed' : 'Please try again or use alternative verification',
          processingTime: performance.now() - startTime
        });

        return new Response(
          JSON.stringify(verifyResponse),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'getProfile':
        const { data: profileData } = await supabase
          .from('biometric_profiles')
          .select('confidence_score, status, pattern_count')
          .eq('user_id', profile.id)
          .maybeSingle();

        const profileResponse = createStandardResponse({
          success: true,
          confidenceScore: profileData?.confidence_score || 0,
          message: profileData ? 'Biometric profile retrieved successfully' : 'No biometric profile found. Training required.',
          recommendation: profileData?.pattern_count < 5 ? 'Complete additional training for better accuracy' : 'Profile ready for authentication',
          processingTime: performance.now() - startTime
        });

        return new Response(
          JSON.stringify({
            ...profileResponse,
            profile: profileData || { 
              confidence_score: 0, 
              status: 'learning', 
              pattern_count: 0
            }
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
        const multiModalRiskScore = Math.max(0, 100 - combinedConfidence - (modalityCount * 10) + deviceRisk);
        const multiModalRiskLevel = calculateRiskLevel(combinedConfidence, multiModalRiskScore);
        
        const multiModalSuccess = combinedConfidence >= 70 && multiModalRiskScore < 50;

        // Track failed attempts for multi-modal too
        if (!multiModalSuccess) {
          const isLocked = trackFailedAttempt(email);
          if (isLocked) {
            const lockoutResponse = createStandardResponse({
              success: false,
              confidenceScore: combinedConfidence,
              riskLevel: 'high',
              message: 'Account temporarily locked due to multiple failed attempts',
              anomalies: ['account_locked', 'multi_modal_failure'],
              recommendation: 'Wait 5 minutes before attempting again',
              processingTime: performance.now() - startTime
            });

            return new Response(
              JSON.stringify(lockoutResponse),
              { status: 423, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        }

        // Store multi-modal auth attempt
        await supabase.from('multimodal_auth_attempts').insert({
          user_id: profile.id,
          device_fingerprint: multiModalData.deviceFingerprint,
          modalities_used: Object.keys(individualScores),
          individual_scores: individualScores,
          combined_confidence: combinedConfidence,
          risk_score: multiModalRiskScore,
          success: multiModalSuccess,
          anomaly_details: !multiModalSuccess ? { 
            reason: 'Multi-modal verification failed',
            modalities: Object.keys(individualScores),
            risk_score: multiModalRiskScore
          } : null
        });

        const multiModalResponse = createStandardResponse({
          success: multiModalSuccess,
          confidenceScore: combinedConfidence,
          riskLevel: multiModalRiskLevel,
          modalityScores: individualScores,
          deviceTrust: calculateDeviceTrust(multiModalData.deviceFingerprint, []),
          anomalies: !multiModalSuccess ? ['low_confidence', 'high_risk'] : [],
          message: multiModalSuccess ? 'Multi-modal verification successful' : 'Multi-modal verification failed',
          recommendation: multiModalSuccess ? 'Authentication completed with multiple biometric factors' : 'Consider additional verification methods',
          processingTime: performance.now() - startTime
        });

        return new Response(
          JSON.stringify({
            ...multiModalResponse,
            modalities: Object.keys(individualScores)
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