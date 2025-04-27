
import { useState } from "react";
import { toast } from "sonner";
import { extractYouTubeVideoId } from "@/utils/youtubeUtils";
import { fetchTranscript, processTranscriptSegments } from "@/services/youtubeTranscriptService";
import { 
  YoutubeTranscriptDisabledError,
  YoutubeTranscriptNotAvailableError,
  YoutubeTranscriptTooManyRequestError,
  YoutubeTranscriptVideoUnavailableError
} from "@/utils/youtubeTranscriptErrors";

/**
 * Hook for extracting and managing YouTube video transcripts
 */
export function useYoutubeTranscript() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Handles the extraction of transcript from YouTube URL
   */
  const handleExtractTranscript = async () => {
    // Reset states
    setTranscript("");
    setError("");
    
    // Validate URL
    if (!youtubeUrl.trim()) {
      setError("YouTube URL을 입력해주세요.");
      toast.error("YouTube URL을 입력해주세요.");
      return;
    }
    
    // Extract video ID
    const videoId = extractYouTubeVideoId(youtubeUrl);
    console.log("Extracted Video ID:", videoId);
    
    if (!videoId) {
      setError("유효한 YouTube URL을 입력해주세요.");
      toast.error("유효한 YouTube URL을 입력해주세요.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 여러 언어로 시도
      let transcriptData = [];
      let attemptErrors = [];
      
      try {
        console.log("Attempting to fetch Korean transcript");
        transcriptData = await fetchTranscript(videoId, 'ko');
      } catch (koreanError: any) {
        console.log("Korean transcript failed:", koreanError);
        attemptErrors.push({lang: 'ko', error: koreanError});
        
        try {
          console.log("Trying English transcript");
          transcriptData = await fetchTranscript(videoId, 'en');
        } catch (englishError: any) {
          console.log("English transcript failed:", englishError);
          attemptErrors.push({lang: 'en', error: englishError});
          
          try {
            console.log("Trying with default language");
            transcriptData = await fetchTranscript(videoId);
          } catch (defaultError: any) {
            console.log("Default language transcript failed:", defaultError);
            attemptErrors.push({lang: 'default', error: defaultError});
            // 마지막 오류를 던져 캐치 블록에서 처리
            throw defaultError;
          }
        }
      }
      
      if (transcriptData && transcriptData.length > 0) {
        // Process transcript data into a single text
        const fullTranscript = processTranscriptSegments(transcriptData);
        setTranscript(fullTranscript);
        toast.success("자막을 성공적으로 가져왔습니다!");
      } else {
        throw new YoutubeTranscriptNotAvailableError(videoId);
      }
    } catch (error) {
      console.error("자막 추출 오류:", error);
      let errorMessage = "자막을 가져오는데 실패했습니다.";
      
      // Handle different error types
      if (error instanceof YoutubeTranscriptTooManyRequestError) {
        errorMessage = "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
      } else if (error instanceof YoutubeTranscriptVideoUnavailableError) {
        errorMessage = "이 영상은 더 이상 사용할 수 없습니다.";
      } else if (error instanceof YoutubeTranscriptDisabledError) {
        errorMessage = "이 영상에서는 자막 기능이 비활성화되어 있습니다.";
      } else if (error instanceof YoutubeTranscriptNotAvailableError) {
        errorMessage = "이 영상에는 자막이 없거나 접근할 수 없습니다.";
      } else if (error instanceof Error) {
        if (error.message.includes("Failed to fetch") || 
            error.message.includes("NetworkError") || 
            error.message.includes("네트워크 연결 오류")) {
          errorMessage = "네트워크 연결 오류: 서버에 연결할 수 없습니다.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      toast.error("자막을 가져오는데 실패했습니다.");
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
    handleExtractTranscript
  };
}
