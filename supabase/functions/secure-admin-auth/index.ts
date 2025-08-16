import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Define allowed origins (CORS allowlist)
const allowedOrigins = new Set<string>([
  'https://alphagogogo.com',
  'https://www.alphagogogo.com',
  'https://66c7be07-a569-452d-94ac-a575dd055960.lovableproject.com',
  'http://localhost:3000',
  'http://localhost:5173'
]);

// Base CORS headers (without origin)
const baseCorsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function getAllowOrigin(req: Request): string {
  const origin = req.headers.get('origin');
  if (origin && allowedOrigins.has(origin)) return origin;
  // If no Origin (e.g., server-to-server), default to primary domain
  return 'https://alphagogogo.com';
}

function jsonRes(req: Request, body: unknown, init?: ResponseInit) {
  const allowOrigin = getAllowOrigin(req);
  return new Response(JSON.stringify(body), {
    ...(init || {}),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': allowOrigin,
      ...baseCorsHeaders,
      ...(init?.headers || {}),
    },
  });
}

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(hash);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  // Base64URL encode
  const b64 = btoa(String.fromCharCode(...bytes));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
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
    return new Response(null, {
      headers: { 'Access-Control-Allow-Origin': getAllowOrigin(req), ...baseCorsHeaders },
    });
  }

  // Enforce Origin allowlist (if Origin header is present)
  const origin = req.headers.get('origin');
  if (origin && !allowedOrigins.has(origin)) {
    console.warn('[secure-admin-auth] Blocked request from disallowed origin:', origin);
    return jsonRes(req, { success: false, message: '허용되지 않은 Origin' }, { status: 403 });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, email, password, token }: LoginRequest = await req.json();

    if (action === 'login') {
      if (!email || !password) {
        return jsonRes(req, { success: false, message: '이메일과 비밀번호를 입력해주세요' }, { status: 400 });
      }

      // Server-side rate limiting: max 5 attempts per 15 minutes per IP
      const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
      const windowStart = new Date(Date.now() - 15 * 60 * 1000).toISOString();
      const { count: attemptCount, error: rlError } = await supabase
        .from('admin_login_attempts')
        .select('id', { count: 'exact', head: true })
        .eq('ip_address', ip)
        .gt('attempted_at', windowStart);

      if (rlError) {
        console.error('[secure-admin-auth] Rate limit count error:', rlError);
      }
      if ((attemptCount ?? 0) >= 5) {
        console.warn('[secure-admin-auth] Rate limit triggered for IP:', ip);
        return jsonRes(req, { success: false, message: '로그인 시도가 일시적으로 제한되었습니다. 잠시 후 다시 시도하세요.' }, { status: 429 });
      }

      // Record this attempt (regardless of success)
      const { error: rlInsertError } = await supabase
        .from('admin_login_attempts')
        .insert({ ip_address: ip });
      if (rlInsertError) {
        console.error('[secure-admin-auth] Rate limit insert error:', rlInsertError);
      }

      // Get admin user
      const { data: adminUser, error: userError } = await supabase
        .from('admin_users')
        .select('id, email, role, is_active')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (userError || !adminUser) {
        return jsonRes(req, { success: false, message: '유효하지 않은 인증 정보입니다' }, { status: 401 });
      }

      // Verify password
      const adminPassword = Deno.env.get('ADMIN_PASSWORD');
      if (!adminPassword || password !== adminPassword) {
        return jsonRes(req, { success: false, message: '유효하지 않은 인증 정보입니다' }, { status: 401 });
      }

      // Generate random token and store its hash only
      const rawToken = generateToken();
      const tokenHash = await sha256(rawToken);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Store session (hash, never the raw token)
      const { error: sessionError } = await supabase
        .from('admin_sessions')
        .insert({
          admin_user_id: adminUser.id,
          token_hash: tokenHash,
          expires_at: expiresAt.toISOString(),
          ip_address: ip,
          user_agent: req.headers.get('user-agent') || 'unknown',
        });

      if (sessionError) {
        console.error('[secure-admin-auth] Session creation error:', sessionError);
        return jsonRes(req, { success: false, message: '세션 생성 실패' }, { status: 500 });
      }

      // Update last login (best-effort)
      await supabase
        .from('admin_users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', adminUser.id);

      return jsonRes(req, {
        success: true,
        token: rawToken, // return raw token to client; only hash is stored server-side
        user: { id: adminUser.id, email: adminUser.email, role: adminUser.role },
      });
    }

    if (action === 'validate') {
      if (!token) {
        return jsonRes(req, { success: false, message: '토큰이 필요합니다' }, { status: 400 });
      }

      const tokenHash = await sha256(token);

      // Validate session
      const { data: session, error: sessionError } = await supabase
        .from('admin_sessions')
        .select('id, admin_users(id, email, role)')
        .eq('token_hash', tokenHash)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (sessionError || !session) {
        return jsonRes(req, { success: false, message: '유효하지 않은 토큰입니다' }, { status: 401 });
      }

      return jsonRes(req, {
        success: true,
        user: {
          id: session.admin_users.id,
          email: session.admin_users.email,
          role: session.admin_users.role,
        },
      });
    }

    return jsonRes(req, { success: false, message: '유효하지 않은 액션입니다' }, { status: 400 });
  } catch (error) {
    console.error('[secure-admin-auth] Auth error:', error);
    return jsonRes(req, { success: false, message: '인증 서버 오류' }, { status: 500 });
  }
});