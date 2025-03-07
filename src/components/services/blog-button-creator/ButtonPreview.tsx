import { ButtonStyle } from "./BlogButtonCreator";
import { CSSProperties } from "react";
import { ZoomIn } from "lucide-react";

interface ButtonPreviewProps {
  buttonStyle: ButtonStyle;
}

export function ButtonPreview({ buttonStyle }: ButtonPreviewProps) {
  // Define a type for our button styles with all possible properties
  type ButtonStyleObj = {
    color: string;
    fontSize: string;
    borderRadius: string;
    padding: string;
    display: string;
    alignItems: string;
    justifyContent: string;
    fontWeight: string;
    textDecoration: string;
    fontFamily: string;
    cursor: string;
    transition: string;
    backgroundColor?: string;
    border?: string;
    boxShadow?: string;
    textUnderlineOffset?: string;
    position?: "static" | "relative" | "absolute" | "fixed" | "sticky";
    overflow?: string;
    transform?: string;
    width?: string;
    animation?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    zIndex?: string;
  };

  // Generate CSS for the button based on current styles
  const getButtonStyles = () => {
    // Create the initial styles object with the type
    let styles: ButtonStyleObj = {
      color: buttonStyle.textColor,
      fontSize: `${buttonStyle.fontSize}px`,
      borderRadius: `${buttonStyle.borderRadius}px`,
      padding: buttonStyle.padding,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'medium',
      textDecoration: 'none',
      fontFamily: 'inherit',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    };

    // Apply styles based on button types
    const types = buttonStyle.buttonTypes;
    
    // Base appearance (primary, outline, ghost)
    if (types.includes('primary')) {
      styles = {
        ...styles,
        backgroundColor: buttonStyle.backgroundColor,
        border: 'none',
      };
    } else if (types.includes('outline')) {
      styles = {
        ...styles,
        backgroundColor: 'transparent',
        border: `2px solid ${buttonStyle.backgroundColor}`,
        color: buttonStyle.backgroundColor,
      };
    } else if (types.includes('ghost')) {
      styles = {
        ...styles,
        backgroundColor: 'transparent',
        border: 'none',
        color: buttonStyle.backgroundColor,
      };
    }
    
    // Link style
    if (types.includes('link')) {
      styles = {
        ...styles,
        backgroundColor: 'transparent',
        border: 'none',
        color: buttonStyle.backgroundColor,
        padding: '0',
        textDecoration: 'underline',
        textUnderlineOffset: '4px',
      };
    }
    
    // Full Width
    if (types.includes('fullWidth')) {
      styles = {
        ...styles,
        width: '100%',
        padding: '12px 20px',
      };
    }
    
    // Shiny effect
    if (types.includes('shiny')) {
      styles = {
        ...styles,
        overflow: 'hidden',
        position: 'relative',
        zIndex: '1',
        backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)`,
        backgroundSize: '200% 100%',
        backgroundPosition: '-100% 0',
        animation: 'shiny 3s infinite linear',
      };
    }
    
    // Grow effect is handled with CSS classes
    if (types.includes('grow')) {
      styles = {
        ...styles,
        transform: 'scale(1)',
        transition: 'transform 0.3s ease',
      };
    }

    // Add box shadow if enabled
    if (buttonStyle.boxShadow && !types.includes('link')) {
      styles = {
        ...styles,
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
      };
    }

    return styles as CSSProperties;
  };

  // Get CSS class for the button based on type
  const getButtonClass = () => {
    let className = buttonStyle.hoverEffect ? "hover:opacity-90 " : "";
    
    if (buttonStyle.buttonTypes.includes('grow')) {
      className += "hover:scale-500 active:scale-400 transform transition-transform duration-300 ";
    }
    
    if (buttonStyle.buttonTypes.includes('shiny')) {
      className += "shiny-button ";
    }
    
    return className;
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl border border-purple-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">버튼 미리보기</h3>
      
      <div className="bg-gray-100 rounded-md p-8 flex items-center justify-center min-h-[200px]">
        <style>
          {`
            @keyframes shiny {
              0% {
                background-position: -200% 0;
              }
              100% {
                background-position: 200% 0;
              }
            }
            .shiny-button {
              background-size: 200% 100%;
              background-position: -100% 0;
            }
            .hover\\:scale-500:hover {
              transform: scale(5);
            }
            .active\\:scale-400:active {
              transform: scale(4);
            }
          `}
        </style>
        <a 
          href={buttonStyle.url} 
          style={getButtonStyles()}
          className={getButtonClass()}
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => e.preventDefault()}
        >
          {buttonStyle.buttonTypes.includes('grow') && (
            <ZoomIn className="mr-1" size={16} />
          )}
          {buttonStyle.text}
        </a>
      </div>
      
      <p className="text-sm text-gray-500 mt-4">
        미리보기에서는 클릭이 작동하지 않습니다. 생성된 HTML 코드를 블로그에 붙여넣기 하면 링크가 활성화됩니다.
      </p>
    </div>
  );
}
