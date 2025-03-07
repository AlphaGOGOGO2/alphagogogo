
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
