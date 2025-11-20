
export interface Resource {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  file_type: string;
  file_size: number | null;
  category: string;
  tags: string[];
  download_count: number;
  is_featured: boolean;
  is_visible?: boolean; // 공개/비공개 (기본값: true)
  author_name: string;
  created_at: string;
  updated_at: string;
}

export interface ResourceCategory {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResourceDownload {
  id: string;
  resource_id: string;
  ip_address: string | null;
  downloaded_at: string;
}
