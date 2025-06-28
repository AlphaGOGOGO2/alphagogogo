
// 최적화된 블로그 포스트 조회 서비스 - 배치 처리로 성능 개선
export { 
  getAllBlogPostsOptimized as getAllBlogPosts, 
  getBlogPostsByCategoryOptimized as getBlogPostsByCategory 
} from './blogPostBatchService';

export { 
  getBlogPostById, 
  getBlogPostBySlug, 
  getAllBlogPostsForAdmin 
} from './blogPostRetrieveServiceLegacy';
