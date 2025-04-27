
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Youtube } from "lucide-react";
import { useYoutubeTranscript } from "@/hooks/useYoutubeTranscript";
import { TranscriptForm } from "./youtube-transcript/TranscriptForm";
import { ErrorMessage } from "./youtube-transcript/ErrorMessage";
import { TranscriptDisplay } from "./youtube-transcript/TranscriptDisplay";
import { useEffect, useState } from "react";

export function YouTubeTranscriptService() {
  const {
    youtubeUrl,
    setYoutubeUrl,
    transcript,
    isLoading,
    error,
    lastVideoId,
    handleExtractTranscript
  } = useYoutubeTranscript();
  
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="youtube-transcript" className="mb-16">
      <Card className={`shadow-lg overflow-hidden border-0 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
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
            <div className={`transition-all duration-300 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <TranscriptForm
                youtubeUrl={youtubeUrl}
                setYoutubeUrl={setYoutubeUrl}
                isLoading={isLoading}
                onSubmit={handleExtractTranscript}
              />
            </div>
            
            {error && (
              <div className="animate-fade-in">
                <ErrorMessage error={error} lastVideoId={lastVideoId} />
              </div>
            )}
            
            {transcript && (
              <div className="animate-fade-in">
                <TranscriptDisplay transcript={transcript} />
              </div>
            )}

            {isLoading && !error && !transcript && (
              <div className="flex justify-center py-12">
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-purple-700">자막을 추출하는 중입니다...</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 py-4 px-8 rounded-b-lg">
          <div className="text-xs text-gray-500 space-y-1">
            <p>* 일부 영상은 자막이 제공되지 않을 수 있습니다. 공개된 자막이 있는 영상에서만 동작합니다.</p>
            <p>* 테스트 기간에는 예시 URL을 사용하여 서비스를 확인해보세요.</p>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
}
