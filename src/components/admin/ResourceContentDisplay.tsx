
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

interface ResourceContentDisplayProps {
  content: string;
  className?: string;
}

export function ResourceContentDisplay({ content, className = "" }: ResourceContentDisplayProps) {
  // 읽기 전용 에디터 생성
  const editor = useCreateBlockNote({
    initialContent: parseContent(content),
  });

  // 에디터를 읽기 전용으로 설정
  editor.isEditable = false;

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
  if (!content || !content.trim()) return undefined;
  
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (error) {
    // 기존 텍스트인 경우 단순 텍스트 블록으로 변환
    return [{
      id: "text-content",
      type: "paragraph",
      content: [{ type: "text", text: content, styles: {} }]
    }];
  }
  
  return undefined;
}
