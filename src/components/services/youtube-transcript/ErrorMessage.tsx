
import { AlertTriangle } from "lucide-react";

interface ErrorMessageProps {
  error: string;
}

export function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm flex items-start gap-3 shadow-sm">
      <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-medium text-base text-red-800 mb-1">오류 발생</p>
        <p>{error}</p>
        
        {error.includes("네트워크 연결 오류") && (
          <p className="mt-2 bg-red-100/50 p-2 rounded-lg">
            네트워크 연결을 확인하거나 잠시 후 다시 시도해보세요. CORS 문제일 수 있습니다.
          </p>
        )}
        
        {error.includes("자막이 없거나") && (
          <div className="mt-2">
            <p>해당 영상에 자막이 없거나 자막 접근이 제한되었습니다. 자막이 있는 다른 영상을 시도해보세요.</p>
            <div className="bg-amber-50 border border-amber-100 p-3 mt-3 rounded-lg text-amber-800 text-xs">
              <p className="font-medium mb-1">추천하는 시도:</p>
              <ul className="list-disc pl-4 mt-1 space-y-1.5">
                <li>영어 교육 콘텐츠나 TED 강연과 같은 공식 채널의 영상</li>
                <li>최근에 업로드된 인기 있는 콘텐츠</li>
                <li>자막이 포함된 것으로 표시된 영상</li>
                <li>다른 영상 URL 형식 시도 (예: 모바일 링크 대신 데스크톱 링크)</li>
              </ul>
            </div>
          </div>
        )}
        
        {error.includes("유효한 YouTube URL") && (
          <p className="mt-2 bg-red-100/50 p-2 rounded-lg">
            예시: https://www.youtube.com/watch?v=VIDEO_ID 또는 https://youtu.be/VIDEO_ID
          </p>
        )}

        {error.includes("요청이 너무 많습니다") && (
          <p className="mt-2 bg-red-100/50 p-2 rounded-lg">
            YouTube에서 너무 많은 요청을 받아 캡챠 확인이 필요합니다. 잠시 후 다시 시도하거나 다른 네트워크에서 접속해보세요.
          </p>
        )}

        {error.includes("더 이상 사용할 수 없습니다") && (
          <p className="mt-2 bg-red-100/50 p-2 rounded-lg">
            이 영상은 삭제되었거나 비공개로 전환되었을 수 있습니다. 다른 영상을 시도해보세요.
          </p>
        )}

        {error.includes("자막 기능이 비활성화") && (
          <p className="mt-2 bg-red-100/50 p-2 rounded-lg">
            업로더가 이 영상의 자막 기능을 비활성화했습니다. 자막이 활성화된 다른 영상을 시도해보세요.
          </p>
        )}
      </div>
    </div>
  );
}
