
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string;
  author_name: string;
  author_avatar: string;
  published_at: string;
  read_time: number;
  cover_image: string | null;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}
