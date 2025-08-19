/**
 * Blog Button Creator Service - 통합된 버튼 생성 서비스
 * 
 * 모든 버튼 관련 기능을 하나의 서비스로 통합하여 코드 중복 제거
 */

import { CSSProperties } from "react";

// 버튼 스타일 타입 정의를 export
export interface ButtonStyle {
  text: string;
  url: string;
  backgroundColor: string;
  textColor: string;
  fontSize: number;
  borderRadius: number;
  padding: string;
  buttonTypes: string[];
  hoverEffect: boolean;
  boxShadow: boolean;
}

// 버튼 스타일 객체 타입
export interface ButtonStyleObj {
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
  margin: string;
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
}

/**
 * 블로그 버튼 생성기 서비스
 */
export class BlogButtonCreatorService {
  /**
   * 스타일 객체를 인라인 CSS 문자열로 변환
   */
  static styleToString(style: Record<string, any>): string {
    return Object.keys(style)
      .filter(key => style[key] !== undefined && style[key] !== null)
      .map(key => {
        // camelCase를 kebab-case로 변환
        const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        return `${cssKey}: ${style[key]};`;
      })
      .join(" ");
  }

  /**
   * 버튼 스타일을 기반으로 CSS 스타일 생성
   */
  static getButtonStyles(buttonStyle: ButtonStyle): CSSProperties {
    const baseStyles: ButtonStyleObj = {
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
      margin: '0 auto',
    };

    // 버튼 타입에 따른 스타일 적용
    const styles = this.applyButtonTypeStyles(baseStyles, buttonStyle);
    
    // 박스 섀도우 적용
    if (buttonStyle.boxShadow && !buttonStyle.buttonTypes.includes('link')) {
      styles.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.15)';
    }

    return styles as CSSProperties;
  }

  /**
   * 버튼 타입에 따른 스타일 적용
   */
  private static applyButtonTypeStyles(styles: ButtonStyleObj, buttonStyle: ButtonStyle): ButtonStyleObj {
    const types = buttonStyle.buttonTypes;
    let updatedStyles = { ...styles };

    // 기본 외관 (primary, outline, ghost)
    if (types.includes('primary')) {
      updatedStyles = {
        ...updatedStyles,
        backgroundColor: buttonStyle.backgroundColor,
        border: 'none',
      };
    } else if (types.includes('outline')) {
      updatedStyles = {
        ...updatedStyles,
        backgroundColor: 'transparent',
        border: `2px solid ${buttonStyle.backgroundColor}`,
        color: buttonStyle.backgroundColor,
      };
    } else if (types.includes('ghost')) {
      updatedStyles = {
        ...updatedStyles,
        backgroundColor: 'transparent',
        border: 'none',
        color: buttonStyle.backgroundColor,
      };
    }

    // 링크 스타일
    if (types.includes('link')) {
      updatedStyles = {
        ...updatedStyles,
        backgroundColor: 'transparent',
        border: 'none',
        color: buttonStyle.backgroundColor,
        padding: '0',
        textDecoration: 'underline',
        textUnderlineOffset: '4px',
      };
    }

    // 전체 너비
    if (types.includes('fullWidth')) {
      updatedStyles = {
        ...updatedStyles,
        width: '100%',
        padding: '12px 20px',
      };
    }

    // 샤이니 효과
    if (types.includes('shiny')) {
      updatedStyles = {
        ...updatedStyles,
        overflow: 'hidden',
        position: 'relative',
        zIndex: '1',
        backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)`,
        backgroundSize: '200% 100%',
        backgroundPosition: '-100% 0',
        animation: 'shiny 3s infinite linear',
      };
    }

    // 확대 효과
    if (types.includes('grow')) {
      updatedStyles = {
        ...updatedStyles,
        transition: 'transform 0.3s ease',
      };
    }

    return updatedStyles;
  }

  /**
   * 버튼 CSS 클래스 생성
   */
  static getButtonClass(buttonStyle: ButtonStyle): string {
    let className = buttonStyle.hoverEffect ? "hover:opacity-90 " : "";
    
    if (buttonStyle.buttonTypes.includes('grow')) {
      className += "hover:scale-500 active:scale-400 ";
    }
    
    if (buttonStyle.buttonTypes.includes('shiny')) {
      className += "shiny-button ";
    }
    
    return className.trim();
  }

  /**
   * CSS 스타일 문자열 생성
   */
  static generateCssStyles(buttonStyle: ButtonStyle): string {
    return `
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
  margin: 0 auto;
${this.generateButtonTypeStyles(buttonStyle)}
${buttonStyle.boxShadow && !buttonStyle.buttonTypes.includes('link') ? '  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);' : ''}
}

/* 버튼 컨테이너 */
.button-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

${this.generateHoverEffects(buttonStyle)}
${this.generateAnimationStyles(buttonStyle)}
`;
  }

  /**
   * 버튼 타입별 CSS 스타일 생성
   */
  private static generateButtonTypeStyles(buttonStyle: ButtonStyle): string {
    const types = buttonStyle.buttonTypes;
    let styles = '';

    if (types.includes('primary')) {
      styles += `  background-color: ${buttonStyle.backgroundColor};\n  border: none;\n`;
    } else if (types.includes('outline')) {
      styles += `  background-color: transparent;\n  border: 2px solid ${buttonStyle.backgroundColor};\n  color: ${buttonStyle.backgroundColor};\n`;
    } else if (types.includes('ghost')) {
      styles += `  background-color: transparent;\n  border: none;\n  color: ${buttonStyle.backgroundColor};\n`;
    }

    if (types.includes('link')) {
      styles += `  background-color: transparent;\n  border: none;\n  padding: 0;\n  color: ${buttonStyle.backgroundColor};\n  text-decoration: underline;\n  text-underline-offset: 4px;\n`;
    }

    if (types.includes('fullWidth')) {
      styles += `  width: 100%;\n  padding: 12px 20px;\n`;
    }

    return styles;
  }

  /**
   * 호버 효과 CSS 생성
   */
  private static generateHoverEffects(buttonStyle: ButtonStyle): string {
    let styles = '';

    if (buttonStyle.hoverEffect) {
      styles += `
.button-link:hover {
  opacity: 0.9;
}`;
    }

    if (buttonStyle.buttonTypes.includes('grow')) {
      styles += `
.button-link:hover {
  transform: scale(2.0);
}
.button-link:active {
  transform: scale(1.8);
}`;
    }

    return styles;
  }

  /**
   * 애니메이션 스타일 CSS 생성
   */
  private static generateAnimationStyles(buttonStyle: ButtonStyle): string {
    if (!buttonStyle.buttonTypes.includes('shiny')) return '';

    return `
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
}`;
  }

  /**
   * HTML 버튼 코드 생성
   */
  static generateButtonHtml(buttonStyle: ButtonStyle, buttonClass: string, stylesString: string): string {
    const classAttribute = buttonClass.trim() ? ` class="${buttonClass.trim()}"` : '';
    
    return `<a href="${buttonStyle.url}" style="${stylesString}"${classAttribute} target="_blank" rel="noopener noreferrer">
  ${buttonStyle.text}
