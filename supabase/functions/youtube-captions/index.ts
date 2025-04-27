
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

    // 1. 자막 트랙 목록 가져오기
    const captionsListUrl = `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${apiKey}`
    const captionsResponse = await fetch(captionsListUrl)
    const captionsData = await captionsResponse.json()

    if (!captionsResponse.ok) {
      throw new Error(`자막 목록을 가져오는데 실패했습니다: ${captionsData.error?.message || '알 수 없는 오류'}`)
    }

    // 2. 적절한 자막 트랙 찾기
    const captions = captionsData.items || []
    let targetCaption = captions.find(c => c.snippet.language === (language || 'ko'))
    
    if (!targetCaption) {
      // 한국어가 없으면 영어 자막 시도
      targetCaption = captions.find(c => c.snippet.language === 'en')
    }
    
    if (!targetCaption) {
      // 영어도 없으면 첫 번째 가용 자막 사용
      targetCaption = captions[0]
    }

    if (!targetCaption) {
      throw new Error('이 비디오에는 자막이 없습니다.')
    }

    // 3. 자막 내용 다운로드
    const captionId = targetCaption.id
    const downloadUrl = `https://www.googleapis.com/youtube/v3/captions/${captionId}?key=${apiKey}`
    
    const downloadResponse = await fetch(downloadUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    })

    if (!downloadResponse.ok) {
      const error = await downloadResponse.json()
      console.error('자막 다운로드 실패:', error)
      throw new Error(`자막을 다운로드하는데 실패했습니다: ${error.error?.message || '알 수 없는 오류'}`)
    }

    const transcriptData = await downloadResponse.text()
    
    // 4. 비디오 정보 가져오기
    const videoInfoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
    const videoResponse = await fetch(videoInfoUrl)
    const videoData = await videoResponse.json()

    const videoInfo = {
      id: videoId,
      title: videoData.items?.[0]?.snippet?.title,
      author: videoData.items?.[0]?.snippet?.channelTitle,
      language: targetCaption.snippet.language
    }

    return new Response(JSON.stringify({
      transcript: transcriptData,
      videoInfo
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
