
import { Routes, Route } from "react-router-dom";
import AllBlogPage from "@/pages/blog/AllBlogPage";
import BlogPostPage from "@/pages/blog/BlogPostPage";
import BlogWritePage from "@/pages/blog/BlogWritePage";
import { BlogCategoryPage } from "@/components/blog/BlogCategoryPage";
import LatestAIUpdates from "@/pages/blog/LatestAIUpdates";
import TrendingPage from "@/pages/blog/TrendingPage";
import LifestylePage from "@/pages/blog/LifestylePage";
import AINewsPage from "@/pages/blog/AINewsPage";
import TechReviewsPage from "@/pages/blog/TechReviewsPage";
import TutorialsPage from "@/pages/blog/TutorialsPage";
import ChatGPTGuidesPage from "@/pages/blog/ChatGPTGuidesPage";
import LovableDevPage from "@/pages/blog/LovableDevPage";
import SitemapPage from "@/pages/api/SitemapPage";
import RSSPage from "@/pages/api/RSSPage";

export function BlogRoutes() {
  return (
    <Routes>
      {/* 블로그 메인 페이지 */}
      <Route path="/" element={<AllBlogPage />} />
      
      {/* 글 작성 및 수정 */}
      <Route path="/write" element={<BlogWritePage />} />
      <Route path="/edit/:slug" element={<BlogWritePage />} />
      
      {/* 기존 카테고리 페이지들 */}
      <Route path="/latest-updates" element={<LatestAIUpdates />} />
      <Route path="/trending" element={<TrendingPage />} />
      <Route path="/lifestyle" element={<LifestylePage />} />
      
      {/* 새로 추가된 카테고리 페이지들 */}
      <Route path="/ai-news" element={<AINewsPage />} />
      <Route path="/tech-reviews" element={<TechReviewsPage />} />
      <Route path="/tutorials" element={<TutorialsPage />} />
      <Route path="/chatgpt-guides" element={<ChatGPTGuidesPage />} />
      <Route path="/lovable-dev" element={<LovableDevPage />} />
      
      {/* API 엔드포인트들 */}
      <Route path="/api/sitemap" element={<SitemapPage />} />
      <Route path="/api/rss" element={<RSSPage />} />
      
      {/* 개별 블로그 포스트 */}
      <Route path="/post/:id" element={<BlogPostPage />} />
      <Route path="/:slug" element={<BlogPostPage />} />
      
      {/* 동적 카테고리 페이지 (fallback) */}
      <Route path="/:category" element={<BlogCategoryPage />} />
    </Routes>
  );
}
