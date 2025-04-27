
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";

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
    <div className="w-full">
      <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700 mb-2">
        YouTube 동영상 URL
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Input
            id="youtube-url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="pl-4 pr-4 py-3 h-12 bg-white border-purple-100 focus-visible:ring-purple-500 shadow-sm"
          />
        </div>
        <Button
          onClick={onSubmit}
          disabled={isLoading || !youtubeUrl}
          className="h-12 px-6 bg-purple-700 hover:bg-purple-800 text-white shadow-md transition-all duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              자막 추출 중...
            </>
          ) : (
            <>
              <Search className="mr-2 h-5 w-5" />
              자막 추출하기
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
