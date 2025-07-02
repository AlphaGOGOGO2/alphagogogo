
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

export function BlogRoutes() {
  return (
    <Routes>
      {/* 블로그 메인 페이지 */}
      <Route path="/" element={<AllBlogPage />} />
      
      {/* 글 작성 및 수정 */}
      <Route path="/write" element={<BlogWritePage />} />
      <Route path="/edit/:slug" element={<BlogWritePage />} />
      
      {/* ID 기반 포스트 라우트 (우선순위 높음) */}
      <Route path="/post/:id" element={<BlogPostPage />} />
      
      {/* 기존 카테고리 페이지들 (구체적인 경로 먼저) */}
      <Route path="/latest-updates" element={<LatestAIUpdates />} />
      <Route path="/trending" element={<TrendingPage />} />
      <Route path="/lifestyle" element={<LifestylePage />} />
      
      {/* 새로 추가된 카테고리 페이지들 */}
      <Route path="/ai-news" element={<AINewsPage />} />
      <Route path="/tech-reviews" element={<TechReviewsPage />} />
      <Route path="/tutorials" element={<TutorialsPage />} />
      <Route path="/chatgpt-guides" element={<ChatGPTGuidesPage />} />
      <Route path="/lovable-dev" element={<LovableDevPage />} />
      
      {/* Slug 기반 포스트 라우트 (카테고리보다 우선) */}
      <Route path="/:slug" element={<BlogPostPage />} />
      
      {/* 동적 카테고리 페이지 (최후 fallback) */}
      <Route path="/:category" element={<BlogCategoryPage />} />
    </Routes>
  );
}
