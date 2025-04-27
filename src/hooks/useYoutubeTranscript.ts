
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { extractYouTubeVideoId } from "@/utils/youtubeUtils";
import { fetchTranscript, processTranscriptSegments } from "@/services/youtubeTranscriptService";
import { 
  YoutubeTranscriptDisabledError,
  YoutubeTranscriptNotAvailableError,
  YoutubeTranscriptTooManyRequestError,
  YoutubeTranscriptVideoUnavailableError
} from "@/utils/youtubeTranscriptErrors";
import { TranscriptSegment } from "@/types/youtubeTranscript";

export function useYoutubeTranscript() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [attemptCount, setAttemptCount] = useState(0);
  const [transcriptSegments, setTranscriptSegments] = useState<TranscriptSegment[]>([]);

  useEffect(() => {
    if (attemptCount > 0 && error && (error.includes("네트워크 연결 오류") || error.includes("CORS")) && youtubeUrl) {
      const maxRetries = 3;
      
      if (attemptCount <= maxRetries) {
        const timer = setTimeout(() => {
          console.log(`자동 재시도 중... (${attemptCount}/${maxRetries})`);
          toast.info(`자동으로 다시 시도 중... (${attemptCount}/${maxRetries})`);
          handleExtractTranscript(true);
        }, 1500);
        
        return () => clearTimeout(timer);
      }
    }
  }, [error, attemptCount, youtubeUrl]);

  const handleExtractTranscript = async (isRetry = false) => {
    if (!isRetry) {
      setTranscript("");
      setTranscriptSegments([]);
      setError("");
      setAttemptCount(0);
    } else {
      setAttemptCount(prev => prev + 1);
    }
    
    if (!youtubeUrl.trim()) {
      setError("YouTube URL을 입력해주세요.");
      toast.error("YouTube URL을 입력해주세요.");
      return;
    }
    
    const videoId = extractYouTubeVideoId(youtubeUrl);
    console.log("Extracted Video ID:", videoId);
    
    if (!videoId) {
      setError("유효한 YouTube URL을 입력해주세요.");
      toast.error("유효한 YouTube URL을 입력해주세요.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 먼저 기본 언어로 시도 (브라우저 언어 우선)
      const preferredLang = navigator.language.split('-')[0];
      console.log(`선호 언어로 시도: ${preferredLang}`);
      
      let segments: TranscriptSegment[] = [];
      let succeeded = false;
      
      try {
        // 1. 선호 언어 시도
        segments = await fetchTranscript(videoId, preferredLang);
        succeeded = true;
      } catch (langError) {
        console.log(`선호 언어 실패 (${preferredLang}):`, langError);
        
        try {
          // 2. 한국어 시도
          console.log("한국어 자막 시도 중...");
          segments = await fetchTranscript(videoId, 'ko');
          succeeded = true;
        } catch (koreanError) {
          console.log("한국어 자막 실패:", koreanError);
          
          try {
            // 3. 영어 시도
            console.log("영어 자막 시도 중...");
            segments = await fetchTranscript(videoId, 'en');
            succeeded = true;
          } catch (englishError) {
            console.log("영어 자막 실패:", englishError);
            
            try {
              // 4. 언어 지정 없이 시도
              console.log("기본 언어로 시도 중...");
              segments = await fetchTranscript(videoId);
              succeeded = true;
            } catch (defaultError) {
              console.log("기본 언어 시도 실패:", defaultError);
              // 모든 시도 실패 시 에러 발생
              throw defaultError;
            }
          }
        }
      }
      
      if (succeeded && segments.length > 0) {
        setTranscriptSegments(segments);
        const fullTranscript = processTranscriptSegments(segments);
        setTranscript(fullTranscript);
        toast.success("자막을 성공적으로 가져왔습니다!");
        setAttemptCount(0);
      } else {
        throw new YoutubeTranscriptNotAvailableError(videoId);
      }
    } catch (error: any) {
      console.error("자막 추출 오류:", error);
      let errorMessage = "자막을 가져오는데 실패했습니다.";
      
      if (error instanceof YoutubeTranscriptTooManyRequestError) {
        errorMessage = "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
      } else if (error instanceof YoutubeTranscriptVideoUnavailableError) {
        errorMessage = "이 영상은 더 이상 사용할 수 없습니다.";
      } else if (error instanceof YoutubeTranscriptDisabledError) {
        errorMessage = "이 영상에서는 자막 기능이 비활성화되어 있습니다.";
      } else if (error instanceof YoutubeTranscriptNotAvailableError) {
        errorMessage = "이 영상에는 자막이 없거나 접근할 수 없습니다.";
      } else if (error.message.includes('CORS') || error.message.includes('네트워크 연결 오류')) {
        errorMessage = `네트워크 연결 오류: CORS 정책 문제로 자막에 접근할 수 없습니다. (시도 ${attemptCount + 1}/3)`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      if (!isRetry || attemptCount >= 3) {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    youtubeUrl,
    setYoutubeUrl,
    transcript,
    transcriptSegments,
    isLoading,
    error,
    handleExtractTranscript
  };
}
