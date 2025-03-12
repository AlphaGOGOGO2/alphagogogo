
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ScrollToTop } from "./components/ScrollToTop";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AllBlogPage from "./pages/blog/AllBlogPage";
import LatestAIUpdates from "./pages/blog/LatestAIUpdates";
import BlogWritePage from "./pages/blog/BlogWritePage";
import TrendingPage from "./pages/blog/TrendingPage";
import LifestylePage from "./pages/blog/LifestylePage";
import BlogPostPage from "./pages/blog/BlogPostPage";
import GPTSPage from "./pages/GPTSPage";
import CommunityPage from "./pages/CommunityPage";
import ServicesPage from "./pages/ServicesPage";
import YouTubeTranscriptPage from "./pages/YouTubeTranscriptPage";
import URLShortenerPage from "./pages/URLShortenerPage";
import BlogButtonCreatorPage from "./pages/BlogButtonCreatorPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Main routes */}
            <Route path="/" element={<Index />} />
            <Route path="/gpts" element={<GPTSPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/community" element={<CommunityPage />} />
            
            {/* Service sub-pages */}
            <Route path="/youtube-transcript" element={<YouTubeTranscriptPage />} />
            <Route path="/url-shortener" element={<URLShortenerPage />} />
            <Route path="/blog-button-creator" element={<BlogButtonCreatorPage />} />
            
            {/* Legacy services routes - redirect to new paths */}
            <Route path="/services/youtube-transcript" element={<Navigate to="/youtube-transcript" replace />} />
            <Route path="/services/url-shortener" element={<Navigate to="/url-shortener" replace />} />
            <Route path="/services/blog-button-creator" element={<Navigate to="/blog-button-creator" replace />} />
            
            {/* Blog routes */}
            <Route path="/blog" element={<AllBlogPage />} />
            <Route path="/blog/latest-updates" element={<LatestAIUpdates />} />
            <Route path="/blog/trending" element={<TrendingPage />} />
            <Route path="/blog/lifestyle" element={<LifestylePage />} />
            <Route path="/blog/write" element={<BlogWritePage />} />
            <Route path="/blog/edit/:slug" element={<BlogWritePage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            
            {/* Redirect legacy paths or alternate paths */}
            <Route path="/latest-ai-updates" element={<Navigate to="/blog/latest-updates" replace />} />
            <Route path="/trending" element={<Navigate to="/blog/trending" replace />} />
            <Route path="/lifestyle" element={<Navigate to="/blog/lifestyle" replace />} />
            
            {/* Catch-all route - must be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
