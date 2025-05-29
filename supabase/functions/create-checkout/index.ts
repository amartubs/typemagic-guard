
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
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
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.email) {
      throw new Error("User not authenticated");
    }

    const { planId, userType } = await req.json();
    
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Define pricing based on plan and user type with new pricing structure
    const getPriceAmount = (planId: string, userType: string) => {
      const pricing: Record<string, Record<string, number>> = {
        basic: { individual: 999, company: 4999, charity: 499 }, // $9.99, $49.99, $4.99
        professional: { individual: 1999, company: 9999, charity: 1999 }, // $19.99, $99.99, $19.99
        enterprise: { individual: 9999, company: 49999, charity: 24999 }, // $99.99, $499.99, $249.99
      };
      return pricing[planId]?.[userType] || 0;
    };

    const amount = getPriceAmount(planId, userType);
    
    // Don't create checkout for free plans
    if (amount === 0) {
      return new Response(
        JSON.stringify({ error: "Free plans don't require checkout" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const planNames: Record<string, string> = {
      basic: 'Basic Plan',
      professional: 'Professional Plan',
      enterprise: 'Enterprise Plan'
    };

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: planNames[planId] || 'Subscription Plan',
              description: `TypeMagic Guard ${planNames[planId]} for ${userType}s`,
            },
            unit_amount: amount,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/dashboard?subscription=success`,
      cancel_url: `${req.headers.get("origin")}/pricing?subscription=cancelled`,
      metadata: {
        user_id: user.id,
        plan_id: planId,
        user_type: userType,
      },
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
