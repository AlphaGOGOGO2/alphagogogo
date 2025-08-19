// 기존 blog 타입 정의
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  updatedAt?: string;
  readTime: number;
  coverImage: string;
  slug: string;
  tags?: string[];
}

export interface BlogCategory {
  id: string;
  name: string;
  description?: string;
  postCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogTag {
  id: string;
  name: string;
  postCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostTag {
  id: string;
  blogPostId: string;
  tagId: string;
  createdAt: string;
}

// 블로그 필터 및 정렬 타입
export interface BlogFilters {
  category?: string;
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  searchQuery?: string;
}

export interface BlogSortOptions {
  field: 'publishedAt' | 'title' | 'readTime' | 'category';
  direction: 'asc' | 'desc';
}

// 블로그 작성/수정 관련 타입
export interface BlogPostForm {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage?: string;
  tags: string[];
  publishedAt?: string;
}

export interface BlogPostValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

// SEO 관련 타입
export interface BlogSEO {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonical?: string;
}