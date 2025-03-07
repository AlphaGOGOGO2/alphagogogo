
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface BlogSubmitButtonProps {
  isSubmitting: boolean;
  isEditMode?: boolean;
}

export function BlogSubmitButton({ isSubmitting, isEditMode = false }: BlogSubmitButtonProps) {
  return (
    <Button 
      type="submit" 
      className="bg-purple-600 hover:bg-purple-700 w-full md:w-auto float-right" 
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isEditMode ? "수정 중..." : "저장 중..."}
        </>
      ) : isEditMode ? "글 수정하기" : "글 저장하기"}
    </Button>
  );
}
