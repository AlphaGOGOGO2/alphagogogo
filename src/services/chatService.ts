
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/types/chat";

export const fetchRecentMessages = async (): Promise<ChatMessage[]> => {
  const { data, error } = await supabase
    .from('community_messages')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(50) as { data: ChatMessage[] | null, error: any };
    
  if (error) throw error;
  
  return data || [];
};

export const sendChatMessage = async (
  messageId: string,
  nickname: string,
  content: string,
  color: string
): Promise<void> => {
  const { error } = await supabase
    .from('community_messages')
    .insert({
      id: messageId,
      nickname,
      content,
      color
    } as any);
    
  if (error) throw error;
};
