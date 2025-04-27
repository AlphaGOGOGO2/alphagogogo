
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
    const url = `${BASE_API_URL}/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`;
    const response = await fetchWithTimeout(url, { headers: BASE_HEADERS });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`YouTube API Error: ${error.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    if (!data.items || data.items.length === 0) {
      throw new YoutubeTranscriptVideoUnavailableError(videoId);
    }
    
    return data.items[0];
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw error;
  }
}

// 유튜브 API를 통해 자막 목록 가져오기
async function getCaptionTracks(videoId: string): Promise<any[]> {
  try {
    const url = `${BASE_API_URL}/captions?part=snippet&videoId=${videoId}&key=${YOUTUBE_API_KEY}`;
    const response = await fetchWithTimeout(url, { headers: BASE_HEADERS });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`YouTube API Error: ${error.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching caption tracks:', error);
    throw error;
  }
}

// YouTube Data API v3를 사용하여 자막 가져오기
export const fetchTranscript = async (
  videoId: string, 
  lang?: string
): Promise<TranscriptSegment[]> => {
  try {
    console.log(`Fetching transcript for video ${videoId} using YouTube Data API v3`);
    
    // 1. 비디오 정보 확인
    const videoDetails = await getVideoDetails(videoId);
    console.log('Video details retrieved:', videoDetails.snippet.title);
    
    // 2. 자막 트랙 목록 가져오기
    const captionTracks = await getCaptionTracks(videoId);
    console.log('Caption tracks found:', captionTracks.length);
    
    if (!captionTracks || captionTracks.length === 0) {
      // 자막이 없는 경우 샘플 데이터 반환 (실제 환경에서는 에러 처리)
      throw new YoutubeTranscriptNotAvailableError(videoId);
    }
    
    // 선호하는 언어의 자막 찾기
    let selectedTrack = null;
    
    // 요청된 언어가 있으면 해당 언어 찾기
    if (lang) {
      selectedTrack = captionTracks.find((track: any) => 
        track.snippet.language === lang
      );
    }
    
    // 요청 언어를 못 찾았거나 언어가 지정되지 않은 경우 한국어, 영어 순으로 시도
    if (!selectedTrack) {
      selectedTrack = captionTracks.find((track: any) => 
        track.snippet.language === 'ko'
      );
      
      if (!selectedTrack) {
        selectedTrack = captionTracks.find((track: any) => 
          track.snippet.language === 'en'
        );
      }
      
      // 그래도 없으면 첫번째 자막 사용
      if (!selectedTrack && captionTracks.length > 0) {
        selectedTrack = captionTracks[0];
      }
    }
    
    if (!selectedTrack) {
      throw new YoutubeTranscriptNotAvailableError(videoId);
    }
    
    // 참고: 실제 자막 콘텐츠는 YouTube Data API v3에서 직접 제공하지 않음
    // 자막이 있다는 정보만 확인하고 샘플 데이터 또는 대체 방법 사용 필요
    console.log('Found caption track:', selectedTrack.snippet.language);
    
    // 3. 임시 대체 데이터 생성 (실제로는 다른 방법으로 자막 데이터를 가져와야 함)
    const transcript = generateSampleTranscript(videoDetails.snippet.title, selectedTrack.snippet.language);
    
    return transcript;
      
  } catch (error: any) {
    console.error('Transcript fetch error:', error);
    
    if (error instanceof YoutubeTranscriptError) {
      throw error;
    }
    
    if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
      throw new Error('네트워크 연결 오류: API 서버에 연결할 수 없습니다.');
    }
    
    throw new YoutubeTranscriptNotAvailableError(videoId);
  }
};

function generateSampleTranscript(videoTitle: string, language: string): TranscriptSegment[] {
  // 실제 환경에서는 별도 자막 서비스나 대체 방법으로 대체해야 함
  return [
    {
      text: `이 자막은 "${videoTitle}" 영상의 자막 샘플입니다.`,
      offset: 0,
      duration: 3000
    },
    {
      text: "YouTube Data API v3는 자막 내용을 직접 제공하지 않습니다.",
      offset: 3000,
      duration: 3000
    },
    {
      text: `언어: ${language}로 설정된 자막 트랙이 존재합니다.`,
      offset: 6000,
      duration: 3000
    },
    {
      text: "실제 서비스에서는 별도 자막 서비스나 대체 API를 사용해야 합니다.",
      offset: 9000,
      duration: 3000
    }
  ];
}

export const processTranscriptSegments = (segments: TranscriptSegment[]): string => {
  return segments
    .map(segment => segment.text.trim())
    .filter(text => text.length > 0)
    .join('\n');
};
