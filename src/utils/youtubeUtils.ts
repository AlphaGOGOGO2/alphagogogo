
/**
 * 다양한 형식의 YouTube URL에서 비디오 ID를 추출하는 함수
 * 
 * @param url - 어떤 형식이든 YouTube URL (표준, 짧은 URL, 임베드 등)
 * @returns 비디오 ID 또는 유효하지 않을 경우 null
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  
  // 표준 YouTube URL 처리
  // https://www.youtube.com/watch?v=VIDEO_ID
  const standardRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const standardMatch = url.match(standardRegex);
  
  if (standardMatch && standardMatch[1]) {
    return standardMatch[1];
  }
  
  // 짧은 YouTube URL 처리
  // https://youtu.be/VIDEO_ID
  const shortRegex = /youtu\.be\/([a-zA-Z0-9_-]{11})/;
  const shortMatch = url.match(shortRegex);
  
  if (shortMatch && shortMatch[1]) {
    return shortMatch[1];
  }
  
  // 임베드 YouTube URL 처리
  // https://www.youtube.com/embed/VIDEO_ID
  const embedRegex = /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/;
  const embedMatch = url.match(embedRegex);
  
  if (embedMatch && embedMatch[1]) {
    return embedMatch[1];
  }
  
  return null;
}
