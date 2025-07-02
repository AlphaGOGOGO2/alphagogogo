
// Utility functions for blog posts

// 개선된 슬러그 생성 함수 - 더 짧고 깔끔한 URL 생성
export const generateSlug = (title: string): string => {
  if (!title || title.trim() === '') {
    // 제목이 비어있을 경우, 현재 시간과 랜덤 문자열로 대체
    return `post-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  }

  // 한글 및 영문을 포함한 슬러그 생성 (더 짧게 최적화)
  const processed = title
    .trim()
    .toLowerCase()
    // 공백을 하이픈으로 변환
    .replace(/\s+/g, '-')
    // 특수문자 제거 (한글, 영문, 숫자, 하이픈만 유지)
    .replace(/[^\wㄱ-ㅎㅏ-ㅣ가-힣\-]/g, '')
    // 연속된 하이픈 단일화
    .replace(/-+/g, '-')
    // 앞뒤 하이픈 제거
    .replace(/^-+|-+$/g, '');

  // 슬러그가 너무 길면 앞의 50자만 사용
  let slug = processed;
  if (slug.length > 50) {
    slug = slug.substring(0, 50).replace(/-[^-]*$/, ''); // 마지막 불완전한 단어 제거
  }
  
  // 처리된 문자열이 비었을 경우 기본값
  if (!slug) {
    slug = 'post';
  }
  
  // 더 짧은 고유 식별자 추가 (8자리)
  const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2, 4);
  
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

// Generate excerpt from content, 마크다운 태그 제거 - 성능 최적화
export const generateExcerpt = (content: string, maxLength: number = 150): string => {
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
      console.log('이미지 추출 성공 (figure):', match[1]);
      return match[1];
    }
  }
  
  // 2. 마크다운 이미지 문법: ![alt](url)
  const markdownImgRegex = /!\[([^\]]*)\]\(([^)]+)\)/i;
  const markdownMatch = content.match(markdownImgRegex);
  
  if (markdownMatch && markdownMatch[2] && isValidImageUrl(markdownMatch[2])) {
    console.log('이미지 추출 성공 (markdown):', markdownMatch[2]);
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
      console.log('이미지 추출 성공 (HTML):', url);
      return url;
    }
  }
  
  // 4. Base64 이미지 찾기
  const base64Regex = /data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/i;
  const base64Match = content.match(base64Regex);
  
  if (base64Match && base64Match[0]) {
    console.log('이미지 추출 성공 (Base64)');
    return base64Match[0];
  }
  
  console.log('이미지 추출 실패:', content.substring(0, 200) + '...');
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
