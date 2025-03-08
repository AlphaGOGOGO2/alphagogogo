
import { ButtonStyle } from "../BlogButtonCreator";

/**
 * Generates the HTML button code
 */
export const generateButtonHtml = (buttonStyle: ButtonStyle, buttonClass: string, stylesString: string): string => {
  // Generate class attribute if there are any classes
  const classAttribute = buttonClass.trim() ? ` class="${buttonClass.trim()}"` : '';
  
  return `<a href="${buttonStyle.url}" style="${stylesString}"${classAttribute} target="_blank" rel="noopener noreferrer">
  ${buttonStyle.text}
</a>`;
};

/**
 * Generates the complete HTML code with CSS
 */
export const generateCompleteHtml = (buttonStyle: ButtonStyle, buttonClass: string, stylesString: string, cssStyles: string): string => {
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
    <!-- 아래 버튼 코드를 복사하여 블로그에 붙여넣기 하세요 -->
    <a href="${buttonStyle.url}" class="button-link" style="${stylesString}" target="_blank" rel="noopener noreferrer">
      ${buttonStyle.text}
    </a>
  </div>
</body>
</html>`;
};

/**
 * Generates just the button code for direct use
 */
export const generateButtonCode = (buttonStyle: ButtonStyle, buttonClass: string, stylesString: string, cssStyles: string): string => {
  return `<div class="button-container">
  <a href="${buttonStyle.url}" class="button-link" style="${stylesString}" target="_blank" rel="noopener noreferrer">
    ${buttonStyle.text}
  </a>
</div>

<style>
${cssStyles}
</style>`;
};
