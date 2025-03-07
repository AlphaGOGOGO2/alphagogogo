
import { useState } from "react";
import { toast } from "sonner";
import { extractYoutubeVideoId } from "@/utils/youtubeUtils";

export function useYoutubeTranscript() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleExtractTranscript = async () => {
    // Reset states
    setTranscript("");
    setError("");
    
    const videoId = extractYoutubeVideoId(youtubeUrl);
    
    if (!videoId) {
      setError("유효한 YouTube URL을 입력해주세요.");
      toast.error("유효한 YouTube URL을 입력해주세요.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use a fallback method by creating an iframe-based approach
      // This avoids CORS issues by using the YouTube embed API
      // First try the direct API (which might work in some environments)
      try {
        const apiUrl = `https://youtube-transcript.vercel.app/api?videoId=${videoId}`;
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          mode: 'cors', // Explicitly set CORS mode
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.transcript) {
            setTranscript(data.transcript);
            toast.success("자막을 성공적으로 가져왔습니다!");
            setIsLoading(false);
            return;
          }
        }
      } catch (directApiError) {
        console.log("Direct API failed, trying fallback method", directApiError);
        // Continue to fallback method
      }
      
      // Fallback method - use a public API that has CORS enabled
      const fallbackApiUrl = `https://yt-transcript-api.vercel.app/api?videoId=${videoId}`;
      
      const fallbackResponse = await fetch(fallbackApiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!fallbackResponse.ok) {
        throw new Error(`자막을 가져오는데 실패했습니다. (${fallbackResponse.status})`);
      }
      
      const fallbackData = await fallbackResponse.json();
      
      if (fallbackData.transcript || fallbackData.text) {
        setTranscript(fallbackData.transcript || fallbackData.text);
        toast.success("자막을 성공적으로 가져왔습니다!");
      } else if (fallbackData.error) {
        throw new Error(fallbackData.error);
      } else {
        throw new Error("No transcript found");
      }
    } catch (error) {
      console.error("자막 추출 오류:", error);
      let errorMessage = "자막을 가져오는데 실패했습니다.";
      
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
          errorMessage = "네트워크 연결 오류: 서버에 연결할 수 없습니다.";
        } else if (error.message.includes("No transcript")) {
          errorMessage = "No transcript: 이 영상에는 자막이 없거나 접근할 수 없습니다.";
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
