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
    console.log('🔍 SEO 상태 점검 시작');
    
    const results = {
      timestamp: new Date().toISOString(),
      site_domain: SITE_DOMAIN,
      checks: []
    };
    
    // 1. 사이트맵 접근성 점검
    console.log('📋 사이트맵 점검 중...');
    try {
      const sitemapResponse = await fetch(`${SITE_DOMAIN}/sitemap.xml`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SEO-Status-Check/1.0)'
        }
      });
      
      const sitemapText = await sitemapResponse.text();
      const urlCount = (sitemapText.match(/<loc>/g) || []).length;
      
      results.checks.push({
        name: 'Sitemap Accessibility',
        status: sitemapResponse.ok ? 'PASS' : 'FAIL',
        details: {
          http_status: sitemapResponse.status,
          content_type: sitemapResponse.headers.get('content-type'),
          url_count: urlCount,
          size_kb: Math.round(sitemapText.length / 1024)
        }
      });
      
      console.log(`✅ 사이트맵: ${sitemapResponse.status} (${urlCount}개 URL)`);
    } catch (error) {
      results.checks.push({
        name: 'Sitemap Accessibility',
        status: 'ERROR',
        error: error.message
      });
      console.error('❌ 사이트맵 점검 실패:', error);
    }
    
    // 2. RSS 피드 접근성 점검
    console.log('📡 RSS 피드 점검 중...');
    try {
      const rssResponse = await fetch(`${SITE_DOMAIN}/rss.xml`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SEO-Status-Check/1.0)'
        }
      });
      
      const rssText = await rssResponse.text();
      const itemCount = (rssText.match(/<item>/g) || []).length;
      
      results.checks.push({
        name: 'RSS Feed Accessibility',
        status: rssResponse.ok ? 'PASS' : 'FAIL',
        details: {
          http_status: rssResponse.status,
          content_type: rssResponse.headers.get('content-type'),
          item_count: itemCount,
          size_kb: Math.round(rssText.length / 1024)
        }
      });
      
      console.log(`✅ RSS 피드: ${rssResponse.status} (${itemCount}개 아이템)`);
    } catch (error) {
      results.checks.push({
        name: 'RSS Feed Accessibility',
        status: 'ERROR',
        error: error.message
      });
      console.error('❌ RSS 피드 점검 실패:', error);
    }
    
    // 3. robots.txt 점검
    console.log('🤖 robots.txt 점검 중...');
    try {
      const robotsResponse = await fetch(`${SITE_DOMAIN}/robots.txt`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SEO-Status-Check/1.0)'
        }
      });
      
      const robotsText = await robotsResponse.text();
      const hasSitemap = robotsText.includes('Sitemap:');
      
      results.checks.push({
        name: 'Robots.txt Accessibility',
        status: robotsResponse.ok ? 'PASS' : 'FAIL',
        details: {
          http_status: robotsResponse.status,
          content_type: robotsResponse.headers.get('content-type'),
          has_sitemap_directive: hasSitemap,
          size_bytes: robotsText.length
        }
      });
      
      console.log(`✅ robots.txt: ${robotsResponse.status} (사이트맵 지시문: ${hasSitemap})`);
    } catch (error) {
      results.checks.push({
        name: 'Robots.txt Accessibility',
        status: 'ERROR',
        error: error.message
      });
      console.error('❌ robots.txt 점검 실패:', error);
    }
    
    // 4. 메인 페이지 접근성 점검
    console.log('🏠 메인 페이지 점검 중...');
    try {
      const homeResponse = await fetch(SITE_DOMAIN, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SEO-Status-Check/1.0)'
        }
      });
      
      const homeText = await homeResponse.text();
      const hasTitle = homeText.includes('<title>');
      const hasMetaDescription = homeText.includes('name="description"');
      const hasOgTags = homeText.includes('property="og:');
      
      results.checks.push({
        name: 'Homepage Accessibility',
        status: homeResponse.ok ? 'PASS' : 'FAIL',
        details: {
          http_status: homeResponse.status,
          has_title: hasTitle,
          has_meta_description: hasMetaDescription,
          has_og_tags: hasOgTags,
          size_kb: Math.round(homeText.length / 1024)
        }
      });
      
      console.log(`✅ 메인 페이지: ${homeResponse.status} (SEO 태그 포함)`);
    } catch (error) {
      results.checks.push({
        name: 'Homepage Accessibility',
        status: 'ERROR',
        error: error.message
      });
      console.error('❌ 메인 페이지 점검 실패:', error);
    }
    
    // 5. 전체 상태 요약
    const totalChecks = results.checks.length;
    const passedChecks = results.checks.filter(check => check.status === 'PASS').length;
    const failedChecks = results.checks.filter(check => check.status === 'FAIL').length;
    const errorChecks = results.checks.filter(check => check.status === 'ERROR').length;
    
    results.summary = {
      total_checks: totalChecks,
      passed: passedChecks,
      failed: failedChecks,
      errors: errorChecks,
      score: Math.round((passedChecks / totalChecks) * 100),
      status: passedChecks === totalChecks ? 'HEALTHY' : (failedChecks + errorChecks > totalChecks / 2 ? 'CRITICAL' : 'WARNING')
    };
    
    console.log(`🎯 SEO 상태 점검 완료: ${passedChecks}/${totalChecks} 통과 (${results.summary.score}%)`);
    
    return new Response(JSON.stringify(results, null, 2), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json; charset=utf-8',
      },
    });

  } catch (error) {
    console.error('❌ SEO 상태 점검 오류:', error);
    
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