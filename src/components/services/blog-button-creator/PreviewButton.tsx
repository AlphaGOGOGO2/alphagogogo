
import React from "react";
import { ButtonStyle } from "./BlogButtonCreator";
import { getButtonStyles, getButtonClass } from "./utils/buttonStyleUtils";
import { ZoomIn } from "lucide-react";

interface PreviewButtonProps {
  buttonStyle: ButtonStyle;
}

export function PreviewButton({ buttonStyle }: PreviewButtonProps) {
  const buttonClass = getButtonClass(buttonStyle);
  
  return (
    <a 
      href={buttonStyle.url} 
      style={getButtonStyles(buttonStyle)}
      className={buttonClass}
      target="_blank" 
      rel="noopener noreferrer"
      onClick={(e) => {
        e.preventDefault(); // 미리보기에서는 실제 동작 방지
        // 실제로는 구글 애드센스 광고가 표시된 후 새 창에서 URL로 이동
      }}
    >
      {buttonStyle.buttonTypes.includes('grow') && (
        <ZoomIn className="mr-1" size={16} />
      )}
      {buttonStyle.text}
    </a>
  );
}
