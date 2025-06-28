
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
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <User size={16} className="text-gray-500 flex-shrink-0" />
              <span className="font-medium text-gray-900 truncate">
                {link.user_nickname}
              </span>
            </div>
            
            {link.description && (
              <p className="text-sm text-gray-600 mb-2 break-words">
                {link.description}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
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
          </div>
          
          <div className="flex-shrink-0">
            <Button
              onClick={handleClick}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
              size="sm"
            >
              <ExternalLink size={16} className="mr-1" />
              초대링크 이용
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
