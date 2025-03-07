
import { useState } from "react";
import { ButtonStyle } from "./BlogButtonCreator";
import { AlertCircle, Check, ClipboardCopy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ButtonCodeDisplayProps {
  buttonStyle: ButtonStyle;
}

export function ButtonCodeDisplay({ buttonStyle }: ButtonCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  
  const generateCSSStyles = () => {
    const { 
      backgroundColor, textColor, fontSize, borderRadius, 
      padding, boxShadow, buttonTypes
    } = buttonStyle;
    
    let css = `
/* 버튼 기본 스타일 */
.custom-blog-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-size: ${fontSize}px;
  font-weight: 500;
  text-decoration: none;
  border-radius: ${borderRadius}px;
  padding: ${padding};
  cursor: pointer;
  transition: all 0.3s ease;
`;
    
    // Apply base style (primary, outline, or ghost)
    if (buttonTypes.includes('primary')) {
      css += `
  background-color: ${backgroundColor};
  color: ${textColor};
  border: none;
`;
    } else if (buttonTypes.includes('outline')) {
      css += `
  background-color: transparent;
  color: ${backgroundColor};
  border: 2px solid ${backgroundColor};
`;
    } else if (buttonTypes.includes('ghost')) {
      css += `
  background-color: transparent;
  color: ${backgroundColor};
  border: none;
`;
    }
    
    // Add box shadow if enabled
    if (boxShadow && !buttonTypes.includes('link')) {
      css += `
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
`;
    }
    
    // Link style
    if (buttonTypes.includes('link')) {
      css += `
  background-color: transparent;
  border: none;
  color: ${backgroundColor};
  padding: 0;
  text-decoration: underline;
  text-underline-offset: 4px;
`;
    }
    
    // Full width
    if (buttonTypes.includes('fullWidth')) {
      css += `
  width: 100%;
  padding: 12px 20px;
`;
    }
    
    css += `
}`;
    
    // Hover effects
    if (buttonStyle.hoverEffect) {
      css += `

/* 호버 효과 */
.custom-blog-button:hover {
  opacity: 0.9;
}
`;
    }
    
    // Grow effect
    if (buttonTypes.includes('grow')) {
      css += `

/* 확대 효과 */
.custom-blog-button {
  transform: scale(1);
  transition: transform 0.3s ease;
}

.custom-blog-button:hover {
  transform: scale(5);
}

.custom-blog-button:active {
  transform: scale(4);
}
`;
    }
    
    // Shiny effect
    if (buttonTypes.includes('shiny')) {
      css += `

/* 반짝이는 효과 */
.custom-blog-button {
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.custom-blog-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transition: all 0.6s;
  z-index: -1;
}

.custom-blog-button:hover::before {
  left: 100%;
}
`;
    }
    
    return css;
  };
  
  const generateHTML = () => {
    const { text, url, buttonTypes } = buttonStyle;
    
    const includeIcon = buttonTypes.includes('grow');
    const iconHTML = includeIcon ? '<span style="margin-right: 4px;">⤢</span>' : '';
    
    return `<!DOCTYPE html>
<html>
<head>
  <style>
${generateCSSStyles()}
  </style>
</head>
<body>
  <a href="${url}" class="custom-blog-button" target="_blank" rel="noopener noreferrer">
    ${iconHTML}${text}
  </a>
</body>
</html>`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateHTML());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700">HTML 코드</h3>
        <Button 
          variant="outline" 
          size="sm"
          className="text-xs"
          onClick={copyToClipboard}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 mr-1" />
              복사됨
            </>
          ) : (
            <>
              <ClipboardCopy className="h-3 w-3 mr-1" />
              코드 복사
            </>
          )}
        </Button>
      </div>
      
      <ScrollArea className="h-60 w-full rounded-md border">
        <pre className="p-4 text-xs text-gray-800 bg-gray-50">
          <code>{generateHTML()}</code>
        </pre>
      </ScrollArea>
      
      <Alert variant="outline" className="bg-blue-50 border-blue-200 text-xs py-2">
        <AlertCircle className="h-3 w-3 text-blue-500" />
        <AlertDescription className="text-blue-700">
          HTML 코드를 복사하여 블로그나 웹사이트에 붙여넣으세요.
        </AlertDescription>
      </Alert>
    </div>
  );
}
