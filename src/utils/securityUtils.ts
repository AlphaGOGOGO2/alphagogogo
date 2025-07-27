import DOMPurify from 'dompurify';

/**
 * HTML 콘텐츠를 안전하게 새니타이즈합니다
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'code', 'pre'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    KEEP_CONTENT: true
  });
}

/**
 * 텍스트 입력을 새니타이즈합니다
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/[<>]/g, '') // HTML 태그 제거
    .replace(/javascript:/gi, '') // JavaScript 프로토콜 제거
    .replace(/on\w+=/gi, '') // 이벤트 핸들러 제거
    .trim();
}

/**
 * 메시지 콘텐츠가 유효한지 검사합니다
 */
export function validateMessageContent(content: string): { isValid: boolean; error?: string } {
  if (!content || !content.trim()) {
    return { isValid: false, error: '메시지 내용이 비어있습니다.' };
  }

  if (content.length > 1000) {
    return { isValid: false, error: '메시지는 1000자를 초과할 수 없습니다.' };
  }

  // 스팸 패턴 검사
  const spamPatterns = [
    /(.)\1{10,}/, // 같은 문자 10개 이상 반복
    /https?:\/\/[^\s]+/g, // URL 패턴
    /[\u4e00-\u9fff]{50,}/, // 중국어 50자 이상
  ];

  for (const pattern of spamPatterns) {
    if (pattern.test(content)) {
      return { isValid: false, error: '스팸으로 의심되는 내용입니다.' };
    }
  }

  return { isValid: true };
}

/**
 * 파일명을 안전하게 새니타이즈합니다
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .slice(0, 255);
}

/**
 * 관리자 토큰이 유효한지 검사합니다
 */
export function validateAdminToken(token: string): boolean {
  if (!token || typeof token !== 'string') {
    return false;
  }

  // 최소 길이 검사
  if (token.length < 10) {
    return false;
  }

  // 기본적인 형식 검사 (실제 JWT 토큰은 더 복잡한 검증이 필요)
  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }

  return true;
}

/**
 * Rate limiting을 위한 키 생성
 */
export function generateRateLimitKey(identifier: string, action: string): string {
  return `rate_limit:${action}:${identifier}`;
}

/**
 * IP 주소를 익명화합니다
 */
export function anonymizeIpAddress(ip: string): string {
  if (!ip) return '';
  
  // IPv4인 경우 마지막 옥텟을 0으로 마스킹
  if (ip.includes('.')) {
    const parts = ip.split('.');
    if (parts.length === 4) {
      parts[3] = '0';
      return parts.join('.');
    }
  }
  
  // IPv6인 경우 마지막 4개 그룹을 마스킹
  if (ip.includes(':')) {
    const parts = ip.split(':');
    if (parts.length >= 4) {
      for (let i = parts.length - 4; i < parts.length; i++) {
        parts[i] = '0';
      }
      return parts.join(':');
    }
  }
  
  return ip;
}