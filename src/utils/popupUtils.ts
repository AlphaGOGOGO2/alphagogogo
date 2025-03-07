
import { toast } from "@/hooks/use-toast";

/**
 * 인앱 알림 메시지를 표시하고 특정 액션을 수행하는 유틸리티 함수
 */
export function openInfoPopup(options: {
  title: string;
  message: string;
  action?: 'link' | 'email';
  actionData?: string;
}) {
  const { title, message, action, actionData } = options;
  
  // Toast 알림 표시
  return toast({
    title: title,
    description: message,
    variant: "default",
    duration: 5000, // 5초 후 자동으로 닫힘
    action: action && actionData ? (
      <button
        onClick={() => {
          if (action === 'link') {
            window.location.href = actionData;
          } else if (action === 'email') {
            window.open(`mailto:${actionData}`, "_blank");
          }
        }}
        className="rounded bg-gradient-to-r from-purple-600 to-purple-500 px-3 py-2 text-sm font-medium text-white hover:from-purple-700 hover:to-purple-600 transition-colors"
      >
        {action === 'link' ? '채팅방 참여하기' : '이메일 보내기'}
      </button>
    ) : undefined,
  });
}
