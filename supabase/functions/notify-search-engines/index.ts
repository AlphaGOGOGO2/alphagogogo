import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const SITE_DOMAIN = 'https://alphagogogo.com';

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
    console.log('검색엔진 알림 요청 처리 시작');
    
    const sitemapUrl = `${SITE_DOMAIN}/sitemap.xml`;
    const rssUrl = `${SITE_DOMAIN}/rss.xml`;
    
    const results = [];
    
    // Google 핑
    try {
      const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
      const googleResponse = await fetch(googlePingUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; alphagogogo-seo-bot/1.0)'
        }
      });
      
      results.push({
        service: 'Google',
        url: googlePingUrl,
        status: googleResponse.status,
        success: googleResponse.ok
      });
      
      console.log(`Google 핑 결과: ${googleResponse.status} - ${googleResponse.ok ? '성공' : '실패'}`);
    } catch (error) {
      console.error('Google 핑 에러:', error);
      results.push({
        service: 'Google',
        error: error.message,
        success: false
      });
    }
    
    // Bing 핑
    try {
      const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
      const bingResponse = await fetch(bingPingUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; alphagogogo-seo-bot/1.0)'
        }
      });
      
      results.push({
        service: 'Bing',
        url: bingPingUrl,
        status: bingResponse.status,
        success: bingResponse.ok
      });
      
      console.log(`Bing 핑 결과: ${bingResponse.status} - ${bingResponse.ok ? '성공' : '실패'}`);
    } catch (error) {
      console.error('Bing 핑 에러:', error);
      results.push({
        service: 'Bing',
        error: error.message,
        success: false
      });
    }
    
    // RSS 피드 갱신도 함께 처리
    try {
      const rssResponse = await fetch(rssUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; alphagogogo-seo-bot/1.0)'
        }
      });
      
      results.push({
        service: 'RSS Feed Refresh',
        url: rssUrl,
        status: rssResponse.status,
        success: rssResponse.ok
      });
      
      console.log(`RSS 갱신 결과: ${rssResponse.status} - ${rssResponse.ok ? '성공' : '실패'}`);
    } catch (error) {
      console.error('RSS 갱신 에러:', error);
      results.push({
        service: 'RSS Feed Refresh',
        error: error.message,
        success: false
      });
    }
    
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;
    
    console.log(`검색엔진 알림 완료: ${successCount}/${totalCount} 성공`);
    
    return new Response(JSON.stringify({
      success: true,
      message: `검색엔진 알림 처리 완료: ${successCount}/${totalCount} 성공`,
      timestamp: new Date().toISOString(),
      results
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json; charset=utf-8',
      },
    });

  } catch (error) {
    console.error('검색엔진 알림 처리 에러:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  }
});