
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

export function useYoutubeTranscript() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [attemptCount, setAttemptCount] = useState(0);
  const [lastVideoId, setLastVideoId] = useState<string | null>(null);

  useEffect(() => {
    if (attemptCount > 0 && error && error.includes("네트워크 연결 오류") && youtubeUrl) {
      const maxRetries = 2;
      
      if (attemptCount <= maxRetries) {
        const timer = setTimeout(() => {
          console.log(`자동 재시도 중... (${attemptCount}/${maxRetries})`);
          handleExtractTranscript(true);
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [error, attemptCount, youtubeUrl]);

  const handleExtractTranscript = async (isRetry = false) => {
    if (!isRetry) {
      setTranscript("");
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
    console.log("추출된 비디오 ID:", videoId);
    
    if (!videoId) {
      setError("유효한 YouTube URL을 입력해주세요.");
      toast.error("유효한 YouTube URL을 입력해주세요.");
      return;
    }
    
    setLastVideoId(videoId);
    setIsLoading(true);
    
    // 테스트용 비디오 ID 체크 - 실제 배포 시 이 부분은 제거
    const testVideoIds = ["dQw4w9WgXcQ", "9bZkp7q19f0", "example1", "example2"];
    if (testVideoIds.includes(videoId)) {
      console.log("테스트 비디오 ID를 사용합니다 - 데모 자막이 반환됩니다");
      toast.info("테스트 URL이 감지되었습니다. 데모 자막이 표시됩니다.");
    }
    
    try {
      // 한국어로 먼저 시도
      let transcriptData = [];
      
      try {
        console.log("한국어 자막 시도 중...");
        transcriptData = await fetchTranscript(videoId, 'ko');
      } catch (koreanError) {
        console.log("한국어 자막 실패:", koreanError);
        
        try {
          console.log("영어 자막 시도 중...");
          transcriptData = await fetchTranscript(videoId, 'en');
        } catch (englishError) {
          console.log("영어 자막 실패:", englishError);
          
          console.log("기본 언어로 시도 중...");
          transcriptData = await fetchTranscript(videoId);
        }
      }
      
      if (transcriptData && transcriptData.length > 0) {
        const fullTranscript = processTranscriptSegments(transcriptData);
        setTranscript(fullTranscript);
        toast.success("자막을 성공적으로 가져왔습니다!");
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
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    youtubeUrl,
    setYoutubeUrl,
    transcript,
    isLoading,
    error,
    lastVideoId,
    handleExtractTranscript
  };
}
