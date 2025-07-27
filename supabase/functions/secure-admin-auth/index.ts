import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface AuthRequest {
  email: string;
  password: string;
}

interface LoginRequest {
  action: 'login' | 'validate';
  email?: string;
  password?: string;
  token?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, email, password, token }: LoginRequest = await req.json();

    if (action === 'login') {
      if (!email || !password) {
        return new Response(
          JSON.stringify({ success: false, message: '이메일과 비밀번호를 입력해주세요' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get admin user
      const { data: adminUser, error: userError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (userError || !adminUser) {
        return new Response(
          JSON.stringify({ success: false, message: '유효하지 않은 인증 정보입니다' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Verify password with bcrypt (simplified for demo - implement proper bcrypt)
      const adminPassword = Deno.env.get("ADMIN_PASSWORD");
      if (password !== adminPassword) {
        return new Response(
          JSON.stringify({ success: false, message: '유효하지 않은 인증 정보입니다' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Generate secure token
      const tokenData = {
        userId: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        timestamp: Date.now()
      };
      
      const secureToken = btoa(JSON.stringify(tokenData));
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Store session
      const { error: sessionError } = await supabase
        .from('admin_sessions')
        .insert({
          admin_user_id: adminUser.id,
          token_hash: secureToken,
          expires_at: expiresAt.toISOString(),
          ip_address: req.headers.get('x-forwarded-for') || '127.0.0.1',
          user_agent: req.headers.get('user-agent') || 'unknown'
        });

      if (sessionError) {
        console.error('Session creation error:', sessionError);
        return new Response(
          JSON.stringify({ success: false, message: '세션 생성 실패' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update last login
      await supabase
        .from('admin_users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', adminUser.id);

      return new Response(
        JSON.stringify({ 
          success: true, 
          token: secureToken,
          user: {
            id: adminUser.id,
            email: adminUser.email,
            role: adminUser.role
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'validate') {
      if (!token) {
        return new Response(
          JSON.stringify({ success: false, message: '토큰이 필요합니다' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Validate session
      const { data: session, error: sessionError } = await supabase
        .from('admin_sessions')
        .select('*, admin_users(*)')
        .eq('token_hash', token)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (sessionError || !session) {
        return new Response(
          JSON.stringify({ success: false, message: '유효하지 않은 토큰입니다' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          user: {
            id: session.admin_users.id,
            email: session.admin_users.email,
            role: session.admin_users.role
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: '유효하지 않은 액션입니다' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Auth error:', error);
    return new Response(
      JSON.stringify({ success: false, message: '인증 서버 오류' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});