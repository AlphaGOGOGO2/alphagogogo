
import {
  YoutubeTranscriptDisabledError,
  YoutubeTranscriptError,
  YoutubeTranscriptNotAvailableError,
  YoutubeTranscriptTooManyRequestError,
  YoutubeTranscriptVideoUnavailableError
} from "@/utils/youtubeTranscriptErrors";
import { TranscriptSegment } from "@/types/youtubeTranscript";

// YouTube API를 위한 설정
const YOUTUBE_API_KEY = 'AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8'; // 공개 API 키 (제한된 기능만 사용 가능)
const BASE_API_URL = 'https://www.googleapis.com/youtube/v3';

// 기본 헤더 설정
const BASE_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// 신뢰할 수 있는 CORS 프록시 목록
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest='
];

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

// 프록시를 통한 요청 처리
async function fetchThroughProxy(url: string, options: RequestInit = {}): Promise<Response | null> {
  // 각 프록시를 순차적으로 시도
  for (const proxy of CORS_PROXIES) {
    try {
      console.log(`프록시 시도: ${proxy}`);
      const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
      const response = await fetchWithTimeout(proxyUrl, options, 5000);
      if (response.ok) {
        console.log(`프록시 성공: ${proxy}`);
        return response;
      }
    } catch (error) {
      console.warn(`프록시 실패: ${proxy}`, error);
      continue; // 다음 프록시 시도
    }
  }
  
  // 모든 프록시가 실패한 경우
  console.error("모든 프록시 요청 실패");
  return null;
}

// HTML 엔티티 디코딩 함수
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

// 유튜브 API를 통해 동영상 정보 가져오기
async function getVideoDetails(videoId: string): Promise<any> {
  try {
    const url = `${BASE_API_URL}/videos?part=snippet,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`;
    
    // 직접 요청 먼저 시도
    try {
      const directResponse = await fetchWithTimeout(url, { headers: BASE_HEADERS }, 5000);
      if (directResponse.ok) {
        return await directResponse.json();
      }
    } catch (error) {
      console.warn("직접 API 요청 실패, 프록시 시도");
    }
    
    // 프록시를 통한 요청 시도
    const proxyResponse = await fetchThroughProxy(url);
    if (!proxyResponse) {
      throw new Error('네트워크 연결 오류: API 서버에 연결할 수 없습니다.');
    }
    
    const data = await proxyResponse.json();
    if (!data.items || data.items.length === 0) {
      throw new YoutubeTranscriptVideoUnavailableError(videoId);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw error;
  }
}

// 유튜브 API를 통해 자막 목록 가져오기
async function getCaptionTracks(videoId: string): Promise<any[]> {
  try {
    const url = `${BASE_API_URL}/captions?part=snippet&videoId=${videoId}&key=${YOUTUBE_API_KEY}`;
    
    // 직접 요청 먼저 시도
    try {
      const directResponse = await fetchWithTimeout(url, { headers: BASE_HEADERS }, 5000);
      if (directResponse.ok) {
        const data = await directResponse.json();
        return data.items || [];
      }
    } catch (error) {
      console.warn("직접 API 요청 실패, 프록시 시도");
    }
    
    // 프록시를 통한 요청 시도
    const proxyResponse = await fetchThroughProxy(url);
    if (!proxyResponse) {
      throw new Error('네트워크 연결 오류: API 서버에 연결할 수 없습니다.');
    }
    
    const data = await proxyResponse.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching caption tracks:', error);
    throw error;
  }
}

// 비디오 자막 가져오기 위한 별도 함수 (YouTube API v3 제한 때문에 대체 방법 필요)
async function fetchTranscriptContent(videoId: string, languageCode: string): Promise<TranscriptSegment[]> {
  // 실제 환경에서는 서버 측에서 처리하거나 별도 API 사용 권장
  // 현재는 샘플 데이터 반환
  return generateSampleTranscript(`실제 자막 내용은 YouTube API v3에서 직접 제공되지 않아 서버 측 기능이 필요합니다`, languageCode);
}

// YouTube Data API v3를 사용하여 자막 정보 가져오기
export const fetchTranscript = async (
  videoId: string, 
  lang?: string
): Promise<TranscriptSegment[]> => {
  try {
    console.log(`Fetching transcript for video ${videoId} using YouTube Data API v3`);
    
    // 1. 비디오 정보 확인
    const videoDetails = await getVideoDetails(videoId);
    console.log('Video details retrieved:', videoDetails.items[0].snippet.title);
    
    // 비디오 정보에서 제목과 채널명 추출
    const videoTitle = videoDetails.items[0].snippet.title;
    const channelTitle = videoDetails.items[0].snippet.channelTitle;
    
    // 2. 자막 트랙 목록 가져오기
    const captionTracks = await getCaptionTracks(videoId);
    console.log('Caption tracks found:', captionTracks.length);
    
    if (!captionTracks || captionTracks.length === 0) {
      // 자막이 없는 경우
      throw new YoutubeTranscriptNotAvailableError(videoId);
    }
    
    // 선호하는 언어의 자막 찾기
    let selectedTrack = null;
    let selectedLanguage = lang || 'ko'; // 기본값은 한국어
    
    // 요청된 언어가 있으면 해당 언어 찾기
    if (lang) {
      selectedTrack = captionTracks.find((track: any) => 
        track.snippet.language === lang
      );
      
      if (selectedTrack) {
        selectedLanguage = lang;
      }
    }
    
    // 요청 언어를 못 찾았거나 언어가 지정되지 않은 경우 한국어, 영어 순으로 시도
    if (!selectedTrack) {
      selectedTrack = captionTracks.find((track: any) => 
        track.snippet.language === 'ko'
      );
      
      if (selectedTrack) {
        selectedLanguage = 'ko';
      } else {
        selectedTrack = captionTracks.find((track: any) => 
          track.snippet.language === 'en'
        );
        
        if (selectedTrack) {
          selectedLanguage = 'en';
        }
      }
      
      // 그래도 없으면 첫번째 자막 사용
      if (!selectedTrack && captionTracks.length > 0) {
        selectedTrack = captionTracks[0];
        selectedLanguage = selectedTrack.snippet.language;
      }
    }
    
    if (!selectedTrack) {
      throw new YoutubeTranscriptNotAvailableError(videoId);
    }
    
    // 실제 자막 콘텐츠를 가져오기
    const transcript = await fetchTranscriptContent(videoId, selectedLanguage);
    
    // 비디오 메타데이터 추가
    (transcript as any).videoInfo = {
      title: videoTitle,
      author: channelTitle,
      language: selectedLanguage
    };
    
    return transcript;
      
  } catch (error: any) {
    console.error('Transcript fetch error:', error);
    
    if (error instanceof YoutubeTranscriptError) {
      throw error;
    }
    
    if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch') || 
        error.message.includes('네트워크 연결 오류')) {
      throw new Error('네트워크 연결 오류: API 서버에 연결할 수 없습니다.');
    }
    
    throw new YoutubeTranscriptNotAvailableError(videoId);
  }
};

