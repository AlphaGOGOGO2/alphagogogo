
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Info } from "lucide-react";
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
  const [showHint, setShowHint] = useState(false);
  
  const handleExampleClick = (url: string) => {
    setYoutubeUrl(url);
  };
  
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
      
      <div className="mt-3">
        <button 
          type="button"
          onClick={() => setShowHint(!showHint)}
          className="text-xs flex items-center text-purple-600 hover:text-purple-800"
        >
          <Info className="h-3 w-3 mr-1" />
          {showHint ? "예시 숨기기" : "예시 URL 보기"}
        </button>
        
        {showHint && (
          <div className="mt-2 p-3 bg-purple-50 rounded-md text-sm">
            <p className="font-medium mb-1.5 text-purple-800">테스트용 예시 URL:</p>
            <div className="space-y-1.5">
              {[
                { label: "Rick Astley - Never Gonna Give You Up", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
                { label: "PSY - GANGNAM STYLE", url: "https://www.youtube.com/watch?v=9bZkp7q19f0" },
                { label: "예시 테스트 1", url: "https://www.youtube.com/watch?v=example1" },
                { label: "예시 테스트 2", url: "https://www.youtube.com/watch?v=example2" }
              ].map((example, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-gray-700">{example.label}</span>
                  <button
                    type="button"
                    onClick={() => handleExampleClick(example.url)}
                    className="text-purple-600 hover:text-purple-800 text-xs bg-white px-2 py-1 rounded-md border border-purple-200 shadow-sm"
                  >
                    사용하기
                  </button>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-500">위 URL은 테스트 목적으로만 사용됩니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
