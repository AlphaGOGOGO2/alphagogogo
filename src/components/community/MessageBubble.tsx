
import { FC } from "react";

interface MessageBubbleProps {
  nickname: string;
  content: string;
  timestamp: string;
  color: string;
}

export const MessageBubble: FC<MessageBubbleProps> = ({
  nickname,
  content,
  timestamp,
  color,
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-start gap-2">
        <div 
          className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: color }}
        >
          {nickname.substring(0, 1)}
        </div>
        <div className="flex-1">
          <div className="flex items-baseline">
            <span className="font-medium mr-2">{nickname}</span>
            <span className="text-xs text-gray-500">{formatTime(timestamp)}</span>
          </div>
          <div className="bg-gray-100 rounded-lg p-2 mt-1 text-gray-800 inline-block">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};
