
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface BlogSubmitButtonProps {
  isSubmitting: boolean;
}

export function BlogSubmitButton({ isSubmitting }: BlogSubmitButtonProps) {
  return (
    <Button 
      type="submit" 
      className="bg-purple-600 hover:bg-purple-700 w-full md:w-auto float-right" 
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          저장 중...
        </>
      ) : "글 저장하기"}
    </Button>
  );
}
