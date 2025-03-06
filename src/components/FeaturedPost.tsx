
import { useState } from "react";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface Post {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
}

const featuredPosts: Post[] = [
  {
    id: 1,
    title: "How Generative AI is Transforming Creative Industries",
    excerpt: "An exploration of how AI tools are revolutionizing design, content creation, and artistic expression.",
    category: "Technology",
    readTime: "5 min",
    date: "May 28, 2023",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YWklMjBhcnR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 2,
    title: "The Ethics of Advanced AI: Navigating the Future",
    excerpt: "Discussing the ethical considerations and frameworks needed as AI systems become more powerful.",
    category: "Ethics",
    readTime: "8 min",
    date: "May 22, 2023",
    image: "https://images.unsplash.com/photo-1655720828018-edd2daec9349?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGFpJTIwcm9ib3R8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
  },
  {
    id: 3,
    title: "AI in Healthcare: Breakthrough Diagnostic Tools",
    excerpt: "How machine learning models are enhancing diagnostic accuracy and patient care across medical specialties.",
    category: "Healthcare",
    readTime: "6 min",
    date: "May 15, 2023",
    image: "https://images.unsplash.com/photo-1576670159052-9ea5550ca474?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGhlYWx0aGNhcmUlMjB0ZWNofGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60"
  }
];

export function FeaturedPosts() {
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);
  
  return (
    <section className="py-20 px-6 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <span className="inline-block px-3 py-1 mb-4 text-sm font-medium text-purple-700 bg-purple-100 rounded-full">
            Featured Content
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Latest in AI News
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-balance">
            Discover trending topics and breakthrough developments in artificial intelligence from around the globe.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredPosts.map((post) => (
            <article 
              key={post.id}
              className={cn(
                "group rounded-2xl overflow-hidden bg-white transition-all duration-300 h-full flex flex-col",
                "border border-gray-100 hover:border-purple-200 shadow-sm hover:shadow-md",
                "transform hover:-translate-y-1"
              )}
              onMouseEnter={() => setHoveredPost(post.id)}
              onMouseLeave={() => setHoveredPost(null)}
            >
              <div className="relative overflow-hidden h-56">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded-full">
                  {post.category}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center text-sm text-gray-500 mb-3 gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{post.readTime} read</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-3 transition-colors group-hover:text-purple-700 text-balance">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 flex-1 text-balance">
                  {post.excerpt}
                </p>
                
                <div className="mt-auto">
                  <button 
                    className={cn(
                      "flex items-center text-sm font-medium gap-1 transition-colors",
                      hoveredPost === post.id ? "text-purple-700" : "text-gray-900"
                    )}
                  >
                    Read More
                    <ArrowRight 
                      size={16} 
                      className={cn(
                        "transition-transform duration-300",
                        hoveredPost === post.id ? "translate-x-1" : ""
                      )} 
                    />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button className="px-6 py-3 rounded-lg border border-purple-200 text-purple-700 font-medium hover:bg-purple-50 transition-colors">
            View All Articles
          </button>
        </div>
      </div>
    </section>
  );
}
