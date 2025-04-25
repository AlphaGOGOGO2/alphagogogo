
import { Card } from "@/components/ui/card";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useCommunityChat } from "@/hooks/useCommunityChat";
import { useEffect, useState } from "react";

export function CommunityChat() {
  const {
    messages,
    isLoading,
    nickname,
    userColor,
    sendMessage,
    changeNickname,
    activeUsersCount,
    connectionState
  } = useCommunityChat();
  
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className={`shadow-lg border-purple-100 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <ChatHeader 
        nickname={nickname} 
        userColor={userColor} 
        onChangeNickname={changeNickname} 
        activeUsersCount={activeUsersCount}
        connectionState={connectionState}
      />
      
      <div className="p-4 h-[500px] overflow-y-auto bg-white">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>
      
      <MessageInput onSendMessage={sendMessage} />
    </Card>
  );
}
