
import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorBoundaryFallback } from "@/components/ErrorFallback";
import { logError } from "@/utils/logger";
import Index from "./pages/Index";
import ServicesPage from "./pages/ServicesPage";
import { BlogRoutes } from "./routes/BlogRoutes";
import GPTSPage from "./pages/GPTSPage";
import OpenChatRoomsPage from "./pages/OpenChatRoomsPage";
import BlogButtonCreatorPage from "./pages/BlogButtonCreatorPage";
import BusinessInquiryPage from "./pages/BusinessInquiryPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminBlogWrite from "./pages/admin/AdminBlogWrite";
import AdminBlogEdit from "./pages/admin/AdminBlogEdit";
import AdminResources from "./pages/admin/AdminResources";
import NotFound from "./pages/NotFound";
import { PerformanceOptimization } from "./components/optimization/PerformanceOptimization";
import "./App.css";

// Query Client 설정 개선
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // 4xx 에러는 재시도하지 않음
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // 최대 3회 재시도
        return failureCount < 3;
      },
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 10, // 10분
    },
    mutations: {
      onError: (error: any) => {
        logError('React Query Mutation Error', error);
      },
    },
  },
});

// 에러 바운더리 에러 핸들러
const handleError = (error: Error, errorInfo: { componentStack: string }) => {
  logError('React Error Boundary', error, {
    route: window.location.pathname,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    additionalData: { componentStack: errorInfo.componentStack }
  });
};

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} onError={handleError}>
      <HelmetProvider>
        <PerformanceOptimization>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster />
              <BrowserRouter>
                <ErrorBoundary 
                  FallbackComponent={ErrorBoundaryFallback} 
                  onError={handleError}
                >
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/services" element={<ServicesPage />} />
                    
                    {/* 모든 블로그 관련 라우팅을 BlogRoutes로 위임 */}
                    <Route path="/blog/*" element={<BlogRoutes />} />
                    
                    <Route path="/gpts" element={<GPTSPage />} />
                    <Route path="/open-chat-rooms" element={<OpenChatRoomsPage />} />
                    <Route path="/blog-button-creator" element={<BlogButtonCreatorPage />} />
                    <Route path="/business-inquiry" element={<BusinessInquiryPage />} />

                    {/* Admin routes - only available in development */}
                    {import.meta.env.DEV && (
                      <>
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/blog" element={<AdminBlog />} />
                        <Route path="/admin/blog/write" element={<AdminBlogWrite />} />
                        <Route path="/admin/blog/edit/:slug" element={<AdminBlogEdit />} />
                        <Route path="/admin/resources" element={<AdminResources />} />
                      </>
                    )}

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </ErrorBoundary>
              </BrowserRouter>
            </TooltipProvider>
          </QueryClientProvider>
        </PerformanceOptimization>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