</a>`;
  }

  /**
   * 완전한 HTML 코드 생성
   */
  static generateCompleteHtml(buttonStyle: ButtonStyle, buttonClass: string, stylesString: string, cssStyles: string): string {
    return `<!DOCTYPE html>
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
  <div class="button-container">
    <a href="${buttonStyle.url}" class="button-link" style="${stylesString}" target="_blank" rel="noopener noreferrer">
      ${buttonStyle.text}
    </a>
  </div>
</body>
</html>`;
  }

  /**
   * 블로그용 버튼 코드 생성 (최종)
   */
  static generateButtonCode(buttonStyle: ButtonStyle, buttonClass: string, stylesString: string, cssStyles: string): string {
    return `<div class="button-container">
  <a href="${buttonStyle.url}" class="button-link" style="${stylesString}" target="_blank" rel="noopener noreferrer">
    ${buttonStyle.text}
  </a>
</div>

<style>
${cssStyles}
</style>`;
  }

  /**
   * 완전한 버튼 생성 프로세스
   */
  static createButton(buttonStyle: ButtonStyle) {
    const buttonStyles = this.getButtonStyles(buttonStyle);
    const buttonClass = this.getButtonClass(buttonStyle);
    const stylesString = this.styleToString(buttonStyles);
    const cssStyles = this.generateCssStyles(buttonStyle);

    return {
      styles: buttonStyles,
      className: buttonClass,
      stylesString,
      cssStyles,
      html: this.generateButtonHtml(buttonStyle, buttonClass, stylesString),
      completeHtml: this.generateCompleteHtml(buttonStyle, buttonClass, stylesString, cssStyles),
      code: this.generateButtonCode(buttonStyle, buttonClass, stylesString, cssStyles)
    };
  }
}