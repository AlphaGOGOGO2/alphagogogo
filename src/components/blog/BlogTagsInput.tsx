
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BlogTagsInputProps {
  tags: string;
  setTags: (tags: string) => void;
}

export function BlogTagsInput({ tags, setTags }: BlogTagsInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="tags">태그</Label>
      <Input 
        id="tags" 
        value={tags} 
        onChange={(e) => setTags(e.target.value)} 
        placeholder="태그를 쉼표(,)로 구분하여 입력하세요" 
      />
      <p className="text-sm text-gray-500">
        쉼표(,)로 구분하여 여러 태그를 입력할 수 있습니다.
      </p>
    </div>
  );
}
