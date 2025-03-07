
import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeaturedPosts } from "@/components/FeaturedPost";
import { Footer } from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    // Smooth scroll to top when page loads
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    
    // Add page transition class
    document.body.classList.add("page-transition");
    
    return () => {
      document.body.classList.remove("page-transition");
    };
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <main>
        <Hero />
        <FeaturedPosts />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
