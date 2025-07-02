import { BlogPost } from "@/types/blog";

// 관련 포스트 추천 로직
export function getRelatedPosts(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  maxCount: number = 3
): BlogPost[] {
  const scoredPosts = allPosts
    .filter(post => post.id !== currentPost.id) // 현재 포스트 제외
    .map(post => ({
      post,
      score: calculateRelevanceScore(currentPost, post)
    }))
    .sort((a, b) => b.score - a.score) // 점수 높은 순 정렬
    .slice(0, maxCount)
    .map(item => item.post);

  return scoredPosts;
}

// 관련성 점수 계산
function calculateRelevanceScore(currentPost: BlogPost, comparePost: BlogPost): number {
  let score = 0;

  // 1. 카테고리 일치 (높은 가중치)
  if (currentPost.category === comparePost.category) {
    score += 10;
  }

  // 2. 태그 일치
  if (currentPost.tags && comparePost.tags) {
    const currentTags = currentPost.tags.map(tag => tag.toLowerCase());
    const compareTags = comparePost.tags.map(tag => tag.toLowerCase());
    
    const commonTags = currentTags.filter(tag => 
      compareTags.includes(tag)
    );
    
    score += commonTags.length * 5; // 태그 하나당 5점
  }

  // 3. 제목 키워드 유사성
  const currentTitleWords = extractKeywords(currentPost.title);
  const compareTitleWords = extractKeywords(comparePost.title);
  
  const commonTitleWords = currentTitleWords.filter(word =>
    compareTitleWords.includes(word)
  );
  
  score += commonTitleWords.length * 3; // 제목 키워드 하나당 3점

  // 4. 콘텐츠 키워드 유사성 (excerpt 기반)
  if (currentPost.excerpt && comparePost.excerpt) {
    const currentContentWords = extractKeywords(currentPost.excerpt);
    const compareContentWords = extractKeywords(comparePost.excerpt);
    
    const commonContentWords = currentContentWords.filter(word =>
      compareContentWords.includes(word)
    );
    
    score += commonContentWords.length * 2; // 콘텐츠 키워드 하나당 2점
  }

  // 5. 발행일 근접성 (최근 포스트일수록 높은 점수)
  const daysDiff = Math.abs(
    new Date(currentPost.publishedAt).getTime() - 
    new Date(comparePost.publishedAt).getTime()
  ) / (1000 * 60 * 60 * 24);
  
  if (daysDiff <= 7) score += 3;      // 일주일 이내
  else if (daysDiff <= 30) score += 2; // 한 달 이내
  else if (daysDiff <= 90) score += 1; // 3개월 이내

  return score;
}

// 키워드 추출 함수
function extractKeywords(text: string): string[] {
  if (!text) return [];
  
  // 불용어 목록 (한국어 + 영어)
  const stopWords = new Set([
    '그', '이', '저', '것', '수', '있', '하', '되', '않', '에', '의', '를', '을', '와', '과', '로', '으로',
    '입니다', '있습니다', '합니다', '때문', '통해', '대한', '위한', '같은', '다른', '많은', '새로운',
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are',
    'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'
  ]);
  
  return text
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, ' ') // 특수문자 제거
    .split(/\s+/)
    .filter(word => 
      word.length >= 2 && // 2글자 이상
      !stopWords.has(word) && // 불용어 제외
      !/^\d+$/.test(word) // 순수 숫자 제외
    );
}

// 카테고리별 인기 포스트 가져오기
export function getPopularPostsByCategory(
  posts: BlogPost[],
  category: string,
  maxCount: number = 5
): BlogPost[] {
  return posts
    .filter(post => post.category === category)
    .sort((a, b) => {
      // 조회수가 있다면 조회수 순, 없다면 최신순
      const aViews = (a as any).views || 0;
      const bViews = (b as any).views || 0;
      
      if (aViews !== bViews) {
        return bViews - aViews;
      }
      
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    })
    .slice(0, maxCount);
}

// 태그별 관련 포스트 가져오기
export function getPostsByTag(
  posts: BlogPost[],
  tag: string,
  excludePostId?: string,
  maxCount: number = 5
): BlogPost[] {
  return posts
    .filter(post => 
      post.id !== excludePostId &&
      post.tags && 
      post.tags.some(postTag => 
        postTag.toLowerCase() === tag.toLowerCase()
      )
    )
    .sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, maxCount);
}