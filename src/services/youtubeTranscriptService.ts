
import { TranscriptSegment } from "@/types/youtubeTranscript";
import {
  YoutubeTranscriptDisabledError,
  YoutubeTranscriptError,
  YoutubeTranscriptNotAvailableError,
  YoutubeTranscriptTooManyRequestError,
  YoutubeTranscriptVideoUnavailableError
} from "@/utils/youtubeTranscriptErrors";

/**
 * 유튜브 트랜스크립트(자막) API를 통해 자막을 가져옵니다.
 * 
 * @param videoId - 유튜브 비디오 ID
 * @param lang - 언어 코드 (선택사항)
 * @returns 트랜스크립트 세그먼트 배열
 */
export const fetchTranscript = async (
  videoId: string, 
  lang?: string
): Promise<TranscriptSegment[]> => {
  try {
    console.log(`Fetching transcript for video ${videoId} in language ${lang || 'default'}`);
    
    // Supabase Edge Function 호출
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_API_URL}/functions/v1/get-youtube-transcript`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        videoId,
        lang
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error || '자막을 가져오는데 실패했습니다.';
      
      if (errorMessage.includes('Too many requests') || errorMessage.includes('captcha')) {
        throw new YoutubeTranscriptTooManyRequestError();
      } else if (errorMessage.includes('unavailable') || errorMessage.includes('no longer available')) {
        throw new YoutubeTranscriptVideoUnavailableError(videoId);
      } else if (errorMessage.includes('disabled')) {
        throw new YoutubeTranscriptDisabledError(videoId);
      } else if (errorMessage.includes('not available')) {
        throw new YoutubeTranscriptNotAvailableError(videoId);
      }
      
      throw new Error(`API Error: ${errorMessage}`);
    }
    
    const data = await response.json();
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new YoutubeTranscriptNotAvailableError(videoId);
    }
    
    return data.map((segment: any) => ({
      text: segment.text,
      offset: segment.start * 1000, // 초를 밀리초로 변환
      duration: segment.duration * 1000, // 초를 밀리초로 변환
      lang: lang || 'default'
    }));
  } catch (error: any) {
    console.error('Transcript fetch error:', error);
    
    if (error instanceof YoutubeTranscriptError) {
      throw error;
    }
    
    if (error.message.includes('NetworkError') || error.message.includes('네트워크 연결 오류')) {
      throw new Error('네트워크 연결 오류: 서버에 연결할 수 없습니다.');
    }
    
    throw new YoutubeTranscriptNotAvailableError(videoId);
  }
};

/**
 * 트랜스크립트 세그먼트를 처리하여 단일 문자열로 변환합니다.
 * 
 * @param segments - 트랜스크립트 세그먼트 배열
 * @returns 전체 트랜스크립트 문자열
 */
export const processTranscriptSegments = (segments: TranscriptSegment[]): string => {
  return segments
    .map(segment => segment.text.trim())
    .filter(text => text.length > 0)
    .join('\n');
};
