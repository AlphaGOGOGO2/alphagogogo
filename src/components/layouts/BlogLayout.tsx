import { ReactNode, useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link, useLocation } from "react-router-dom";
import { blogCategories } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PenLine } from "lucide-react";
import { BlogPasswordModal } from "@/components/blog/BlogPasswordModal";

interface BlogLayoutProps {
  children: ReactNode;
  title: string;
}

export function BlogLayout({ children, title }: BlogLayoutProps) {
  const location = useLocation();
  const isWritePage = location.pathname === "/blog/write";
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Add animation effect when component mounts
  useEffect(() => {
    // Add the animation class to the main content
    const mainContent = document.getElementById('blog-content');
    if (mainContent) {
      mainContent.classList.add('animate-fade-in');
    }

    // Staggered animation for category tabs
    const categoryTabs = document.querySelectorAll('.category-tab');
    categoryTabs.forEach((tab, index) => {
      setTimeout(() => {
        tab.classList.add('animate-fade-in');
      }, 100 + (index * 50)); // Stagger each tab by 50ms
    });
  }, [location.pathname]);

  const handleWriteButtonClick = () => {
    // Check if user is already authenticated for blog writing
    const isAuthorized = sessionStorage.getItem("blogAuthToken") === "authorized";
    
    if (isAuthorized) {
      // If already authenticated, navigate directly
      window.location.href = "/blog/write";
    } else {
      // Otherwise show the auth modal
      setShowAuthModal(true);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className={cn(
          "mx-auto px-4 sm:px-6 lg:px-8",
          isWritePage ? "max-w-[95%] xl:max-w-[90%]" : "max-w-7xl"
        )}>
          <header className="py-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>{title}</h1>
              
              <nav className="flex flex-wrap gap-2 md:gap-4 mb-8 items-center">
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
                  >
                    {category.name}
                  </Link>
                ))}
              </nav>
            </div>
            
            {location.pathname !== "/blog/write" && (
              <Button 
                onClick={handleWriteButtonClick}
                className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2 opacity-0 animate-fade-in" 
                style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
              >
                <PenLine size={16} />
                글쓰기
              </Button>
            )}
          </header>
          
          <div id="blog-content" className="opacity-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
            {children}
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Password Authentication Modal */}
      <BlogPasswordModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}
