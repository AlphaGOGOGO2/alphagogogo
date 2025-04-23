
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
export const stripMarkdown = (md: string): string => {
  return md
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[*_~>#-]/g, '')
    .replace(/!\([^\]]*\)\([^)]+\)/g, '')
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

// Extract the first image URL from HTML content
export const extractFirstImageUrl = (htmlContent: string): string | null => {
  const imgRegex = /<img[^>]+src="([^">]+)"/i;
  const match = htmlContent.match(imgRegex);
  return match ? match[1] : null;
};
