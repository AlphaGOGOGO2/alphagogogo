import { createClient } from '@supabase/supabase-js'
import { TranscriptSegment, YoutubeVideoInfo } from '@/types/youtubeTranscript'
import { YoutubeTranscriptError, YoutubeTranscriptNotAvailableError } from '@/utils/youtubeTranscriptErrors'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export async function fetchTranscript(videoId: string, lang?: string): Promise<{
  segments: TranscriptSegment[],
  videoInfo: YoutubeVideoInfo
}> {
  try {
    console.log(`비디오 ID ${videoId}의 자막을 가져오는 중...`)
    
    const { data, error } = await supabase.functions.invoke('youtube-captions', {
      body: { videoId, language: lang || 'ko' }
    })

    if (error) {
      console.error('Edge function 호출 오류:', error)
      throw new Error(error.message)
    }

    if (!data || data.error) {
      console.error('자막 가져오기 실패:', data?.error)
      throw new YoutubeTranscriptNotAvailableError(videoId)
    }

    // Edge function에서 받은 자막 데이터 처리
    const { transcript, videoInfo } = data
    
    // 자막 텍스트를 세그먼트로 변환
    const segments: TranscriptSegment[] = transcript.split('\n\n')
      .filter(segment => segment.trim())
      .map((segment, index) => ({
        text: segment.trim(),
        offset: index * 3000, // 예시 타임스탬프
        duration: 3000,
        lang: videoInfo.language
      }))

    return { segments, videoInfo }
      
  } catch (error) {
    console.error('자막 가져오기 오류:', error)
    
    if (error instanceof YoutubeTranscriptError) {
      throw error
    }
    
    throw new YoutubeTranscriptNotAvailableError(videoId)
  }
}

export const processTranscriptSegments = (segments: TranscriptSegment[]): string => {
  // 자막 텍스트만 추출하여 조합
  return segments
    .map(segment => segment.text.trim())
    .filter(text => text.length > 0)
    .join('\n\n');
};
