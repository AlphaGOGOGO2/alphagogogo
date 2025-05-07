
/**
 * Blog Service - Main entry point for blog-related functionality
 * 
 * This file organizes all blog service exports by category.
 * Import from this file to access all blog functionality.
 */

// Post management (CRUD operations)
export * from "./blogPostService";

// Tag and category management
export * from "./blogTagService";
export * from "./blogCategoryService";

// Media handling
export * from "./blogMediaService";

// Data adapters and utilities
export * from "./blogAdapters";
export * from "@/utils/blogUtils";

// 추가 디버깅용 함수
export const debugBlogService = (message: string) => {
  console.log(`[Blog Service Debug] ${message}`);
};
