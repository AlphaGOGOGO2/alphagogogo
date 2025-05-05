
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
      // 새 포스트 생성
      const slug = generateSlug(postData.title);
      
      const newPost = {
        title: postData.title,
        content: postData.content,
        category: postData.category,
        cover_image: coverImageUrl,
        slug,
        read_time: readTime,
        excerpt,
        author_name: "알파GOGOGO",
        author_avatar: "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//instructor%20profile%20image.png",
        published_at: postData.published_at || new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from("blog_posts")
        .insert(newPost)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // 태그 처리
      if (postData.tags && postData.tags.length > 0) {
        await handleTags(supabase, data.id, postData.tags);
      }
      
      result = data;
      
    } else if (action === "update") {
      // 기존 포스트 업데이트
      if (!postId) {
        throw new Error("포스트 ID가 필요합니다");
      }
      
      const updateData = {
        title: postData.title,
        content: postData.content,
        category: postData.category,
        cover_image: coverImageUrl,
        read_time: readTime,
        excerpt,
        updated_at: new Date().toISOString()
      };
      
      // published_at이 제공된 경우에만 업데이트
      if (postData.published_at) {
        updateData.published_at = postData.published_at;
      }
      
      const { data, error } = await supabase
        .from("blog_posts")
        .update(updateData)
        .eq("id", postId)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
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
  if (!content) return null;
  let plainText = content.replace(/<[^>]*>/g, '');
  return plainText.length > 300 ? plainText.substring(0, 297) + '...' : plainText;
}

// 첫 번째 이미지 URL 추출 함수
function extractFirstImageUrl(content) {
  if (!content) return null;
  const imgTagRegex = /<img[^>]+src="([^">]+)"/;
  const match = content.match(imgTagRegex);
  return match ? match[1] : null;
}

// 슬러그 생성 함수
function generateSlug(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
