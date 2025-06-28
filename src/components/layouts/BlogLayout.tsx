
import { ReactNode, useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link, useLocation } from "react-router-dom";
import { blogCategories } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { Banner } from "@/components/Banner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { BlogLayoutSkeleton } from "./BlogLayoutSkeleton";

interface BlogLayoutProps {
  children: ReactNode;
  title: string;
  isLoading?: boolean;
}

export function BlogLayout({ children, title, isLoading = false }: BlogLayoutProps) {
  const location = useLocation();
  const [showContent, setShowContent] = useState(false);
  const isWritePage = location.pathname === "/blog/write";

  useEffect(() => {
    // 컴포넌트가 마운트된 후 조금의 지연을 두고 콘텐츠 표시
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showContent) return;

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
  }, [location.pathname, showContent]);

  // 로딩 상태이거나 콘텐츠가 아직 준비되지 않았을 때 스켈레톤 표시
  if (isLoading || !showContent) {
    return <BlogLayoutSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 relative" role="main">
        <div className={cn(
          "mx-auto px-4 sm:px-6 lg:px-8",
          isWritePage ? "max-w-[95%] xl:max-w-[90%]" : "max-w-7xl"
        )}>
          {!isWritePage && <Banner />}
          
          <header className="py-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 opacity-0 animate-fade-in" 
                style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
                aria-label={`${title} 페이지`}
              >
                {title}
              </h1>
              
              <nav aria-label="블로그 카테고리" className="flex flex-wrap gap-2 md:gap-4 mb-8 items-center">
                {blogCategories.map((category, index) => (
                  <Link
                    key={category.path}
                    to={category.path}
                    className={cn(
                      "category-tab px-4 py-2 rounded-full transition-colors text-sm font-medium opacity-0",
                      location.pathname === category.path
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700"
                    )}
                    style={{ animationDelay: `${150 + (index * 50)}ms`, animationFillMode: 'forwards' }}
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
              className="opacity-0" 
              style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
              aria-live="polite"
            >
              {children}
            </section>
          </ErrorBoundary>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
