
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BlogCategory } from "@/types/supabase";

interface BlogCategorySelectProps {
  category: string;
  setCategory: (category: string) => void;
  categories: BlogCategory[];
  isLoading: boolean;
}

export function BlogCategorySelect({ 
  category, 
  setCategory, 
  categories, 
  isLoading 
}: BlogCategorySelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="category">카테고리</Label>
      {isLoading ? (
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="카테고리 로딩 중..." />
          </SelectTrigger>
        </Select>
      ) : (
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger id="category">
            <SelectValue placeholder="카테고리 선택" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
