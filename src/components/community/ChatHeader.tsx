
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface ChatHeaderProps {
  nickname: string;
  userColor: string;
  onChangeNickname: () => void;
  activeUsersCount?: number; // 선택적 접속자 수 prop 추가
}

export const ChatHeader: FC<ChatHeaderProps> = ({
  nickname,
  userColor,
  onChangeNickname,
  activeUsersCount = 0,
}) => {
  return (
    <div className="bg-purple-50 p-4 rounded-t-lg border-b border-purple-100 flex justify-between items-center">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold text-purple-900">실시간 채팅</h2>
        {activeUsersCount > 0 && (
          <div className="ml-3 flex items-center text-sm text-purple-700">
            <Users className="h-4 w-4 mr-1" />
            <span>{activeUsersCount}명 접속 중</span>
          </div>
        )}
      </div>
      <div className="flex items-center">
        <div 
          className="h-4 w-4 rounded-full mr-2"
          style={{ backgroundColor: userColor }}
        ></div>
        <span className="text-sm font-medium text-purple-700 mr-2">{nickname}</span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onChangeNickname}
          className="text-xs bg-white hover:bg-purple-50"
        >
          닉네임 변경
        </Button>
      </div>
    </div>
  );
};
