
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

// Upload blog media (images and videos)
export const uploadBlogImage = async (file: File): Promise<string | null> => {
  try {
    // Check for valid file types (images and videos)
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Check file size (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`파일 크기는 10MB 이하여야 합니다 (현재: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
      return null;
    }

    // Upload the file
    const { error: uploadError, data } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Change to true to allow overwriting files
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      
      // Provide more specific error messages
      if (uploadError.message.includes("permission")) {
        toast.error("권한이 없습니다. 관리자에게 문의하세요.");
      } else if (uploadError.message.includes("storage") || uploadError.message.includes("bucket")) {
        toast.error("스토리지 버킷 접근에 문제가 있습니다.");
      } else {
        toast.error(`업로드 오류: ${uploadError.message}`);
      }
      
      return null;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    console.log("Upload successful, URL:", urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error("Error uploading media:", error);
    toast.error("미디어 업로드에 실패했습니다. 잠시 후 다시 시도해주세요.");
    return null;
  }
};
