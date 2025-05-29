
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
    if (!user?.id) throw new Error("User not authenticated");

    // Fetch all user data from various tables
    const [
      profileData,
      securityData,
      subscriptionData,
      biometricData,
      keystrokeData,
      authAttempts,
      usageData
    ] = await Promise.all([
      supabaseClient.from("profiles").select("*").eq("id", user.id).single(),
      supabaseClient.from("security_settings").select("*").eq("user_id", user.id).single(),
      supabaseClient.from("subscriptions").select("*, subscription_plans(*)").eq("user_id", user.id).single(),
      supabaseClient.from("biometric_profiles").select("*").eq("user_id", user.id).single(),
      supabaseClient.from("keystroke_patterns").select("*").eq("user_id", user.id),
      supabaseClient.from("authentication_attempts").select("*").eq("user_id", user.id),
      supabaseClient.from("usage_analytics").select("*").eq("user_id", user.id)
    ]);

    // Compile export data
    const exportData = {
      exportDate: new Date().toISOString(),
      userId: user.id,
      profile: profileData.data,
      securitySettings: securityData.data,
      subscription: subscriptionData.data,
      biometricProfile: biometricData.data,
      keystrokePatterns: keystrokeData.data || [],
      authenticationAttempts: authAttempts.data || [],
      usageAnalytics: usageData.data || [],
      metadata: {
        version: "1.0",
        format: "GDPR-compliant JSON export",
        rights: [
          "This export contains all personal data we hold about you",
          "You have the right to request corrections to this data",
          "You have the right to request deletion of this data",
          "You have the right to object to processing of this data"
        ]
      }
    };

    // Log the export request
    await supabaseClient.from("system_logs").insert({
      user_id: user.id,
      level: "info",
      message: "GDPR data export requested",
      context: { export_date: new Date().toISOString() }
    });

    return new Response(
      JSON.stringify(exportData),
      {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="gdpr-export-${user.id}.json"`
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error exporting user data:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
