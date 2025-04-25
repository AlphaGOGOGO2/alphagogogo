
import { Card } from "@/components/ui/card";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useCommunityChat } from "@/hooks/useCommunityChat";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, InfoIcon } from "lucide-react";
import { toast } from "sonner";

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
    diagnoseConnectionStatus,
    reconnect
  } = useCommunityChat();
  
  const [isVisible, setIsVisible] = useState(false);
  const [showDiagnosisInfo, setShowDiagnosisInfo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleReconnect = () => {
    toast.info("채팅 서버에 재연결 시도 중...");
    reconnect();
  };
  
  const handleDiagnose = async () => {
    setShowDiagnosisInfo(true);
    await diagnoseConnectionStatus();
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
              >
                <RefreshCw className="h-4 w-4" />
                재연결 시도
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-red-700"
                onClick={handleDiagnose}
              >
                <InfoIcon className="h-4 w-4" />
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
