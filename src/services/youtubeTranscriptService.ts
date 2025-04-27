
import { createClient } from '@supabase/supabase-js'
import { TranscriptSegment, YoutubeVideoInfo } from '@/types/youtubeTranscript'
import { YoutubeTranscriptError, YoutubeTranscriptNotAvailableError } from '@/utils/youtubeTranscriptErrors'

// Supabase 클라이언트 초기화
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

/**
 * YouTube 비디오 ID를 사용해 자막 데이터를 가져옵니다.
 */
export async function fetchTranscript(videoId: string, lang?: string): Promise<{
  segments: TranscriptSegment[],
  videoInfo: YoutubeVideoInfo
}> {
  try {
    console.log(`비디오 ID ${videoId}의 자막을 가져오는 중...`)
    
    // Edge function을 호출하여 자막 데이터 요청
    const { data, error } = await supabase.functions.invoke('youtube-captions', {
      body: { 
        videoId, 
        language: lang || 'ko' 
      }
    })

    if (error) {
      console.error('Edge function 호출 오류:', error)
      throw new Error(error.message)
    }

    if (!data || data.error) {
      console.error('자막 가져오기 실패:', data?.error || '알 수 없는 오류')
      throw new YoutubeTranscriptNotAvailableError(videoId)
    }

    console.log('Edge Function 응답:', data)

    const { transcript, videoInfo } = data
    
    if (!transcript || typeof transcript !== 'string') {
      console.error('자막 데이터가 올바른 형식이 아닙니다:', transcript)
      throw new YoutubeTranscriptNotAvailableError(videoId)
    }

    // 자막 텍스트를 세그먼트로 변환
    // 타임코드와 텍스트를 분리하는 로직 추가
    const segments: TranscriptSegment[] = parseTranscriptToSegments(transcript, videoInfo.language)
    
    return { 
      segments, 
      videoInfo 
    }
      
  } catch (error) {
    console.error('자막 가져오기 오류:', error)
    
    if (error instanceof YoutubeTranscriptError) {
      throw error
    }
    
    throw new YoutubeTranscriptNotAvailableError(videoId)
  }
}

/**
 * 자막 텍스트를 구문 분석하여 세그먼트로 변환합니다.
 */
function parseTranscriptToSegments(transcript: string, language: string = 'ko'): TranscriptSegment[] {
  if (!transcript.trim()) {
    return []
  }
  
  try {
    // 자막 텍스트를 줄 단위로 분리
    const lines = transcript.split('\n')
    const segments: TranscriptSegment[] = []
    
    // SRT나 일반 텍스트 형식에 따른 파싱 시도
    // 기본적인 세그먼트 생성
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      // 타임스탬프가 있는지 확인 (00:00:00,000 --> 00:00:00,000 형식)
      const timeRegex = /(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})/
      const timeMatch = lines[i].match(timeRegex)
      
      if (timeMatch) {
        // 타임스탬프가 있는 경우 시작 시간과 종료 시간 계산
        const startTimeMs = 
          (parseInt(timeMatch[1]) * 3600 + parseInt(timeMatch[2]) * 60 + parseInt(timeMatch[3])) * 1000 + 
          parseInt(timeMatch[4])
        
        const endTimeMs = 
          (parseInt(timeMatch[5]) * 3600 + parseInt(timeMatch[6]) * 60 + parseInt(timeMatch[7])) * 1000 + 
          parseInt(timeMatch[8])
        
        // 다음 줄에 자막 텍스트가 있을 것으로 가정
        i++
        if (i < lines.length) {
          segments.push({
            text: lines[i].trim(),
            offset: startTimeMs,
            duration: endTimeMs - startTimeMs,
            lang: language
          })
        }
      } else {
        // 타임스탬프가 없는 경우 일반 텍스트로 간주
        segments.push({
          text: line,
          offset: segments.length * 3000, // 대략적인 시간 간격 부여
          duration: 3000,
          lang: language
        })
      }
    }
    
    return segments
  } catch (error) {
    console.error('자막 파싱 오류:', error)
    // 파싱에 실패한 경우 텍스트를 단순 분리
    return transcript
      .split('\n\n')
      .filter(segment => segment.trim())
      .map((segment, index) => ({
        text: segment.trim(),
        offset: index * 3000, // 예시 타임스탬프
        duration: 3000,
        lang: language
      }))
  }
}

/**
 * 자막 세그먼트를 텍스트로 변환합니다.
 */
export const processTranscriptSegments = (segments: TranscriptSegment[]): string => {
  // 자막 텍스트만 추출하여 조합
  return segments
    .map(segment => segment.text.trim())
    .filter(text => text.length > 0)
    .join('\n\n');
};
