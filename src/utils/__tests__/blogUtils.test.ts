
/// <reference types="jest" />

import { 
  generateSlug, 
  calculateReadingTime, 
  stripMarkdown, 
  generateExcerpt, 
  extractFirstImageUrl 
} from '../blogUtils';

describe('blogUtils', () => {
  describe('generateSlug', () => {
    test('빈 제목에 대해 기본 슬러그를 생성한다', () => {
      const slug = generateSlug('');
      expect(slug).toMatch(/^post-\d+-[a-z0-9]+$/);
    });

    test('한글 제목을 적절히 처리한다', () => {
      const slug = generateSlug('안녕하세요 블로그 포스트');
      expect(slug).toContain('안녕하세요-블로그-포스트');
      expect(slug).toMatch(/-\d+-[a-z0-9]+$/);
    });

    test('영문 제목을 소문자로 변환한다', () => {
      const slug = generateSlug('Hello World Blog Post');
      expect(slug).toMatch(/^hello-world-blog-post-\d+-[a-z0-9]+$/);
    });

    test('특수문자를 제거한다', () => {
      const slug = generateSlug('제목!@#$%^&*()입니다');
      expect(slug).toMatch(/^제목-입니다-\d+-[a-z0-9]+$/);
    });

    test('연속된 하이픈을 단일화한다', () => {
      const slug = generateSlug('여러    공백이    있는    제목');
      expect(slug).not.toContain('--');
    });
  });

  describe('calculateReadingTime', () => {
    test('짧은 텍스트에 대해 최소 1분을 반환한다', () => {
      const readingTime = calculateReadingTime('짧은 텍스트');
      expect(readingTime).toBe(1);
    });

    test('200단어 텍스트에 대해 1분을 반환한다', () => {
      const words = Array(200).fill('word').join(' ');
      const readingTime = calculateReadingTime(words);
      expect(readingTime).toBe(1);
    });

    test('400단어 텍스트에 대해 2분을 반환한다', () => {
      const words = Array(400).fill('word').join(' ');
      const readingTime = calculateReadingTime(words);
      expect(readingTime).toBe(2);
    });

    test('HTML 태그를 제거하고 계산한다', () => {
      const htmlContent = '<p>' + Array(200).fill('word').join(' ') + '</p>';
      const readingTime = calculateReadingTime(htmlContent);
      expect(readingTime).toBe(1);
    });
  });

  describe('stripMarkdown', () => {
    test('빈 문자열을 처리한다', () => {
      expect(stripMarkdown('')).toBe('');
      expect(stripMarkdown(null as any)).toBe('');
    });

    test('마크다운 이미지를 제거한다', () => {
      const markdown = '텍스트 ![이미지](image.jpg) 더 많은 텍스트';
      expect(stripMarkdown(markdown)).toBe('텍스트  더 많은 텍스트');
    });

    test('마크다운 링크를 텍스트만 남긴다', () => {
      const markdown = '이것은 [링크 텍스트](https://example.com) 입니다';
      expect(stripMarkdown(markdown)).toBe('이것은 링크 텍스트 입니다');
    });

    test('인라인 코드를 처리한다', () => {
      const markdown = '이것은 `코드` 입니다';
      expect(stripMarkdown(markdown)).toBe('이것은 코드 입니다');
    });

    test('헤더와 강조 기호를 제거한다', () => {
      const markdown = '# 헤더\n**굵은 글씨** *기울임* > 인용';
      expect(stripMarkdown(markdown)).toBe('헤더 굵은 글씨 기울임  인용');
    });

    test('여러 줄바꿈을 공백으로 변환한다', () => {
      const markdown = '첫 번째 줄\n\n\n두 번째 줄';
      expect(stripMarkdown(markdown)).toBe('첫 번째 줄 두 번째 줄');
    });
  });

  describe('generateExcerpt', () => {
    test('짧은 내용을 그대로 반환한다', () => {
      const content = '짧은 내용입니다';
      expect(generateExcerpt(content, 150)).toBe('짧은 내용입니다');
    });

    test('긴 내용을 잘라내고 말줄임표를 추가한다', () => {
      const content = '이것은 매우 긴 내용입니다. '.repeat(20);
      const excerpt = generateExcerpt(content, 50);
      expect(excerpt).toHaveLength(53); // 50 + '...'
      expect(excerpt).toEndWith('...');
    });

    test('마크다운을 제거한 후 발췌문을 생성한다', () => {
      const content = '이것은 **굵은** 글씨와 [링크](url)가 있는 내용입니다';
      const excerpt = generateExcerpt(content, 150);
      expect(excerpt).toBe('이것은 굵은 글씨와 링크가 있는 내용입니다');
    });

    test('HTML 태그를 제거한 후 발췌문을 생성한다', () => {
      const content = '<p>이것은 <strong>HTML</strong> 태그가 있는 내용입니다</p>';
      const excerpt = generateExcerpt(content, 150);
      expect(excerpt).toBe('이것은 HTML 태그가 있는 내용입니다');
    });
  });

  describe('extractFirstImageUrl', () => {
    test('빈 내용에 대해 null을 반환한다', () => {
      expect(extractFirstImageUrl('')).toBe(null);
      expect(extractFirstImageUrl(null as any)).toBe(null);
    });

    test('마크다운 이미지 URL을 추출한다', () => {
      const content = '텍스트 ![alt text](https://example.com/image.jpg) 더 많은 텍스트';
      expect(extractFirstImageUrl(content)).toBe('https://example.com/image.jpg');
    });

    test('HTML img 태그에서 URL을 추출한다', () => {
      const content = '<p>텍스트 <img src="https://example.com/image.png" alt="이미지"> 더 많은 텍스트</p>';
      expect(extractFirstImageUrl(content)).toBe('https://example.com/image.png');
    });

    test('마크다운 이미지를 HTML보다 우선한다', () => {
      const content = '![마크다운](md-image.jpg) <img src="html-image.jpg">';
      expect(extractFirstImageUrl(content)).toBe('md-image.jpg');
    });

    test('이미지가 없으면 null을 반환한다', () => {
      const content = '이미지가 없는 텍스트 내용입니다';
      expect(extractFirstImageUrl(content)).toBe(null);
    });

    test('복잡한 마크다운에서 첫 번째 이미지를 추출한다', () => {
      const content = `
        # 제목
        텍스트 내용
        ![첫 번째 이미지](first.jpg)
        더 많은 텍스트
        ![두 번째 이미지](second.jpg)
      `;
      expect(extractFirstImageUrl(content)).toBe('first.jpg');
    });
  });
});
