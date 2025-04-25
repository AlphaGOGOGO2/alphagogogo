
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Users, Wifi, WifiOff } from "lucide-react";

interface ChatHeaderProps {
  nickname: string;
  userColor: string;
  isConnected: boolean;
  activeUsersCount?: number;
}

export const ChatHeader: FC<ChatHeaderProps> = ({
  nickname,
  userColor,
  isConnected,
  activeUsersCount = 0,
}) => {
  return (
    <div className="bg-purple-50 p-4 rounded-t-lg border-b border-purple-100 flex justify-between items-center">
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-lg font-semibold text-purple-900">실시간 채팅</h2>
        
        <div className="flex items-center text-sm">
          {isConnected ? (
            <div className="flex items-center text-green-600" title="연결됨">
              <Wifi className="h-4 w-4 mr-1" />
              <span className="text-xs">연결됨</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600" title="연결 안됨">
              <WifiOff className="h-4 w-4 mr-1" />
              <span className="text-xs">연결 안됨</span>
            </div>
          )}
        </div>

        {activeUsersCount > 0 && (
          <div className="flex items-center text-sm text-purple-700">
            <Users className="h-4 w-4 mr-1" />
            <span>{activeUsersCount}명 접속 중</span>
          </div>
        )}
      </div>

      <div className="flex items-center">
        <div 
          className="h-4 w-4 rounded-full mr-2 shadow-sm"
          style={{ backgroundColor: userColor }}
        />
        <span className="text-sm font-medium text-purple-700">{nickname}</span>
      </div>
    </div>
  );
}
