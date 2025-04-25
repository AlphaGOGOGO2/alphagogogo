
import { Card } from "@/components/ui/card";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useState } from "react";
import { useChat } from "@/hooks/chat/useChat";
import { usePresence } from "@/hooks/chat/usePresence";

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
    sendMessage 
  } = useChat();

  const { 
    activeUsersCount, 
    isConnected: isPresenceConnected 
  } = usePresence(nickname, userColor);

  const handleSendMessage = async (content: string) => {
    await sendMessage(nickname, content, userColor);
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
