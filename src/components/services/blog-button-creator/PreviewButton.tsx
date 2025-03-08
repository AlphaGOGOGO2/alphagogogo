
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
      }}
    >
      {buttonStyle.buttonTypes.includes('grow') && (
        <ZoomIn className="mr-1" size={16} />
      )}
      {buttonStyle.text}
    </a>
  );
}
