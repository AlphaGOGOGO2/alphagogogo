
import { TranscriptSegment } from "@/types/youtubeTranscript";
import {
  YoutubeTranscriptDisabledError,
  YoutubeTranscriptError,
  YoutubeTranscriptNotAvailableError,
  YoutubeTranscriptTooManyRequestError,
  YoutubeTranscriptVideoUnavailableError
} from "@/utils/youtubeTranscriptErrors";
import { supabase } from "@/integrations/supabase/client";

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
    console.log(`자막 가져오기: 비디오 ID ${videoId}, 언어 ${lang || '기본값'}`);
    
    // Supabase SDK를 사용하여 Edge Function 호출
    const { data, error } = await supabase.functions.invoke('get-youtube-transcript', {
      body: {
        videoId,
        lang
      }
    });

    // 오류 처리
    if (error) {
      console.error("Edge Function 호출 오류:", error);
      const errorMessage = error.message || '자막을 가져오는데 실패했습니다.';
      
      if (errorMessage.includes('Too many requests') || errorMessage.includes('captcha')) {
        throw new YoutubeTranscriptTooManyRequestError();
      } else if (errorMessage.includes('unavailable') || errorMessage.includes('no longer available')) {
        throw new YoutubeTranscriptVideoUnavailableError(videoId);
      } else if (errorMessage.includes('disabled')) {
        throw new YoutubeTranscriptDisabledError(videoId);
      } else if (errorMessage.includes('not available') || errorMessage.includes('없거나 접근할 수 없습니다')
                || errorMessage.includes('찾을 수 없습니다')) {
        throw new YoutubeTranscriptNotAvailableError(videoId);
      }
      
      throw new Error(`API 오류: ${errorMessage}`);
    }
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error("응답 데이터가 비어있거나 배열이 아님:", data);
      throw new YoutubeTranscriptNotAvailableError(videoId);
    }
    
    console.log(`자막 세그먼트 ${data.length}개 가져옴`);
    
    return data.map((segment: any) => ({
      text: segment.text,
      offset: segment.start * 1000, // 초를 밀리초로 변환
      duration: segment.duration * 1000, // 초를 밀리초로 변환
      lang: lang || 'default'
    }));
  } catch (error: any) {
    console.error('자막 가져오기 오류:', error);
    
    if (error instanceof YoutubeTranscriptError) {
      throw error;
    }
    
    if (error.message.includes('NetworkError') || error.message.includes('네트워크 연결 오류')) {
      throw new Error('네트워크 연결 오류: 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
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
