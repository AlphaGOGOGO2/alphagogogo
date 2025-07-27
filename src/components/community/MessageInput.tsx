
import { FC, FormEvent, useState, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { validateMessageContent, sanitizeText } from "@/utils/securityUtils";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const MessageInput: FC<MessageInputProps> = ({ onSendMessage, disabled = false }) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || disabled) return;

    // 메시지 유효성 검사
    const validation = validateMessageContent(newMessage);
    if (!validation.isValid) {
      // 에러는 부모 컴포넌트에서 처리하도록 onSendMessage로 전달
      return;
    }
    
    // 메시지 새니타이즈
    const sanitizedMessage = sanitizeText(newMessage);
    onSendMessage(sanitizedMessage);
    setNewMessage("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (newMessage.trim() && !disabled) {
        // 메시지 유효성 검사
        const validation = validateMessageContent(newMessage);
        if (!validation.isValid) {
          return;
        }
        
        // 메시지 새니타이즈
        const sanitizedMessage = sanitizeText(newMessage);
        onSendMessage(sanitizedMessage);
        setNewMessage("");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-purple-100 bg-white rounded-b-lg transition-all duration-200 focus-within:shadow-md">
      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "채팅 연결이 끊어졌습니다. 재연결 후 이용해주세요." : "메시지를 입력하세요..."}
          className={`flex-1 focus:ring-2 focus:ring-purple-200 transition-all duration-200 ${disabled ? 'bg-gray-100 text-gray-500' : ''}`}
          maxLength={500}
          disabled={disabled}
        />
        <Button 
          type="submit" 
          disabled={!newMessage.trim() || disabled}
          className="bg-purple-600 hover:bg-purple-700 transition-colors duration-200"
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">전송</span>
        </Button>
      </div>
      {disabled && (
        <p className="text-xs text-red-500 mt-1">채팅 서버와의 연결이 끊어졌습니다. 재연결 후 이용해주세요.</p>
      )}
    </form>
  );
};
