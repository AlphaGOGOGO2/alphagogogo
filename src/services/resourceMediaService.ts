
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { sanitizeFilename } from "@/utils/downloadPrivacy";

// Upload resource images and files
export const uploadResourceImage = async (file: File): Promise<string | null> => {
  try {
    // Check for valid file types (images primarily, but also documents)
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const originalBase = sanitizeFilename(file.name.replace(/\.[^/.]+$/, ''));
    const shortId = uuidv4().split('-')[0];
    const fileName = `${originalBase || 'file'}-${shortId}.${fileExt}`;
    const filePath = `${fileName}`;

    // Check file size (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`파일 크기는 10MB 이하여야 합니다 (현재: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
      return null;
    }

    // Upload the file
    const { error: uploadError, data } = await supabase.storage
      .from('resource-media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
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
      .from('resource-media')
      .getPublicUrl(filePath);

    console.log("Upload successful, URL:", urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error("Error uploading resource media:", error);
    toast.error("미디어 업로드에 실패했습니다. 잠시 후 다시 시도해주세요.");
    return null;
  }
};

// Upload resource files (documents, archives, etc.)
export const uploadResourceFile = async (file: File): Promise<{ url: string; size: number } | null> => {
  try {
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const originalBase = sanitizeFilename(file.name.replace(/\.[^/.]+$/, ''));
    const shortId = uuidv4().split('-')[0];
    const fileName = `${originalBase || 'file'}-${shortId}.${fileExt}`;
    const filePath = `files/${fileName}`;

    // Check file size (max 1GB for files)
    const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`파일 크기는 1GB 이하여야 합니다 (현재: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
      return null;
    }

    // Upload the file
    const { error: uploadError, data } = await supabase.storage
      .from('resource-media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || 'application/octet-stream'
      });

    if (uploadError) {
      console.error("File upload error:", uploadError);
      toast.error(`파일 업로드 오류: ${uploadError.message}`);
      return null;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('resource-media')
      .getPublicUrl(filePath);

    console.log("File upload successful, URL:", urlData.publicUrl);
    return {
      url: urlData.publicUrl,
      size: file.size
    };
  } catch (error) {
    console.error("Error uploading resource file:", error);
    toast.error("파일 업로드에 실패했습니다. 잠시 후 다시 시도해주세요.");
    return null;
  }
};
