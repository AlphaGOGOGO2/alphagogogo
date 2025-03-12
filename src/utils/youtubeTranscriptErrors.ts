
/**
 * Custom error classes for YouTube transcript operations
 */

// Base error class for YouTube transcript operations
export class YoutubeTranscriptError extends Error {
  constructor(message: string) {
    super(`[YoutubeTranscript] 🚨 ${message}`);
  }
}

// Error for too many requests from the same IP
export class YoutubeTranscriptTooManyRequestError extends YoutubeTranscriptError {
  constructor() {
    super('YouTube is receiving too many requests from this IP and now requires solving a captcha to continue');
  }
}

// Error for when a video is unavailable
export class YoutubeTranscriptVideoUnavailableError extends YoutubeTranscriptError {
  constructor(videoId: string) {
    super(`The video is no longer available (${videoId})`);
  }
}

// Error for when transcripts are disabled on a video
export class YoutubeTranscriptDisabledError extends YoutubeTranscriptError {
  constructor(videoId: string) {
    super(`Transcript is disabled on this video (${videoId})`);
  }
}

// Error for when no transcripts are available
export class YoutubeTranscriptNotAvailableError extends YoutubeTranscriptError {
  constructor(videoId: string) {
    super(`No transcripts are available for this video (${videoId})`);
  }
}
