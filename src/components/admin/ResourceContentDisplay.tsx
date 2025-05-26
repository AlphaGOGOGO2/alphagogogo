
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";

interface ResourceContentDisplayProps {
  content: string;
  className?: string;
}

export function ResourceContentDisplay({ content, className = "" }: ResourceContentDisplayProps) {
  // 읽기 전용 에디터 생성
  const editor = useCreateBlockNote({
    initialContent: parseContent(content),
    editable: false,
  });

  return (
    <div className={className}>
      <BlockNoteView
        editor={editor}
        theme="light"
        className="prose prose-sm max-w-none"
      />
    </div>
  );
}

// 콘텐츠 파싱 헬퍼 함수
function parseContent(content: string) {
  if (!content) return undefined;
  
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (error) {
    // 기존 텍스트인 경우 단순 텍스트 블록으로 변환
    return [{
      id: "text-content",
      type: "paragraph",
      props: {},
      content: [{ type: "text", text: content, styles: {} }],
      children: []
    }];
  }
  
  return undefined;
}
