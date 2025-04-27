
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// 임시 데이터 처리 함수 - 실제 Python API 연동 전까지 사용할 예시 응답
function getMockTranscript(videoId: string, lang?: string): Promise<any> {
  console.log(`임시 트랜스크립트 생성: 비디오 ID ${videoId}, 언어: ${lang || '기본값'}`);
  
  // 간단한 예제 자막 생성 (실제 구현 시 이 부분은 실제 API를 호출하도록 변경)
  return new Promise((resolve, reject) => {
    // 모든 비디오 ID에 대해 성공 응답을 반환하도록 수정
    // 이렇게 하면 모든 유튜브 링크가 테스트용으로 작동합니다
    setTimeout(() => {
      try {
        resolve([
          { text: "안녕하세요 여러분.", start: 0.5, duration: 2.5 },
          { text: "오늘은 좋은 날씨네요.", start: 3.0, duration: 2.0 },
          { text: "이 비디오에 오신 것을 환영합니다.", start: 5.0, duration: 3.0 },
          { text: "자막이 잘 작동하는지 테스트 중입니다.", start: 8.0, duration: 3.5 },
          { text: `[비디오 ID: ${videoId}] 이 자막은 테스트용입니다.`, start: 11.5, duration: 4.0 },
          { text: `언어 설정: ${lang || '기본값'}`, start: 15.5, duration: 2.0 }
        ]);
      } catch (error) {
        reject(new Error("자막 생성 중 오류가 발생했습니다."));
      }
    }, 300);
  });
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
    
    // 테스트 모드: 실제 구현 전까지는 모든 비디오 ID에 대해 샘플 자막 반환
    try {
      const transcriptData = await getMockTranscript(videoId, lang);
      
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
