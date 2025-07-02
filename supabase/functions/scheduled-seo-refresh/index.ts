import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🕐 정기적 SEO 갱신 시작 - " + new Date().toLocaleString('ko-KR'));
    
    // 사이트맵과 RSS 피드를 병렬로 갱신
    const promises = [];
    
    // 사이트맵 갱신
    promises.push(
      fetch('https://plimzlmmftdbpipbnhsy.supabase.co/functions/v1/sitemap', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
        }
      }).then(response => {
        if (response.ok) {
          console.log("✅ 사이트맵 정기 갱신 완료");
          return { type: 'sitemap', success: true, timestamp: new Date().toISOString() };
        } else {
          console.error("❌ 사이트맵 정기 갱신 실패:", response.status);
          return { type: 'sitemap', success: false, error: response.status };
        }
      }).catch(error => {
        console.error("❌ 사이트맵 정기 갱신 오류:", error);
        return { type: 'sitemap', success: false, error: error.message };
      })
    );
    
    // RSS 피드 갱신
    promises.push(
      fetch('https://plimzlmmftdbpipbnhsy.supabase.co/functions/v1/rss-feed', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
        }
      }).then(response => {
        if (response.ok) {
          console.log("✅ RSS 피드 정기 갱신 완료");
          return { type: 'rss', success: true, timestamp: new Date().toISOString() };
        } else {
          console.error("❌ RSS 피드 정기 갱신 실패:", response.status);
          return { type: 'rss', success: false, error: response.status };
        }
      }).catch(error => {
        console.error("❌ RSS 피드 정기 갱신 오류:", error);
        return { type: 'rss', success: false, error: error.message };
      })
    );
    
    // 모든 갱신 작업 완료 대기
    const results = await Promise.allSettled(promises);
    
    // 결과 정리
    const sitemapResult = results[0].status === 'fulfilled' ? results[0].value : { type: 'sitemap', success: false, error: 'Promise rejected' };
    const rssResult = results[1].status === 'fulfilled' ? results[1].value : { type: 'rss', success: false, error: 'Promise rejected' };
    
    const successCount = [sitemapResult, rssResult].filter(r => r.success).length;
    const totalCount = 2;
    
    console.log(`🏁 정기 SEO 갱신 완료: ${successCount}/${totalCount} 성공`);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `정기 SEO 갱신 완료: ${successCount}/${totalCount} 성공`,
        timestamp: new Date().toISOString(),
        results: {
          sitemap: sitemapResult,
          rss: rssResult
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error("정기 SEO 갱신 중 전체 오류:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: "정기 SEO 갱신 중 오류 발생",
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});