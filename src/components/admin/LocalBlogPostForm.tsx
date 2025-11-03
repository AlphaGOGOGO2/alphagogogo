/**
 * 로컬 모드 블로그 포스트 작성/수정 폼
 * 작성한 내용을 TypeScript 코드로 변환하여 다운로드
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, X } from "lucide-react";
import { toast } from "sonner";

interface LocalBlogPostFormProps {
  onClose: () => void;
}

export function LocalBlogPostForm({ onClose }: LocalBlogPostFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("latest-updates");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const categories = [
    { value: "latest-updates", label: "최신 AI소식" },
    { value: "trending", label: "화제의 이슈" },
    { value: "lifestyle", label: "라이프스타일" }
  ];

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  };

  const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  };

  const handleDownloadCode = () => {
    if (!title.trim() || !content.trim()) {
      toast.error("제목과 내용은 필수입니다");
      return;
    }

    const slug = generateSlug(title);
    const id = generateId();
    const now = new Date().toISOString();

    const tagArray = tags.split(',').map(t => t.trim()).filter(t => t);

    const postCode = `  {
    id: "${id}",
    title: "${title.replace(/"/g, '\\"')}",
    slug: "${slug}",
    excerpt: "${excerpt.replace(/"/g, '\\"')}",
    content: \`${content.replace(/`/g, '\\`')}\`,
    category: "${category}",
    tags: [${tagArray.map(t => `"${t}"`).join(', ')}],
    publishedAt: "${now}",
    updatedAt: "${now}",
    authorId: "local-author",
    authorName: "알파GOGOGO",
    ${thumbnailUrl ? `thumbnailUrl: "${thumbnailUrl}",` : '// thumbnailUrl: "",'}
    views: 0,
    readingTime: ${Math.ceil(content.length / 500)}
  }`;

    const instructions = `// 이 코드를 src/data/blogPosts.ts의 blogPosts 배열에 추가하세요
// 배열의 맨 위에 추가하면 최신 글로 표시됩니다

${postCode},

// ⚠️ 주의사항:
// 1. blogPosts 배열 안에 위 객체를 추가하세요
// 2. 마지막 객체가 아니라면 끝에 쉼표(,)가 있어야 합니다
// 3. 파일을 저장하면 자동으로 핫 리로드됩니다
// 4. TypeScript 문법 오류가 있으면 에러가 표시됩니다`;

    const blob = new Blob([instructions], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blog-post-${slug}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("블로그 포스트 코드가 다운로드되었습니다", {
      description: "다운로드한 파일의 지침을 따라 blogPosts.ts에 추가하세요"
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>새 블로그 포스트 작성</CardTitle>
              <CardDescription>
                작성 후 다운로드 버튼을 클릭하여 코드를 받으세요
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              placeholder="블로그 포스트 제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnailUrl">썸네일 URL (선택)</Label>
              <Input
                id="thumbnailUrl"
                placeholder="https://..."
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">요약 (선택)</Label>
            <Input
              id="excerpt"
              placeholder="포스트 요약 (1-2문장)"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">태그 (쉼표로 구분)</Label>
            <Input
              id="tags"
              placeholder="AI, ChatGPT, 튜토리얼"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">본문 * (마크다운 지원)</Label>
            <Textarea
              id="content"
              placeholder="# 제목&#10;&#10;본문 내용을 마크다운으로 작성하세요..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              예상 읽기 시간: 약 {Math.ceil(content.length / 500)}분
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleDownloadCode} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              코드 다운로드
            </Button>
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm text-blue-800">
            <p className="font-semibold mb-2">📝 사용 방법</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>위 폼에 블로그 내용을 작성합니다</li>
              <li>"코드 다운로드" 버튼을 클릭합니다</li>
              <li>다운로드된 파일을 열어 코드를 복사합니다</li>
              <li><code className="bg-blue-100 px-1 rounded">src/data/blogPosts.ts</code> 파일을 엽니다</li>
              <li><code className="bg-blue-100 px-1 rounded">blogPosts</code> 배열에 코드를 추가합니다</li>
              <li>파일을 저장하면 자동으로 새 글이 표시됩니다</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
