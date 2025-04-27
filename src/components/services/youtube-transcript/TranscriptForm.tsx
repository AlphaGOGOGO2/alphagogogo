
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { useState } from "react";

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
  const [isTouched, setIsTouched] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };
  
  // 입력값 검증 (선택사항)
  const isValidUrl = youtubeUrl.trim().length > 0 && 
    (youtubeUrl.includes('youtube.com') || youtubeUrl.includes('youtu.be'));

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700 mb-2">
        YouTube 동영상 URL
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Input
            id="youtube-url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={youtubeUrl}
            onChange={(e) => {
              setYoutubeUrl(e.target.value);
              setIsTouched(true);
            }}
            className={`pl-4 pr-4 py-3 h-12 bg-white shadow-sm
              ${isTouched && !isValidUrl ? 'border-red-300 focus-visible:ring-red-400' : 
              'border-purple-100 focus-visible:ring-purple-500'}`}
          />
          {isTouched && !isValidUrl && youtubeUrl.trim() !== '' && (
            <div className="text-xs text-red-500 mt-1 ml-1">
              유효한 YouTube URL을 입력하세요
            </div>
          )}
        </div>
        <Button
          type="submit"
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
    </form>
  );
}
