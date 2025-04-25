
import { FC, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Users, RefreshCw, Wifi, WifiOff, AlertTriangle, ActivityIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatHeaderProps {
  nickname: string;
  userColor: string;
  onChangeNickname: () => void;
  activeUsersCount?: number;
  connectionState?: 'disconnected' | 'connecting' | 'connected' | 'error';
  onReconnect?: () => void;
  onDiagnoseConnection?: () => void;
  connectionQualityIndicator?: ReactNode;
}

export const ChatHeader: FC<ChatHeaderProps> = ({
  nickname,
  userColor,
  onChangeNickname,
  activeUsersCount = 0,
  connectionState = 'connected',
  onReconnect,
  onDiagnoseConnection,
  connectionQualityIndicator
}) => {
  const getConnectionStatusDisplay = () => {
    switch (connectionState) {
      case 'connected':
        return (
          <div className="flex items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center text-green-600 cursor-help" title="연결됨">
                  <Wifi className="h-4 w-4 mr-1" />
                  <span className="text-xs">연결됨</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">실시간 채팅 서버에 정상적으로 연결되었습니다</p>
              </TooltipContent>
            </Tooltip>
            {connectionQualityIndicator}
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
        return (
          <div className="flex items-center gap-2">
            <div className="flex items-center text-orange-600" title="연결 안됨">
              <AlertTriangle className="h-4 w-4 mr-1" />
              <span className="text-xs">연결 안됨</span>
            </div>
            {onReconnect && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onReconnect}
                className="text-xs bg-white hover:bg-orange-50 transition-colors duration-200 h-6 px-2"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                재연결
              </Button>
            )}
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2">
            <div className="flex items-center text-red-600" title="연결 오류">
              <WifiOff className="h-4 w-4 mr-1" />
              <span className="text-xs">연결 오류</span>
            </div>
            <div className="flex gap-1">
              {onReconnect && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onReconnect}
                  className="text-xs bg-white hover:bg-red-50 transition-colors duration-200 h-6 px-2"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  재연결
                </Button>
              )}
              {onDiagnoseConnection && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onDiagnoseConnection}
                  className="text-xs bg-white hover:bg-gray-100 transition-colors duration-200 h-6 px-2"
                >
                  <ActivityIcon className="h-3 w-3 mr-1" />
                  진단
                </Button>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-purple-50 p-4 rounded-t-lg border-b border-purple-100 flex justify-between items-center transition-all duration-200 hover:bg-purple-100">
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-lg font-semibold text-purple-900">실시간 채팅</h2>
        {getConnectionStatusDisplay()}
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
