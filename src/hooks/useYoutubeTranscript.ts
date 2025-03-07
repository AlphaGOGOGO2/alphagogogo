
import { useState } from "react";
import { toast } from "sonner";
import { extractYouTubeVideoId } from "@/utils/youtubeUtils";

export function useYoutubeTranscript() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleExtractTranscript = async () => {
    // Reset states
    setTranscript("");
    setError("");
    
    const videoId = extractYouTubeVideoId(youtubeUrl);
    
    if (!videoId) {
      setError("유효한 YouTube URL을 입력해주세요.");
      toast.error("유효한 YouTube URL을 입력해주세요.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use the transcript API directly without language parameter to get default language
      const apiUrl = `https://youtube-transcript.vercel.app/api?videoId=${videoId}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`자막을 가져오는데 실패했습니다. (${response.status})`);
      }
      
      const data = await response.json();
      
      if (data.transcript) {
        setTranscript(data.transcript);
        toast.success("자막을 성공적으로 가져왔습니다!");
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error("알 수 없는 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("자막 추출 오류:", error);
      setError(error instanceof Error ? error.message : "자막을 가져오는데 실패했습니다.");
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
