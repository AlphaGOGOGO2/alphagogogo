
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { password } = await req.json();
    
    // Verify password (hardcoded here but more secure than client-side)
    // In a real production app, you might want to store this in Supabase secrets
    // and access via Deno.env.get("ADMIN_PASSWORD")
    const correctPassword = "dnjsehd12@@";
    
    if (password === correctPassword) {
      // Return success response
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Authentication successful",
          token: "authorized" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // Return error response for incorrect password
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Authentication failed: Incorrect password" 
        }),
        { 
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
  } catch (error) {
    // Return error response
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: `Authentication error: ${error.message}` 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
