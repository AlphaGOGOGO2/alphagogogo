
/**
 * YouTube 자막 기능 관련 타입 정의
 */

// 자막 세그먼트 인터페이스
export interface TranscriptSegment {
  text: string;
  duration: number;
  offset: number;
  lang?: string;
}

// 비디오 정보 인터페이스
export interface YoutubeVideoInfo {
  id: string;
  title?: string;
  author?: string;
  language?: string;
}
