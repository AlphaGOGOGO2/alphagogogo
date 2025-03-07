
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonStyle } from "./BlogButtonCreator";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface ButtonCodeDisplayProps {
  buttonStyle: ButtonStyle;
}

export function ButtonCodeDisplay({ buttonStyle }: ButtonCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  // Generate the HTML button code
  const generateButtonHtml = () => {
    // Create CSS styles
    let styles = "";
    
    // Add animation keyframes for shiny button
    let keyframes = "";
    if (buttonStyle.buttonTypes.includes('shiny')) {
      keyframes = `
        @keyframes shiny {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `;
    }
    
    // Basic styles for all button types
    let baseStyles = `
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: ${buttonStyle.fontSize}px;
      font-weight: 500;
      padding: ${buttonStyle.padding};
      border-radius: ${buttonStyle.borderRadius}px;
      text-decoration: none;
      font-family: sans-serif;
      cursor: pointer;
      transition: all 0.3s ease;
    `;
    
    // Apply styles based on button types
    const types = buttonStyle.buttonTypes;
    
    // Base appearance (primary, outline, ghost)
    if (types.includes('primary')) {
      styles = `
        ${baseStyles}
        background-color: ${buttonStyle.backgroundColor};
        color: ${buttonStyle.textColor};
        border: none;
      `;
    } else if (types.includes('outline')) {
      styles = `
        ${baseStyles}
        background-color: transparent;
        color: ${buttonStyle.backgroundColor};
        border: 2px solid ${buttonStyle.backgroundColor};
      `;
    } else if (types.includes('ghost')) {
      styles = `
        ${baseStyles}
        background-color: transparent;
        color: ${buttonStyle.backgroundColor};
        border: none;
      `;
    }
    
    // Link style
    if (types.includes('link')) {
      styles = `
        ${baseStyles}
        background-color: transparent;
        color: ${buttonStyle.backgroundColor};
        padding: 0;
        text-decoration: underline;
        text-underline-offset: 4px;
        border: none;
      `;
    }
    
    // Full Width
    if (types.includes('fullWidth')) {
      styles += `
        width: 100%;
        padding: 12px 20px;
      `;
    }
    
    // Hover effect
    if (buttonStyle.hoverEffect) {
      styles += `
        :hover { opacity: 0.9; }
      `;
    }
    
    // Box shadow
    if (buttonStyle.boxShadow && !types.includes('link')) {
      styles += `
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
      `;
    }
    
    // Shiny effect
    if (types.includes('shiny')) {
      styles += `
        position: relative;
        overflow: hidden;
        z-index: 1;
        background-image: linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
        background-size: 200% 100%;
        background-position: -100% 0;
        animation: shiny 3s infinite linear;
      `;
    }
    
    // Grow effect
    if (types.includes('grow')) {
      styles += `
        transform: scale(1);
        transition: transform 0.3s ease;
      `;
      
      if (!styles.includes(':hover')) {
        styles += `
          :hover { transform: scale(1.05); }
        `;
      } else {
        // If we already have a hover effect, add to it
        styles = styles.replace(':hover { opacity: 0.9; }', ':hover { opacity: 0.9; transform: scale(1.05); }');
      }
    }

    // Clean up the CSS (remove extra whitespace)
    styles = styles
      .replace(/\n/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Add keyframes if needed
    let htmlWithStyle = '';
    if (keyframes) {
      htmlWithStyle = `<style>\n${keyframes}\n</style>\n`;
      keyframes = keyframes.replace(/\n/g, '').replace(/\s+/g, ' ').trim();
    }

    // Create HTML button with inline styles
    htmlWithStyle += `<a href="${buttonStyle.url}" style="${styles}" target="_blank" rel="noopener noreferrer">${buttonStyle.text}</a>`;

    return htmlWithStyle;
  };

  const buttonHtmlCode = generateButtonHtml();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(buttonHtmlCode)
      .then(() => {
        setCopied(true);
        toast.success("HTML 코드가 클립보드에 복사되었습니다!");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error("클립보드 복사 실패:", err);
        toast.error("복사하는데 실패했습니다. 수동으로 복사해 주세요.");
      });
  };

  return (
    <div className="rounded-lg border bg-gray-50 border-gray-200">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-100">
        <span className="text-sm font-medium text-gray-600">HTML 코드</span>
        <Button
          size="sm"
          variant="ghost"
          onClick={copyToClipboard}
          className="h-8 px-2 text-gray-600"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-1" /> 복사됨
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-1" /> 복사
            </>
          )}
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono text-gray-800 bg-gray-50 max-h-60">
        {buttonHtmlCode}
      </pre>
    </div>
  );
}
