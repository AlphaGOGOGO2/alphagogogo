
import { ButtonStyle } from "../BlogButtonCreator";

/**
 * Generates the CSS styles for the button
 */
export const generateCssStyles = (buttonStyle: ButtonStyle): string => {
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
  margin: 0 auto; /* 가운데 정렬을 위한 스타일 */
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

/* 버튼 컨테이너 - 가운데 정렬을 위함 */
.button-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

${buttonStyle.hoverEffect ? `
.button-link:hover {
  opacity: 0.9;
}` : ''}

${buttonStyle.buttonTypes.includes('grow') ? `
.button-link:hover {
  transform: scale(2.0);
}
.button-link:active {
  transform: scale(1.8);
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
};
