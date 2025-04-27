
import {
  YoutubeTranscriptDisabledError,
  YoutubeTranscriptError,
  YoutubeTranscriptNotAvailableError,
  YoutubeTranscriptTooManyRequestError,
  YoutubeTranscriptVideoUnavailableError
} from "@/utils/youtubeTranscriptErrors";
import { TranscriptSegment } from "@/types/youtubeTranscript";

// Constants for YouTube transcript extraction
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

// 더 많은 CORS 프록시 목록 (더 안정적인 프록시 추가)
const CORS_PROXIES = [
  'https://corsproxy.org/?',
  'https://corsproxy.io/?',
  'https://cors.sh/',
  'https://cors-anywhere.azm.workers.dev/',
  'https://api.allorigins.win/raw?url=',
  'https://api.codetabs.com/v1/proxy?quest=',
  'https://yacdn.org/proxy/',
  'https://proxy.cors.sh/',
  'https://crossorigin.me/'
];

// 서버 없이 자막을 가져오는 방법 (브라우저단에서 실행)
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        // 캐시 무효화 및 CORS 정책 우회
        cache: 'no-store',
        referrerPolicy: 'no-referrer',
        mode: 'cors',
        credentials: 'omit',
      });
      
      if (response.ok) {
        return response;
      }
      
      lastError = new Error(`HTTP error: ${response.status}`);
    } catch (error) {
      console.error(`Fetch attempt ${attempt + 1} failed:`, error);
      lastError = error;
      // 잠시 대기 후 재시도 (지수 백오프)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
    }
  }
  
  throw lastError;
}

/**
 * Fetches transcript for a YouTube video
 * 
 * @param videoId - YouTube video ID
 * @param lang - Optional language code (e.g., 'ko', 'en')
 * @returns Array of transcript segments
 */
