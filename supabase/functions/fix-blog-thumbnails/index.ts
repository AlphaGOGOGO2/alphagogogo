import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// 이미지 추출 로직 - 개선된 버전
function extractFirstImageUrl(content: string): string | null {
  if (!content) return null;
  
  // 1. 마크다운 이미지 문법: ![alt](url)
  const markdownImgRegex = /!\[.*?\]\((.*?)\)/i;
  const markdownMatch = content.match(markdownImgRegex);
  
  if (markdownMatch && markdownMatch[1] && isValidImageUrl(markdownMatch[1])) {
    return markdownMatch[1];
  }
  
  // 2. HTML img 태그 (CKEditor 포함) - 다양한 형태 지원
  const imgTagRegexes = [
    /<img[^>]+src=['"]([^'"]+)['"]/i,  // 기본 img 태그
    /<figure[^>]*>.*?<img[^>]+src=['"]([^'"]+)['"][^>]*>.*?<\/figure>/i, // CKEditor figure 태그
    /<p[^>]*>.*?<img[^>]+src=['"]([^'"]+)['"][^>]*>.*?<\/p>/i // p 태그 안의 img
  ];
  
  for (const regex of imgTagRegexes) {
    const match = content.match(regex);
    if (match && match[1] && isValidImageUrl(match[1])) {
      return match[1];
    }
  }
  
  // 3. Base64 이미지 찾기
  const base64Regex = /data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/i;
  const base64Match = content.match(base64Regex);
  
  if (base64Match && base64Match[0]) {
    return base64Match[0];
  }
  
  return null;
}

// 이미지 URL 유효성 검사 함수
function isValidImageUrl(url: string): boolean {
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

// 카테고리별 기본 썸네일 이미지 제공
function getCategoryThumbnail(category: string): string {
  const thumbnails: Record<string, string> = {
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

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('썸네일 수정 작업 시작...');

    // 모든 블로그 포스트 조회
    const { data: posts, error: fetchError } = await supabaseClient
      .from('blog_posts')
      .select('id, title, content, category, cover_image')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('포스트 조회 에러:', fetchError);
      throw fetchError;
    }

    if (!posts || posts.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: '수정할 포스트가 없습니다.',
          updated: 0 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    console.log(`총 ${posts.length}개 포스트 확인 중...`);

    let updatedCount = 0;
    const updatePromises = [];

    for (const post of posts) {
      // cover_image가 없거나 비어있는 경우만 처리
      if (!post.cover_image || post.cover_image.trim() === '') {
        console.log(`포스트 "${post.title}" 썸네일 수정 시작...`);
        
        // content에서 이미지 추출 시도
        let newCoverImage = null;
        
        if (post.content) {
          newCoverImage = extractFirstImageUrl(post.content);
        }
        
        // 추출된 이미지가 없으면 카테고리별 기본 이미지 사용
        if (!newCoverImage) {
          newCoverImage = getCategoryThumbnail(post.category);
        }
        
        // 데이터베이스 업데이트
        const updatePromise = supabaseClient
          .from('blog_posts')
          .update({ cover_image: newCoverImage })
          .eq('id', post.id)
          .then(({ error }) => {
            if (error) {
              console.error(`포스트 ${post.id} 업데이트 실패:`, error);
              return false;
            } else {
              console.log(`포스트 "${post.title}" 썸네일 업데이트 완료: ${newCoverImage}`);
              return true;
            }
          });
        
        updatePromises.push(updatePromise);
      }
    }

    // 모든 업데이트 실행
    const results = await Promise.all(updatePromises);
    updatedCount = results.filter(result => result === true).length;

    console.log(`썸네일 수정 완료. 총 ${updatedCount}개 포스트 업데이트됨`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `썸네일 수정이 완료되었습니다.`,
        total: posts.length,
        updated: updatedCount,
        skipped: posts.length - updatedCount
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('썸네일 수정 중 오류 발생:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        message: '썸네일 수정 중 오류가 발생했습니다.'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});