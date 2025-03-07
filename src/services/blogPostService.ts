
import { supabase } from "@/integrations/supabase/client";
import { BlogPost as SupabaseBlogPost } from "@/types/supabase";
import { BlogPost } from "@/types/blog";
import { adaptBlogPost } from "./blogAdapters";
import { generateSlug, calculateReadingTime, generateExcerpt, extractFirstImageUrl } from "@/utils/blogUtils";
import { toast } from "sonner";

// Get all blog posts
export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map(adaptBlogPost);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    toast.error("블로그 포스트를 불러오는데 실패했습니다");
    return [];
  }
};

// Get blog posts by category
export const getBlogPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("category", category)
      .order("published_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map(adaptBlogPost);
  } catch (error) {
    console.error("Error fetching blog posts by category:", error);
    toast.error("블로그 포스트를 불러오는데 실패했습니다");
    return [];
  }
};

// Get blog post by slug
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      throw error;
    }

    return data ? adaptBlogPost(data) : null;
  } catch (error) {
    console.error("Error fetching blog post by slug:", error);
    toast.error("블로그 포스트를 불러오는데 실패했습니다");
    return null;
  }
};

// Create a new blog post
export const createBlogPost = async (
  post: Omit<Partial<SupabaseBlogPost>, "id" | "author_name" | "author_avatar" | "published_at" | "created_at" | "updated_at" | "slug" | "read_time" | "excerpt"> & { tags?: string[] }
): Promise<SupabaseBlogPost | null> => {
  try {
    const slug = generateSlug(post.title!);
    const readTime = calculateReadingTime(post.content!);
    const excerpt = generateExcerpt(post.content!);
    
    // Extract first image URL from content if any
    const coverImageUrl = extractFirstImageUrl(post.content!);
    
    console.log("Preparing to insert blog post with data:", {
      title: post.title,
      category: post.category,
      slug,
      read_time: readTime,
      excerpt,
      coverImageUrl
    });
    
    // Create the blog post object with all required fields properly defined
    const blogPostData = {
      title: post.title!,
      content: post.content!,
      category: post.category!,
      cover_image: coverImageUrl,
      slug,
      read_time: readTime,
      excerpt,
      author_name: "알파GOGOGO", // Default author name
      author_avatar: "https://i.pravatar.cc/150?img=10", // Default avatar
      published_at: new Date().toISOString() // Explicitly set published_at
    };
    
    console.log("Final blog post data for insert:", blogPostData);
    
    const { data, error } = await supabase
      .from("blog_posts")
      .insert(blogPostData)
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      
      // Handle specific error cases
      if (error.code === '42501') {
        // Permission denied error
        console.error("Permission denied error. RLS policy might be blocking the operation.");
        toast.error("권한 오류: 블로그 포스트 작성 권한이 없습니다");
        return null;
      }
      
      throw error;
    }

    console.log("Blog post inserted successfully:", data);

    // Handle tags if the blog_tags and blog_post_tags tables exist
    if (post.tags && post.tags.length > 0 && data) {
      try {
        await handleBlogTags(data.id, post.tags);
      } catch (tagError) {
        // We don't want tag errors to prevent post creation
        console.error("Error handling tags, but post was created:", tagError);
      }
    }

    toast.success("블로그 포스트가 성공적으로 작성되었습니다");
    return data;
  } catch (error) {
    console.error("Error creating blog post:", error);
    
    // Provide more specific error messages based on the error type
    if (error.message && error.message.includes("violates row-level security policy")) {
      toast.error("권한 오류: 데이터베이스 정책에 의해 저장이 거부되었습니다");
    } else {
      toast.error("블로그 포스트 작성에 실패했습니다");
    }
    
    return null;
  }
};

// Handle saving tags for a blog post
async function handleBlogTags(blogPostId: string, tags: string[]): Promise<void> {
  try {
    // Upsert tags first (insert if not exists)
    for (const tagName of tags) {
      if (!tagName.trim()) continue;
      
      // Insert tag if it doesn't exist
      const { data: tagData, error: tagError } = await supabase
        .from("blog_tags")
        .upsert({ name: tagName.trim() }, { onConflict: 'name' })
        .select('id, name')
        .single();
      
      if (tagError) {
        console.error("Error upserting tag:", tagError);
        continue;
      }
      
      // Create relationship between post and tag
      if (tagData) {
        const { error: relationError } = await supabase
          .from("blog_post_tags")
          .upsert({
            blog_post_id: blogPostId,
            tag_id: tagData.id
          }, { onConflict: 'blog_post_id,tag_id' });
          
        if (relationError) {
          console.error("Error creating tag relationship:", relationError);
        }
      }
    }
  } catch (error) {
    console.error("Error handling blog tags:", error);
    // Note: We don't want to fail the post creation if tags fail, so we just log the error
  }
}
