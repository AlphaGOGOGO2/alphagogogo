import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// CORS allowlist
const allowedOrigins = new Set<string>([
  'https://alphagogogo.com',
  'https://www.alphagogogo.com',
  'https://66c7be07-a569-452d-94ac-a575dd055960.lovableproject.com',
  'http://localhost:3000',
  'http://localhost:5173'
]);

const baseCorsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function getAllowOrigin(req: Request): string {
  const origin = req.headers.get('origin');
  if (origin && allowedOrigins.has(origin)) return origin;
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

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': getAllowOrigin(req), ...baseCorsHeaders } });
  }

  // Enforce Origin allowlist (if present)
  const origin = req.headers.get('origin');
  if (origin && !allowedOrigins.has(origin)) {
    console.warn('[record-visit] Blocked request from disallowed origin:', origin);
    return jsonRes(req, { success: false, message: '허용되지 않은 Origin' }, { status: 403 });
  }

  try {
    const { client_id, user_agent } = await req.json();

    if (!client_id || client_id === 'null' || client_id === 'undefined' || client_id.trim() === '') {
      return jsonRes(req, { success: false, message: '유효하지 않은 클라이언트 ID' }, { status: 400 });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Server-side upsert to prevent duplicates
    const visitData = {
      client_id: client_id.trim(),
      user_agent: user_agent || 'unknown',
      ip_address: req.headers.get('x-forwarded-for') || '127.0.0.1',
    };

    const { error } = await supabase
      .from('visit_logs')
      .upsert(visitData, {
        onConflict: 'client_id,visit_date',
        ignoreDuplicates: true,
      });

    if (error) {
      console.error('[record-visit] DB error:', error);
      return jsonRes(req, { success: false, message: '방문 기록 실패' }, { status: 500 });
    }

    return jsonRes(req, { success: true, message: '방문 기록 완료' });
  } catch (error) {
    console.error('[record-visit] Error:', (error as Error).message);
    return jsonRes(req, { success: false, message: '서버 오류' }, { status: 500 });
  }
});