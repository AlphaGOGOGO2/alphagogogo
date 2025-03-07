
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/gpts" element={<GPTSPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/youtube-transcript" element={<YouTubeTranscriptPage />} />
          <Route path="/url-shortener" element={<URLShortenerPage />} />
          <Route path="/blog-button-creator" element={<BlogButtonCreatorPage />} />
          <Route path="/blog" element={<AllBlogPage />} />
          <Route path="/blog/latest-updates" element={<LatestAIUpdates />} />
          <Route path="/blog/trending" element={<TrendingPage />} />
          <Route path="/blog/lifestyle" element={<LifestylePage />} />
          <Route path="/blog/write" element={<BlogWritePage />} />
          <Route path="/blog/edit/:slug" element={<BlogWritePage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/community" element={<CommunityPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
