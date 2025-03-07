
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

// Upload blog image
export const uploadBlogImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    toast.error("이미지 업로드에 실패했습니다");
    return null;
  }
};
