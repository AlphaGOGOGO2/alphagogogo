
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
    console.log("Extracted Video ID:", videoId); // 디버깅용 로그
    
    if (!videoId) {
      setError("유효한 YouTube URL을 입력해주세요.");
      toast.error("유효한 YouTube URL을 입력해주세요.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 1. 먼저 직접 YouTube API 시도
      let transcriptText = await fetchYoutubeDirectApi(videoId);
      if (transcriptText) {
        setTranscript(transcriptText);
        toast.success("자막을 성공적으로 가져왔습니다!");
        setIsLoading(false);
        return;
      }
      
      // 2. GitHub 저장소에서 제공하는 방식으로 시도
      transcriptText = await fetchFromGithubRepo(videoId);
      if (transcriptText) {
        setTranscript(transcriptText);
        toast.success("자막을 성공적으로 가져왔습니다!");
        setIsLoading(false);
        return;
      }
      
      // 3. 다른 API 시도
      transcriptText = await fetchFromExternalApi(videoId);
      if (transcriptText) {
        setTranscript(transcriptText);
        toast.success("자막을 성공적으로 가져왔습니다!");
        setIsLoading(false);
        return;
      }
      
      // 모든 방법이 실패한 경우
      throw new Error("자막을 찾을 수 없습니다");
      
    } catch (error) {
      console.error("자막 추출 오류:", error);
      let errorMessage = "자막을 가져오는데 실패했습니다.";
      
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
          errorMessage = "네트워크 연결 오류: 서버에 연결할 수 없습니다.";
        } else if (error.message.includes("자막을 찾을 수 없습니다")) {
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

  // 직접 YouTube API에서 자막 가져오기
  const fetchYoutubeDirectApi = async (videoId: string): Promise<string | null> => {
    try {
      // 한국어 자막 먼저 시도
      const apiUrl = `https://www.youtube.com/api/timedtext?lang=ko&v=${videoId}`;
      const response = await fetch(apiUrl);
      
      if (response.ok) {
        const xmlText = await response.text();
        if (xmlText && xmlText.length > 0 && !xmlText.includes("<?xml version=\"1.0\" encoding=\"utf-8\"?>\n")) {
          // XML 자막 파싱
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlText, "text/xml");
          const textNodes = xmlDoc.getElementsByTagName("text");
          
          if (textNodes.length === 0) return null;
          
          let fullTranscript = "";
          for (let i = 0; i < textNodes.length; i++) {
            fullTranscript += textNodes[i].textContent + " ";
          }
          
          return fullTranscript.trim();
        }
      }
      
      // 영어 자막 시도
      const enApiUrl = `https://www.youtube.com/api/timedtext?lang=en&v=${videoId}`;
      const enResponse = await fetch(enApiUrl);
      
      if (enResponse.ok) {
        const xmlText = await enResponse.text();
        if (xmlText && xmlText.length > 0 && !xmlText.includes("<?xml version=\"1.0\" encoding=\"utf-8\"?>\n")) {
          // XML 자막 파싱
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlText, "text/xml");
          const textNodes = xmlDoc.getElementsByTagName("text");
          
          if (textNodes.length === 0) return null;
          
          let fullTranscript = "";
          for (let i = 0; i < textNodes.length; i++) {
            fullTranscript += textNodes[i].textContent + " ";
          }
          
          return fullTranscript.trim();
        }
      }
      
      return null;
    } catch (error) {
      console.log("Direct YouTube API failed:", error);
      return null;
    }
  };
  
  // GitHub 저장소에서 제공하는 방식으로 시도
  const fetchFromGithubRepo = async (videoId: string): Promise<string | null> => {
    try {
      // GitHub 저장소에 있는 API 엔드포인트 사용
      const corsProxy = "https://corsproxy.io/?";
      const apiUrl = `${corsProxy}https://yt-transcript-api.vercel.app/api?videoId=${videoId}`;
      
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        
        if (data && data.transcript) {
          return data.transcript;
        }
      }
      return null;
    } catch (error) {
      console.log("GitHub repo API failed:", error);
      return null;
    }
  };
  
  // 기존 외부 API 시도
  const fetchFromExternalApi = async (videoId: string): Promise<string | null> => {
    try {
      const corsProxy = "https://corsproxy.io/?";
      const apiUrl = `${corsProxy}https://youtube-transcript-api.vercel.app/api/transcript?videoId=${videoId}`;
      
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        
        if (data && data.transcript) {
          return data.transcript;
        }
      }
      return null;
    } catch (error) {
      console.log("External API failed:", error);
      return null;
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
