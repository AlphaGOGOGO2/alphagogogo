
import { ReactNode, useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/Footer";
import { Link, useLocation } from "react-router-dom";
import { blogCategories } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { Banner } from "@/components/Banner";
import { BlogAIBanner } from "@/components/banner/BlogAIBanner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { BlogLayoutSkeleton } from "./BlogLayoutSkeleton";
import { PerformanceOptimization } from "@/components/optimization/PerformanceOptimization";

interface BlogLayoutProps {
  children: ReactNode;
  title: string;
  isLoading?: boolean;
}

export function BlogLayout({ children, title, isLoading = false }: BlogLayoutProps) {
  const location = useLocation();
  const isWritePage = location.pathname === "/blog/write";

  useEffect(() => {
    const mainContent = document.getElementById('blog-content');
    if (mainContent) {
      mainContent.classList.add('animate-fade-in');
    }

    const categoryTabs = document.querySelectorAll('.category-tab');
    categoryTabs.forEach((tab, index) => {
      setTimeout(() => {
        tab.classList.add('animate-fade-in');
      }, 100 + (index * 50));
    });
  }, [location.pathname]);

  // 로딩 상태일 때만 스켈레톤 표시
  if (isLoading) {
    return <BlogLayoutSkeleton />;
  }

  return (
    <PerformanceOptimization>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow pb-16 relative pt-24" role="main">
          <div className={cn(
            "mx-auto px-4 sm:px-6 lg:px-8",
            isWritePage ? "max-w-[95%] xl:max-w-[90%]" : "max-w-7xl"
          )}>
            {!isWritePage && (
              <div className="mb-8">
                <Banner className="mb-4" />
                <BlogAIBanner />
              </div>
            )}
            {isWritePage && (
              <div className="mb-8">
                <BlogAIBanner />
              </div>
            )}
            
            <header className="py-8">
              <div>
                 <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6" 
                   aria-label={`${title} 페이지`}
                 >
                  {title}
                 </h1>
                
                <h2 className="text-xl font-semibold text-gray-800 mb-4">카테고리</h2>
                <nav aria-label="블로그 카테고리" className="flex flex-wrap gap-2 md:gap-4 mb-8 items-center">
                  {blogCategories.map((category, index) => (
                    <Link
                      key={category.path}
                      to={category.path}
                      className={cn(
                        "category-tab px-4 py-2 rounded-full transition-colors text-sm font-medium",
                        location.pathname === category.path
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700"
                      )}
                      aria-current={location.pathname === category.path ? "page" : undefined}
                    >
                      {category.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </header>
            
            <ErrorBoundary>
              <section 
                id="blog-content"
                aria-live="polite"
              >
                {children}
              </section>
            </ErrorBoundary>
          </div>
        </main>
        
        <Footer />
      </div>
    </PerformanceOptimization>
  );
}
