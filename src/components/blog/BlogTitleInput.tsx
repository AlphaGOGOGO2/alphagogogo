
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BlogTitleInputProps {
  title: string;
  setTitle: (title: string) => void;
}

export function BlogTitleInput({ title, setTitle }: BlogTitleInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="title">제목</Label>
      <Input 
        id="title" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="제목을 입력하세요" 
        required 
      />
    </div>
  );
}
