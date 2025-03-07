
import { MessageCircle, ExternalLink, Mail } from "lucide-react";

interface CommunityIconProps {
  categoryName: string;
}

export function CommunityIcon({ categoryName }: CommunityIconProps) {
  switch (categoryName) {
    case "실시간 채팅":
      return <MessageCircle size={16} />;
    case "오픈 채팅방":
      return <ExternalLink size={16} />;
    case "비즈니스 문의":
      return <Mail size={16} />;
    default:
      return null;
  }
}
