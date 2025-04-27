
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Python YouTube Transcript API 서비스 URL
// 실제 배포 시에는 이 URL을 여러분의 파이썬 API 서버 주소로 변경해야 합니다
const PYTHON_API_URL = "https://youtube-transcript-api.your-domain.com/api/transcript";

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

    console.log(`Fetching transcript for video ${videoId}, language: ${lang || 'default'}`);

    // 파이썬 API에 요청 전송
    const response = await fetch(PYTHON_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        videoId,
        lang: lang || null,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return new Response(
        JSON.stringify({ error: errorData.message || "Failed to fetch transcript" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: response.status }
      );
    }

    const transcriptData = await response.json();
    
    return new Response(
      JSON.stringify(transcriptData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error fetching transcript:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to fetch transcript",
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
