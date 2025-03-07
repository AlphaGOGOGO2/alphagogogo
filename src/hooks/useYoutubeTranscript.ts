
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
    console.log("Extracted Video ID:", videoId);
    
    if (!videoId) {
      setError("유효한 YouTube URL을 입력해주세요.");
      toast.error("유효한 YouTube URL을 입력해주세요.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 1. GitHub 저장소 방식으로 시도 (가장 신뢰할 수 있는 방법)
      let transcriptText = await fetchFromGithubRepo(videoId);
      if (transcriptText) {
        setTranscript(transcriptText);
        toast.success("자막을 성공적으로 가져왔습니다!");
        setIsLoading(false);
        return;
      }
      
      // 2. YouTube XML API 시도
      transcriptText = await fetchYoutubeDirectApi(videoId);
      if (transcriptText) {
        setTranscript(transcriptText);
        toast.success("자막을 성공적으로 가져왔습니다!");
        setIsLoading(false);
        return;
      }
      
      // 3. 기존 외부 API 시도
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

  // GitHub 저장소 방식으로 시도 - Kakulukian/youtube-transcript
  const fetchFromGithubRepo = async (videoId: string): Promise<string | null> => {
    try {
      // GitHub의 레포지토리에 있는 API 엔드포인트를 직접 사용 (CORS 프록시 이용)
      const corsProxy = "https://corsproxy.io/?";
      const apiUrl = `${corsProxy}https://youtube-transcript.vercel.app/api/transcript?videoId=${videoId}`;
      
      console.log("Trying GitHub repo API:", apiUrl);
      const response = await fetch(apiUrl);
      console.log("GitHub repo API response:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("GitHub repo API data:", data);
        
        if (data && data.transcript) {
          return data.transcript;
        } else if (data && data.captions && data.captions.length > 0) {
          // 새로운 포맷 처리
          return data.captions.map((caption: any) => caption.text).join(" ");
        }
      }
      return null;
    } catch (error) {
      console.log("GitHub repo API failed:", error);
      return null;
    }
  };

  // 직접 YouTube API에서 자막 가져오기
  const fetchYoutubeDirectApi = async (videoId: string): Promise<string | null> => {
    try {
      // 한국어 자막 먼저 시도
      const apiUrl = `https://www.youtube.com/api/timedtext?lang=ko&v=${videoId}`;
      console.log("Trying YouTube Direct API (KO):", apiUrl);
      
      const response = await fetch(apiUrl);
      console.log("YouTube Direct API (KO) response:", response.status);
      
      if (response.ok) {
        const xmlText = await response.text();
        console.log("XML length:", xmlText.length);
        
        if (xmlText && xmlText.length > 100) {
          // XML 자막 파싱
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlText, "text/xml");
          const textNodes = xmlDoc.getElementsByTagName("text");
          
          if (textNodes.length > 0) {
            let fullTranscript = "";
            for (let i = 0; i < textNodes.length; i++) {
              fullTranscript += textNodes[i].textContent + " ";
            }
            
            return fullTranscript.trim();
          }
        }
      }
      
      // 영어 자막 시도
      const enApiUrl = `https://www.youtube.com/api/timedtext?lang=en&v=${videoId}`;
      console.log("Trying YouTube Direct API (EN):", enApiUrl);
      
      const enResponse = await fetch(enApiUrl);
      console.log("YouTube Direct API (EN) response:", enResponse.status);
      
      if (enResponse.ok) {
        const xmlText = await enResponse.text();
        console.log("EN XML length:", xmlText.length);
        
        if (xmlText && xmlText.length > 100) {
          // XML 자막 파싱
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlText, "text/xml");
          const textNodes = xmlDoc.getElementsByTagName("text");
          
          if (textNodes.length > 0) {
            let fullTranscript = "";
            for (let i = 0; i < textNodes.length; i++) {
              fullTranscript += textNodes[i].textContent + " ";
            }
            
            return fullTranscript.trim();
          }
        }
      }
      
      return null;
    } catch (error) {
      console.log("Direct YouTube API failed:", error);
      return null;
    }
  };
  
  // 기존 외부 API 시도
  const fetchFromExternalApi = async (videoId: string): Promise<string | null> => {
    try {
      const corsProxy = "https://corsproxy.io/?";
      const apiUrl = `${corsProxy}https://youtube-transcript-api.vercel.app/api/transcript?videoId=${videoId}`;
      
      console.log("Trying External API:", apiUrl);
      const response = await fetch(apiUrl);
      console.log("External API response:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("External API data:", data);
        
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
