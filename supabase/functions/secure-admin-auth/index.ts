import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AuthRequest {
  password: string;
  action?: 'login' | 'verify' | 'refresh';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { password, action = 'login' }: AuthRequest = await req.json();

    console.log(`Secure admin auth request: ${action}`);

    // 관리자 비밀번호 검증
    const adminPassword = Deno.env.get('ADMIN_PASSWORD');
    
    if (!adminPassword) {
      console.error('ADMIN_PASSWORD not configured');
      return new Response(
        JSON.stringify({ success: false, message: 'Server configuration error' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    if (action === 'login') {
      // 로그인 처리
      if (password !== adminPassword) {
        console.log('Invalid password attempt');
        return new Response(
          JSON.stringify({ success: false, message: 'Invalid password' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        );
      }

      // JWT 토큰 생성 (간단한 형태)
      const sessionId = crypto.randomUUID();
      const expiresAt = Date.now() + (2 * 60 * 60 * 1000); // 2시간
      
      // 세션을 admin_sessions 테이블에 저장
      const { error: sessionError } = await supabaseClient
        .from('admin_sessions')
        .insert({
          session_id: sessionId,
          expires_at: new Date(expiresAt).toISOString(),
          ip_address: req.headers.get('x-forwarded-for') || 'unknown'
        });

      if (sessionError) {
        console.error('Session creation error:', sessionError);
        return new Response(
          JSON.stringify({ success: false, message: 'Session creation failed' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      // 간단한 JWT-like 토큰 생성
      const token = btoa(JSON.stringify({
        sessionId,
        expiresAt,
        issued: Date.now()
      }));

      console.log('Admin authentication successful');
      return new Response(
        JSON.stringify({ 
          success: true, 
          token,
          sessionId,
          expiresAt
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'verify') {
      // 토큰 검증
      const authHeader = req.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(
          JSON.stringify({ success: false, message: 'No token provided' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        );
      }

      const token = authHeader.substring(7);
      
      try {
        const tokenData = JSON.parse(atob(token));
        const { sessionId, expiresAt } = tokenData;

        // 세션 유효성 검사
        if (Date.now() > expiresAt) {
          return new Response(
            JSON.stringify({ success: false, message: 'Token expired' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
          );
        }

        // 데이터베이스에서 세션 확인
        const { data: session, error } = await supabaseClient
          .from('admin_sessions')
          .select('*')
          .eq('session_id', sessionId)
          .eq('is_active', true)
          .single();

        if (error || !session) {
          return new Response(
            JSON.stringify({ success: false, message: 'Invalid session' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
          );
        }

        return new Response(
          JSON.stringify({ success: true, sessionId }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      } catch (error) {
        console.error('Token verification error:', error);
        return new Response(
          JSON.stringify({ success: false, message: 'Invalid token format' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        );
      }
    }

    return new Response(
      JSON.stringify({ success: false, message: 'Invalid action' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );

  } catch (error) {
    console.error('Auth function error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
})