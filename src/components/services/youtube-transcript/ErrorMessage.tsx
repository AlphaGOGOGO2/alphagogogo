
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
        {error.includes("Failed to fetch") && (
          <p className="mt-1">
            CORS 우회 옵션을 활성화했는지 확인하시거나, 다른 YouTube 영상을 시도해보세요.
          </p>
        )}
      </div>
    </div>
  );
}
