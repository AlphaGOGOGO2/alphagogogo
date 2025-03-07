
import { FC, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { MessageBubble } from "./MessageBubble";

interface ChatMessage {
  id: string;
  nickname: string;
  content: string;
  created_at: string;
  color: string;
}

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export const MessageList: FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom only when new messages are added
  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      scrollToBottom();
    }
  }, [messages.length, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 animate-fade-in">
        <p>아직 메시지가 없습니다.</p>
        <p>첫 메시지를 보내보세요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((msg, index) => (
        <div 
          key={msg.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <MessageBubble
            nickname={msg.nickname}
            content={msg.content}
            timestamp={msg.created_at}
            color={msg.color}
          />
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
