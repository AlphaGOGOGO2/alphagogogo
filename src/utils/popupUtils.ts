
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
  const height = 280;
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
        <title>${title}</title>
        <meta charset="UTF-8">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Noto Sans KR', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #F9F7FE;
            color: #333333;
          }
          .container {
            background-color: white;
            padding: 2.5rem;
            border-radius: 1rem;
            box-shadow: 0 10px 25px rgba(124, 76, 223, 0.1);
            text-align: center;
            max-width: 90%;
            width: 100%;
            animation: fadeIn 0.3s ease-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .icon-wrapper {
            margin-bottom: 1.5rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background: linear-gradient(135deg, #A78BFA, #8B5CF6);
          }
          .icon {
            font-size: 2rem;
            color: white;
          }
          h2 {
            color: #4B5563;
            margin-bottom: 1rem;
            font-weight: 600;
            font-size: 1.5rem;
          }
          p {
            color: #6B7280;
            font-size: 1rem;
            line-height: 1.6;
            margin-bottom: 2rem;
          }
          button {
            background: linear-gradient(135deg, #A78BFA, #8B5CF6);
            color: white;
            border: none;
            padding: 0.75rem 2rem;
            border-radius: 0.5rem;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            transition: all 0.2s;
            box-shadow: 0 4px 6px rgba(139, 92, 246, 0.25);
          }
          button:hover {
            transform: translateY(-2px);
            box-shadow: 0 7px 14px rgba(139, 92, 246, 0.3);
          }
          button:active {
            transform: translateY(0);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon-wrapper">
            <div class="icon">${action === 'link' ? '🔗' : '✉️'}</div>
          </div>
          <h2>${title}</h2>
          <p>${message}</p>
          <button onclick="handleButtonClick()">${action === 'link' ? '채팅방 참여하기' : '이메일 보내기'}</button>
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
