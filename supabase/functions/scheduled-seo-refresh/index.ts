import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('📡 예약된 SEO 최적화 작업 시작');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. 사이트맵 재생성
    console.log('🗺️ 사이트맵 재생성 중...');
    const sitemapResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/sitemap`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
      },
    });

    if (!sitemapResponse.ok) {
      console.error('❌ 사이트맵 재생성 실패:', sitemapResponse.status);
    } else {
      console.log('✅ 사이트맵 재생성 완료');
    }

    // 2. RSS 피드 재생성
    console.log('📄 RSS 피드 재생성 중...');
    const rssResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/rss-feed`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
      },
    });

    if (!rssResponse.ok) {
      console.error('❌ RSS 피드 재생성 실패:', rssResponse.status);
    } else {
      console.log('✅ RSS 피드 재생성 완료');
    }

    // 3. Google에 사이트맵 제출 알림 (핑)
    console.log('🔔 Google에 사이트맵 업데이트 알림 중...');
    try {
      const pingUrl = `http://www.google.com/ping?sitemap=https://alphagogogo.com/sitemap.xml`;
      const pingResponse = await fetch(pingUrl);
      
      if (pingResponse.ok) {
        console.log('✅ Google 사이트맵 핑 성공');
      } else {
        console.error('⚠️ Google 사이트맵 핑 실패:', pingResponse.status);
      }
    } catch (error) {
      console.error('⚠️ Google 사이트맵 핑 오류:', error);
    }

    // 4. Bing에 사이트맵 제출 알림
    console.log('🔔 Bing에 사이트맵 업데이트 알림 중...');
    try {
      const bingPingUrl = `http://www.bing.com/ping?sitemap=https://alphagogogo.com/sitemap.xml`;
      const bingPingResponse = await fetch(bingPingUrl);
      
      if (bingPingResponse.ok) {
        console.log('✅ Bing 사이트맵 핑 성공');
      } else {
        console.error('⚠️ Bing 사이트맵 핑 실패:', bingPingResponse.status);
      }
    } catch (error) {
      console.error('⚠️ Bing 사이트맵 핑 오류:', error);
    }

    // 5. 통계 조회 및 로깅
    const { data: postsCount } = await supabase
      .from('blog_posts')
      .select('id', { count: 'exact', head: true });

    const { data: resourcesCount } = await supabase
      .from('resources')
      .select('id', { count: 'exact', head: true });

    console.log(`📊 현재 콘텐츠 통계:`);
    console.log(`   - 블로그 포스트: ${postsCount?.length || 0}개`);
    console.log(`   - 리소스: ${resourcesCount?.length || 0}개`);
    console.log(`   - 총 예상 사이트맵 페이지: ${16 + (postsCount?.length || 0) + (resourcesCount?.length || 0)}개`);

    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      sitemap_regenerated: sitemapResponse.ok,
      rss_regenerated: rssResponse.ok,
      google_pinged: true,
      bing_pinged: true,
      content_stats: {
        blog_posts: postsCount?.length || 0,
        resources: resourcesCount?.length || 0,
        total_pages: 16 + (postsCount?.length || 0) + (resourcesCount?.length || 0)
      }
    };

    console.log('🎉 예약된 SEO 최적화 작업 완료');

    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error) {
    console.error('❌ 예약된 SEO 최적화 작업 실패:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
});