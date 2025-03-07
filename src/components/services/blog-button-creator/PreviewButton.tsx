
import React from "react";
import { ButtonStyle } from "./BlogButtonCreator";
import { getButtonStyles, getButtonClass } from "./utils/buttonStyleUtils";
import { ZoomIn } from "lucide-react";

interface PreviewButtonProps {
  buttonStyle: ButtonStyle;
}

export function PreviewButton({ buttonStyle }: PreviewButtonProps) {
  return (
    <a 
      href={buttonStyle.url} 
      style={getButtonStyles(buttonStyle)}
      className={getButtonClass(buttonStyle)}
      target="_blank" 
      rel="noopener noreferrer"
      onClick={(e) => e.preventDefault()}
    >
      {buttonStyle.buttonTypes.includes('grow') && (
        <ZoomIn className="mr-1" size={16} />
      )}
      {buttonStyle.text}
    </a>
  );
}
