/**
 * Blog Post Retrieve Service - Supabase backend (현재 미사용, 로컬 모드 사용 중)
 *
 * 이 파일은 로컬 블로그 서비스로 대체되었습니다.
 * 실제 기능은 localBlogService.ts에서 제공됩니다.
 */

import * as localBlogService from './localBlogService';

// 로컬 서비스로 리다이렉트
export const getAllBlogPosts = localBlogService.getAllBlogPosts;
export const getBlogPostsByCategory = localBlogService.getBlogPostsByCategory;
export const getBlogPostById = localBlogService.getBlogPostById;
export const getBlogPostBySlug = localBlogService.getBlogPostBySlug;
export const getAllBlogPostsForAdmin = localBlogService.getAllBlogPostsForAdmin;
