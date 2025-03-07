
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Youtube } from "lucide-react";

interface TranscriptFormProps {
  youtubeUrl: string;
  setYoutubeUrl: (url: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  useProxy: boolean;
  setUseProxy: (use: boolean) => void;
  isLoading: boolean;
  onSubmit: () => void;
}

export function TranscriptForm({
  youtubeUrl,
  setYoutubeUrl,
  language,
  setLanguage,
  useProxy,
  setUseProxy,
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
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="ko">한국어</option>
          <option value="en">영어</option>
          <option value="ja">일본어</option>
          <option value="zh-Hans">중국어 (간체)</option>
          <option value="zh-Hant">중국어 (번체)</option>
          <option value="es">스페인어</option>
          <option value="fr">프랑스어</option>
          <option value="de">독일어</option>
          <option value="ru">러시아어</option>
        </select>
      </div>
      
      <div className="flex items-center mt-2">
        <input
          type="checkbox"
          id="use-proxy"
          checked={useProxy}
          onChange={(e) => setUseProxy(e.target.checked)}
          className="mr-2 h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
        />
        <label htmlFor="use-proxy" className="text-sm text-gray-600">
          CORS 우회 사용 (권장)
        </label>
      </div>
      
      <Button
        className="w-full mt-3"
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
  );
}
