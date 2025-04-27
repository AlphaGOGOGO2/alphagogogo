
/**
 * YouTube 자막 관련 커스텀 에러 클래스
 */

// 기본 에러 클래스
export class YoutubeTranscriptError extends Error {
  constructor(message: string) {
    super(`[YoutubeTranscript] 🚨 ${message}`);
  }
}

// 요청이 너무 많을 때 발생하는 에러
export class YoutubeTranscriptTooManyRequestError extends YoutubeTranscriptError {
  constructor() {
    super('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
  }
}

// 비디오를 이용할 수 없을 때 발생하는 에러
export class YoutubeTranscriptVideoUnavailableError extends YoutubeTranscriptError {
  constructor(videoId: string) {
    super(`이 영상은 더 이상 사용할 수 없습니다. (${videoId})`);
  }
}

// 자막 기능이 비활성화되었을 때 발생하는 에러
export class YoutubeTranscriptDisabledError extends YoutubeTranscriptError {
  constructor(videoId: string) {
    super(`이 영상에서는 자막 기능이 비활성화되어 있습니다. (${videoId})`);
  }
}

// 자막을 이용할 수 없을 때 발생하는 에러
export class YoutubeTranscriptNotAvailableError extends YoutubeTranscriptError {
  constructor(videoId: string) {
    super(`이 영상에는 자막이 없거나 접근할 수 없습니다. (${videoId})`);
  }
}
