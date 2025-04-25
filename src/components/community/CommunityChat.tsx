
import { Card } from "@/components/ui/card";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useCommunityChat } from "@/hooks/useCommunityChat";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, InfoIcon, Activity, Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function CommunityChat() {
  const {
    messages,
    isLoading,
    nickname,
    userColor,
    sendMessage,
    changeNickname,
    activeUsersCount,
    connectionState,
    connectionDiagnosis,
    connectionQuality,
    diagnoseConnectionStatus,
    reconnect
  } = useCommunityChat();
  
  const [isVisible, setIsVisible] = useState(false);
  const [showDiagnosisInfo, setShowDiagnosisInfo] = useState(false);
  const [lastReconnectTime, setLastReconnectTime] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleReconnect = () => {
    // 재연결 쿨다운 체크 (10초)
    const now = Date.now();
    if (lastReconnectTime && now - lastReconnectTime < 10000) {
      const remainingSecs = Math.ceil((10000 - (now - lastReconnectTime)) / 1000);
      toast.info(`잠시 후 다시 시도해주세요 (${remainingSecs}초 후 가능)`);
      return;
    }
    
    setLastReconnectTime(now);
    toast.info("채팅 서버에 재연결 시도 중...");
    reconnect();
  };
  
  const handleDiagnose = async () => {
    // 진단 쿨다운 체크 (5초)
    const now = Date.now();
    if (lastReconnectTime && now - lastReconnectTime < 5000) {
      const remainingSecs = Math.ceil((5000 - (now - lastReconnectTime)) / 1000);
      toast.info(`잠시 후 다시 시도해주세요 (${remainingSecs}초 후 가능)`);
      return;
    }
    
    setLastReconnectTime(now);
    setShowDiagnosisInfo(true);
    await diagnoseConnectionStatus();
  };

  const getConnectionQualityIndicator = () => {
    if (connectionState !== 'connected') return null;
    
    let color = '';
    let label = '';
    let icon = null;
    
    switch (connectionQuality) {
      case 'good':
        color = 'text-green-600';
        label = '양호';
        icon = <Wifi className="h-4 w-4 mr-1" />;
        break;
      case 'acceptable':
        color = 'text-yellow-600';
        label = '보통';
        icon = <Wifi className="h-4 w-4 mr-1" />;
        break;
      case 'poor':
        color = 'text-orange-600';
        label = '불안정';
        icon = <WifiOff className="h-4 w-4 mr-1" />;
        break;
      default:
        return null;
    }
    
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center ${color} ml-2 cursor-help`}>
            {icon}
            <span className="text-xs">{label}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">연결 품질: {label}. {
            connectionQuality === 'poor' ? '불안정한 연결 상태입니다. 재연결을 시도해보세요.' :
            connectionQuality === 'acceptable' ? '보통의 연결 상태입니다.' : 
            '양호한 연결 상태입니다.'
          }</p>
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <Card className={`shadow-lg border-purple-100 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <ChatHeader 
        nickname={nickname} 
        userColor={userColor} 
        onChangeNickname={changeNickname} 
        activeUsersCount={activeUsersCount}
        connectionState={connectionState}
        onReconnect={handleReconnect}
        onDiagnoseConnection={handleDiagnose}
        connectionQualityIndicator={getConnectionQualityIndicator()}
      />
      
      <div className="p-4 h-[500px] overflow-y-auto bg-white relative">
        {connectionState === 'error' && (
          <div className="flex flex-col items-center justify-center p-4 mb-4 bg-red-50 text-red-800 rounded-md">
            <div className="flex items-center mb-2">
              <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
              <p className="font-medium">채팅 서버와의 연결이 끊어졌습니다</p>
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2 border-red-300 hover:bg-red-50"
                onClick={handleReconnect}
                disabled={lastReconnectTime && Date.now() - lastReconnectTime < 10000}
              >
                <RefreshCw className={`h-4 w-4 ${lastReconnectTime && Date.now() - lastReconnectTime < 10000 ? 'animate-spin' : ''}`} />
                재연결 시도
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-red-700"
                onClick={handleDiagnose}
                disabled={lastReconnectTime && Date.now() - lastReconnectTime < 5000}
              >
                <Activity className="h-4 w-4" />
                연결 상태 진단
              </Button>
            </div>
            
            {connectionDiagnosis && showDiagnosisInfo && (
              <div className="mt-3 text-sm p-2 bg-red-100 rounded w-full">
                <p className="text-red-800">{connectionDiagnosis}</p>
              </div>
            )}
          </div>
        )}
        
        {connectionState === 'connecting' && (
          <div className="flex flex-col items-center justify-center p-4 mb-4 bg-yellow-50 text-yellow-800 rounded-md">
            <p className="mb-2">채팅 서버에 연결 중입니다...</p>
            <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <MessageList messages={messages} isLoading={isLoading} />
      </div>
      
      <MessageInput 
        onSendMessage={sendMessage} 
        disabled={connectionState !== 'connected'} 
      />
    </Card>
  );
}
