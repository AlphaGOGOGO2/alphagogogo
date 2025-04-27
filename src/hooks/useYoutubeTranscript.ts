
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
import { TranscriptSegment } from "@/types/youtubeTranscript";

export function useYoutubeTranscript() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [transcriptSegments, setTranscriptSegments] = useState<TranscriptSegment[]>([]);
  const [videoInfo, setVideoInfo] = useState<{title?: string, author?: string}>({});

  const handleExtractTranscript = async () => {
    setTranscript("");
    setTranscriptSegments([]);
    setError("");
    setVideoInfo({});
    
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
      // 브라우저 언어 우선
      const preferredLang = navigator.language.split('-')[0];
      console.log(`선호 언어로 시도: ${preferredLang}`);
      
      // API 호출
      const segments = await fetchTranscript(videoId, preferredLang);
      
      if (segments && segments.length > 0) {
        setTranscriptSegments(segments);
        const fullTranscript = processTranscriptSegments(segments);
        setTranscript(fullTranscript);
        setVideoInfo({
          title: "YouTube 동영상",
          author: "YouTube 채널"
        });
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
        errorMessage = "이 영상에는 자막이 없거나 접근할 수 없습니다. 다음과 같은 이유가 있을 수 있습니다:\n- 자막이 없는 영상\n- 자막 접근 권한이 제한된 영상\n- YouTube API 할당량 초과";
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
    transcriptSegments,
    isLoading,
    error,
    videoInfo,
    handleExtractTranscript
  };
}
