
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': getAllowOrigin(req), ...baseCorsHeaders } });
  }

  // Enforce Origin allowlist (if present)
  const origin = req.headers.get('origin');
  if (origin && !allowedOrigins.has(origin)) {
    console.warn('[verify-admin-password] Blocked request from disallowed origin:', origin);
    return jsonRes(req, { success: false, message: '허용되지 않은 Origin' }, { status: 403 });
  }

  try {
    const { password } = await req.json();
    const correctPassword = Deno.env.get('ADMIN_PASSWORD');

    if (!correctPassword) {
      console.error('[verify-admin-password] ADMIN_PASSWORD env not set');
      return jsonRes(req, { success: false, message: 'Server configuration error: Admin password not configured' }, { status: 500 });
    }

    if (password === correctPassword) {
      return jsonRes(req, { success: true, message: 'Authentication successful', token: 'authorized' });
    }

    return jsonRes(req, { success: false, message: 'Authentication failed: Incorrect password' }, { status: 401 });
  } catch (error) {
    console.error('[verify-admin-password] Error:', (error as Error).message);
    return jsonRes(req, { success: false, message: `Authentication error: ${(error as Error).message}` }, { status: 500 });
  }
});
