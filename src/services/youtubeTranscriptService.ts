
import {
  YoutubeTranscriptDisabledError,
  YoutubeTranscriptError,
  YoutubeTranscriptNotAvailableError,
  YoutubeTranscriptTooManyRequestError,
  YoutubeTranscriptVideoUnavailableError
} from "@/utils/youtubeTranscriptErrors";
import { TranscriptSegment } from "@/types/youtubeTranscript";

// YouTube API를 위한 설정
const INNERTUBE_CLIENT_VERSION = '2.20240221.01.00';
const INNERTUBE_CLIENT_NAME = 'WEB';
const INNERTUBE_API_KEY = 'AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8';

// CORS 프록시 URL 목록 (여러 대안을 제공하여 하나라도 작동하도록 함)
const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://cors-anywhere.herokuapp.com/',
  'https://api.allorigins.win/raw?url=',
  'https://api.codetabs.com/v1/proxy?quest='
];

// 기본 헤더 설정
const BASE_HEADERS = {
  'accept': '*/*',
  'accept-language': 'ko,en;q=0.9',
  'content-type': 'application/json',
  'origin': 'https://www.youtube.com',  // Origin 헤더 추가
  'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'x-youtube-client-name': '1',
  'x-youtube-client-version': INNERTUBE_CLIENT_VERSION
};

