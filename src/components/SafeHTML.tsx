import React from 'react';
import { sanitizeHTML } from '@/utils/sanitization';

interface SafeHTMLProps {
  content: string;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
}

/**
 * XSS 공격을 방지하는 안전한 HTML 렌더링 컴포넌트
 */
export const SafeHTML: React.FC<SafeHTMLProps> = ({ 
  content, 
  className = '', 
  tag: Tag = 'div' 
}) => {
  const sanitizedContent = sanitizeHTML(content);
  
  return (
    <Tag 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default SafeHTML;