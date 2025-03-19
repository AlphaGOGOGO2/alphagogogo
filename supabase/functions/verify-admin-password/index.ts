
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
    
    // Verify password using environment variable
    // Access the password from Supabase secrets
    const correctPassword = Deno.env.get("ADMIN_PASSWORD");
    
    if (!correctPassword) {
      console.error("ADMIN_PASSWORD environment variable is not set");
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Server configuration error: Admin password not configured" 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
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
    console.error("Error in verify-admin-password function:", error.message);
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
