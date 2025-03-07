
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { v4 as uuidv4 } from "uuid";
import { Send, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ChatMessage {
  id: string;
  nickname: string;
  content: string;
  created_at: string;
  color: string;
}

export function CommunityChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userColor, setUserColor] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Generate random nickname and color when component mounts
  useEffect(() => {
    const randomNickname = `익명${Math.floor(Math.random() * 10000)}`;
    setNickname(randomNickname);
    
    // Generate a random pastel color
    const hue = Math.floor(Math.random() * 360);
    const pastelColor = `hsl(${hue}, 70%, 80%)`;
    setUserColor(pastelColor);
    
    // Load recent messages
    loadRecentMessages();
    
    // Subscribe to new messages
    const channel = supabase
      .channel('public:community_messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'community_messages' 
        }, 
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages(prev => [...prev, newMsg]);
        })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadRecentMessages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('community_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50) as { data: ChatMessage[] | null, error: any };
        
      if (error) throw error;
      
      if (data) {
        setMessages(data);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "메시지 로딩 실패",
        description: "최근 메시지를 불러오는데 실패했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const messageId = uuidv4();
    const tempMessage: ChatMessage = {
      id: messageId,
      nickname,
      content: newMessage,
      created_at: new Date().toISOString(),
      color: userColor
    };
    
    // Optimistically add message to UI
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage("");
    
    try {
      const { error } = await supabase
        .from('community_messages')
        .insert({
          id: messageId,
          nickname,
          content: newMessage,
          color: userColor
        } as any);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "메시지 전송 실패",
        description: "메시지를 전송하는데 실패했습니다. 다시 시도해주세요.",
        variant: "destructive"
      });
      
      // Remove the optimistically added message
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const changeNickname = () => {
    const newNickname = prompt("새로운 닉네임을 입력하세요:", nickname);
    if (newNickname && newNickname.trim()) {
      setNickname(newNickname.trim());
      toast({
        title: "닉네임 변경 완료",
        description: `닉네임이 ${newNickname.trim()}(으)로 변경되었습니다.`
      });
    }
  };

  return (
    <Card className="shadow-lg border-purple-100">
      <div className="bg-purple-50 p-4 rounded-t-lg border-b border-purple-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-purple-900">실시간 채팅</h2>
        <div className="flex items-center">
          <div 
            className="h-4 w-4 rounded-full mr-2"
            style={{ backgroundColor: userColor }}
          ></div>
          <span className="text-sm font-medium text-purple-700 mr-2">{nickname}</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={changeNickname}
            className="text-xs bg-white hover:bg-purple-50"
          >
            닉네임 변경
          </Button>
        </div>
      </div>
      
      <div className="p-4 h-[500px] overflow-y-auto bg-white">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>아직 메시지가 없습니다.</p>
            <p>첫 메시지를 보내보세요!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, index) => (
              <div key={msg.id} className="flex flex-col">
                <div className="flex items-start gap-2">
                  <div 
                    className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: msg.color }}
                  >
                    {msg.nickname.substring(0, 1)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline">
                      <span className="font-medium mr-2">{msg.nickname}</span>
                      <span className="text-xs text-gray-500">{formatTime(msg.created_at)}</span>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-2 mt-1 text-gray-800 inline-block">
                      {msg.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <form onSubmit={sendMessage} className="p-4 border-t border-purple-100 bg-white rounded-b-lg">
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
    </Card>
  );
}
