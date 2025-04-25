
import { Card } from "@/components/ui/card";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useCommunityChat } from "@/hooks/useCommunityChat";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
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
    reconnect
  } = useCommunityChat();
  
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <Card className={`shadow-lg border-purple-100 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <ChatHeader 
        nickname={nickname} 
        userColor={userColor} 
        onChangeNickname={changeNickname} 
        activeUsersCount={activeUsersCount}
        connectionState={connectionState}
        onReconnect={handleReconnect}
      />
      
      <div className="p-4 h-[500px] overflow-y-auto bg-white">
        {connectionState === 'error' && (
          <div className="flex flex-col items-center justify-center p-4 mb-4 bg-red-50 text-red-800 rounded-md">
            <p className="mb-3">채팅 서버와의 연결이 끊어졌습니다.</p>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2 border-red-300 hover:bg-red-50"
              onClick={handleReconnect}
            >
              <RefreshCw className="h-4 w-4" />
              재연결 시도
            </Button>
          </div>
        )}
        <MessageList messages={messages} isLoading={isLoading} />
      </div>
      
      <MessageInput onSendMessage={sendMessage} disabled={connectionState !== 'connected'} />
    </Card>
  );
}
