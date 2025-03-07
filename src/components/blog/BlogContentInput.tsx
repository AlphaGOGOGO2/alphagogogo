
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface BlogContentInputProps {
  content: string;
  setContent: (content: string) => void;
}

export function BlogContentInput({ content, setContent }: BlogContentInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="content">내용</Label>
      <Textarea 
        id="content" 
        value={content} 
        onChange={(e) => setContent(e.target.value)} 
        placeholder="내용을 입력하세요" 
        rows={15} 
        required 
      />
      <p className="text-sm text-gray-500">
        HTML 형식으로 작성 가능합니다. 본문에 포함된 첫 번째 이미지가 자동으로 커버 이미지로 사용됩니다.
      </p>
    </div>
  );
}