function generateSampleTranscript(videoTitle: string, language: string): TranscriptSegment[] {
  // 언어별 샘플 자막 생성
  let baseSamples;
  
  if (language === 'ko') {
    baseSamples = [
      "이 자막은 YouTube Data API v3 제한으로 인한 샘플입니다.",
      "실제 자막 내용을 가져오려면 서버 측 기능이 필요합니다.",
      "이 비디오에는 자막 트랙이 존재하지만 내용은 API를 통해 직접 접근할 수 없습니다.",
      "API에서는 자막 존재 여부만 확인 가능합니다."
    ];
  } else if (language === 'en') {
    baseSamples = [
      "This transcript is a sample due to YouTube Data API v3 limitations.",
      "Server-side functionality is required to retrieve the actual transcript content.",
      "This video has caption tracks, but the content cannot be accessed directly through the API.",
      "The API only allows checking for the existence of captions."
    ];
  } else {
    baseSamples = [
      `This is a sample transcript for "${videoTitle}"`,
      "YouTube Data API v3 does not provide direct access to caption content.",
      `Language: ${language} caption track exists for this video.`,
      "A separate service or server-side code is needed for actual captions."
    ];
  }
  
  // 샘플 자막 세그먼트 생성
  return baseSamples.map((text, index) => ({
    text,
    offset: index * 3000,
    duration: 3000,
    lang: language
  }));
}

export const processTranscriptSegments = (segments: TranscriptSegment[]): string => {
  // 비디오 정보 추출
  const videoInfo = (segments as any).videoInfo || {};
  
  // 자막 텍스트만 추출하여 조합
  const transcriptText = segments
    .map(segment => segment.text.trim())
    .filter(text => text.length > 0)
    .join('\n\n');
  
  // 결과에 비디오 정보도 포함
  return transcriptText;
};
