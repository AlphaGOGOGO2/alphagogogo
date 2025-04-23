
// Utility functions for blog posts

// Generate a slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim() + "-" + (Math.random().toString(36).substring(2, 10));
};

// Calculate reading time based on word count
// Average reading speed: 200-250 words per minute
export const calculateReadingTime = (content: string): number => {
  const textContent = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
  const words = textContent.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / 200); // Assuming 200 words per minute
  return Math.max(1, readingTime); // Minimum 1 minute
};

// 마크다운 제거 함수 (excerpt용)
// 링크, 이미지, 코드블럭, 강조 등 모든 마크다운 요소를 제거
export const stripMarkdown = (md: string): string => {
  if (!md) return '';
  
  return md
    // 마크다운 이미지 제거 - 이미지 처리를 링크보다 먼저 해야 ![alt](url) 패턴이 정확히 제거됨
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    // 링크 [텍스트](url) -> 텍스트만 남김
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // 인라인 코드 `코드` -> 코드만 남김
    .replace(/`([^`]+)`/g, '$1')
    // 헤더(#), 강조(*_), 인용(>), 리스트(-) 등 기타 마크다운 기호 제거
    .replace(/[*_~>#-]/g, '')
    // 여러 줄바꿈을 하나의 공백으로 변환
    .replace(/\n+/g, ' ')
    .trim();
};

// Generate excerpt from content, 마크다운 태그 제거
export const generateExcerpt = (content: string, maxLength: number = 150): string => {
  // 마크다운 → 일반 텍스트로 전환 후 자르기
  const textContent = stripMarkdown(content.replace(/<[^>]*>/g, ''));
  if (textContent.length <= maxLength) {
    return textContent;
  }
  return textContent.substring(0, maxLength).trim() + '...';
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
