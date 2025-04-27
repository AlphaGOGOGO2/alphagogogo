
import {
  YoutubeTranscriptDisabledError,
  YoutubeTranscriptError,
  YoutubeTranscriptNotAvailableError,
  YoutubeTranscriptTooManyRequestError,
  YoutubeTranscriptVideoUnavailableError
} from "@/utils/youtubeTranscriptErrors";
import { TranscriptSegment } from "@/types/youtubeTranscript";

// Constants for YouTube transcript extraction
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36,gzip(gfe)';
const RE_XML_TRANSCRIPT = /<text start="([^"]*)" dur="([^"]*)">([^<]*)<\/text>/g;

// 더 안정적인 CORS 프록시 목록 (최신 및 활성 상태인 프록시들)
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://api.codetabs.com/v1/proxy?quest=',
  'https://corsproxy.io/?',
  'https://yacdn.org/proxy/',
  'https://proxy.cors.sh/'
];

/**
 * 현재 사용할 CORS 프록시 URL을 선택합니다
 * 첫 번째 것부터 시도하고 필요시 다음 프록시로 넘어갑니다
 */
function getCorsProxy(attemptIndex = 0) {
  const index = attemptIndex % CORS_PROXIES.length;
  return CORS_PROXIES[index];
}

/**
 * Fetches transcript for a YouTube video
 * 
 * @param videoId - YouTube video ID
 * @param lang - Optional language code (e.g., 'ko', 'en')
 * @param attemptIndex - 현재 시도 횟수 (프록시 선택과 재시도를 위해 사용)
 * @returns Array of transcript segments
 */
export const fetchTranscript = async (
  videoId: string, 
  lang?: string, 
  attemptIndex = 0
): Promise<TranscriptSegment[]> => {
  console.log(`Fetching transcript for video ${videoId} in language ${lang || 'default'}, attempt: ${attemptIndex + 1}`);
  
  const corsProxy = getCorsProxy(attemptIndex);
  console.log(`Using CORS proxy: ${corsProxy}`);
  
  try {
    // Step 1: Fetch the video page to get caption data
    const videoPageResponse = await fetch(
      `${corsProxy}https://www.youtube.com/watch?v=${videoId}`,
      {
        headers: {
          ...(lang && { 'Accept-Language': lang }),
          'User-Agent': USER_AGENT,
        },
        cache: 'no-store',
        referrerPolicy: 'no-referrer',
        mode: 'cors',
        credentials: 'omit'
      }
    );
    
    if (!videoPageResponse.ok) {
      console.error(`Video page response not OK: ${videoPageResponse.status}`);
      throw new YoutubeTranscriptVideoUnavailableError(videoId);
    }
    
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
    const transcriptResponse = await fetch(`${corsProxy}${transcriptURL}`, {
      headers: {
        ...(lang && { 'Accept-Language': lang }),
        'User-Agent': USER_AGENT,
      },
      cache: 'no-store',
      referrerPolicy: 'no-referrer',
      mode: 'cors',
      credentials: 'omit'
    });
    
    if (!transcriptResponse.ok) {
      console.error(`Transcript response not OK: ${transcriptResponse.status}`);
      throw new YoutubeTranscriptNotAvailableError(videoId);
    }
    
    const transcriptBody = await transcriptResponse.text();
    console.log(`Transcript fetched successfully, length: ${transcriptBody.length}`);

    // Step 6: Parse the XML transcript
    const results = [...transcriptBody.matchAll(RE_XML_TRANSCRIPT)];
    console.log(`Parsed ${results.length} transcript segments`);
    
    return results.map((result) => ({
      text: result[3],
      duration: parseFloat(result[2]),
      offset: parseFloat(result[1]),
      lang: lang ?? captionTrack.languageCode,
    }));
  } catch (error) {
    console.error(`Error fetching transcript:`, error);
    
    // 재시도 로직: 다른 CORS 프록시로 시도
    if (attemptIndex < CORS_PROXIES.length - 1) {
      console.log(`Retrying with different CORS proxy, attempt ${attemptIndex + 2}`);
      return fetchTranscript(videoId, lang, attemptIndex + 1);
    }
    
    // 모든 프록시를 시도했지만 실패한 경우
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      throw new Error('네트워크 연결 오류: 서버에 연결할 수 없습니다.');
    }
    
    throw error;
  }
};

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
  
  // 자막 텍스트에서 HTML 특수 문자를 디코딩하고 정리
  return segments
    .map(segment => {
      // HTML 엔티티 디코딩
      const decoded = segment.text
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ');
      
      return decoded.trim();
    })
    .join(' ');
};
