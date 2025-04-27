
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
    videoInfo,
    handleExtractTranscript,
    needsAuth,
    authUrl
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
                needsAuth={needsAuth}
                authUrl={authUrl}
              />
            </div>
            
            {error && (
              <div className="animate-fade-in">
                <ErrorMessage error={error} />
              </div>
            )}
            
            {transcript && (
              <div className="animate-fade-in">
                <TranscriptDisplay 
                  transcript={transcript} 
                  videoInfo={videoInfo} 
                />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 py-4 px-8">
          <div className="space-y-2 text-xs text-gray-500">
            <p>
              * YouTube Data API를 통해 자막 데이터를 가져옵니다.
            </p>
            <p>
              * 자막이 없는 동영상의 경우 추출이 불가능합니다.
            </p>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
}
