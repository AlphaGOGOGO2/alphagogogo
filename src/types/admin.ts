// 관리자 관련 타입 정의

import type { BaseRequest } from './api';

export interface AdminUser extends BaseRequest {
  email: string;
  role: 'admin' | 'moderator' | 'editor';
  isActive: boolean;
  lastLoginAt?: string;
}

export interface AdminSession extends BaseRequest {
  adminUserId: string;
  tokenHash: string;
  expiresAt: string;
  isActive: boolean;
  ipAddress?: string;
  userAgent?: string;
  locationData?: Record<string, unknown>;
  deviceFingerprint?: string;
  securityFlags?: Record<string, unknown>;
  lastUsedAt?: string;
  invalidatedAt?: string;
}

export interface AdminLoginAttempt extends BaseRequest {
  ipAddress: string;
  attemptedAt: string;
  userAgent?: string;
  success: boolean;
  email?: string;
  metadata?: Record<string, unknown>;
}

export interface DashboardStats {
  posts: BlogPostSummary[];
  categories: CategorySummary[];
  totalVisitors: number;
  recentPosts: BlogPostSummary[];
}

export interface BlogPostSummary {
  id: string;
  title: string;
  category: string;
  publishedAt: string;
  readTime: number;
  excerpt?: string;
  slug: string;
}

export interface CategorySummary {
  name: string;
  count: number;
  description?: string;
}

export interface VisitorStats {
  date: string;
  visitors: number;
  pageViews: number;
}

// CKEditor 관련 타입
export interface CKEditorConfig {
  toolbar: string[];
  plugins: string[];
  heading?: {
    options: HeadingOption[];
  };
  table?: {
    contentToolbar: string[];
  };
}

export interface HeadingOption {
  model: string;
  view: string;
  title: string;
  class: string;
}

export interface CKEditorInstance {
  setData: (data: string) => void;
  getData: () => string;
  destroy: () => Promise<void>;
  model: {
    document: {
      on: (event: string, callback: () => void) => void;
    };
  };
}

export interface ImageUploadAdapter {
  loader: {
    file: Promise<File>;
  };
  upload: () => Promise<{ default: string }>;
  abort: () => void;
}

// SEO 관리 관련 타입
export interface SEOScore {
  title: number;
  description: number;
  content: number;
  images: number;
  total: number;
}

export interface SEORecommendation {
  type: 'title' | 'description' | 'content' | 'images';
  message: string;
  priority: 'high' | 'medium' | 'low';
}

export interface SEOAnalysis {
  score: SEOScore;
  recommendations: SEORecommendation[];
  issues: string[];
}