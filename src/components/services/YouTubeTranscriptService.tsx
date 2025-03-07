
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
      <Card className="shadow-lg overflow-hidden border-0">
        <CardHeader className="bg-gradient-to-r from-purple-800 to-purple-600 text-white rounded-t-lg py-8">
          <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl">
            <Youtube size={32} className="text-white" />
            유튜브 자막 추출 서비스
          </CardTitle>
          <CardDescription className="text-white/90 text-base mt-2">
            YouTube 동영상의 자막을 텍스트로 추출하여 저장하거나 복사할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 pb-6 px-8">
          <div className="flex flex-col gap-6">
            <div className="rounded-xl bg-purple-50 p-4 border border-purple-100 mb-2">
              <div className="flex gap-3">
                <AlertCircle size={20} className="text-purple-700 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-purple-800">
                  <p className="font-medium mb-1">자막이 있는 영상에서만 동작합니다</p>
                  <p className="text-purple-700 text-sm">다음 URL 형식을 지원합니다:</p>
                  <ul className="list-disc pl-5 text-xs mt-1 space-y-1 text-purple-600">
                    <li>https://www.youtube.com/watch?v=VIDEO_ID</li>
                    <li>https://youtu.be/VIDEO_ID</li>
                    <li>https://m.youtube.com/watch?v=VIDEO_ID</li>
                  </ul>
                  <p className="text-purple-700 text-sm mt-3 font-medium">추천 영상:</p>
                  <ul className="list-disc pl-5 text-xs mt-1 space-y-1 text-purple-600">
                    <li>영어 교육 콘텐츠, TED 강연, 자막이 제공되는 공식 채널의 영상</li>
                    <li>최근에 업로드된 인기 영상</li>
                    <li>자막 옵션이 있는 것으로 표시된 영상</li>
                  </ul>
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
        <CardFooter className="bg-gray-50 py-4 px-8 rounded-b-lg">
          <p className="text-xs text-gray-500">
            * 일부 영상은 자막이 제공되지 않을 수 있습니다. 공개된 자막이 있는 영상에서만 동작합니다.
            CORS 정책으로 인한 제한이 있을 수 있으며, 이 경우 CORS 프록시를 통해 요청합니다.
          </p>
        </CardFooter>
      </Card>
    </section>
  );
}
