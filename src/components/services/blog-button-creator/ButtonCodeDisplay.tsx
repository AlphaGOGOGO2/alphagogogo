
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { ButtonStyle } from "./BlogButtonCreator";
import { getButtonStyles, getButtonClass } from "./utils/buttonStyleUtils";
import { ButtonAnimationStyles } from "./ButtonAnimationStyles";

interface ButtonCodeDisplayProps {
  buttonStyle: ButtonStyle;
}

export function ButtonCodeDisplay({ buttonStyle }: ButtonCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  
  const buttonStyles = getButtonStyles(buttonStyle);
  const buttonClass = getButtonClass(buttonStyle);
  
  // Convert style object to inline CSS string
  const styleToString = (style: Record<string, any>): string => {
    return Object.keys(style)
      .filter(key => style[key] !== undefined && style[key] !== null)
      .map(key => {
        // Convert camelCase to kebab-case
        const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        return `${cssKey}: ${style[key]};`;
      })
      .join(" ");
  };
  
  // Generate class attribute if there are any classes
  const classAttribute = buttonClass.trim() ? ` class="${buttonClass.trim()}"` : '';
  
  // Generate the HTML button tag
  const buttonHtml = `<a href="${buttonStyle.url}" style="${styleToString(buttonStyles)}"${classAttribute}>
  ${buttonStyle.text}
</a>`;

  // Generate the CSS styles
  const cssStyles = `
/* 버튼 스타일 */
.button-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  font-weight: medium;
  color: ${buttonStyle.textColor};
  font-size: ${buttonStyle.fontSize}px;
  border-radius: ${buttonStyle.borderRadius}px;
  padding: ${buttonStyle.padding};
${buttonStyle.buttonTypes.includes('primary') ? `  background-color: ${buttonStyle.backgroundColor};
  border: none;` : ''}
${buttonStyle.buttonTypes.includes('outline') ? `  background-color: transparent;
  border: 2px solid ${buttonStyle.backgroundColor};
  color: ${buttonStyle.backgroundColor};` : ''}
${buttonStyle.buttonTypes.includes('ghost') ? `  background-color: transparent;
  border: none;
  color: ${buttonStyle.backgroundColor};` : ''}
${buttonStyle.buttonTypes.includes('link') ? `  background-color: transparent;
  border: none;
  padding: 0;
  color: ${buttonStyle.backgroundColor};
  text-decoration: underline;
  text-underline-offset: 4px;` : ''}
${buttonStyle.buttonTypes.includes('fullWidth') ? `  width: 100%;
  padding: 12px 20px;` : ''}
${buttonStyle.boxShadow && !buttonStyle.buttonTypes.includes('link') ? `  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);` : ''}
}

${buttonStyle.hoverEffect ? `
.button-link:hover {
  opacity: 0.9;
}` : ''}

${buttonStyle.buttonTypes.includes('grow') ? `
.button-link:hover {
  transform: scale(5);
}
.button-link:active {
  transform: scale(4);
}` : ''}

${buttonStyle.buttonTypes.includes('shiny') ? `
@keyframes shiny {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
.button-link {
  overflow: hidden;
  position: relative;
  z-index: 1;
  background-image: linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
  background-size: 200% 100%;
  background-position: -100% 0;
  animation: shiny 3s infinite linear;
}` : ''}
`;

  // Complete HTML code with CSS
  const completeHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>블로그 커스텀 버튼</title>
  <style>
${cssStyles}
  </style>
</head>
<body>
  <div>
    <!-- 아래 버튼 코드를 복사하여 블로그에 붙여넣기 하세요 -->
    <a href="${buttonStyle.url}" class="button-link" style="${styleToString(buttonStyles)}">
      ${buttonStyle.text}
    </a>
  </div>
</body>
</html>`;

  // Just the button code for direct use
  const justButtonCode = `<a href="${buttonStyle.url}" class="button-link" style="${styleToString(buttonStyles)}">
  ${buttonStyle.text}
</a>

<style>
${cssStyles}
</style>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(justButtonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-gray-800">HTML 코드</h3>
        <Button
          variant="default"
          size="sm"
          className="bg-purple-600 hover:bg-purple-700"
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check className="h-4 w-4 mr-1" />
          ) : (
            <Copy className="h-4 w-4 mr-1" />
          )}
          {copied ? "복사됨" : "코드 복사"}
        </Button>
      </div>
      
      <Card className="relative">
        <pre className="p-4 text-sm overflow-x-auto bg-gray-50 rounded-lg text-gray-800 border border-gray-200">
          <code>{justButtonCode}</code>
        </pre>
        <ButtonAnimationStyles />
      </Card>
    </div>
  );
}
