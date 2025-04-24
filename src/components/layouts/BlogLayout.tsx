
import { ReactNode, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link, useLocation } from "react-router-dom";
import { blogCategories } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { Banner } from "@/components/Banner";
import { AdBanner } from "@/components/ads/AdBanner";
import { SidebarAd } from "@/components/ads/SidebarAd";

interface BlogLayoutProps {
  children: ReactNode;
  title: string;
}

export function BlogLayout({ children, title }: BlogLayoutProps) {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 relative" role="main">
        {!isWritePage && (
          <>
            <div className="fixed left-4 top-32 z-10 hidden lg:block">
              <SidebarAd slot="1497497659" />
            </div>
            
            <div className="fixed right-4 top-32 z-10 hidden lg:block">
              <SidebarAd slot="1497497659" />
            </div>
          </>
        )}

        <div className={cn(
          "mx-auto px-4 sm:px-6 lg:px-8",
          isWritePage ? "max-w-[95%] xl:max-w-[90%]" : "max-w-7xl"
        )}>
          {!isWritePage && <Banner />}
          
          {!isWritePage && (
            <div className="w-full flex justify-center">
              <AdBanner 
                slot="1497497659"
                format="auto" 
                className="mt-4 mb-6" 
                style={{ minHeight: '90px', minWidth: '300px' }} 
              />
            </div>
          )}
          
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
          
          <section 
            id="blog-content" 
            className="opacity-0" 
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
            aria-live="polite"
          >
            {children}
          </section>
          
          {!isWritePage && (
            <div className="w-full flex justify-center">
              <AdBanner 
                slot="1497497659"
                format="rectangle" 
                className="mt-10 mb-4" 
                style={{ minHeight: '250px', minWidth: '300px' }}
              />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
