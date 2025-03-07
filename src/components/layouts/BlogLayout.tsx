
import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link, useLocation } from "react-router-dom";
import { blogCategories } from "@/config/navigation";
import { cn } from "@/lib/utils";

interface BlogLayoutProps {
  children: ReactNode;
  title: string;
}

export function BlogLayout({ children, title }: BlogLayoutProps) {
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{title}</h1>
            
            <nav className="flex flex-wrap gap-2 md:gap-4 mb-8 items-center">
              {blogCategories.map((category) => (
                <Link
                  key={category.path}
                  to={category.path}
                  className={cn(
                    "px-4 py-2 rounded-full transition-colors text-sm font-medium",
                    location.pathname === category.path
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700"
                  )}
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </header>
          
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
