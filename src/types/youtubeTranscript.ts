
/**
 * Types for YouTube transcript functionality
 */

// Individual transcript segment returned from the API
export interface TranscriptSegment {
  text: string;
  duration: number;
  offset: number;
  lang?: string;
}

// Error response for transcript API
export interface TranscriptError {
  message: string;
  code?: string;
}

// YouTube 동영상 정보
export interface YoutubeVideoInfo {
  id: string;
  title?: string;
  author?: string;
  availableLanguages?: string[];
}
