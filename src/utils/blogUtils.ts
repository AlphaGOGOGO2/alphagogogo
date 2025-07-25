
// Utility functions for blog posts

// SEO 최적화된 슬러그 생성 함수 - 간결하고 의미있는 URL 생성
export const generateSlug = (title: string): string => {
  if (!title || title.trim() === '') {
    // 제목이 비어있을 경우, 짧은 랜덤 식별자
    return `post-${Math.random().toString(36).substring(2, 8)}`;
  }

  // 한글과 영문을 SEO 친화적으로 처리
  let slug = title
    .trim()
    .toLowerCase()
    // 한글을 영어 키워드로 변환 (주요 키워드만)
    .replace(/러버블\s*dev/gi, 'lovable-dev')
    .replace(/ai\s*뉴스/gi, 'ai-news')
    .replace(/챗\s*gpt/gi, 'chatgpt')
    .replace(/가이드/gi, 'guide')
    .replace(/튜토리얼/gi, 'tutorial')
    .replace(/리뷰/gi, 'review')
    .replace(/블로그/gi, 'blog')
    .replace(/최신/gi, 'latest')
    .replace(/업데이트/gi, 'update')
    .replace(/분석/gi, 'analysis')
    .replace(/완벽/gi, 'complete')
    // 공백을 하이픈으로 변환
    .replace(/\s+/g, '-')
    // 특수문자 제거 (영문, 숫자, 하이픈만 유지)
    .replace(/[^a-z0-9\-]/g, '')
    // 연속된 하이픈 단일화
    .replace(/-+/g, '-')
    // 앞뒤 하이픈 제거
    .replace(/^-+|-+$/g, '');

  // 슬러그가 너무 길면 의미있는 단위로 자르기
  if (slug.length > 40) {
    const words = slug.split('-');
    slug = words.slice(0, 6).join('-'); // 첫 6개 단어만 사용
  }
  
  // 처리된 문자열이 비었거나 너무 짧을 경우
  if (!slug || slug.length < 3) {
    // 제목에서 핵심 키워드 추출 시도
    const coreKeywords = title.match(/러버블|AI|챗GPT|블로그|가이드|튜토리얼|리뷰/gi);
    if (coreKeywords && coreKeywords.length > 0) {
      slug = coreKeywords[0].toLowerCase().replace(/[^a-z]/g, '') + '-post';
    } else {
      slug = 'blog-post';
    }
  }
  
  // 고유성을 위한 짧은 식별자 추가 (4자리만)
  const uniqueId = Math.random().toString(36).substring(2, 6);
  
  return `${slug}-${uniqueId}`;
};

// Calculate reading time based on word count
// Average reading speed: 200-250 words per minute
export const calculateReadingTime = (content: string): number => {
  // HTML 태그와 마크다운 태그 제거
  const textContent = stripMarkdown(content.replace(/<[^>]*>/g, '')); 
  
  // 한글과 영어 단어를 모두 고려한 읽기 시간 계산
  const koreanChars = (textContent.match(/[가-힣]/g) || []).length;
  const englishWords = textContent.replace(/[가-힣]/g, '').trim().split(/\s+/).filter(word => word.length > 0).length;
  
  // 한글: 400자/분, 영어: 200단어/분 기준
  const readingTime = Math.ceil((koreanChars / 400) + (englishWords / 200));
  return Math.max(1, readingTime); // 최소 1분
};

