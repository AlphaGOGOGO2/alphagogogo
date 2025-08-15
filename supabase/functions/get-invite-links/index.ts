import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const serviceName = url.searchParams.get('service');

    if (!serviceName) {
      return new Response(
        JSON.stringify({ error: 'service parameter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    // Fetch with minimal public data only
    const { data, error } = await supabase
      .from('invite_links')
      .select('id, service_name, user_nickname, description, click_count, created_at, updated_at')
      .eq('service_name', serviceName)
      .order('click_count', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch invite links error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch invite links' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Filter out sensitive data and provide anonymized nicknames
    const publicData = (data || []).map(link => ({
      id: link.id,
      service_name: link.service_name,
      user_nickname: link.user_nickname.length > 3 
        ? link.user_nickname.substring(0, 3) + '*'.repeat(Math.min(3, link.user_nickname.length - 3))
        : link.user_nickname,
      description: link.description,
      click_count: link.click_count,
      created_at: link.created_at,
      updated_at: link.updated_at
    }));

    return new Response(
      JSON.stringify({ success: true, data: publicData }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('get-invite-links error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});