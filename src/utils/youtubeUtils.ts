
/**
 * Extracts the YouTube video ID from various YouTube URL formats
 * 
 * @param url - YouTube URL in any format (standard, shortened, embedded, etc.)
 * @returns The video ID or null if the URL is invalid
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  
  // Handle standard YouTube URLs
  // https://www.youtube.com/watch?v=VIDEO_ID
  const standardRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const standardMatch = url.match(standardRegex);
  
  if (standardMatch && standardMatch[1]) {
    return standardMatch[1];
  }
  
  // Handle short YouTube URLs
  // https://youtu.be/VIDEO_ID
  const shortRegex = /youtu\.be\/([a-zA-Z0-9_-]{11})/;
  const shortMatch = url.match(shortRegex);
  
  if (shortMatch && shortMatch[1]) {
    return shortMatch[1];
  }
  
  // Handle YouTube embedded URLs
  // https://www.youtube.com/embed/VIDEO_ID
  const embedRegex = /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/;
  const embedMatch = url.match(embedRegex);
  
  if (embedMatch && embedMatch[1]) {
    return embedMatch[1];
  }
  
  return null;
}

/**
 * Creates a proxy URL for the YouTube transcript API
 * 
 * @param videoId - YouTube video ID
 * @param language - Language code for the transcript
 * @returns The proxied API URL
 */
export function createTranscriptProxyUrl(videoId: string, language: string): string {
  // Use a CORS proxy to avoid cross-origin issues
  const corsProxy = "https://cors-anywhere.herokuapp.com/";
  const apiUrl = `https://youtube-transcript.vercel.app/api?videoId=${videoId}&lang=${language}`;
  
  return corsProxy + apiUrl;
}
