
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Remove existing tag associations for a blog post
export async function removeExistingTags(blogPostId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from("blog_post_tags")
      .delete()
      .eq("blog_post_id", blogPostId);
    
    if (error) {
      console.error("Error removing existing tags:", error);
    }
  } catch (error) {
    console.error("Error removing existing tags:", error);
  }
}

// Handle saving tags for a blog post
export async function handleBlogTags(blogPostId: string, tags: string[]): Promise<void> {
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
