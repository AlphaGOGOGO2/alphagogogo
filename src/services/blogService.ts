
/**
 * Blog Service - Main entry point for blog-related functionality
 * 
 * This file organizes all blog service exports by category.
 * Import from this file to access all blog functionality.
 */

// Post management (CRUD operations)
export * from "./blogPostService";

// Category management
export * from "./blogCategoryService";

// Utilities
export * from "@/utils/blogUtils";

// 추가 디버깅용 함수
export const debugBlogService = (message: string) => {
  console.log(`[Blog Service Debug] ${message}`);
};
