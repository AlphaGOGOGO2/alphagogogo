
import { TranscriptSegment, YoutubeVideoInfo } from "@/types/youtubeTranscript";
import {
  YoutubeTranscriptError,
  YoutubeTranscriptNotAvailableError,
  YoutubeTranscriptTooManyRequestError,
  YoutubeTranscriptVideoUnavailableError
} from "@/utils/youtubeTranscriptErrors";

/**
 * YouTube Data API v3을 사용하여 자막 정보 가져오기
 */

// YouTube 동영상 정보 가져오기
export async function getVideoDetails(videoId: string): Promise<YoutubeVideoInfo> {
  try {
    // YouTube Data API v3 키는 환경 변수에서 가져옴 (수파베이스에 등록된 시크릿)
    const apiKey = process.env.YOUTUBE_DATA_API_KEY || 'AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8';
    
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new YoutubeTranscriptTooManyRequestError();
      }
      throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new YoutubeTranscriptVideoUnavailableError(videoId);
    }

    const videoInfo: YoutubeVideoInfo = {
      id: videoId,
      title: data.items[0].snippet.title,
      author: data.items[0].snippet.channelTitle
    };

    return videoInfo;
  } catch (error) {
    console.error('비디오 정보 가져오기 실패:', error);
    if (error instanceof YoutubeTranscriptError) {
      throw error;
    }
    throw new Error('YouTube API에서 비디오 정보를 가져오지 못했습니다.');
  }
}

// 자막 목록 가져오기
export async function getCaptionTracks(videoId: string): Promise<any[]> {
  try {
    const apiKey = process.env.YOUTUBE_DATA_API_KEY || 'AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8';
    const url = `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${apiKey}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new YoutubeTranscriptTooManyRequestError();
      }
      throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('자막 트랙 가져오기 실패:', error);
    if (error instanceof YoutubeTranscriptError) {
      throw error;
    }
    throw new Error('YouTube API에서 자막 정보를 가져오지 못했습니다.');
  }
}

// 자막 내용 가져오기 (YouTube Data API의 한계로 인해 샘플 데이터 반환)
export async function generateTranscriptContent(videoInfo: YoutubeVideoInfo, language: string = 'ko'): Promise<TranscriptSegment[]> {
  // 언어별 샘플 자막 생성
  let samples: string[];
  
  if (language === 'ko') {
    samples = [
      `"${videoInfo.title}" 영상의 자막입니다.`,
      `업로더: ${videoInfo.author}`,
      "YouTube Data API v3는 자막 내용에 직접 접근할 수 없는 제한이 있습니다.",
      "실제 자막 내용을 가져오려면 서버 측 기능이 필요합니다.",
      "이 영상에는 자막 트랙이 존재하지만, API를 통해 내용을 직접 가져올 수 없습니다.",
      "대신 YouTube 자막 서비스를 활용하는 방법을 고려해보세요."
    ];
  } else if (language === 'en') {
    samples = [
      `Transcript for "${videoInfo.title}"`,
      `Uploader: ${videoInfo.author}`,
      "YouTube Data API v3 has limitations on direct access to caption content.",
      "Server-side functionality is required to retrieve the actual transcript.",
      "This video has caption tracks, but the content can't be accessed directly through the API.",
      "Consider using YouTube's caption service instead."
    ];
  } else {
    samples = [
      `Transcript for "${videoInfo.title}" (${language})`,
      `Uploader: ${videoInfo.author}`,
      "Caption language: " + language,
      "YouTube Data API v3 doesn't provide direct access to caption content.",
      "Server-side functionality is needed for actual transcripts."
    ];
  }
  
  // 샘플 자막 세그먼트 생성
  return samples.map((text, index) => ({
    text,
    offset: index * 3000,
    duration: 3000,
    lang: language
  }));
}

// 메인 자막 가져오기 함수
export async function fetchTranscript(videoId: string, lang?: string): Promise<{
  segments: TranscriptSegment[],
  videoInfo: YoutubeVideoInfo
}> {
  try {
    console.log(`비디오 ID ${videoId}의 자막을 가져오는 중...`);
    
    // 1. 비디오 정보 확인
    const videoInfo = await getVideoDetails(videoId);
    console.log('비디오 정보 가져옴:', videoInfo.title);
    
    // 2. 자막 트랙 목록 가져오기
    let captionTracks;
    try {
      captionTracks = await getCaptionTracks(videoId);
      console.log('자막 트랙 찾음:', captionTracks.length);
    } catch (error) {
      console.error('자막 트랙 가져오기 오류:', error);
      // 자막 트랙을 가져오는 데 실패해도 계속 진행
      captionTracks = [];
    }
    
    // 3. 가용 언어 확인
    let selectedLanguage = lang || 'ko'; // 기본값은 한국어
    
    if (captionTracks && captionTracks.length > 0) {
      // 요청된 언어가 있으면 해당 언어 찾기
      if (lang) {
        const trackExists = captionTracks.some((track: any) => 
          track.snippet.language === lang
        );
        
        if (trackExists) {
          selectedLanguage = lang;
        }
      }
      
      // 요청 언어를 못 찾았거나 언어가 지정되지 않은 경우 한국어, 영어 순으로 시도
      if (!lang || !captionTracks.some((track: any) => track.snippet.language === lang)) {
        if (captionTracks.some((track: any) => track.snippet.language === 'ko')) {
          selectedLanguage = 'ko';
        } else if (captionTracks.some((track: any) => track.snippet.language === 'en')) {
          selectedLanguage = 'en';
        } else if (captionTracks.length > 0) {
          // 첫 번째 가용 언어 사용
          selectedLanguage = captionTracks[0].snippet.language;
        }
      }
      
      videoInfo.language = selectedLanguage;
    } else {
      // 자막이 없는 경우 메시지 표시
      throw new YoutubeTranscriptNotAvailableError(videoId);
    }
    
    // 4. 자막 내용 생성 (API 제한으로 샘플 데이터)
    const segments = await generateTranscriptContent(videoInfo, selectedLanguage);
    
    return { segments, videoInfo };
      
  } catch (error) {
    console.error('자막 가져오기 오류:', error);
    
    if (error instanceof YoutubeTranscriptError) {
      throw error;
    }
    
    if (error instanceof Error && error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
      throw new Error('네트워크 연결 오류: API 서버에 연결할 수 없습니다.');
    }
    
    throw new YoutubeTranscriptNotAvailableError(videoId);
  }
}

// 자막 세그먼트를 텍스트로 처리하는 함수
export const processTranscriptSegments = (segments: TranscriptSegment[]): string => {
  // 자막 텍스트만 추출하여 조합
  return segments
    .map(segment => segment.text.trim())
    .filter(text => text.length > 0)
    .join('\n\n');
};
