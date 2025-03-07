
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

// Upload blog image
export const uploadBlogImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Check if the bucket exists, if not create it (this won't do anything if it already exists)
    const { data: buckets } = await supabase.storage.listBuckets();
    const blogImagesBucket = buckets?.find(bucket => bucket.name === 'blog-images');

    if (!blogImagesBucket) {
      console.log("Creating blog-images bucket...");
      const { error: createBucketError } = await supabase.storage.createBucket('blog-images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB in bytes
      });

      if (createBucketError) {
        console.error("Error creating bucket:", createBucketError);
        throw createBucketError;
      }
    }

    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }

    // Get the public URL
    const { data } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    toast.error("이미지 업로드에 실패했습니다. 권한이 없거나 버킷 설정이 잘못되었을 수 있습니다.");
    return null;
  }
};
