
import { AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ErrorMessageProps {
  error: string;
}

export function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <Alert variant="destructive" className="bg-red-50 border-red-100 text-red-700">
      <AlertTriangle className="h-5 w-5" />
      <AlertTitle className="text-red-800">오류 발생</AlertTitle>
      <AlertDescription>
        <p>{error}</p>
        
        {error.includes("요청이 너무 많습니다") && (
          <div className="mt-2 bg-red-100/50 p-3 rounded-lg">
            <p>YouTube API에서 허용하는 할당량을 초과했습니다. 잠시 후 다시 시도하세요.</p>
          </div>
        )}
        
        {error.includes("자막이 없거나") && (
          <div className="mt-2">
            <p>해당 영상에 자막이 없거나 자막 접근이 제한되었습니다.</p>
            <div className="bg-amber-50 border border-amber-100 p-3 mt-3 rounded-lg text-amber-800 text-xs">
              <p className="font-medium mb-1">추천하는 시도:</p>
              <ul className="list-disc pl-4 mt-1 space-y-1.5">
                <li>영어 교육 콘텐츠나 TED 강연과 같은 공식 채널의 영상</li>
                <li>최근에 업로드된 인기 있는 콘텐츠</li>
                <li>자막이 포함된 것으로 표시된 영상</li>
              </ul>
            </div>
          </div>
        )}
        
        {error.includes("유효한 YouTube URL") && (
          <p className="mt-2 bg-red-100/50 p-3 rounded-lg">
            예시: https://www.youtube.com/watch?v=VIDEO_ID 또는 https://youtu.be/VIDEO_ID
          </p>
        )}

        {error.includes("더 이상 사용할 수 없습니다") && (
          <p className="mt-2 bg-red-100/50 p-3 rounded-lg">
            이 영상은 삭제되었거나 비공개로 전환되었을 수 있습니다. 다른 영상을 시도해보세요.
          </p>
        )}

        {error.includes("자막 기능이 비활성화") && (
          <p className="mt-2 bg-red-100/50 p-3 rounded-lg">
            업로더가 이 영상의 자막 기능을 비활성화했습니다. 자막이 활성화된 다른 영상을 시도해보세요.
          </p>
        )}
        
        {error.includes("네트워크 연결 오류") && (
          <div className="mt-2">
            <p className="bg-red-100/50 p-3 rounded-lg">
              YouTube API 서버에 연결할 수 없습니다. 인터넷 연결을 확인하거나 잠시 후 다시 시도해보세요.
            </p>
            <div className="bg-amber-50 border border-amber-100 p-3 mt-3 rounded-lg text-amber-800 text-xs">
              <p className="font-medium mb-1">다음을 확인해보세요:</p>
              <ul className="list-disc pl-4 mt-1 space-y-1.5">
                <li>인터넷 연결이 정상적으로 작동하는지 확인</li>
                <li>브라우저 콘솔에서 네트워크 오류 확인</li>
                <li>VPN이나 프록시를 사용 중이라면 일시적으로 해제 후 시도</li>
                <li>다른 브라우저로 시도해보기</li>
                <li>다른 영상으로 시도해보기</li>
              </ul>
            </div>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
