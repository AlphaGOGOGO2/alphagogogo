import matter from 'gray-matter';
import { BlogPost } from '@/types/blog';

// Vite의 import.meta.glob을 사용하여 모든 마크다운 파일을 가져옵니다
// 상대 경로 사용 (현재 파일 위치: src/services/)
const blogPosts = import.meta.glob<string>('../content/blog/*.md', {
  query: '?raw',
  eager: true
});

// 디버깅: import.meta.glob 결과 확인
console.log('[localBlogService] import.meta.glob keys:', Object.keys(blogPosts));
console.log('[localBlogService] Total files found:', Object.keys(blogPosts).length);

interface BlogPostCache {
  posts: BlogPost[];
  postsBySlug: Map<string, BlogPost>;
  postsByCategory: Map<string, BlogPost[]>;
  lastUpdated: number;
}

let cache: BlogPostCache | null = null;

// 마크다운 파일을 BlogPost 객체로 변환
const parseBlogPost = (filepath: string, content: string): BlogPost | null => {
  try {
    const { data: frontmatter, content: markdown } = matter(content);

    // 파일명에서 slug 추출 (날짜-slug.md 형식)
    const filename = filepath.split('/').pop() || '';
    const slug = frontmatter.slug || filename.replace(/\.md$/, '');

    return {
      id: slug, // slug를 ID로 사용
      title: frontmatter.title || 'Untitled',
      excerpt: frontmatter.excerpt || markdown.slice(0, 200) + '...',
      content: markdown,
      category: frontmatter.category || 'Uncategorized',
      author: {
        name: frontmatter.author || 'Anonymous',
        avatar: frontmatter.authorAvatar || '/images/instructor-profile-image.png',
      },
      publishedAt: frontmatter.date || new Date().toISOString(),
      readTime: frontmatter.readTime || Math.ceil(markdown.length / 1000),
      coverImage: frontmatter.coverImage || '',
      slug: slug,
      updatedAt: frontmatter.date || new Date().toISOString(),
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    };
  } catch (error) {
    console.error(`Error parsing blog post ${filepath}:`, error);
    return null;
  }
};

// 모든 블로그 포스트를 캐시에 로드
const loadBlogPosts = (): BlogPostCache => {
  if (cache && Date.now() - cache.lastUpdated < 60000) {
    // 1분 캐시
    return cache;
  }

  const posts: BlogPost[] = [];
  const postsBySlug = new Map<string, BlogPost>();
  const postsByCategory = new Map<string, BlogPost[]>();

  Object.entries(blogPosts).forEach(([filepath, module]) => {
    const content = typeof module === 'string' ? module : (module as any).default;
    const post = parseBlogPost(filepath, content);

    if (post) {
      posts.push(post);
      postsBySlug.set(post.slug, post);

      // 카테고리별 그룹핑
      if (!postsByCategory.has(post.category)) {
        postsByCategory.set(post.category, []);
      }
      postsByCategory.get(post.category)!.push(post);
    }
  });

  // 최신순 정렬
  posts.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  // 각 카테고리별로도 정렬
  postsByCategory.forEach(categoryPosts => {
    categoryPosts.sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  });

  cache = {
    posts,
    postsBySlug,
    postsByCategory,
    lastUpdated: Date.now(),
  };

  console.log(`[localBlogService] Loaded ${posts.length} blog posts from Markdown files`);
  return cache;
};

/**
 * 모든 블로그 포스트 가져오기 (최신순)
 */
export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  const { posts } = loadBlogPosts();
  return posts;
};

/**
 * 카테고리별 블로그 포스트 가져오기
 */
export const getBlogPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  const { postsByCategory } = loadBlogPosts();
  return postsByCategory.get(category) || [];
};

/**
 * Slug로 블로그 포스트 가져오기
 */
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const { postsBySlug } = loadBlogPosts();
  return postsBySlug.get(slug) || null;
};

/**
 * ID로 블로그 포스트 가져오기 (slug와 동일)
 */
export const getBlogPostById = async (id: string): Promise<BlogPost | null> => {
  return getBlogPostBySlug(id);
};

/**
 * 관리자용 모든 블로그 포스트 가져오기
 */
export const getAllBlogPostsForAdmin = async (): Promise<BlogPost[]> => {
  return getAllBlogPosts();
};

/**
 * 캐시 무효화 (개발 중 새로고침용)
 */
export const invalidateCache = () => {
  cache = null;
};
