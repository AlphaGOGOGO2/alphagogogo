
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
import { TranscriptSegment, YoutubeVideoInfo } from "@/types/youtubeTranscript";
import { supabase } from "@/integrations/supabase/client";

export function useYoutubeTranscript() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [transcriptSegments, setTranscriptSegments] = useState<TranscriptSegment[]>([]);
  const [videoInfo, setVideoInfo] = useState<YoutubeVideoInfo | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState<boolean>(false);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  // URL에서 인증 코드 확인
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state'); // videoId가 state로 전달됨
    
    if (code && state) {
      // URL에서 코드 제거 (페이지 새로고침 없이)
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // 코드로 토큰 얻기
      getAccessToken(code, state);
    }
  }, []);
  
  // 인증 URL 가져오기
  const getAuthUrl = async (videoId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('youtube-oauth', {
        body: { action: 'getAuthUrl', videoId }
      });
      
      if (error) throw new Error(error.message);
      if (data.authUrl) {
        setAuthUrl(data.authUrl);
        setNeedsAuth(true);
        setCurrentVideoId(videoId);
      }
    } catch (error: any) {
      console.error('인증 URL 가져오기 실패:', error);
      setError(error.message || '인증 URL을 가져오는데 실패했습니다.');
    }
  };
  
  // 인증 코드로 액세스 토큰 얻기
  const getAccessToken = async (code: string, videoId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('youtube-oauth', {
        body: { action: 'getToken', code }
      });
      
      if (error) throw new Error(error.message);
      
      setAccessToken(data.accessToken);
      setNeedsAuth(false);
      
      // 토큰을 얻으면 즉시 자막 가져오기
      if (videoId) {
        await getTranscriptWithOAuth(videoId, data.accessToken);
      }
    } catch (error: any) {
      console.error('토큰 얻기 실패:', error);
      setError(error.message || '인증 토큰을 얻는데 실패했습니다.');
      toast.error('인증에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // OAuth 토큰으로 자막 가져오기
  const getTranscriptWithOAuth = async (videoId: string, token: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('youtube-oauth', {
        body: { 
          action: 'getTranscript', 
          videoId,
          accessToken: token
        }
      });
      
      if (error) throw new Error(error.message);
      
      if (data.transcript && data.videoInfo) {
        const segments = parseTranscriptToSegments(data.transcript, data.videoInfo.language);
        setTranscriptSegments(segments);
        setVideoInfo(data.videoInfo);
        
        const fullTranscript = processTranscriptSegments(segments);
        setTranscript(fullTranscript);
        
        toast.success('자막 정보를 가져왔습니다!');
      } else {
        throw new Error('자막 데이터가 올바르지 않습니다.');
      }
    } catch (error: any) {
      console.error('자막 가져오기 실패:', error);
      setError(error.message || '자막을 가져오는데 실패했습니다.');
      toast.error('자막을 가져오지 못했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtractTranscript = async () => {
    // 초기화
    setTranscript("");
    setTranscriptSegments([]);
    setError("");
    setVideoInfo(null);
    setNeedsAuth(false);
    setAuthUrl(null);
    
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
    
    setIsLoading(true);
    
    try {
      // API 키로 먼저 시도
      try {
        const preferredLang = navigator.language.split('-')[0];
        const result = await fetchTranscript(videoId, preferredLang);
        const { segments, videoInfo } = result;
        
        if (segments && segments.length > 0) {
          setTranscriptSegments(segments);
          setVideoInfo(videoInfo);
          
          const fullTranscript = processTranscriptSegments(segments);
          setTranscript(fullTranscript);
          
          toast.success("자막 정보를 가져왔습니다!");
          return;
        }
      } catch (error) {
        console.log("API 키 방식이 실패함, OAuth로 시도");
        // API 키로 실패하면 OAuth로 시도
        if (!accessToken) {
          // 인증 URL 가져오기
          await getAuthUrl(videoId);
        } else {
          // 이미 토큰이 있으면 바로 자막 요청
          await getTranscriptWithOAuth(videoId, accessToken);
        }
        return;
      }
      
      throw new YoutubeTranscriptNotAvailableError(videoId);
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
      toast.error("자막을 가져오지 못했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  // 자막 텍스트를 세그먼트로 파싱
  const parseTranscriptToSegments = (transcript: string, language: string = 'ko'): TranscriptSegment[] => {
    if (!transcript.trim()) {
      return [];
    }
    
    try {
      // 자막 텍스트를 줄 단위로 분리
      const lines = transcript.split('\n');
      const segments: TranscriptSegment[] = [];
      
      // SRT 형식에 따른 파싱 시도
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // 타임스탬프가 있는지 확인 (00:00:00,000 --> 00:00:00,000 형식)
        const timeRegex = /(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})/;
        const timeMatch = lines[i].match(timeRegex);
        
        if (timeMatch) {
          // 타임스탬프가 있는 경우 시작 시간과 종료 시간 계산
          const startTimeMs = 
            (parseInt(timeMatch[1]) * 3600 + parseInt(timeMatch[2]) * 60 + parseInt(timeMatch[3])) * 1000 + 
            parseInt(timeMatch[4]);
          
          const endTimeMs = 
            (parseInt(timeMatch[5]) * 3600 + parseInt(timeMatch[6]) * 60 + parseInt(timeMatch[7])) * 1000 + 
            parseInt(timeMatch[8]);
          
          // 다음 줄에 자막 텍스트가 있을 것으로 가정
          i++;
          if (i < lines.length) {
            segments.push({
              text: lines[i].trim(),
              offset: startTimeMs,
              duration: endTimeMs - startTimeMs,
              lang: language
            });
          }
        } else {
          // 타임스탬프가 없는 경우 일반 텍스트로 간주
          segments.push({
            text: line,
            offset: segments.length * 3000, // 대략적인 시간 간격 부여
            duration: 3000,
            lang: language
          });
        }
      }
      
      return segments;
    } catch (error) {
      console.error('자막 파싱 오류:', error);
      // 파싱에 실패한 경우 텍스트를 단순 분리
      return transcript
        .split('\n\n')
        .filter(segment => segment.trim())
        .map((segment, index) => ({
          text: segment.trim(),
          offset: index * 3000, // 예시 타임스탬프
          duration: 3000,
          lang: language
        }));
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
    handleExtractTranscript,
    needsAuth,
    authUrl
  };
}