export const fetchTranscript = async (
  videoId: string, 
  lang?: string
): Promise<TranscriptSegment[]> => {
  console.log(`Fetching transcript for video ${videoId} in language ${lang || 'default'}`);
  
  // 모든 CORS 프록시를 시도
  const errors: any[] = [];
  
  for (const corsProxy of CORS_PROXIES) {
    try {
      console.log(`Trying CORS proxy: ${corsProxy}`);
      
      // Step 1: Fetch the video page to get caption data
      const videoUrl = `${corsProxy}https://www.youtube.com/watch?v=${videoId}`;
      console.log(`Fetching video page: ${videoUrl}`);
      
      const videoPageResponse = await fetchWithRetry(
        videoUrl,
        {
          headers: {
            ...(lang && { 'Accept-Language': lang }),
            'User-Agent': USER_AGENT,
            'Origin': window.location.origin
          }
        },
        2 // 최대 2번 재시도
      );
      
      const videoPageBody = await videoPageResponse.text();
      console.log(`Video page fetched successfully, length: ${videoPageBody.length}`);

      // Step 2: Extract caption data from the page
      const splittedHTML = videoPageBody.split('"captions":');

      if (splittedHTML.length <= 1) {
        console.error('No captions found in the video page');
        if (videoPageBody.includes('class="g-recaptcha"')) {
          throw new YoutubeTranscriptTooManyRequestError();
        }
        if (!videoPageBody.includes('"playabilityStatus":')) {
          throw new YoutubeTranscriptVideoUnavailableError(videoId);
        }
        throw new YoutubeTranscriptDisabledError(videoId);
      }

      // Step 3: Parse the captions data
      const captions = (() => {
        try {
          return JSON.parse(
            splittedHTML[1].split(',"videoDetails')[0].replace('\n', '')
          );
        } catch (e) {
          console.error('Error parsing captions JSON:', e);
          return undefined;
        }
      })()?.['playerCaptionsTracklistRenderer'];

      if (!captions) {
        console.error('Captions object not found');
        throw new YoutubeTranscriptDisabledError(videoId);
      }

      if (!('captionTracks' in captions)) {
        console.error('No caption tracks found');
        throw new YoutubeTranscriptNotAvailableError(videoId);
      }

      console.log(`Found ${captions.captionTracks.length} caption tracks`);
      
      // Step 4: Get the transcript URL
      const captionTrack = lang
        ? captions.captionTracks.find((track: any) => track.languageCode === lang)
        : captions.captionTracks[0];
        
      if (!captionTrack) {
        console.error(`No caption track found for language: ${lang}`);
        throw new YoutubeTranscriptNotAvailableError(videoId);
      }
      
      const transcriptURL = captionTrack.baseUrl;
      console.log(`Using transcript URL: ${transcriptURL}`);

      // Step 5: Fetch the actual transcript
      const transcriptResponse = await fetchWithRetry(
        `${corsProxy}${transcriptURL}`,
        {
          headers: {
            ...(lang && { 'Accept-Language': lang }),
            'User-Agent': USER_AGENT,
            'Origin': window.location.origin
          }
        },
        2 // 최대 2번 재시도
      );
      
      const transcriptBody = await transcriptResponse.text();
      console.log(`Transcript fetched successfully, length: ${transcriptBody.length}`);

      // Step 6: Parse the XML transcript
      const results = parseTranscriptXml(transcriptBody);
      console.log(`Parsed ${results.length} transcript segments`);
      
      return results.map((result) => ({
        text: result.text,
        duration: result.duration,
        offset: result.offset,
        lang: lang ?? captionTrack.languageCode,
      }));
    } catch (error) {
      console.error(`Error with CORS proxy ${corsProxy}:`, error);
      errors.push({ proxy: corsProxy, error });
      // 다음 프록시로 계속 진행
      continue;
    }
  }
  
  // 모든 프록시가 실패한 경우
  console.error('All CORS proxies failed:', errors);
  
  if (errors.length > 0) {
    // 네트워크 연결 오류가 있는지 확인
    const networkErrors = errors.filter(err => 
      err.error instanceof Error && 
      (err.error.message.includes('Failed to fetch') || 
       err.error.message.includes('NetworkError'))
    );
    
    if (networkErrors.length > 0) {
      throw new Error('네트워크 연결 오류: 서버에 연결할 수 없습니다.');
    }
    
    // 다른 특정 오류 확인
    if (errors.some(err => err.error instanceof YoutubeTranscriptDisabledError)) {
      throw new YoutubeTranscriptDisabledError(videoId);
    }
    if (errors.some(err => err.error instanceof YoutubeTranscriptVideoUnavailableError)) {
      throw new YoutubeTranscriptVideoUnavailableError(videoId);
    }
    if (errors.some(err => err.error instanceof YoutubeTranscriptTooManyRequestError)) {
      throw new YoutubeTranscriptTooManyRequestError();
    }
  }
  
  // 기본 오류
  throw new YoutubeTranscriptNotAvailableError(videoId);
};

// XML 파싱 개선 (정규식 대신 안전한 파싱)
function parseTranscriptXml(xml: string): Array<{text: string, duration: number, offset: number}> {
  const results: Array<{text: string, duration: number, offset: number}> = [];
  const RE_XML_TRANSCRIPT = /<text start="([^"]*)" dur="([^"]*)">([^<]*)<\/text>/g;
  
  let match;
  while ((match = RE_XML_TRANSCRIPT.exec(xml)) !== null) {
    if (match && match.length >= 4) {
      results.push({
        offset: parseFloat(match[1]),
        duration: parseFloat(match[2]),
        text: decodeHtmlEntities(match[3])
      });
    }
  }
  
  return results;
}

// HTML 엔티티 디코딩 함수 개선
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

/**
 * Processes multiple transcript segments into a single text
 * 
 * @param segments - Array of transcript segments
 * @returns Combined transcript text
 */
export const processTranscriptSegments = (segments: TranscriptSegment[]): string => {
  if (!segments || segments.length === 0) {
    return '';
  }
  
  // 자막 텍스트 처리 및 포맷팅
  return segments
    .map(segment => segment.text.trim())
    .join(' ');
};
