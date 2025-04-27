
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// YouTube 동영상 ID에서 자막을 가져오는 함수
async function fetchYoutubeTranscript(videoId: string, lang?: string): Promise<any> {
  console.log(`자막 가져오기 시작: 비디오 ID ${videoId}, 언어: ${lang || '기본값'}`);
  
  try {
    // YouTube 자막 API URL
    const apiUrl = `https://youtube-transcript.p.rapidapi.com/api/transcript`;
    
    // API 요청 본문
    const requestBody = {
      videoId: videoId,
      language: lang || 'ko'
    };
    
    // RapidAPI 키
    const RAPID_API_KEY = Deno.env.get("RAPID_API_KEY");
    
    if (!RAPID_API_KEY) {
      throw new Error("RAPID_API_KEY 환경변수가 설정되지 않았습니다.");
    }
    
    // API 요청 설정
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": RAPID_API_KEY,
        "X-RapidAPI-Host": "youtube-transcript.p.rapidapi.com"
      },
      body: JSON.stringify(requestBody)
    };
    
    // API 요청 실행
    const response = await fetch(apiUrl, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API 응답 오류: ${response.status} - ${errorText}`);
      
      if (response.status === 404) {
        throw new Error("자막을 찾을 수 없습니다.");
      } else if (response.status === 403) {
        throw new Error("자막 접근이 제한되었습니다.");
      } else {
        throw new Error(`API 오류: ${response.status}`);
      }
    }
    
    const data = await response.json();
    console.log("자막 API 응답:", JSON.stringify(data).substring(0, 300) + "...");
    
    if (!data.transcript || !Array.isArray(data.transcript)) {
      throw new Error("응답 데이터가 유효하지 않습니다.");
    }
    
    // API 응답에서 자막 데이터 추출
    const transcriptData = data.transcript.map((item: any) => ({
      text: item.text,
      start: parseFloat(item.start),
      duration: parseFloat(item.duration)
    }));
    
    console.log(`자막 ${transcriptData.length}개 추출 완료`);
    return transcriptData;
    
  } catch (error) {
    console.error(`자막 가져오기 오류: ${error.message}`);
    throw error;
  }
}

serve(async (req) => {
  // CORS 처리
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Only POST method is allowed" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 405 }
      );
    }

    // 요청 본문 파싱
    const { videoId, lang } = await req.json();

    if (!videoId) {
      return new Response(
        JSON.stringify({ error: "videoId is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log(`요청 받음: 비디오 ID ${videoId}, 언어: ${lang || '기본값'}`);
    
    try {
      // 실제 YouTube 자막 API 호출
      const transcriptData = await fetchYoutubeTranscript(videoId, lang);
      
      console.log(`트랜스크립트 성공적으로 가져옴: ${transcriptData.length}개 세그먼트`);
      
      return new Response(
        JSON.stringify(transcriptData),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    } catch (apiError: any) {
      console.error("API 오류:", apiError.message);
      
      return new Response(
        JSON.stringify({ 
          error: apiError.message || "자막을 가져오는데 실패했습니다." 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }
  } catch (error: any) {
    console.error("서버 오류:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "서버 오류가 발생했습니다",
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
