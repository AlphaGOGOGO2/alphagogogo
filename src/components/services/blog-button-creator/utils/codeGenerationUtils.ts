
import { ButtonStyle } from "../BlogButtonCreator";

/**
 * Converts a style object to an inline CSS string
 */
export const styleToString = (style: Record<string, any>): string => {
  return Object.keys(style)
    .filter(key => style[key] !== undefined && style[key] !== null)
    .map(key => {
      // Convert camelCase to kebab-case
      const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      return `${cssKey}: ${style[key]};`;
    })
    .join(" ");
};

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

/* 전면 광고 스타일 */
.ad-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.ad-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 80%;
  text-align: center;
}

.ad-close {
  margin-top: 15px;
  padding: 8px 16px;
  background: #8B5CF6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
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

/**
 * Generates the HTML button code
 */
export const generateButtonHtml = (buttonStyle: ButtonStyle, buttonClass: string, stylesString: string): string => {
  // Generate class attribute if there are any classes
  const classAttribute = buttonClass.trim() ? ` class="${buttonClass.trim()}"` : '';
  
  return `<a href="${buttonStyle.url}" style="${stylesString}"${classAttribute} target="_blank" rel="noopener noreferrer" onclick="showAdAndOpenLink(event, '${buttonStyle.url}')">
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
    <a href="${buttonStyle.url}" class="button-link" style="${stylesString}" target="_blank" rel="noopener noreferrer" onclick="showAdAndOpenLink(event, '${buttonStyle.url}')">
      ${buttonStyle.text}
    </a>
  </div>

  <!-- 전면 광고 요소 -->
  <div class="ad-overlay" id="adOverlay">
    <div class="ad-content">
      <h2>광고</h2>
      <p>이 광고는 3초 후에 자동으로 닫힙니다.</p>
      <button class="ad-close" onclick="closeAd()">닫기</button>
    </div>
  </div>

  <script>
    function showAdAndOpenLink(event, url) {
      event.preventDefault();
      
      // 광고 표시
      const adOverlay = document.getElementById('adOverlay');
      adOverlay.style.display = 'flex';
      
      // 새 창에서 링크 열기
      window.open(url, '_blank');
      
      // 3초 후 광고 닫기
      setTimeout(() => {
        adOverlay.style.display = 'none';
      }, 3000);
    }
    
    function closeAd() {
      document.getElementById('adOverlay').style.display = 'none';
    }
  </script>
</body>
</html>`;
};

/**
 * Generates just the button code for direct use
 */
export const generateButtonCode = (buttonStyle: ButtonStyle, buttonClass: string, stylesString: string, cssStyles: string): string => {
  return `<div class="button-container">
  <a href="${buttonStyle.url}" class="button-link" style="${stylesString}" target="_blank" rel="noopener noreferrer" onclick="showAdAndOpenLink(event, '${buttonStyle.url}')">
    ${buttonStyle.text}
  </a>
</div>

<!-- 전면 광고 요소 -->
<div class="ad-overlay" id="adOverlay">
  <div class="ad-content">
    <h2>광고</h2>
    <p>이 광고는 3초 후에 자동으로 닫힙니다.</p>
    <button class="ad-close" onclick="closeAd()">닫기</button>
  </div>
</div>

<style>
${cssStyles}
</style>

<script>
  function showAdAndOpenLink(event, url) {
    event.preventDefault();
    
    // 광고 표시
    const adOverlay = document.getElementById('adOverlay');
    adOverlay.style.display = 'flex';
    
    // 새 창에서 링크 열기
    window.open(url, '_blank');
    
    // 3초 후 광고 닫기
    setTimeout(() => {
      adOverlay.style.display = 'none';
    }, 3000);
  }
  
  function closeAd() {
    document.getElementById('adOverlay').style.display = 'none';
  }
</script>`;
};
