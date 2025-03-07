
export interface ChatMessage {
  id: string;
  nickname: string;
  content: string;
  created_at: string;
  color: string;
}

export interface UserPresence {
  nickname: string;
  color: string;
  online_at: string;
}
