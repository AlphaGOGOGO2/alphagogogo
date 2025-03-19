
export interface GensparkInvite {
  id: string;
  nickname: string;
  message: string;
  invite_url: string;
  created_at: string;
  clicks: number;
}

export interface GensparkInviteClick {
  id: string;
  invite_id: string;
  client_id: string;
  created_at: string;
}
