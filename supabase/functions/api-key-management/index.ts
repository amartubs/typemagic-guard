
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

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

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw userError;
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");

    // Check if user has enterprise subscription
    const { data: subscription } = await supabaseClient
      .from('subscriptions')
      .select(`
        *,
        plan:subscription_plans(tier)
      `)
      .eq('user_id', user.id)
      .single();

    if (!subscription || subscription.plan.tier !== 'enterprise') {
      return new Response(
        JSON.stringify({ error: "Enterprise subscription required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (req.method === 'POST') {
      const { name, permissions, rateLimit } = await req.json();
      
      // Generate API key
      const apiKey = generateApiKey();
      
      const { data, error } = await supabaseClient
        .from('api_keys')
        .insert({
          user_id: user.id,
          name,
          key_hash: apiKey, // In production, store hashed version
          permissions: permissions || ['biometric_auth'],
          rate_limit: rateLimit || 1000,
          active: true
        })
        .select()
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: "Failed to create API key" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ 
          ...data, 
          api_key: apiKey // Only return the actual key on creation
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (req.method === 'GET') {
      const { data, error } = await supabaseClient
        .from('api_keys')
        .select('id, name, permissions, rate_limit, active, created_at, last_used')
        .eq('user_id', user.id);

      if (error) {
        return new Response(
          JSON.stringify({ error: "Failed to fetch API keys" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (req.method === 'DELETE') {
      const url = new URL(req.url);
      const keyId = url.searchParams.get('keyId');
      
      if (!keyId) {
        return new Response(
          JSON.stringify({ error: "keyId parameter required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { error } = await supabaseClient
        .from('api_keys')
        .delete()
        .eq('id', keyId)
        .eq('user_id', user.id);

      if (error) {
        return new Response(
          JSON.stringify({ error: "Failed to delete API key" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("API key management error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'tmg_'; // TypeMagic Guard prefix
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
