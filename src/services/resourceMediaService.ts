/**
 * Resource Media Service - 로컬 모드 (업로드 비활성화)
 *
 * 로컬 모드에서는 파일 업로드가 지원되지 않습니다.
 * 이미지/파일은 public 폴더에 직접 배치하여 사용하세요.
 */

import { toast } from "sonner";

// Upload resource images (로컬 모드에서는 비활성화)
export const uploadResourceImage = async (file: File): Promise<string | null> => {
  toast.error("로컬 모드에서는 파일 업로드가 지원되지 않습니다. public/images 폴더에 파일을 직접 배치하세요.");
  return null;
};

// Upload resource files (로컬 모드에서는 비활성화)
export const uploadResourceFile = async (file: File): Promise<{ url: string; size: number } | null> => {
  toast.error("로컬 모드에서는 파일 업로드가 지원되지 않습니다. public 폴더에 파일을 직접 배치하세요.");
  return null;
};
