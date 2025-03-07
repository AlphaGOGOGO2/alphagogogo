
import React, { useEffect, useState } from 'react';
import { BlogGrid } from './BlogGrid';
import { BlogPost } from '@/types/blog';

interface BlogGridAnimationProps {
  posts: BlogPost[];
}

export const BlogGridAnimation: React.FC<BlogGridAnimationProps> = ({ posts }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set a small timeout to ensure the animation runs after mounting
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`transition-all duration-500 ease-out ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}
    >
      <BlogGrid posts={posts} />
    </div>
  );
};