// 타임아웃이 있는 페치 함수
async function fetchWithTimeout(url: string, options: RequestInit, timeout = 10000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// CORS 프록시를 통한 페치 시도
async function fetchWithCorsProxy(url: string, options: RequestInit): Promise<Response> {
  // 모든 프록시를 순차적으로 시도
  let lastError = null;
  
  for (const proxy of CORS_PROXIES) {
    try {
      console.log(`프록시 시도 중: ${proxy}`);
      const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
      const response = await fetchWithTimeout(proxyUrl, options);
      
      if (response.ok) {
        console.log(`프록시 성공: ${proxy}`);
        return response;
      }
    } catch (error) {
      console.error(`프록시 실패: ${proxy}`, error);
      lastError = error;
      // 계속 다음 프록시 시도
    }
  }

  // 모든 프록시가 실패한 경우
  throw lastError || new Error('모든 CORS 프록시 시도 실패');
}

// 대체 접근 방식 - 정적 자막 데이터 제공 (네트워크 문제 시 폴백)
const SAMPLE_TRANSCRIPT_DATA: TranscriptSegment[] = [
  {
    text: "이 자막은 네트워크 오류로 인해 실제 자막을 가져오지 못한 경우 표시됩니다.",
    offset: 0,
    duration: 3000
  },
  {
    text: "현재 YouTube API 접근에 문제가 있습니다. 잠시 후 다시 시도해주세요.",
    offset: 3000,
    duration: 3000
  },
  {
    text: "이 자막은 임시 데이터이며, 실제 영상 내용을 반영하지 않습니다.",
    offset: 6000,
    duration: 3000
  }
];

// HTML 엔티티 디코딩 함수 (브라우저 API 사용)
function decodeHtmlEntities(text: string): string {
  if (!text) return '';
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
  return textarea.value;
}

// 직접 디코딩 (브라우저 API가 없는 환경을 위한 대비책)
function decodeHtmlEntitiesDirect(text: string): string {
  if (!text) return '';
  return text
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&') 
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

// 유튜브 자막 데이터를 직접 가져오는 함수 (API 키 사용)
export const fetchTranscript = async (
  videoId: string, 
  lang?: string
): Promise<TranscriptSegment[]> => {
  try {
    console.log(`Fetching transcript for video ${videoId} in language ${lang || 'default'}`);
    
    // 1단계: 자막 리스트 API 호출
    const API_URL = `https://www.youtube.com/api/timedtext?type=list&v=${videoId}`;
    
    console.log("자막 리스트 요청 시도...");
    let response;
    
    try {
      // 직접 요청을 먼저 시도
      response = await fetchWithTimeout(API_URL, {
        headers: BASE_HEADERS
      });
    } catch (directError) {
      console.warn("직접 요청 실패, CORS 프록시 시도...", directError);
      // CORS 프록시 사용
      response = await fetchWithCorsProxy(API_URL, {
        headers: BASE_HEADERS
      });
    }

    const text = await response.text();
    
    if (!text || text.includes("captionTracks") === false) {
      console.warn("자막 트랙을 찾을 수 없음, 대체 방식 시도");
      
      // 대체 방식 - 텍스트 파라미터로 직접 접근
      const directUrl = `https://www.youtube.com/api/timedtext?lang=${lang || 'ko'}&v=${videoId}&fmt=json3`;
      
      try {
        const directResponse = await fetchWithCorsProxy(directUrl, {
          headers: BASE_HEADERS
        });
        
        const transcriptData = await directResponse.json();
        
        if (transcriptData?.events?.length > 0) {
          return transcriptData.events
            .filter((event: any) => event.segs && event.segs.length > 0)
            .map((event: any) => ({
              text: decodeHtmlEntities(event.segs.map((seg: any) => seg.utf8).join(' ')),
              offset: event.tStartMs,
              duration: event.dDurationMs,
              lang: lang || 'default'
            }));
        }
      } catch (directAccessError) {
        console.error("대체 방식 실패:", directAccessError);
      }
      
      // 모든 접근 방식이 실패한 경우 샘플 데이터 반환
      console.warn("모든 접근 방식 실패, 샘플 데이터 반환");
      return SAMPLE_TRANSCRIPT_DATA;
    }
    
    // XML 형식 파싱 (간단한 정규식 방식)
    const captionTracksMatch = text.match(/captionTracks":\[(.*?)\]/s);
    
    if (!captionTracksMatch) {
      throw new YoutubeTranscriptNotAvailableError(videoId);
    }
    
    const captionTracksJson = `[${captionTracksMatch[1]}]`;
    const captionTracks = JSON.parse(captionTracksJson.replace(/\\"/g, '"'));
    
    // 선호하는 언어의 자막 찾기
    let selectedCaptionTrack = null;
    
    // 요청된 언어가 있으면 해당 언어 찾기
    if (lang) {
      selectedCaptionTrack = captionTracks.find((track: any) => 
        track.languageCode === lang
      );
    }
    
    // 요청 언어를 못 찾았거나 언어가 지정되지 않은 경우 한국어, 영어 순으로 시도
    if (!selectedCaptionTrack) {
      selectedCaptionTrack = captionTracks.find((track: any) => 
        track.languageCode === 'ko'
      );
      
      if (!selectedCaptionTrack) {
        selectedCaptionTrack = captionTracks.find((track: any) => 
          track.languageCode === 'en'
        );
      }
      
      // 그래도 없으면 첫번째 자막 사용
      if (!selectedCaptionTrack && captionTracks.length > 0) {
        selectedCaptionTrack = captionTracks[0];
      }
    }
    
    if (!selectedCaptionTrack) {
      throw new YoutubeTranscriptNotAvailableError(videoId);
    }
    
    console.log(`자막 트랙 발견: ${selectedCaptionTrack.name?.simpleText}, 언어: ${selectedCaptionTrack.languageCode}`);
    
    // 자막 URL에서 baseUrl 추출
    const baseUrl = selectedCaptionTrack.baseUrl || selectedCaptionTrack.url;
    
    if (!baseUrl) {
      throw new YoutubeTranscriptNotAvailableError(videoId);
    }
    
    // 자막 데이터를 JSON 형식으로 가져오기
    const transcriptUrl = `${baseUrl}&fmt=json3`;
    
    console.log("자막 데이터 요청 중...", transcriptUrl);
    
    // CORS 프록시를 통해 자막 데이터 요청
    const transcriptResponse = await fetchWithCorsProxy(transcriptUrl, {
      headers: BASE_HEADERS
    });
    
    const transcriptData = await transcriptResponse.json();
    
    if (!transcriptData?.events || transcriptData.events.length === 0) {
      throw new YoutubeTranscriptNotAvailableError(videoId);
    }
    
    // 자막 세그먼트 변환
    return transcriptData.events
      .filter((event: any) => event.segs && event.segs.length > 0)
      .map((event: any) => ({
        text: decodeHtmlEntities(event.segs.map((seg: any) => seg.utf8).join(' ')),
        offset: event.tStartMs,
        duration: event.dDurationMs,
        lang: selectedCaptionTrack.languageCode
      }));
      
  } catch (error: any) {
    console.error('Transcript fetch error:', error);
    
    if (error instanceof YoutubeTranscriptError) {
      throw error;
    }
    
    if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
      throw new Error('네트워크 연결 오류: 서버에 연결할 수 없습니다. CORS 정책 문제일 수 있습니다.');
    }
    
    // 샘플 데이터 반환 (개발자 모드에서만)
    if (process.env.NODE_ENV === 'development') {
      console.warn('개발 모드에서 샘플 데이터 사용');
      return SAMPLE_TRANSCRIPT_DATA;
    }
    
    throw new YoutubeTranscriptNotAvailableError(videoId);
  }
};

export const processTranscriptSegments = (segments: TranscriptSegment[]): string => {
  return segments
    .map(segment => segment.text.trim())
    .filter(text => text.length > 0)
    .join('\n');
};
