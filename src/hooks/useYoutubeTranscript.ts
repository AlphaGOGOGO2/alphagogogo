
import { useState } from "react";
import { toast } from "sonner";
import { extractYouTubeVideoId } from "@/utils/youtubeUtils";

// Constants for YouTube transcript extraction
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36,gzip(gfe)';
const RE_XML_TRANSCRIPT = /<text start="([^"]*)" dur="([^"]*)">([^<]*)<\/text>/g;
const CORS_PROXY = 'https://corsproxy.io/?';

// Error classes for better error handling
class YoutubeTranscriptError extends Error {
  constructor(message: string) {
    super(`[YoutubeTranscript] 🚨 ${message}`);
  }
}

class YoutubeTranscriptTooManyRequestError extends YoutubeTranscriptError {
  constructor() {
    super('YouTube is receiving too many requests from this IP and now requires solving a captcha to continue');
  }
}

class YoutubeTranscriptVideoUnavailableError extends YoutubeTranscriptError {
  constructor(videoId: string) {
    super(`The video is no longer available (${videoId})`);
  }
}

class YoutubeTranscriptDisabledError extends YoutubeTranscriptError {
  constructor(videoId: string) {
    super(`Transcript is disabled on this video (${videoId})`);
  }
}

class YoutubeTranscriptNotAvailableError extends YoutubeTranscriptError {
  constructor(videoId: string) {
    super(`No transcripts are available for this video (${videoId})`);
  }
}

interface TranscriptResponse {
  text: string;
  duration: number;
  offset: number;
  lang?: string;
}

export function useYoutubeTranscript() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to retrieve transcript using the more reliable method
  const fetchTranscript = async (videoId: string, lang?: string): Promise<TranscriptResponse[]> => {
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

  const handleExtractTranscript = async () => {
    // Reset states
    setTranscript("");
    setError("");
    
    if (!youtubeUrl.trim()) {
      setError("YouTube URL을 입력해주세요.");
      toast.error("YouTube URL을 입력해주세요.");
      return;
    }
    
    const videoId = extractYouTubeVideoId(youtubeUrl);
    console.log("Extracted Video ID:", videoId);
    
    if (!videoId) {
      setError("유효한 YouTube URL을 입력해주세요.");
      toast.error("유효한 YouTube URL을 입력해주세요.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Try to get transcript with Korean language first
      let transcriptData: TranscriptResponse[] = [];
      
      try {
        console.log("Attempting to fetch Korean transcript");
        transcriptData = await fetchTranscript(videoId, 'ko');
      } catch (koreanError) {
        console.log("Korean transcript failed, trying English", koreanError);
        try {
          transcriptData = await fetchTranscript(videoId, 'en');
        } catch (englishError) {
          console.log("English transcript failed, trying default language", englishError);
          transcriptData = await fetchTranscript(videoId);
        }
      }
      
      if (transcriptData && transcriptData.length > 0) {
        // Join all transcript segments into a single text
        const fullTranscript = transcriptData.map(segment => segment.text).join(' ');
        setTranscript(fullTranscript);
        toast.success("자막을 성공적으로 가져왔습니다!");
      } else {
        throw new YoutubeTranscriptNotAvailableError(videoId);
      }
    } catch (error) {
      console.error("자막 추출 오류:", error);
      let errorMessage = "자막을 가져오는데 실패했습니다.";
      
      if (error instanceof YoutubeTranscriptTooManyRequestError) {
        errorMessage = "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
      } else if (error instanceof YoutubeTranscriptVideoUnavailableError) {
        errorMessage = "이 영상은 더 이상 사용할 수 없습니다.";
      } else if (error instanceof YoutubeTranscriptDisabledError) {
        errorMessage = "이 영상에서는 자막 기능이 비활성화되어 있습니다.";
      } else if (error instanceof YoutubeTranscriptNotAvailableError) {
        errorMessage = "이 영상에는 자막이 없거나 접근할 수 없습니다.";
      } else if (error instanceof Error) {
        if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
          errorMessage = "네트워크 연결 오류: 서버에 연결할 수 없습니다.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      toast.error("자막을 가져오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    youtubeUrl,
    setYoutubeUrl,
    transcript,
    isLoading,
    error,
    handleExtractTranscript
  };
}
