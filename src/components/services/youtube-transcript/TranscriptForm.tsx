
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Youtube } from "lucide-react";

interface TranscriptFormProps {
  youtubeUrl: string;
  setYoutubeUrl: (url: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
}

export function TranscriptForm({
  youtubeUrl,
  setYoutubeUrl,
  isLoading,
  onSubmit
}: TranscriptFormProps) {
  return (
    <div>
      <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700 mb-1">
        YouTube 동영상 URL
      </label>
      <div className="flex gap-2">
        <Input
          id="youtube-url"
          placeholder="https://www.youtube.com/watch?v=..."
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          className="flex-1"
        />
        <Button
          onClick={onSubmit}
          disabled={isLoading || !youtubeUrl}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              자막 추출 중...
            </>
          ) : (
            "자막 추출하기"
          )}
        </Button>
      </div>
    </div>
  );
}
