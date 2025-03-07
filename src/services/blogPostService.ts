
/**
 * Blog Post Service - Core CRUD operations for blog posts
 * 
 * This file re-exports blog post functionality from specialized service files.
 */

// Re-export blog post service functions from separate files
export { getAllBlogPosts, getBlogPostsByCategory, getBlogPostBySlug } from './blogPostRetrieveService';
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
};
