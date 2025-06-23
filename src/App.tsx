
import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import ServicesPage from "./pages/ServicesPage";
import { BlogRoutes } from "./routes/BlogRoutes";
import GPTSPage from "./pages/GPTSPage";
import CommunityPage from "./pages/CommunityPage";
import OpenChatRoomsPage from "./pages/OpenChatRoomsPage";
import BlogButtonCreatorPage from "./pages/BlogButtonCreatorPage";
import BusinessInquiryPage from "./pages/BusinessInquiryPage";
import ResourcesPage from "./pages/ResourcesPage";
import ResourceDetailPage from "./pages/ResourceDetailPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminPostsPage from "./pages/admin/AdminPostsPage";
import AdminResourcesPage from "./pages/admin/AdminResourcesPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import NotFound from "./pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

// Edge Function으로 리다이렉트하는 컴포넌트
const RedirectToEdgeFunction = ({ endpoint }: { endpoint: string }) => {
  const edgeUrl = `https://plimzlmmftdbpipbnhsy.supabase.co/functions/v1/${endpoint}`;
  
  React.useEffect(() => {
    window.location.href = edgeUrl;
  }, [edgeUrl]);

  return <div>Redirecting...</div>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<ServicesPage />} />
              
              {/* 모든 블로그 관련 라우팅을 BlogRoutes로 위임 */}
              <Route path="/blog/*" element={<BlogRoutes />} />
              
              {/* RSS와 Sitemap 엔드포인트 - Edge Functions로 리다이렉트 */}
              <Route 
                path="/rss.xml" 
                element={<RedirectToEdgeFunction endpoint="rss-feed" />} 
              />
              <Route 
                path="/sitemap.xml" 
                element={<RedirectToEdgeFunction endpoint="sitemap" />} 
              />
              
              <Route path="/gpts" element={<GPTSPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/open-chat-rooms" element={<OpenChatRoomsPage />} />
              <Route path="/blog-button-creator" element={<BlogButtonCreatorPage />} />
              <Route path="/business-inquiry" element={<BusinessInquiryPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/resources/:id" element={<ResourceDetailPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/posts" element={<AdminPostsPage />} />
              <Route path="/admin/resources" element={<AdminResourcesPage />} />
              <Route path="/admin/categories" element={<AdminCategoriesPage />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
