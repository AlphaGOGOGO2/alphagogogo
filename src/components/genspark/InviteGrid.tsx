
import { GensparkInvite } from "@/types/genspark";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface InviteGridProps {
  invites: GensparkInvite[];
}

export function InviteGrid({ invites }: InviteGridProps) {
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("초대 링크가 클립보드에 복사되었습니다.");
  };

  if (invites.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-500">등록된 초대 링크가 없습니다.</p>
        <p className="text-sm text-gray-400 mt-2">첫 번째 초대 링크를 공유해 보세요!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {invites.map((invite) => (
        <Card key={invite.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="p-4 pb-2 bg-purple-50">
            <CardTitle className="text-lg font-medium truncate">
              {invite.nickname}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <p className="text-sm text-gray-600 mb-2 h-10 overflow-hidden">
              {invite.message}
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex flex-col gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => handleCopyLink(invite.invite_url)}
            >
              링크 복사하기
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full"
              onClick={() => window.open(invite.invite_url, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              바로 가기
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
