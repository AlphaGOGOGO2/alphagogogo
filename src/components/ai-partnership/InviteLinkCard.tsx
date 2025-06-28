
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, User, Clock, MousePointer } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface InviteLink {
  id: string;
  service_name: string;
  invite_url: string;
  user_nickname: string;
  description: string | null;
  click_count: number;
  created_at: string;
  updated_at: string;
}

interface InviteLinkCardProps {
  link: InviteLink;
  onLinkClick: (linkId: string) => void;
}

export function InviteLinkCard({ link, onLinkClick }: InviteLinkCardProps) {
  const handleClick = () => {
    onLinkClick(link.id);
    window.open(link.invite_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="hover:shadow-md transition-shadow h-full">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <User size={16} className="text-gray-500 flex-shrink-0" />
          <span className="font-semibold text-gray-900 truncate">
            {link.user_nickname}
          </span>
        </div>
        
        {link.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
            {link.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>
              {formatDistanceToNow(new Date(link.created_at), { 
                addSuffix: true, 
                locale: ko 
              })}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <MousePointer size={12} />
            <span>클릭 {link.click_count}회</span>
          </div>
        </div>
        
        <Button
          onClick={handleClick}
          className="w-full bg-purple-600 hover:bg-purple-700 mt-auto"
          size="sm"
        >
          <ExternalLink size={14} className="mr-1" />
          초대링크 이용
        </Button>
      </CardContent>
    </Card>
  );
}
