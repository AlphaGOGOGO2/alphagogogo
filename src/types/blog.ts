
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
  updatedAt?: string; // Add optional updatedAt property
  readTime: number;
  coverImage: string;
  slug: string;
  tags?: string[]; // Added optional tags field
}
