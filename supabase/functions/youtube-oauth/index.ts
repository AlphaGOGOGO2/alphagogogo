
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID')
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET')
const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_DATA_API_KEY')

// OAuth 설정
const REDIRECT_URL = Deno.env.get('SITE_URL') || 'https://alphagogogo.com/youtube-transcript'
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token'
const AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth'

const YOUTUBE_SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl'

serve(async (req) => {
  // CORS 처리
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    const { action, code, videoId, redirectUrl } = await req.json()
    
    // 요청에서 전달된 리디렉션 URL 또는 기본값 사용
    const actualRedirectUrl = redirectUrl || REDIRECT_URL
    console.log('사용할 리디렉션 URL:', actualRedirectUrl)
    
    if (action === 'getAuthUrl') {
      // 인증 URL 생성
      const authUrl = new URL(AUTH_ENDPOINT)
      authUrl.searchParams.append('client_id', GOOGLE_CLIENT_ID || '')
      authUrl.searchParams.append('redirect_uri', actualRedirectUrl)
      authUrl.searchParams.append('response_type', 'code')
      authUrl.searchParams.append('scope', YOUTUBE_SCOPE)
      authUrl.searchParams.append('access_type', 'offline')
      authUrl.searchParams.append('prompt', 'consent')
      authUrl.searchParams.append('state', videoId || '')

      return new Response(JSON.stringify({ authUrl: authUrl.toString() }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } 
    else if (action === 'getToken') {
      if (!code) {
        throw new Error('인증 코드가 없습니다')
      }
      
      // 인증 코드로 토큰 요청
      console.log(`토큰 요청 중 - 코드: ${code.substring(0, 10)}...`)
      console.log(`리디렉션 URL: ${actualRedirectUrl}`)
      
      const tokenResponse = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          code,
          client_id: GOOGLE_CLIENT_ID || '',
          client_secret: GOOGLE_CLIENT_SECRET || '',
          redirect_uri: actualRedirectUrl,
          grant_type: 'authorization_code'
        })
      })
      
      const tokenData = await tokenResponse.json()
      if (!tokenResponse.ok) {
        console.error('토큰 요청 실패:', tokenData)
        throw new Error('토큰 요청 실패: ' + (tokenData.error_description || tokenData.error || JSON.stringify(tokenData)))
      }
      
      return new Response(JSON.stringify({
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresIn: tokenData.expires_in
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    else if (action === 'getTranscript' && videoId) {
      const { accessToken } = await req.json()
      
      // 1. 비디오 정보 가져오기
      const videoInfoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`
      const videoResponse = await fetch(videoInfoUrl)
      const videoData = await videoResponse.json()
      
      if (!videoResponse.ok || !videoData.items || videoData.items.length === 0) {
        throw new Error('YouTube에서 비디오 정보를 가져올 수 없습니다.')
      }
      
      const videoInfo = {
        id: videoId,
        title: videoData.items[0].snippet.title,
        author: videoData.items[0].snippet.channelTitle,
        language: 'ko'
      }
      
      // 2. 자막 트랙 목록 가져오기 (OAuth 토큰 사용)
      const captionsListUrl = `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}`
      const captionsResponse = await fetch(captionsListUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      
      const captionsData = await captionsResponse.json()
      if (!captionsResponse.ok) {
        throw new Error(`자막 목록을 가져오는데 실패했습니다: ${captionsData.error?.message || '알 수 없는 오류'}`)
      }
      
      // 3. 적절한 자막 트랙 찾기
      const captions = captionsData.items || []
      if (captions.length === 0) {
        throw new Error('이 비디오에는 자막이 없습니다.')
      }
      
      let targetCaption = captions.find(c => c.snippet.language === 'ko')
      if (!targetCaption) {
        targetCaption = captions.find(c => c.snippet.language === 'en')
      }
      if (!targetCaption) {
        targetCaption = captions[0]
      }
      
      // 4. 자막 내용 다운로드 (OAuth 토큰 사용)
      const captionId = targetCaption.id
      const downloadUrl = `https://www.googleapis.com/youtube/v3/captions/${captionId}?tfmt=srt`
      
      const downloadResponse = await fetch(downloadUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      
      if (!downloadResponse.ok) {
        const errorText = await downloadResponse.text()
        throw new Error(`자막 다운로드 실패: ${errorText}`)
      }
      
      const transcriptData = await downloadResponse.text()
      
      return new Response(JSON.stringify({
        transcript: transcriptData,
        videoInfo: {
          ...videoInfo,
          language: targetCaption.snippet.language
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    return new Response(JSON.stringify({
      error: '잘못된 요청입니다.'
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('처리 중 오류:', error)
    return new Response(JSON.stringify({
      error: error.message || '요청을 처리하는데 실패했습니다.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
