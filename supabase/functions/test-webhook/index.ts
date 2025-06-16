
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
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

    const { webhookId } = await req.json();

    if (!webhookId) {
      return new Response(
        JSON.stringify({ error: "webhookId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get webhook configuration
    const { data: webhook, error: webhookError } = await supabaseClient
      .from('webhook_configs')
      .select('*')
      .eq('id', webhookId)
      .single();

    if (webhookError || !webhook) {
      return new Response(
        JSON.stringify({ error: "Webhook not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create test payload
    const testPayload = {
      event: "webhook.test",
      timestamp: new Date().toISOString(),
      data: {
        message: "This is a test webhook from TypeMagic Guard",
        webhook_id: webhookId,
        test: true
      }
    };

    // Create signature
    const signature = await createSignature(JSON.stringify(testPayload), webhook.secret);

    // Send webhook
    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-TypeMagic-Signature': `sha256=${signature}`,
          'User-Agent': 'TypeMagic-Guard-Webhook/1.0'
        },
        body: JSON.stringify(testPayload),
        signal: AbortSignal.timeout(webhook.timeout * 1000)
      });

      if (response.ok) {
        // Update success count
        await supabaseClient
          .from('webhook_configs')
          .update({ 
            success_count: webhook.success_count + 1,
            last_triggered: new Date().toISOString()
          })
          .eq('id', webhookId);

        return new Response(
          JSON.stringify({ 
            success: true, 
            status: response.status,
            message: "Test webhook sent successfully"
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else {
        // Update failure count
        await supabaseClient
          .from('webhook_configs')
          .update({ failure_count: webhook.failure_count + 1 })
          .eq('id', webhookId);

        return new Response(
          JSON.stringify({ 
            success: false, 
            status: response.status,
            message: "Webhook endpoint returned an error"
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } catch (error) {
      console.error('Webhook delivery failed:', error);
      
      // Update failure count
      await supabaseClient
        .from('webhook_configs')
        .update({ failure_count: webhook.failure_count + 1 })
        .eq('id', webhookId);

      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Failed to deliver webhook",
          error: error.message
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Test webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function createSignature(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