// 마크다운 제거 함수 (excerpt용) - 성능 최적화
export const stripMarkdown = (md: string): string => {
  if (!md) return '';
  
  return md
    // 마크다운 이미지 제거 - 이미지 처리를 링크보다 먼저 해야 ![alt](url) 패턴이 정확히 제거됨
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    // 링크 [텍스트](url) -> 텍스트만 남김
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // 인라인 코드 `코드` -> 코드만 남김
    .replace(/`([^`]+)`/g, '$1')
    // 코드 블록 제거
    .replace(/```[\s\S]*?```/g, '')
    // 헤더(#), 강조(*_), 인용(>), 리스트(-) 등 기타 마크다운 기호 제거
    .replace(/[*_~>#\-\+]/g, '')
    // 여러 줄바꿈을 하나의 공백으로 변환
    .replace(/\n+/g, ' ')
    // 여러 공백을 하나로 통합
    .replace(/\s+/g, ' ')
    .trim();
};

// Generate SEO-optimized excerpt from content - 향상된 SEO 최적화
export const generateExcerpt = (content: string, maxLength: number = 160): string => {
  if (!content) return '';
  
  // 마크다운과 HTML 태그 제거
  const textContent = stripMarkdown(content.replace(/<[^>]*>/g, ''));
  
  if (textContent.length <= maxLength) {
    return textContent;
  }
  
  // 단어 단위로 자르기 (한글의 경우 음절 단위)
  const truncated = textContent.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  // 마지막 공백 위치에서 자르거나, 없으면 그대로 자르기
  const finalText = lastSpaceIndex > maxLength * 0.8 
    ? truncated.substring(0, lastSpaceIndex) 
    : truncated;
    
  return finalText.trim() + '...';
};

// SEO 최적화된 메타 설명 생성 함수
export const generateSEODescription = (content: string, title: string, category: string): string => {
  const excerpt = generateExcerpt(content, 140);
  
  // 카테고리별 키워드 추가
  const categoryKeywords = {
    'AI 뉴스': 'AI 뉴스, 인공지능 최신 소식',
    '테크 리뷰': '기술 리뷰, 제품 분석',
    '튜토리얼': '튜토리얼, 가이드, 사용법',
    'ChatGPT 가이드': 'ChatGPT, 챗GPT 활용법',
    '러브블 개발': '러버블 개발, 웹개발',
    '최신 업데이트': '최신 업데이트, 신규 기능',
    '트렌딩': '트렌딩, 인기 주제',
    '라이프스타일': '라이프스타일, 일상 활용'
  };
  
  const keywords = categoryKeywords[category] || '실용적인 정보';
  
  // 설명 + 키워드 조합 (160자 제한)
  const description = `${excerpt} ${keywords}, 알파고고고에서 제공하는 비개발자를 위한 실용적인 가이드입니다.`;
  
  return description.length > 160 ? description.substring(0, 157) + '...' : description;
};

// SEO 최적화된 제목 생성 함수 (50-60자 최적화)
export const generateSEOTitle = (title: string, category: string): string => {
  // 브랜드명 제거하고 핵심만 추출
  const cleanTitle = title.replace(/알파고고고|알파고|GOGOGO/gi, '').trim();
  
  // 카테고리별 키워드 추가
  const categoryKeywords = {
    'AI 뉴스': 'AI 뉴스',
    '테크 리뷰': '리뷰',
    '튜토리얼': '가이드',
    'ChatGPT 가이드': 'ChatGPT',
    '러브블 개발': '개발',
    '최신 업데이트': '업데이트',
    '트렌딩': '트렌딩',
    '라이프스타일': '활용법'
  };
  
  const keyword = categoryKeywords[category] || '';
  
  // 제목 구성: 핵심제목 + 키워드 + 브랜드
  let seoTitle = keyword ? `${cleanTitle} ${keyword} | 알파고고고` : `${cleanTitle} | 알파고고고`;
  
  // 60자 제한
  if (seoTitle.length > 60) {
    const maxTitleLength = 60 - '| 알파고고고'.length - 1;
    const truncatedTitle = cleanTitle.substring(0, maxTitleLength);
    seoTitle = `${truncatedTitle}... | 알파고고고`;
  }
  
  return seoTitle;
};

// Extract the first image URL from markdown content or HTML content - 강화된 버전
export const extractFirstImageUrl = (content: string): string | null => {
  if (!content) return null;
  
  // 1. CKEditor figure 태그 우선 처리 (가장 구체적인 패턴부터)
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
  const markdownImgRegex = /!\[([^\]]*)\]\(([^)]+)\)/i;
  const markdownMatch = content.match(markdownImgRegex);
  
  if (markdownMatch && markdownMatch[2] && isValidImageUrl(markdownMatch[2])) {
    return markdownMatch[2];
  }
  
  // 3. 일반 HTML img 태그들
  const imgTagRegexes = [
    /<img[^>]+src=['"]([^'"]+)['"][^>]*alt=['"]([^'"]*image[^'"]*)['"][^>]*>/i, // alt에 image 포함
    /<img[^>]+alt=['"]([^'"]*image[^'"]*)['"][^>]*src=['"]([^'"]+)['"][^>]*>/i, // alt에 image 포함 (순서 바뀜)
    /<img[^>]+src=['"]([^'"]+)['"]/i,  // 기본 img 태그
    /<p[^>]*>.*?<img[^>]+src=['"]([^'"]+)['"][^>]*>.*?<\/p>/is // p 태그 안의 img
  ];
  
  for (const regex of imgTagRegexes) {
    const match = content.match(regex);
    const url = match && match.length > 1 ? (match[2] || match[1]) : null;
    if (url && isValidImageUrl(url)) {
      return url;
    }
  }
  
  // 4. Base64 이미지 찾기
  const base64Regex = /data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/i;
  const base64Match = content.match(base64Regex);
  
  if (base64Match && base64Match[0]) {
    return base64Match[0];
  }
  
  return null;
};

// 이미지 URL 유효성 검사 함수
const isValidImageUrl = (url: string): boolean => {
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
};

// 이미지 최적화를 위한 유틸리티 함수들
export const optimizeImageUrl = (url: string, width?: number, quality?: number): string => {
  if (!url) return '';
  
  // Supabase Storage URL인 경우 최적화 파라미터 추가
  if (url.includes('supabase.co/storage')) {
    const params = new URLSearchParams();
    if (width) params.append('width', width.toString());
    if (quality) params.append('quality', quality.toString());
    
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  }
  
  return url;
};

// 카테고리별 기본 썸네일 이미지 제공
export const getCategoryThumbnail = (category: string): string => {
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
};

// 이미지 alt 태그 자동 생성 함수
export const generateImageAlt = (imageSrc: string, postTitle: string, category: string): string => {
  // 이미지 파일명에서 정보 추출
  const filename = imageSrc.split('/').pop()?.split('.')[0] || '';
  
  // 카테고리별 기본 설명
  const categoryContext = {
    'AI 뉴스': 'AI 뉴스 관련 이미지',
    '테크 리뷰': '기술 제품 리뷰 이미지',
    '튜토리얼': '가이드 설명 이미지',
    'ChatGPT 가이드': 'ChatGPT 활용 가이드 이미지',
    '러브블 개발': '웹개발 관련 이미지',
    '최신 업데이트': '업데이트 소식 이미지',
    '트렌딩': '트렌딩 주제 이미지',
    '라이프스타일': '라이프스타일 관련 이미지'
  };
  
  const context = categoryContext[category] || '블로그 포스트 이미지';
  
  // alt 텍스트 생성
  const altText = `${postTitle} - ${context}`;
  
  return altText.length > 100 ? altText.substring(0, 97) + '...' : altText;
};

// 롱테일 키워드 생성 함수
export const generateLongTailKeywords = (title: string, category: string, tags: string[] = []): string[] => {
  const baseKeywords = ['알파고고고', 'AI', '인공지능', '비개발자'];
  
  // 제목에서 핵심 키워드 추출
  const titleKeywords = title.toLowerCase().match(/ai|chatgpt|gpt|클로드|제미나이|블로그|가이드|튜토리얼|리뷰|개발|업데이트/g) || [];
  
  // 카테고리별 롱테일 키워드
  const categoryLongTail = {
    'AI 뉴스': ['최신 AI 소식', 'AI 업계 동향', 'AI 기술 발전'],
    '테크 리뷰': ['기술 제품 비교', '실사용 후기', '제품 장단점 분석'],
    '튜토리얼': ['초보자 가이드', '단계별 설명', '쉬운 사용법'],
    'ChatGPT 가이드': ['ChatGPT 활용팁', '프롬프트 작성법', 'AI 대화 기술'],
    '러브블 개발': ['노코드 개발', '웹사이트 제작', '개발 도구'],
    '최신 업데이트': ['신기능 소개', '업데이트 내용', '변경사항 정리'],
    '트렌딩': ['인기 주제', '화제의 기술', '주목받는 AI'],
    '라이프스타일': ['일상 AI 활용', '생산성 향상', 'AI 라이프해킹']
  };
  
  const categoryKeywords = categoryLongTail[category] || ['실용적인 정보'];
  
  // 모든 키워드 조합
  return [...baseKeywords, ...titleKeywords, ...categoryKeywords, ...tags].filter(Boolean);
};

// 내부 링크 자동 생성 함수
export const generateInternalLinks = (content: string, allPosts: any[] = []): string => {
  if (!allPosts.length) return content;
  
  // 관련 포스트에서 링크할 키워드 찾기
  const linkableKeywords = ['ChatGPT', 'AI', '인공지능', '러버블', '블로그', '가이드', '튜토리얼'];
  
  let linkedContent = content;
  
  linkableKeywords.forEach(keyword => {
    const relatedPost = allPosts.find(post => 
      post.title.includes(keyword) && post.slug
    );
    
    if (relatedPost) {
      // 첫 번째 등장하는 키워드만 링크로 변환
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(linkedContent) && !linkedContent.includes(`[${keyword}]`)) {
        linkedContent = linkedContent.replace(
          regex, 
          `[${keyword}](/blog/${relatedPost.slug})`
        );
      }
    }
  });
  
  return linkedContent;
};

// 성능 최적화를 위한 debounce 함수
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};
