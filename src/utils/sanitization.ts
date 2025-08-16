import DOMPurify from 'dompurify';

// Configure DOMPurify for safe HTML rendering
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'a', 'img'
];

const ALLOWED_ATTRIBUTES = ['href', 'title', 'target', 'src', 'alt', 'width', 'height', 'class'];

// Sanitize HTML content for blog posts
export const sanitizeHTML = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ALLOWED_ATTRIBUTES,
    ALLOW_DATA_ATTR: false,
    FORCE_BODY: true,
    ALLOWED_URI_REGEXP: /^https?:/i
  });
};

// Sanitize text content (removes all HTML)
export const sanitizeText = (text: string): string => {
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
};

// Validate and sanitize blog post data
export const validateBlogPost = (data: any) => {
  const errors: string[] = [];

  // Validate title
  if (!data.title || typeof data.title !== 'string') {
    errors.push('제목은 필수입니다');
  } else if (data.title.length > 200) {
    errors.push('제목은 200자를 초과할 수 없습니다');
  }

  // Validate content
  if (!data.content || typeof data.content !== 'string') {
    errors.push('내용은 필수입니다');
  } else if (data.content.length > 50000) {
    errors.push('내용은 50,000자를 초과할 수 없습니다');
  }

  // Validate category
  if (!data.category || typeof data.category !== 'string') {
    errors.push('카테고리는 필수입니다');
  }

  // Validate excerpt
  if (data.excerpt && data.excerpt.length > 500) {
    errors.push('요약은 500자를 초과할 수 없습니다');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: {
      title: data.title ? sanitizeText(data.title) : '',
      content: data.content ? sanitizeHTML(data.content) : '',
      excerpt: data.excerpt ? sanitizeText(data.excerpt) : null,
      category: data.category ? sanitizeText(data.category) : ''
    }
  };
};

// Validate chat message
export const validateChatMessage = (content: string, nickname: string) => {
  const errors: string[] = [];

  // Validate nickname
  if (!nickname || nickname.length < 1 || nickname.length > 20) {
    errors.push('닉네임은 1-20자 사이여야 합니다');
  }

  // Validate content
  if (!content || content.length < 1 || content.length > 500) {
    errors.push('메시지는 1-500자 사이여야 합니다');
  }

  // Check for URLs
  if (content.match(/(http:\/\/|https:\/\/|www\.)/)) {
    errors.push('URL은 포함할 수 없습니다');
  }

  // Check for excessive repeated characters
  if (content.match(/(.)\1{10,}/)) {
    errors.push('동일한 문자를 10개 이상 연속으로 사용할 수 없습니다');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: {
      content: sanitizeText(content),
      nickname: sanitizeText(nickname)
    }
  };
};

// Enhanced rate limiting utility with progressive backoff
export const checkRateLimit = (key: string, limit: number, windowMs: number): boolean => {
  const now = Date.now();
  const rateLimitKey = `rate_limit_${key}`;
  const stored = localStorage.getItem(rateLimitKey);
  
  if (!stored) {
    localStorage.setItem(rateLimitKey, JSON.stringify({ count: 1, resetTime: now + windowMs, attempts: [now] }));
    return true;
  }

  const data = JSON.parse(stored);
  
  if (now > data.resetTime) {
    localStorage.setItem(rateLimitKey, JSON.stringify({ count: 1, resetTime: now + windowMs, attempts: [now] }));
    return true;
  }

  if (data.count >= limit) {
    return false;
  }

  data.count++;
  data.attempts = data.attempts || [];
  data.attempts.push(now);
  localStorage.setItem(rateLimitKey, JSON.stringify(data));
  return true;
};

// Get progressive delay for rate limiting
export const getRateLimitDelay = (key: string): number => {
  const rateLimitKey = `rate_limit_${key}`;
  const stored = localStorage.getItem(rateLimitKey);
  
  if (!stored) return 0;
  
  const data = JSON.parse(stored);
  const attempts = data.attempts || [];
  const recentAttempts = attempts.filter((time: number) => Date.now() - time < 60000); // 1 minute window
  
  if (recentAttempts.length <= 2) return 0;
  
  // Progressive delay: 1s, 2s, 4s, 8s, max 30s
  const delay = Math.min(30000, Math.pow(2, recentAttempts.length - 2) * 1000);
  return delay;
};

// Enhanced file validation
export const validateFileUpload = (file: File): { isValid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: '허용되지 않는 파일 형식입니다. JPEG, PNG, GIF, WebP만 지원됩니다.' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, error: '파일 크기가 5MB를 초과합니다.' };
  }
  
  // Check file header for actual file type
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arr = new Uint8Array(e.target?.result as ArrayBuffer);
      let header = '';
      for (let i = 0; i < arr.length && i < 4; i++) {
        header += arr[i].toString(16);
      }
      
      // Check magic numbers for common image formats
      const validHeaders = ['ffd8ff', '89504e', '474946', '52494646'];
      const isValidImage = validHeaders.some(h => header.startsWith(h));
      
      resolve({ 
        isValid: isValidImage, 
        error: isValidImage ? undefined : '유효하지 않은 이미지 파일입니다.' 
      });
    };
    reader.readAsArrayBuffer(file.slice(0, 4));
  }) as any;
};