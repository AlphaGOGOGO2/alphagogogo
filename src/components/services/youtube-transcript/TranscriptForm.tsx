
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader } from "lucide-react";

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
  const [exampleUrls] = useState([
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",  // Rick Astley - Never Gonna Give You Up (영어 자막)
    "https://www.youtube.com/watch?v=9bZkp7q19f0",  // PSY - Gangnam Style (한국어 자막)
    "https://www.youtube.com/watch?v=kTJczUoc26U",  // The Kid LAROI, Justin Bieber - STAY (영어 자막)
    "https://www.youtube.com/watch?v=gdZLi9oWNZg"   // BTS - Dynamite (영어 자막)
  ]);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };
  
  const handleExampleClick = (url: string) => {
    setYoutubeUrl(url);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700 mb-1">
          YouTube URL
        </label>
        <div className="flex">
          <Input
            id="youtube-url"
            type="text"
            placeholder="https://www.youtube.com/watch?v=..."
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="flex-1 rounded-r-none focus:ring-purple-500 focus:border-purple-500"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="rounded-l-none bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader size={16} className="mr-2 animate-spin" />
                처리중...
              </>
            ) : (
              "자막 추출"
            )}
          </Button>
        </div>
      </div>
      
      <div className="text-sm text-gray-500">
        <p className="mb-1">예시 URL:</p>
        <div className="flex flex-wrap gap-2">
          {exampleUrls.map((url, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleExampleClick(url)}
              className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded hover:bg-purple-100 transition-colors"
            >
              예시 {index+1}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
