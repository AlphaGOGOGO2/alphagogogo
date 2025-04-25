
import { Card } from "@/components/ui/card";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useState, useEffect } from "react";
import { useChat } from "@/hooks/chat/useChat";
import { usePresence } from "@/hooks/chat/usePresence";
import { toast } from "sonner";

const getRandomNickname = () => `익명${Math.floor(Math.random() * 10000)}`;
const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 80%)`;
};

export function CommunityChat() {
  const [nickname] = useState(() => {
    const saved = localStorage.getItem('chat_nickname');
    const generated = saved || getRandomNickname();
    if (!saved) localStorage.setItem('chat_nickname', generated);
    return generated;
  });

  const [userColor] = useState(() => {
    const saved = localStorage.getItem('chat_color');
    const generated = saved || getRandomColor();
    if (!saved) localStorage.setItem('chat_color', generated);
    return generated;
  });

  const { 
    messages, 
    isLoading, 
    isConnected, 
    sendMessage,
    error: chatError
  } = useChat();

  const { 
    activeUsersCount, 
    isConnected: isPresenceConnected,
    error: presenceError
  } = usePresence(nickname, userColor);

  // 에러 처리
  useEffect(() => {
    if (chatError) {
      console.error("채팅 오류:", chatError);
      toast.error("채팅 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
    
    if (presenceError) {
      console.error("사용자 현황 오류:", presenceError);
    }
  }, [chatError, presenceError]);

  const handleSendMessage = async (content: string) => {
    try {
      await sendMessage(nickname, content, userColor);
    } catch (error) {
      console.error("메시지 전송 오류:", error);
      toast.error("메시지 전송에 실패했습니다.");
    }
  };

  return (
    <Card className="shadow-lg border-purple-100">
      <ChatHeader
        nickname={nickname}
        userColor={userColor}
        isConnected={isConnected && isPresenceConnected}
        activeUsersCount={activeUsersCount}
      />
      
      <div className="p-4 h-[500px] overflow-y-auto bg-white relative">
        <MessageList 
          messages={messages} 
          isLoading={isLoading} 
        />
      </div>
      
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={!isConnected}
      />
    </Card>
  );
}
