
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
    
    if (!youtubeUrl.trim()) {
      setError("YouTube URL을 입력해주세요.");
      toast.error("YouTube URL을 입력해주세요.");
      return;
    }
    
    const videoId = extractYouTubeVideoId(youtubeUrl);
    console.log("Extracted Video ID:", videoId); // 디버깅용 로그 추가
    
    if (!videoId) {
      setError("유효한 YouTube URL을 입력해주세요.");
      toast.error("유효한 YouTube URL을 입력해주세요.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 먼저 proxy-free API 시도
      try {
        const apiUrl = `https://www.youtube.com/api/timedtext?lang=ko&v=${videoId}`;
        
        const response = await fetch(apiUrl);
        if (response.ok) {
          const xmlText = await response.text();
          if (xmlText && xmlText.length > 0) {
            // XML 자막을 파싱하여 텍스트로 변환
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");
            const textNodes = xmlDoc.getElementsByTagName("text");
            let fullTranscript = "";
            
            for (let i = 0; i < textNodes.length; i++) {
              fullTranscript += textNodes[i].textContent + " ";
            }
            
            if (fullTranscript.trim()) {
              setTranscript(fullTranscript.trim());
              toast.success("자막을 성공적으로 가져왔습니다!");
              setIsLoading(false);
              return;
            }
          }
        }
      } catch (directApiError) {
        console.log("Direct YouTube API failed:", directApiError);
      }
      
      // 두 번째 방법 시도: InnerTube API
      try {
        const innertubeUrl = `https://youtubetranscript.com/?server_vid=${videoId}`;
        const response = await fetch(innertubeUrl);
        
        if (response.ok) {
          const html = await response.text();
          // 간단한 파싱: span 태그 내의 텍스트를 추출
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = html;
          const transcriptDiv = tempDiv.querySelector('.transcript-content');
          
          if (transcriptDiv) {
            setTranscript(transcriptDiv.textContent || "");
            toast.success("자막을 성공적으로 가져왔습니다!");
            setIsLoading(false);
            return;
          }
        }
      } catch (innertubeError) {
        console.log("InnerTube API failed:", innertubeError);
      }
      
      // 세 번째 방법: 외부 API 사용
      try {
        // 수정된 API 엔드포인트 사용
        const apiUrl = `https://youtube-transcript-api.vercel.app/api/transcript?videoId=${videoId}`;
        
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          
          if (data.transcript) {
            setTranscript(data.transcript);
            toast.success("자막을 성공적으로 가져왔습니다!");
            setIsLoading(false);
            return;
          }
        }
      } catch (apiError) {
        console.log("External API failed:", apiError);
      }
      
      // 모든 방법이 실패한 경우
      throw new Error("No transcript found");
      
    } catch (error) {
      console.error("자막 추출 오류:", error);
      let errorMessage = "자막을 가져오는데 실패했습니다.";
      
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
          errorMessage = "네트워크 연결 오류: 서버에 연결할 수 없습니다.";
        } else if (error.message.includes("No transcript")) {
          errorMessage = "이 영상에는 자막이 없거나 접근할 수 없습니다.";
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
