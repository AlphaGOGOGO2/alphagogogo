
import { ButtonStyle } from "./BlogButtonCreator";

interface ButtonPreviewProps {
  buttonStyle: ButtonStyle;
}

export function ButtonPreview({ buttonStyle }: ButtonPreviewProps) {
  // Generate CSS for the button based on current styles
  const getButtonStyles = () => {
    let styles = {
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
      transition: 'all 0.2s ease',
    };

    // Apply style based on button type
    switch (buttonStyle.buttonType) {
      case 'primary':
        styles = {
          ...styles,
          backgroundColor: buttonStyle.backgroundColor,
          border: 'none',
        };
        break;
      case 'outline':
        styles = {
          ...styles,
          backgroundColor: 'transparent',
          border: `2px solid ${buttonStyle.backgroundColor}`,
          color: buttonStyle.backgroundColor,
        };
        break;
      case 'ghost':
        styles = {
          ...styles,
          backgroundColor: 'transparent',
          border: 'none',
          color: buttonStyle.backgroundColor,
        };
        break;
      case 'link':
        styles = {
          ...styles,
          backgroundColor: 'transparent',
          border: 'none',
          color: buttonStyle.backgroundColor,
          padding: '0',
          textDecoration: 'underline',
          textUnderlineOffset: '4px',
        };
        break;
    }

    // Add box shadow if enabled
    if (buttonStyle.boxShadow && buttonStyle.buttonType !== 'link') {
      styles = {
        ...styles,
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
      };
    }

    return styles;
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl border border-purple-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">버튼 미리보기</h3>
      
      <div className="bg-gray-100 rounded-md p-8 flex items-center justify-center min-h-[200px]">
        <a 
          href={buttonStyle.url} 
          style={getButtonStyles()}
          className={buttonStyle.hoverEffect ? "hover:opacity-90" : ""}
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => e.preventDefault()}
        >
          {buttonStyle.text}
        </a>
      </div>
      
      <p className="text-sm text-gray-500 mt-4">
        미리보기에서는 클릭이 작동하지 않습니다. 생성된 HTML 코드를 블로그에 붙여넣기 하면 링크가 활성화됩니다.
      </p>
    </div>
  );
}
