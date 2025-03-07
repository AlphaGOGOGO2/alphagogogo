
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
    
    switch (buttonStyle.buttonType) {
      case 'primary':
        styles = `
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: ${buttonStyle.backgroundColor};
          color: ${buttonStyle.textColor};
          font-size: ${buttonStyle.fontSize}px;
          font-weight: 500;
          padding: ${buttonStyle.padding};
          border-radius: ${buttonStyle.borderRadius}px;
          text-decoration: none;
          font-family: sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          ${buttonStyle.boxShadow ? 'box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);' : ''}
          ${buttonStyle.hoverEffect ? ':hover { opacity: 0.9; }' : ''}
        `;
        break;
      case 'outline':
        styles = `
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: transparent;
          color: ${buttonStyle.backgroundColor};
          font-size: ${buttonStyle.fontSize}px;
          font-weight: 500;
          padding: ${buttonStyle.padding};
          border-radius: ${buttonStyle.borderRadius}px;
          text-decoration: none;
          font-family: sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 2px solid ${buttonStyle.backgroundColor};
          ${buttonStyle.boxShadow ? 'box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);' : ''}
          ${buttonStyle.hoverEffect ? ':hover { background-color: rgba(0, 0, 0, 0.05); }' : ''}
        `;
        break;
      case 'ghost':
        styles = `
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: transparent;
          color: ${buttonStyle.backgroundColor};
          font-size: ${buttonStyle.fontSize}px;
          font-weight: 500;
          padding: ${buttonStyle.padding};
          border-radius: ${buttonStyle.borderRadius}px;
          text-decoration: none;
          font-family: sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          ${buttonStyle.hoverEffect ? ':hover { background-color: rgba(0, 0, 0, 0.05); }' : ''}
        `;
        break;
      case 'link':
        styles = `
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: transparent;
          color: ${buttonStyle.backgroundColor};
          font-size: ${buttonStyle.fontSize}px;
          font-weight: 500;
          padding: 0;
          text-decoration: underline;
          text-underline-offset: 4px;
          font-family: sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          ${buttonStyle.hoverEffect ? ':hover { opacity: 0.7; }' : ''}
        `;
        break;
    }

    // Clean up the CSS (remove extra whitespace)
    styles = styles
      .replace(/\n/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Create HTML button with inline styles
    return `<a href="${buttonStyle.url}" style="${styles}" target="_blank" rel="noopener noreferrer">${buttonStyle.text}</a>`;
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
