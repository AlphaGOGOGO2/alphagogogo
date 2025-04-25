
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Users, RefreshCw, Wifi, WifiOff } from "lucide-react";

interface ChatHeaderProps {
  nickname: string;
  userColor: string;
  onChangeNickname: () => void;
  activeUsersCount?: number;
  connectionState?: 'disconnected' | 'connecting' | 'connected' | 'error';
}

export const ChatHeader: FC<ChatHeaderProps> = ({
  nickname,
  userColor,
  onChangeNickname,
  activeUsersCount = 0,
  connectionState = 'connected',
}) => {
  const getConnectionStatusDisplay = () => {
    switch (connectionState) {
      case 'connected':
        return (
          <div className="flex items-center text-green-600" title="연결됨">
            <Wifi className="h-4 w-4 mr-1" />
            <span className="text-xs">연결됨</span>
          </div>
        );
      case 'connecting':
        return (
          <div className="flex items-center text-yellow-600 animate-pulse" title="연결 중...">
            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
            <span className="text-xs">연결 중...</span>
          </div>
        );
      case 'disconnected':
      case 'error':
        return (
          <div className="flex items-center text-red-600" title="연결 안됨">
            <WifiOff className="h-4 w-4 mr-1" />
            <span className="text-xs">연결 안됨</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-purple-50 p-4 rounded-t-lg border-b border-purple-100 flex justify-between items-center transition-all duration-200 hover:bg-purple-100">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-purple-900">실시간 채팅</h2>
        {getConnectionStatusDisplay()}
        {activeUsersCount > 0 && (
          <div className="flex items-center text-sm text-purple-700 animate-pulse">
            <Users className="h-4 w-4 mr-1" />
            <span>{activeUsersCount}명 접속 중</span>
          </div>
        )}
      </div>
      <div className="flex items-center">
        <div 
          className="h-4 w-4 rounded-full mr-2 shadow-sm"
          style={{ backgroundColor: userColor }}
        ></div>
        <span className="text-sm font-medium text-purple-700 mr-2">{nickname}</span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onChangeNickname}
          className="text-xs bg-white hover:bg-purple-50 transition-colors duration-200"
        >
          닉네임 변경
        </Button>
      </div>
    </div>
  );
};
