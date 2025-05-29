
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

    // Log the deletion request first
    await supabaseClient.from("system_logs").insert({
      user_id: user.id,
      level: "warning",
      message: "GDPR data deletion requested",
      context: { 
        deletion_date: new Date().toISOString(),
        user_email: user.email
      }
    });

    // In a real implementation, this would:
    // 1. Create a deletion job to be processed later
    // 2. Mark the account for deletion with a grace period
    // 3. Send confirmation emails
    // 4. Handle cascading deletions properly

    // For now, we'll delete the user data immediately
    // Note: This should be done in a transaction in production

    // Delete in reverse order of dependencies
    await supabaseClient.from("usage_analytics").delete().eq("user_id", user.id);
    await supabaseClient.from("authentication_attempts").delete().eq("user_id", user.id);
    await supabaseClient.from("keystroke_patterns").delete().eq("user_id", user.id);
    await supabaseClient.from("biometric_profiles").delete().eq("user_id", user.id);
    await supabaseClient.from("subscriptions").delete().eq("user_id", user.id);
    await supabaseClient.from("security_settings").delete().eq("user_id", user.id);
    await supabaseClient.from("profiles").delete().eq("id", user.id);

    // Finally, delete the auth user
    const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(user.id);
    if (deleteError) {
      console.error("Error deleting auth user:", deleteError);
      // Don't throw here as the data is already deleted
    }

    return new Response(
      JSON.stringify({ 
        message: "Account deletion completed",
        deletedAt: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting user data:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
