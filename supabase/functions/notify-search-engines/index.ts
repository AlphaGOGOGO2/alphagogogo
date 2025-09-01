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
    console.log('🔔 검색엔진 알림 시작');
    
    const sitemapUrl = `${SITE_DOMAIN}/sitemap.xml`;
    const rssUrl = `${SITE_DOMAIN}/rss.xml`;
    
    const results = [];
    
    // 사이트맵과 RSS 접근성 검증
    console.log('📝 사이트맵/RSS 접근성 검증 중...');
    
    // 사이트맵 접근 테스트
    try {
      const sitemapTestResponse = await fetch(sitemapUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; alphagogogo-seo-bot/1.0)'
        }
      });
      
      results.push({
        service: 'Sitemap Accessibility Test',
        url: sitemapUrl,
        status: sitemapTestResponse.status,
        success: sitemapTestResponse.ok,
        contentType: sitemapTestResponse.headers.get('content-type')
      });
      
      console.log(`✅ 사이트맵 접근 테스트: ${sitemapTestResponse.status} (${sitemapTestResponse.headers.get('content-type')})`);
    } catch (error) {
      console.error('❌ 사이트맵 접근 테스트 실패:', error);
      results.push({
        service: 'Sitemap Accessibility Test',
        error: error.message,
        success: false
      });
    }
    
    // RSS 접근 테스트
    try {
      const rssTestResponse = await fetch(rssUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; alphagogogo-seo-bot/1.0)'
        }
      });
      
      results.push({
        service: 'RSS Accessibility Test',
        url: rssUrl,
        status: rssTestResponse.status,
        success: rssTestResponse.ok,
        contentType: rssTestResponse.headers.get('content-type')
      });
      
      console.log(`✅ RSS 접근 테스트: ${rssTestResponse.status} (${rssTestResponse.headers.get('content-type')})`);
    } catch (error) {
      console.error('❌ RSS 접근 테스트 실패:', error);
      results.push({
        service: 'RSS Accessibility Test',
        error: error.message,
        success: false
      });
    }
    
    // Google Search Console Ping (권장 방법)
    try {
      console.log('🔍 Google Search Console에 사이트맵 알림 중...');
      const googlePingUrl = `http://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
      const googleResponse = await fetch(googlePingUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; alphagogogo-seo-bot/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        redirect: 'follow'
      });
      
      const responseText = await googleResponse.text();
      
      results.push({
        service: 'Google Sitemap Ping',
        url: googlePingUrl,
        status: googleResponse.status,
        success: googleResponse.ok,
        responseText: responseText.substring(0, 200)
      });
      
      if (googleResponse.ok) {
        console.log('✅ Google 사이트맵 핑 성공');
      } else {
        console.warn(`⚠️ Google 사이트맵 핑: ${googleResponse.status} - ${responseText.substring(0, 100)}`);
      }
    } catch (error) {
      console.error('❌ Google 사이트맵 핑 에러:', error);
      results.push({
        service: 'Google Sitemap Ping',
        error: error.message,
        success: false
      });
    }
    
    // Bing Webmaster Tools Ping
    try {
      console.log('🔍 Bing Webmaster Tools에 사이트맵 알림 중...');
      const bingPingUrl = `http://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
      const bingResponse = await fetch(bingPingUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; alphagogogo-seo-bot/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        redirect: 'follow'
      });
      
      const responseText = await bingResponse.text();
      
      results.push({
        service: 'Bing Sitemap Ping',
        url: bingPingUrl,
        status: bingResponse.status,
        success: bingResponse.ok,
        responseText: responseText.substring(0, 200)
      });
      
      if (bingResponse.ok) {
        console.log('✅ Bing 사이트맵 핑 성공');
      } else {
        console.warn(`⚠️ Bing 사이트맵 핑: ${bingResponse.status} - ${responseText.substring(0, 100)}`);
      }
    } catch (error) {
      console.error('❌ Bing 사이트맵 핑 에러:', error);
      results.push({
        service: 'Bing Sitemap Ping',
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