
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, admin-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 인증 토큰 확인
    const adminToken = req.headers.get('admin-token');
    const correctToken = "authorized"; // 고정 값, 관리자 인증 시 사용되는 토큰
    
    if (adminToken !== correctToken) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "인증 실패: 관리자 권한이 필요합니다" 
        }),
        { 
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // 요청 본문 파싱
    const { action, postData, postId } = await req.json();

    // 기본 데이터 검증
    if (action === "create" && (!postData?.title || !postData?.content)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "필수 필드 누락: 제목과 내용이 필요합니다" 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Supabase 클라이언트 생성 (서비스 롤을 사용하여 RLS 우회)
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // readTime, excerpt, cover_image 계산 로직
    const readTime = calculateReadingTime(postData.content);
    const excerpt = generateExcerpt(postData.content);
    const coverImageUrl = extractFirstImageUrl(postData.content);
    
    let result;
    
    if (action === "create") {
      console.log("새 포스트 생성 시작, 제목:", postData.title);
      // 새 포스트 생성
      const slug = generateSlug(postData.title);
      console.log("생성된 슬러그:", slug);
      
      if (!slug || slug === "") {
        throw new Error("슬러그 생성 실패: 유효한 슬러그를 생성할 수 없습니다");
      }
      
      const newPost = {
        title: postData.title,
        content: postData.content,
        category: postData.category,
        cover_image: coverImageUrl || getCategoryThumbnail(postData.category),
        slug,
        read_time: readTime,
        excerpt,
        author_name: "알파GOGOGO",
        author_avatar: "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//instructor%20profile%20image.png",
        published_at: postData.published_at || new Date().toISOString()
      };

      console.log("DB 삽입 시작, 데이터:", {
        title: newPost.title,
        slug: newPost.slug,
        category: newPost.category
      });
      
      const { data, error } = await supabase
        .from("blog_posts")
        .insert(newPost)
        .select()
        .single();
      
      if (error) {
        console.error("DB 삽입 중 오류:", error);
        throw error;
      }
      
      console.log("DB 삽입 성공, ID:", data.id);
      
      // 태그 처리
      if (postData.tags && postData.tags.length > 0) {
        await handleTags(supabase, data.id, postData.tags);
      }
      
      // SEO 자동 갱신: 새 포스트 발행 시 사이트맵과 RSS 피드 자동 갱신
      console.log("SEO 자동 갱신 시작...");
      await refreshSEOFeeds(supabase);
      
      result = data;
      
    } else if (action === "update") {
      console.log("기존 포스트 업데이트 시작, ID:", postId);
      // 기존 포스트 업데이트
      if (!postId) {
        throw new Error("포스트 ID가 필요합니다");
      }
      
      const updateData = {
        title: postData.title,
        content: postData.content,
        category: postData.category,
        cover_image: coverImageUrl || getCategoryThumbnail(postData.category),
        read_time: readTime,
        excerpt,
        updated_at: new Date().toISOString()
      };
      
      // published_at이 제공된 경우에만 업데이트
      if (postData.published_at) {
        updateData.published_at = postData.published_at;
      }

      console.log("포스트 업데이트 데이터:", {
        title: updateData.title,
        category: updateData.category
      });
      
      const { data, error } = await supabase
        .from("blog_posts")
        .update(updateData)
        .eq("id", postId)
        .select()
        .single();
        
      if (error) {
        console.error("포스트 업데이트 중 오류:", error);
        throw error;
      }

      console.log("포스트 업데이트 성공, ID:", data.id);
      
      // 태그 처리 - 기존 태그 삭제 후 새로운 태그 추가
      if (postData.tags) {
        // 기존 태그 연결 삭제
        await supabase
          .from("blog_post_tags")
          .delete()
          .eq("blog_post_id", postId);
          
        if (postData.tags.length > 0) {
          await handleTags(supabase, postId, postData.tags);
        }
      }
      
      // SEO 자동 갱신: 포스트 업데이트 시에도 사이트맵과 RSS 피드 갱신
      console.log("SEO 자동 갱신 시작...");
      await refreshSEOFeeds(supabase);
      
      result = data;
    } else {
      throw new Error("유효하지 않은 액션: " + action);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: result
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
    
  } catch (error) {
    console.error("블로그 포스트 처리 중 오류:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message || "서버 오류가 발생했습니다",
        error: error
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

// 태그 처리 함수
async function handleTags(supabase, postId, tags) {
  for (const tagName of tags) {
    // 태그가 존재하는지 확인하고 없으면 생성
    let { data: existingTag } = await supabase
      .from("blog_tags")
      .select("id")
      .eq("name", tagName)
      .maybeSingle();
      
    let tagId;
    
    if (!existingTag) {
      // 태그 생성
      const { data: newTag, error: tagError } = await supabase
        .from("blog_tags")
        .insert({ name: tagName })
        .select()
        .single();
        
      if (tagError) throw tagError;
      tagId = newTag.id;
    } else {
      tagId = existingTag.id;
    }
    
    // 포스트와 태그 연결
    const { error: linkError } = await supabase
      .from("blog_post_tags")
      .insert({
        blog_post_id: postId,
        tag_id: tagId
      });
      
    if (linkError) throw linkError;
  }
}

// 읽기 시간 계산 함수
function calculateReadingTime(content) {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 250));
}

// 발췌문 생성 함수
function generateExcerpt(content) {
  if (!content) return "";
  let plainText = content.replace(/<[^>]*>/g, '');
  return plainText.length > 300 ? plainText.substring(0, 297) + '...' : plainText;
}

// 첫 번째 이미지 URL 추출 함수 - 개선된 버전
function extractFirstImageUrl(content) {
  if (!content) return null;
  
  // 1. CKEditor figure 태그 우선 처리
  const figureRegexes = [
    /<figure[^>]*class=[^>]*image[^>]*>.*?<img[^>]+src=['"]([^'"]+)['"][^>]*>.*?<\/figure>/is,
    /<figure[^>]*>.*?<img[^>]+src=['"]([^'"]+)['"][^>]*>.*?<\/figure>/is
  ];
  
  for (const regex of figureRegexes) {
    const match = content.match(regex);
    if (match && match[1] && isValidImageUrl(match[1])) {
      return match[1];
    }
  }
  
  // 2. 마크다운 이미지 문법: ![alt](url)
  const markdownImgRegex = /!\[.*?\]\((.*?)\)/i;
  const markdownMatch = content.match(markdownImgRegex);
  
  if (markdownMatch && markdownMatch[1] && isValidImageUrl(markdownMatch[1])) {
    return markdownMatch[1];
  }
  
  // 3. 일반 HTML img 태그들
  const imgTagRegexes = [
    /<img[^>]+src=['"]([^'"]+)['"]/i,
    /<p[^>]*>.*?<img[^>]+src=['"]([^'"]+)['"][^>]*>.*?<\/p>/is
  ];
  
  for (const regex of imgTagRegexes) {
    const match = content.match(regex);
    if (match && match[1] && isValidImageUrl(match[1])) {
      return match[1];
    }
  }
  
  // 4. Base64 이미지 찾기
  const base64Regex = /data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/i;
  const base64Match = content.match(base64Regex);
  
  if (base64Match && base64Match[0]) {
    return base64Match[0];
  }
  
  return null;
}

// 이미지 URL 유효성 검사 함수
function isValidImageUrl(url) {
  if (!url || url.trim() === '') return false;
  
  // Base64 이미지인 경우
  if (url.startsWith('data:image/')) return true;
  
  // HTTP/HTTPS URL인 경우
  if (url.startsWith('http://') || url.startsWith('https://')) return true;
  
  // 상대 경로인 경우 (Supabase Storage 등)
  if (url.startsWith('/') || url.startsWith('./')) return true;
  
  // 이미지 확장자 확인
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
  const hasImageExtension = imageExtensions.some(ext => 
    url.toLowerCase().includes(ext)
  );
  
  return hasImageExtension;
}

// 슬러그 생성 함수 개선 - 비어있는 슬러그 방지
function generateSlug(title) {
  if (!title || title.trim() === '') {
    return `post-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  }

  // 한글 및 특수문자에 대한 처리 강화
  const processed = title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\wㄱ-ㅎㅏ-ㅣ가-힣\-]/g, '') // 한글, 영문, 숫자, 하이픈만 유지
    .replace(/-+/g, '-'); // 연속된 하이픈 정리
  
  // 처리 후 결과가 비었을 경우 기본값 지정
  const base = processed || `post-${Date.now()}`;
  
  // 고유성 보장을 위한 타임스탬프와 랜덤값 추가
  return `${base}-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6)}`;
}

// 카테고리별 기본 썸네일 이미지 제공 함수
function getCategoryThumbnail(category) {
  const thumbnails = {
    'AI 뉴스': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=192&q=80',
    '테크 리뷰': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=192&q=80',
    '튜토리얼': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=192&q=80',
    'ChatGPT 가이드': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=192&q=80',
    '러브블 개발': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=192&q=80',
    '최신 업데이트': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=192&q=80',
    '트렌딩': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=192&q=80',
    '라이프스타일': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=192&q=80'
  };
  
  return thumbnails[category] || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=192&q=80';
}

// SEO 피드 자동 갱신 함수
async function refreshSEOFeeds(supabase) {
  try {
    console.log("사이트맵과 RSS 피드 자동 갱신 중...");
    
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
          console.log("✅ 사이트맵 자동 갱신 완료");
          return { type: 'sitemap', success: true };
        } else {
          console.error("❌ 사이트맵 갱신 실패:", response.status);
          return { type: 'sitemap', success: false };
        }
      }).catch(error => {
        console.error("❌ 사이트맵 갱신 오류:", error);
        return { type: 'sitemap', success: false };
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
          console.log("✅ RSS 피드 자동 갱신 완료");
          return { type: 'rss', success: true };
        } else {
          console.error("❌ RSS 피드 갱신 실패:", response.status);
          return { type: 'rss', success: false };
        }
      }).catch(error => {
        console.error("❌ RSS 피드 갱신 오류:", error);
        return { type: 'rss', success: false };
      })
    );
    
    // 모든 갱신 작업 완료 대기
    const results = await Promise.allSettled(promises);
    console.log("SEO 피드 자동 갱신 결과:", results);
    
  } catch (error) {
    console.error("SEO 피드 자동 갱신 중 오류:", error);
    // 오류가 발생해도 포스트 저장은 계속 진행
  }
}
