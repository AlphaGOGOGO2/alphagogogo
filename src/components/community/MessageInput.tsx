
import { FC, FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

export const MessageInput: FC<MessageInputProps> = ({ onSendMessage }) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    onSendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-purple-100 bg-white rounded-b-lg">
      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="flex-1"
        />
        <Button type="submit" disabled={!newMessage.trim()}>
          <Send className="h-4 w-4" />
          <span className="sr-only">전송</span>
        </Button>
      </div>
    </form>
  );
};
