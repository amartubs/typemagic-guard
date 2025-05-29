
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-api-key",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

interface ApiKeyRow {
  id: string;
  user_id: string;
  key_hash: string;
  permissions: string[];
  active: boolean;
  rate_limit: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const url = new URL(req.url);
    const path = url.pathname.split('/').slice(-1)[0];
    const method = req.method;

    // Authenticate API key
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API key required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify API key (simplified - in production, use hashed keys)
    const { data: apiKeyData, error: keyError } = await supabaseClient
      .from('api_keys')
      .select('*')
      .eq('key_hash', apiKey)
      .eq('active', true)
      .single();

    if (keyError || !apiKeyData) {
      return new Response(
        JSON.stringify({ error: "Invalid API key" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKeyRow = apiKeyData as ApiKeyRow;

    // Route to appropriate handler
    switch (path) {
      case 'auth':
        return handleBiometricAuth(req, supabaseClient, apiKeyRow);
      case 'users':
        return handleUserManagement(req, supabaseClient, apiKeyRow);
      case 'analytics':
        return handleAnalytics(req, supabaseClient, apiKeyRow);
      case 'security':
        return handleSecuritySettings(req, supabaseClient, apiKeyRow);
      default:
        return new Response(
          JSON.stringify({ error: "Endpoint not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    console.error("Enterprise API error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function handleBiometricAuth(req: Request, supabase: any, apiKey: ApiKeyRow) {
  if (!apiKey.permissions.includes('biometric_auth')) {
    return new Response(
      JSON.stringify({ error: "Insufficient permissions" }),
      { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (req.method === 'POST') {
    const { userId, keystrokeData, context } = await req.json();
    
    // Store keystroke pattern
    const { data, error } = await supabase
      .from('keystroke_patterns')
      .insert({
        user_id: userId,
        pattern_data: keystrokeData,
        context: context || 'api',
        confidence_score: calculateConfidenceScore(keystrokeData)
      })
      .select()
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ error: "Failed to store biometric data" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        patternId: data.id,
        confidenceScore: data.confidence_score 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (req.method === 'GET') {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "userId parameter required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data, error } = await supabase
      .from('biometric_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ error: "Method not allowed" }),
    { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function handleUserManagement(req: Request, supabase: any, apiKey: ApiKeyRow) {
  if (!apiKey.permissions.includes('user_management')) {
    return new Response(
      JSON.stringify({ error: "Insufficient permissions" }),
      { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (req.method === 'GET') {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    
    if (userId) {
      // Get specific user
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          subscriptions(
            *,
            plan:subscription_plans(*)
          ),
          biometric_profiles(*)
        `)
        .eq('id', userId)
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: "User not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // List users with pagination
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const offset = (page - 1) * limit;

      const { data, error, count } = await supabase
        .from('profiles')
        .select(`
          *,
          subscriptions(
            status,
            plan:subscription_plans(name, tier)
          )
        `, { count: 'exact' })
        .range(offset, offset + limit - 1);

      if (error) {
        return new Response(
          JSON.stringify({ error: "Failed to fetch users" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          users: data,
          pagination: {
            page,
            limit,
            total: count,
            totalPages: Math.ceil((count || 0) / limit)
          }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }

  if (req.method === 'PUT') {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const updates = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "userId parameter required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ error: "Failed to update user" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ error: "Method not allowed" }),
    { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function handleAnalytics(req: Request, supabase: any, apiKey: ApiKeyRow) {
  if (!apiKey.permissions.includes('analytics')) {
    return new Response(
      JSON.stringify({ error: "Insufficient permissions" }),
      { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (req.method === 'GET') {
    const url = new URL(req.url);
    const reportType = url.searchParams.get('type');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    switch (reportType) {
      case 'authentication-attempts':
        const { data: authData, error: authError } = await supabase
          .from('authentication_attempts')
          .select('*')
          .gte('created_at', startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .lte('created_at', endDate || new Date().toISOString());

        if (authError) {
          return new Response(
            JSON.stringify({ error: "Failed to fetch authentication data" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const authStats = {
          totalAttempts: authData.length,
          successfulAttempts: authData.filter(a => a.success).length,
          failedAttempts: authData.filter(a => !a.success).length,
          averageConfidence: authData.reduce((sum, a) => sum + (a.confidence_score || 0), 0) / authData.length,
          attempts: authData
        };

        return new Response(
          JSON.stringify(authStats),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

      case 'user-activity':
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select(`
            *,
            biometric_profiles(confidence_score, last_updated),
            authentication_attempts(created_at, success)
          `);

        if (userError) {
          return new Response(
            JSON.stringify({ error: "Failed to fetch user activity" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({
            totalUsers: userData.length,
            activeUsers: userData.filter(u => u.last_login && 
              new Date(u.last_login) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
            users: userData
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

      default:
        return new Response(
          JSON.stringify({ error: "Invalid report type" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  }

  return new Response(
    JSON.stringify({ error: "Method not allowed" }),
    { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

async function handleSecuritySettings(req: Request, supabase: any, apiKey: ApiKeyRow) {
  if (!apiKey.permissions.includes('security_settings')) {
    return new Response(
      JSON.stringify({ error: "Insufficient permissions" }),
      { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (req.method === 'GET') {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "userId parameter required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data, error } = await supabase
      .from('security_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ error: "Security settings not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (req.method === 'PUT') {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const settings = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "userId parameter required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data, error } = await supabase
      .from('security_settings')
      .update(settings)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ error: "Failed to update security settings" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ error: "Method not allowed" }),
    { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

function calculateConfidenceScore(keystrokeData: any): number {
  // Simplified confidence calculation
  if (!keystrokeData || !keystrokeData.timings || keystrokeData.timings.length === 0) {
    return 0;
  }
  
  // Basic calculation based on typing consistency
  const timings = keystrokeData.timings;
  const avgDuration = timings.reduce((sum: number, t: any) => sum + (t.duration || 0), 0) / timings.length;
  
  // Simple confidence score between 0-100
  return Math.min(100, Math.max(0, Math.round(70 + (avgDuration > 50 && avgDuration < 200 ? 20 : -10))));
}
