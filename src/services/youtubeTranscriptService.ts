
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

const BASE_HEADERS = {
  'accept': '*/*',
  'accept-language': 'ko,en;q=0.9',
  'content-type': 'application/json',
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

async function getInitialData(videoId: string): Promise<any> {
  try {
    const response = await fetchWithTimeout(
      `https://www.youtube.com/watch?v=${videoId}`,
      {
        headers: BASE_HEADERS,
        credentials: 'omit',
        mode: 'cors'
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch video page: ${response.status}`);
    }

    const html = await response.text();
    
    // ytInitialData 추출
    const ytInitialDataMatch = html.match(/ytInitialData\s*=\s*({.+?});/);
    if (!ytInitialDataMatch) {
      throw new Error('Could not find ytInitialData');
    }
    
    return JSON.parse(ytInitialDataMatch[1]);
  } catch (error: any) {
    console.error('Error fetching initial data:', error);
    throw new Error('네트워크 연결 오류: YouTube 데이터를 가져올 수 없습니다.');
  }
}

async function getTranscriptData(videoId: string, lang?: string): Promise<any> {
  try {
    const initialData = await getInitialData(videoId);
    
    // 자막 데이터 추출
    const captions = initialData?.playerOverlays?.playerOverlayRenderer?.decoratedPlayerBarRenderer?.decoratedPlayerBarRenderer?.playerBar?.multiMarkersPlayerBarRenderer?.markersMap?.[0]?.value?.chapters;
    
    if (!captions) {
      throw new YoutubeTranscriptNotAvailableError(videoId);
    }

    // 자막 URL 생성 - 숫자 값들을 문자열로 변환
    const params = {
      v: videoId,
      fmt: 'json3',
      xorb: '2',  // 숫자를 문자열로 변경
      xobt: '3',  // 숫자를 문자열로 변경
      xovt: '3',  // 숫자를 문자열로 변경
    };
    
    // 언어 파라미터가 있는 경우에만 추가
    if (lang) {
      params['lang'] = lang;
    }
    
    const url = `https://www.youtube.com/api/timedtext?${new URLSearchParams(params)}`;
    
    const response = await fetchWithTimeout(url, {
      headers: BASE_HEADERS,
      credentials: 'omit',
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch transcript: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error fetching transcript data:', error);
    if (error instanceof YoutubeTranscriptError) {
      throw error;
    }
    throw new Error('네트워크 연결 오류: 자막 데이터를 가져올 수 없습니다.');
  }
}

// HTML 엔티티 디코딩 함수
function decodeHtmlEntities(text: string): string {
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

export const fetchTranscript = async (
  videoId: string, 
  lang?: string
): Promise<TranscriptSegment[]> => {
  try {
    console.log(`Fetching transcript for video ${videoId} in language ${lang || 'default'}`);
    
    const transcriptData = await getTranscriptData(videoId, lang);
    
    if (!transcriptData?.events || transcriptData.events.length === 0) {
      throw new YoutubeTranscriptNotAvailableError(videoId);
    }

    return transcriptData.events
      .filter((event: any) => event.segs && event.segs.length > 0)
      .map((event: any) => ({
        text: decodeHtmlEntities(event.segs.map((seg: any) => seg.utf8).join(' ')),
        offset: event.tStartMs,
        duration: event.dDurationMs,
        lang: lang || 'default'
      }));
  } catch (error: any) {
    console.error('Transcript fetch error:', error);
    
    if (error instanceof YoutubeTranscriptError) {
      throw error;
    }
    
    if (error.message.includes('NetworkError') || error.message.includes('네트워크 연결 오류')) {
      throw new Error('네트워크 연결 오류: 서버에 연결할 수 없습니다.');
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
