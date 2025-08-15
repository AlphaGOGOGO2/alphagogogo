import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, admin-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type VisitStat = { date: string; count: number };

deno_serve: Deno.ServeHandler;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const adminToken = req.headers.get('admin-token');
    if (!adminToken) {
      return new Response(JSON.stringify({ success: false, message: '인증 토큰이 필요합니다' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate token via secure-admin-auth
    const authRes = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/secure-admin-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
      },
      body: JSON.stringify({ action: 'validate', token: adminToken }),
    });

    if (!authRes.ok) {
      return new Response(JSON.stringify({ success: false, message: '토큰 검증 실패' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const authJson = await authRes.json();
    if (!authJson.success) {
      return new Response(JSON.stringify({ success: false, message: '인증 실패: 관리자 권한이 필요합니다' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    const now = new Date();
    const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const tomorrowStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const nextMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

    // Fetch only current month to compute both month and today
    const { data: monthVisits, error } = await supabase
      .from('visit_logs')
      .select('client_id, visited_at')
      .gte('visited_at', monthStart.toISOString())
      .lt('visited_at', nextMonthStart.toISOString());

    if (error) {
      console.error('[get-visitor-stats] month fetch error:', error);
      return new Response(JSON.stringify({ success: false, message: '데이터 조회 실패' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const monthlyUnique = new Set<string>();
    const todayUnique = new Set<string>();
    const dailyMap = new Map<string, Set<string>>();

    for (const v of monthVisits || []) {
      const cid = (v as any).client_id as string | null;
      const ts = new Date((v as any).visited_at);
      if (!cid || cid === 'null' || cid === 'undefined' || cid.trim() === '') continue;

      monthlyUnique.add(cid);

      const dayStr = ts.toISOString().split('T')[0];
      if (!dailyMap.has(dayStr)) dailyMap.set(dayStr, new Set());
      dailyMap.get(dayStr)!.add(cid);

      if (ts >= todayStart && ts < tomorrowStart) {
        todayUnique.add(cid);
      }
    }

    const monthlyVisitStats: VisitStat[] = Array.from(dailyMap.entries())
      .map(([date, set]) => ({ date, count: set.size }))
      .sort((a, b) => b.date.localeCompare(a.date));

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          todayVisitCount: todayUnique.size,
          monthlyVisitCount: monthlyUnique.size,
          monthlyVisitStats,
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    console.error('[get-visitor-stats] error:', e);
    return new Response(JSON.stringify({ success: false, message: '서버 오류' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
