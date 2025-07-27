
interface ResourceContentDisplayProps {
  content: string;
  className?: string;
}

export function ResourceContentDisplay({ content, className = "" }: ResourceContentDisplayProps) {
  // 콘텐츠가 없는 경우 처리
  if (!content || !content.trim()) {
    return (
      <div className={`${className} text-gray-500 italic`}>
        설명이 없습니다.
      </div>
    );
  }

  // HTML 콘텐츠인지 확인하고 렌더링
  const isHtmlContent = content.includes('<') && content.includes('>');
  
  if (isHtmlContent) {
    const { sanitizeHtml } = require('@/utils/securityUtils');
    const sanitizedContent = sanitizeHtml(content);
    
    return (
      <div 
        className={`${className} prose prose-sm max-w-none`}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    );
  }

  // 기존 JSON 형식이거나 일반 텍스트인 경우 처리
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      // BlockNote 형식의 데이터를 간단한 텍스트로 변환
      const textContent = parsed
        .map(block => {
          if (block.content && Array.isArray(block.content)) {
            return block.content
              .filter((item: any) => item.type === 'text')
              .map((item: any) => item.text)
              .join('');
          }
          return '';
        })
        .filter(text => text.trim())
        .join('\n\n');
      
      return (
        <div className={`${className} whitespace-pre-wrap`}>
          {textContent || '내용이 없습니다.'}
        </div>
      );
    }
  } catch (error) {
    // JSON이 아닌 일반 텍스트인 경우
    return (
      <div className={`${className} whitespace-pre-wrap`}>
        {content}
      </div>
    );
  }

  return (
    <div className={`${className} text-gray-500 italic`}>
      내용을 표시할 수 없습니다.
    </div>
  );
}
