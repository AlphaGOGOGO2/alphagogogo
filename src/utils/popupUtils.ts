
/**
 * 팝업창을 통해 알림 메시지를 표시하고 특정 액션을 수행하는 유틸리티 함수
 */
export function openInfoPopup(options: {
  title: string;
  message: string;
  action?: 'link' | 'email';
  actionData?: string;
}) {
  const { title, message, action, actionData } = options;
  
  // 팝업창 설정
  const width = 400;
  const height = 250;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;
  
  const popup = window.open(
    "about:blank",
    "popup",
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
  );
  
  if (popup) {
    popup.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>안내</title>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Noto Sans KR', sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f8f9fa;
          }
          .container {
            background-color: white;
            padding: 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 80%;
          }
          h2 {
            color: #6200ee;
            margin-bottom: 1rem;
          }
          p {
            color: #333;
            font-size: 1.1rem;
            margin-bottom: 1.5rem;
          }
          button {
            background-color: #6200ee;
            color: white;
            border: none;
            padding: 0.5rem 1.5rem;
            border-radius: 0.25rem;
            cursor: pointer;
            font-size: 1rem;
            transition: background-color 0.2s;
          }
          button:hover {
            background-color: #5000d6;
          }
          .info-icon {
            font-size: 2.5rem;
            color: #6200ee;
            margin-bottom: 1rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="info-icon">ℹ️</div>
          <h2>${title}</h2>
          <p>${message}</p>
          <button onclick="handleButtonClick()">확인</button>
        </div>
        <script>
          function handleButtonClick() {
            ${action === 'link' ? 
              `window.opener.location.href = "${actionData}";` : 
              action === 'email' ? 
              `window.open("mailto:${actionData}", "_blank");` : 
              ''}
            window.close();
          }
        </script>
      </body>
      </html>
    `);
    popup.document.close();
    return true;
  } else {
    // 팝업이 차단된 경우 false 반환
    return false;
  }
}
