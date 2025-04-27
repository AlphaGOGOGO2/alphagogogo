
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Youtube, ExternalLink } from "lucide-react";
import { useState } from "react";

interface TranscriptFormProps {
  youtubeUrl: string;
  setYoutubeUrl: (url: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
  needsAuth?: boolean;
  authUrl?: string | null;
}

export function TranscriptForm({
  youtubeUrl,
  setYoutubeUrl,
  isLoading,
  onSubmit,
  needsAuth,
  authUrl
}: TranscriptFormProps) {
  const [isTouched, setIsTouched] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };
  
  const handleAuth = () => {
    if (authUrl) {
      // 새 창에서 인증 URL 열기
      window.location.href = authUrl;
    }
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
      
      {needsAuth && authUrl && (
        <div className="mt-6 p-5 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
          <h3 className="text-md font-medium text-yellow-800 flex items-center">
            <Youtube className="h-5 w-5 mr-2 text-red-600" />
            YouTube 계정 인증 필요
          </h3>
          <p className="mt-2 text-sm text-yellow-700">
            YouTube API 정책에 따라 자막을 가져오기 위해서는 사용자 인증이 필요합니다. 
            아래 버튼을 클릭하여 YouTube 계정에 접근 권한을 허용해주세요.
          </p>
          <div className="mt-4 flex justify-center">
            <Button 
              type="button" 
              onClick={handleAuth}
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 h-auto"
              size="lg"
            >
              <Youtube className="h-5 w-5 mr-2" />
              YouTube 계정으로 인증하기
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-yellow-600 mt-3 text-center">
            인증 후 자동으로 이 페이지로 돌아옵니다
          </p>
        </div>
      )}
    </form>
  );
}
