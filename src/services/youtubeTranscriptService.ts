
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
const CORS_PROXY = 'https://corsproxy.io/?';

/**
 * Fetches transcript for a YouTube video
 * 
 * @param videoId - YouTube video ID
 * @param lang - Optional language code (e.g., 'ko', 'en')
 * @returns Array of transcript segments
 */
export const fetchTranscript = async (videoId: string, lang?: string): Promise<TranscriptSegment[]> => {
  console.log(`Fetching transcript for video ${videoId} in language ${lang || 'default'}`);
  
  // Step 1: Fetch the video page to get caption data
  const videoPageResponse = await fetch(
    `${CORS_PROXY}https://www.youtube.com/watch?v=${videoId}`,
    {
      headers: {
        ...(lang && { 'Accept-Language': lang }),
        'User-Agent': USER_AGENT,
      },
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
  const transcriptResponse = await fetch(`${CORS_PROXY}${transcriptURL}`, {
    headers: {
      ...(lang && { 'Accept-Language': lang }),
      'User-Agent': USER_AGENT,
    },
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
  
  return segments.map(segment => segment.text).join(' ');
};
