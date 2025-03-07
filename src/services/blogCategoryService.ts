
import { supabase } from "@/integrations/supabase/client";
import { BlogCategory } from "@/types/supabase";
import { toast } from "sonner";

// Get all blog categories
export const getAllBlogCategories = async (): Promise<BlogCategory[]> => {
  try {
    const { data, error } = await supabase
      .from("blog_categories")
      .select("*")
      .order("name");

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    toast.error("카테고리를 불러오는데 실패했습니다");
    return [];
  }
};
