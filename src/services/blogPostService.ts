
/**
 * Blog Post Service - Core CRUD operations for blog posts
 *
 * This file re-exports blog post functionality from specialized service files.
 * Supports both local Markdown files and Supabase backend.
 */

// 로컬 블로그 사용 여부 (환경변수 또는 기본값)
const USE_LOCAL_BLOG = import.meta.env.VITE_USE_LOCAL_BLOG === 'true' || true;

// 로컬 블로그 서비스 import
import * as localBlogService from './localBlogService';
// Supabase 블로그 서비스 import
import * as supabaseBlogService from './blogPostRetrieveService';

// Re-export blog post service functions - 로컬 또는 Supabase 중 선택
export const getAllBlogPosts = USE_LOCAL_BLOG
  ? localBlogService.getAllBlogPosts
  : supabaseBlogService.getAllBlogPosts;

export const getBlogPostsByCategory = USE_LOCAL_BLOG
  ? localBlogService.getBlogPostsByCategory
  : supabaseBlogService.getBlogPostsByCategory;

export const getBlogPostBySlug = USE_LOCAL_BLOG
  ? localBlogService.getBlogPostBySlug
  : supabaseBlogService.getBlogPostBySlug;

export const getBlogPostById = USE_LOCAL_BLOG
  ? localBlogService.getBlogPostById
  : supabaseBlogService.getBlogPostById;

export const getAllBlogPostsForAdmin = USE_LOCAL_BLOG
  ? localBlogService.getAllBlogPostsForAdmin
  : supabaseBlogService.getAllBlogPostsForAdmin;

// 쓰기 작업은 Supabase만 지원 (로컬은 읽기 전용)
export { createBlogPost } from './blogPostCreateService';
export { updateBlogPost } from './blogPostUpdateService';
export { handleBlogTags, removeExistingTags } from './blogPostTagsService';

// Add error handling helpers
export const handleBlogServiceError = (error: any, customMessage: string): void => {
  console.error(customMessage, error);
  
  // Log additional details for debugging if available
  if (error.message) {
    console.error(`Error message: ${error.message}`);
  }
  
  if (error.code) {
    console.error(`Error code: ${error.code}`);
  }
  
  if (error.details) {
    console.error(`Error details: ${error.details}`);
  }
  
  // Add specific handling for network errors
  if (error instanceof TypeError && error.message.includes('network')) {
    console.error('Network error detected. Please check your internet connection.');
  }
  
  // Add specific handling for timeout errors
  if (error.message && error.message.includes('timeout')) {
    console.error('Request timed out. The server might be busy or unavailable.');
  }
};
