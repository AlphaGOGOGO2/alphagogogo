
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
  <!-- 구글 애드센스 스크립트 코드 (이 부분은 실제 구글 애드센스 계정 코드로 교체해야 합니다) -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
</head>
<body>
  <div class="button-container">
    <!-- 아래 버튼 코드를 복사하여 블로그에 붙여넣기 하세요 -->
    <a href="${buttonStyle.url}" class="button-link" style="${stylesString}" target="_blank" rel="noopener noreferrer" onclick="showAdBeforeRedirect(event, '${buttonStyle.url}')">
      ${buttonStyle.text}
    </a>
  </div>

  <script>
    function showAdBeforeRedirect(event, url) {
      event.preventDefault();
      
      // 구글 애드센스 광고를 표시하기 위한 코드
      // 참고: 이 함수는 실제 구글 애드센스 계정 및 설정에 맞게 수정되어야 합니다
      
      // 예시: 애드센스 광고 표시 (이 부분은 실제 애드센스 코드로 대체되어야 함)
      try {
        // 인터스티셜 광고 표시를 위한 예시 코드
        // 실제로는 구글 애드센스 계정에서 제공하는 코드로 대체해야 합니다
        (adsbygoogle = window.adsbygoogle || []).push({});
        
        // 광고 노출 후 3초 뒤에 URL로 이동
        setTimeout(function() {
          window.open(url, '_blank');
        }, 3000);
      } catch (e) {
        console.error('광고 표시 중 오류:', e);
        // 오류 발생 시 바로 URL로 이동
        window.open(url, '_blank');
      }
    }
  </script>
  
  <!-- 구글 애드센스 광고 단위 코드 예시 (이 부분은 실제 광고 단위 코드로 교체해야 합니다) -->
  <ins class="adsbygoogle"
       style="display:none"
       data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
       data-ad-slot="XXXXXXXXXX"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
</body>
</html>`;
};

/**
 * Generates just the button code for direct use
 */
export const generateButtonCode = (buttonStyle: ButtonStyle, buttonClass: string, stylesString: string, cssStyles: string): string => {
  return `<div class="button-container">
  <a href="${buttonStyle.url}" class="button-link" style="${stylesString}" target="_blank" rel="noopener noreferrer" onclick="showAdBeforeRedirect(event, '${buttonStyle.url}')">
    ${buttonStyle.text}
  </a>
</div>

<style>
${cssStyles}
</style>

<!-- 구글 애드센스 스크립트 (이 부분은 실제 구글 애드센스 계정 코드로 교체해야 합니다) -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>

<script>
  function showAdBeforeRedirect(event, url) {
    event.preventDefault();
    
    // 구글 애드센스 광고를 표시하기 위한 코드
    try {
      // 인터스티셜 광고 표시 (이 부분은 실제 애드센스 코드로 대체해야 함)
      (adsbygoogle = window.adsbygoogle || []).push({});
      
      // 광고 노출 후 3초 뒤에 URL로 이동
      setTimeout(function() {
        window.open(url, '_blank');
      }, 3000);
    } catch (e) {
      console.error('광고 표시 중 오류:', e);
      // 오류 발생 시 바로 URL로 이동
      window.open(url, '_blank');
    }
  }
</script>

<!-- 구글 애드센스 광고 단위 (이 부분은 실제 광고 단위 코드로 교체해야 합니다) -->
<ins class="adsbygoogle"
     style="display:none"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>`;
};
