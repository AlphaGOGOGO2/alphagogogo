
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface TranscriptSegment {
  text: string;
  duration: number;
  offset: number;
  lang?: string;
}

Deno.serve(async (req) => {
  // CORS 처리
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { videoId, language } = await req.json()
    const apiKey = Deno.env.get('YOUTUBE_DATA_API_KEY')

    if (!apiKey) {
      throw new Error('YouTube API 키가 설정되지 않았습니다.')
    }

    // 1. 비디오 정보 가져오기 (제목, 채널명 등)
    const videoInfoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
    const videoResponse = await fetch(videoInfoUrl)
    const videoData = await videoResponse.json()

    if (!videoResponse.ok || !videoData.items || videoData.items.length === 0) {
      console.error('비디오 정보 가져오기 실패:', videoData.error || '비디오를 찾을 수 없음')
      throw new Error('YouTube에서 비디오 정보를 가져올 수 없습니다.')
    }

    const videoInfo = {
      id: videoId,
      title: videoData.items[0].snippet.title,
      author: videoData.items[0].snippet.channelTitle,
      language: language || 'ko'
    }

    // 2. 자막 트랙 목록 가져오기
    const captionsListUrl = `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${apiKey}`
    const captionsResponse = await fetch(captionsListUrl)
    const captionsData = await captionsResponse.json()

    if (!captionsResponse.ok) {
      console.error('자막 목록을 가져오는데 실패했습니다:', captionsData.error || '알 수 없는 오류')
      throw new Error(`자막 목록을 가져오는데 실패했습니다: ${captionsData.error?.message || '알 수 없는 오류'}`)
    }

    // 3. 적절한 자막 트랙 찾기
    const captions = captionsData.items || []
    
    if (captions.length === 0) {
      throw new Error('이 비디오에는 자막이 없습니다.')
    }
    
    let targetCaption = captions.find(c => c.snippet.language === (language || 'ko'))
    
    if (!targetCaption) {
      // 한국어가 없으면 영어 자막 시도
      targetCaption = captions.find(c => c.snippet.language === 'en')
    }
    
    if (!targetCaption) {
      // 영어도 없으면 첫 번째 가용 자막 사용
      targetCaption = captions[0]
    }

    // 4. 자막 내용 다운로드
    const captionId = targetCaption.id
    const downloadUrl = `https://www.googleapis.com/youtube/v3/captions/${captionId}?key=${apiKey}`
    
    const downloadHeaders = {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json'
    }
    
    const downloadResponse = await fetch(downloadUrl, { 
      headers: downloadHeaders 
    })

    // API 응답 로깅
    console.log('자막 다운로드 URL:', downloadUrl)
    console.log('자막 다운로드 요청 헤더:', downloadHeaders)
    console.log('자막 다운로드 응답 상태:', downloadResponse.status)
    
    let transcriptData = ''
    
    if (downloadResponse.ok) {
      transcriptData = await downloadResponse.text()
      console.log('자막 다운로드 성공, 길이:', transcriptData.length)
    } else {
      // API 오류 처리
      const errorText = await downloadResponse.text()
      console.error('자막 다운로드 실패:', errorText)
      
      // 오류 대체 텍스트 생성
      transcriptData = `이 영상의 자막을 가져오지 못했습니다. 
      
비디오 제목: ${videoInfo.title}
채널: ${videoInfo.author}

YouTube Data API 권한 문제로 인해 자막을 직접 다운로드할 수 없습니다.
YouTube Data API v3에서 자막을 다운로드하려면 OAuth 2.0 인증이 필요합니다.

현재는 대체 텍스트가 표시되고 있습니다.`
    }

    return new Response(JSON.stringify({
      transcript: transcriptData,
      videoInfo: {
        ...videoInfo,
        language: targetCaption.snippet.language
      }
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.error('자막 처리 중 오류:', error)
    return new Response(JSON.stringify({
      error: error.message || '자막을 가져오는데 실패했습니다.'
    }), {
      status: 400,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    })
  }
})
