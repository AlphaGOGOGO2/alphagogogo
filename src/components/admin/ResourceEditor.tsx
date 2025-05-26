
import { useState, useEffect } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";
import { Label } from "@/components/ui/label";

interface ResourceEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ResourceEditor({ value, onChange, placeholder }: ResourceEditorProps) {
  const [initialContent, setInitialContent] = useState<any[]>([]);

  // BlockNote 에디터 초기화
  const editor = useCreateBlockNote({
    initialContent: initialContent.length > 0 ? initialContent : undefined,
  });

  // 값이 변경될 때 에디터 내용 업데이트
  useEffect(() => {
    if (value) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          setInitialContent(parsed);
          editor.replaceBlocks(editor.document, parsed);
        }
      } catch (error) {
        // 기존 텍스트인 경우 단순 텍스트 블록으로 변환
        if (value.trim()) {
          const textBlock = [{
            id: "initial",
            type: "paragraph",
            props: {},
            content: [{ type: "text", text: value, styles: {} }],
            children: []
          }];
          setInitialContent(textBlock);
          editor.replaceBlocks(editor.document, textBlock);
        }
      }
    }
  }, [value, editor]);

  // 에디터 내용 변경 시 호출
  const handleChange = () => {
    const blocks = editor.document;
    onChange(JSON.stringify(blocks));
  };

  return (
    <div>
      <Label className="text-lg font-semibold text-gray-800 mb-3 block">설명</Label>
      <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition-all">
        <BlockNoteView
          editor={editor}
          onChange={handleChange}
          theme="light"
          className="min-h-[200px] p-4"
        />
      </div>
      <p className="text-sm text-gray-500 mt-2">
        자료에 대한 상세한 설명을 작성해주세요. 헤딩, 리스트, 코드 블록 등을 사용할 수 있습니다.
      </p>
    </div>
  );
}
