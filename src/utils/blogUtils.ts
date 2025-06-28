
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

// Extract the first image URL from markdown content or HTML content
export const extractFirstImageUrl = (content: string): string | null => {
  if (!content) return null;
  
  // First try to find markdown image syntax: ![alt](url)
  const markdownImgRegex = /!\[.*?\]\((.*?)\)/i;
  const markdownMatch = content.match(markdownImgRegex);
  
  if (markdownMatch && markdownMatch[1]) {
    return markdownMatch[1];
  }
  
  // If no markdown image found, try to find HTML img tag
  const imgRegex = /<img[^>]+src="([^">]+)"/i;
  const htmlMatch = content.match(imgRegex);
  
  return htmlMatch ? htmlMatch[1] : null;
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
