
import { BlogPost } from "@/types/blog";
import { Link } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  // Use the specified profile image URL instead of the one from the post data
  const authorAvatarUrl = "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//instructor%20profile%20image.png";
  
  return (
    <Link to={`/blog/${post.slug}`} className="block h-full">
      <article className="rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col cursor-pointer hover:-translate-y-1 transition-transform border border-gray-200 hover:border-purple-300">
        {post.coverImage && (
          <div className="block overflow-hidden h-48">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-5 flex-grow flex flex-col">
          <div className="mb-3">
            <span className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
              {post.category}
            </span>
          </div>
          <div className="block mb-2">
            <h3 className="text-lg font-bold text-gray-800 hover:text-purple-700 transition-colors duration-200">
              {post.title}
            </h3>
          </div>
          <p className="text-gray-600 text-sm mb-4 flex-grow">
            {post.excerpt}
          </p>
          
          {/* Display tags if available */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index} 
                  className="px-2 py-0.5 bg-purple-50 text-purple-600 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-gray-500">+{post.tags.length - 3}</span>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
            <div className="flex items-center">
              <img 
                src={authorAvatarUrl} 
                alt={post.author.name} 
                className="w-6 h-6 rounded-full mr-2 object-cover" 
              />
              <span>{post.author.name}</span>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center">
                <Calendar size={14} className="mr-1 text-purple-500" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center">
                <Clock size={14} className="mr-1 text-purple-500" />
                <span>{post.readTime}분</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
