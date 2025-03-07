
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Youtube, AlertCircle } from "lucide-react";
import { useYoutubeTranscript } from "@/hooks/useYoutubeTranscript";
import { TranscriptForm } from "./youtube-transcript/TranscriptForm";
import { ErrorMessage } from "./youtube-transcript/ErrorMessage";
import { TranscriptDisplay } from "./youtube-transcript/TranscriptDisplay";

export function YouTubeTranscriptService() {
  const {
    youtubeUrl,
    setYoutubeUrl,
    transcript,
    isLoading,
    error,
    handleExtractTranscript
  } = useYoutubeTranscript();

  return (
    <section id="youtube-transcript" className="mb-16">
      <Card className="shadow-md">
        <CardHeader className="bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Youtube size={24} />
            유튜브 자막 추출 서비스
          </CardTitle>
          <CardDescription className="text-white/80">
            YouTube 동영상의 자막을 텍스트로 추출하여 저장하거나 복사할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="rounded-md bg-yellow-50 p-3 border border-yellow-200 mb-2">
              <div className="flex gap-2">
                <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-700">
                  <p>자막이 있는 영상에서만 동작합니다. 유효한 YouTube URL을 입력해주세요.</p>
                  <p className="text-xs mt-1">예시: https://www.youtube.com/watch?v=VIDEO_ID 또는 https://youtu.be/VIDEO_ID</p>
                  <p className="text-xs mt-1">추천: 영어 교육 콘텐츠, TED 강연, 자막이 제공되는 공식 채널의 영상을 시도해보세요.</p>
                  <p className="text-xs mt-1">참고: 브라우저의 CORS 정책으로 인해 일부 영상의 자막을 가져오지 못할 수 있습니다.</p>
                </div>
              </div>
            </div>
            
            <TranscriptForm
              youtubeUrl={youtubeUrl}
              setYoutubeUrl={setYoutubeUrl}
              isLoading={isLoading}
              onSubmit={handleExtractTranscript}
            />
            
            {error && <ErrorMessage error={error} />}
            
            {transcript && <TranscriptDisplay transcript={transcript} />}
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 rounded-b-lg">
          <p className="text-xs text-gray-500">
            * 일부 영상은 자막이 제공되지 않을 수 있습니다. 공개된 자막이 있는 영상에서만 동작합니다.
            브라우저의 CORS 정책으로 인해 접근이 제한될 수 있습니다.
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}
