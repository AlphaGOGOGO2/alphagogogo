
import { AlertTriangle } from "lucide-react";

interface ErrorMessageProps {
  error: string;
}

export function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm flex items-start gap-2">
      <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-medium">오류 발생</p>
        <p>{error}</p>
        {error.includes("네트워크 연결 오류") && (
          <p className="mt-1">
            네트워크 연결을 확인하거나 잠시 후 다시 시도해보세요.
          </p>
        )}
        {error.includes("자막이 없거나") && (
          <p className="mt-1">
            해당 영상에 자막이 없거나 자막 접근이 제한되었습니다. 자막이 있는 다른 영상을 시도해보세요.
          </p>
        )}
        {error.includes("유효한 YouTube URL") && (
          <p className="mt-1">
            예시: https://www.youtube.com/watch?v=VIDEO_ID 또는 https://youtu.be/VIDEO_ID
          </p>
        )}
      </div>
    </div>
  );
}
