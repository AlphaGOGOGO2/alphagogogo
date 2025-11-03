
/**
 * Blog Post Service - Core CRUD operations for blog posts
 *
 * This file re-exports blog post functionality from local blog service.
 * Local-only mode - all data stored in src/data/blogPosts.ts
 */

// 로컬 블로그 서비스 import
import * as localBlogService from './localBlogService';

// Re-export blog post service functions from local service
export const getAllBlogPosts = localBlogService.getAllBlogPosts;
export const getBlogPostsByCategory = localBlogService.getBlogPostsByCategory;
export const getBlogPostBySlug = localBlogService.getBlogPostBySlug;
export const getBlogPostById = localBlogService.getBlogPostById;
export const getAllBlogPostsForAdmin = localBlogService.getAllBlogPostsForAdmin;

// 쓰기 작업은 로컬 모드에서 비활성화 (읽기 전용)
export const createBlogPost = async () => {
  throw new Error('로컬 모드에서는 블로그 포스트 생성이 불가능합니다.');
};

export const updateBlogPost = async () => {
  throw new Error('로컬 모드에서는 블로그 포스트 수정이 불가능합니다.');
};

export const handleBlogTags = async () => {
  throw new Error('로컬 모드에서는 태그 관리가 불가능합니다.');
};

export const removeExistingTags = async () => {
  throw new Error('로컬 모드에서는 태그 관리가 불가능합니다.');
};

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
