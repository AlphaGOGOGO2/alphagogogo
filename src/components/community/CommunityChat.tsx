
import { Card } from "@/components/ui/card";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useCommunityChat } from "@/hooks/useCommunityChat";

export function CommunityChat() {
  const {
    messages,
    isLoading,
    nickname,
    userColor,
    sendMessage,
    changeNickname
  } = useCommunityChat();

  return (
    <Card className="shadow-lg border-purple-100">
      <ChatHeader 
        nickname={nickname} 
        userColor={userColor} 
        onChangeNickname={changeNickname} 
      />
      
      <div className="p-4 h-[500px] overflow-y-auto bg-white">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>
      
      <MessageInput onSendMessage={sendMessage} />
    </Card>
  );
}
