/**
 * 블로그 글 작성 페이지 - 마크다운 에디터
 * 로컬 환경에서만 사용 가능
 */

import { useState } from "react";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Eye, Code } from "lucide-react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  "최신 AI소식",
  "화제의 이슈",
  "라이프스타일",
  "테크 리뷰",
  "튜토리얼",
  "ChatGPT 가이드",
  "러브블 개발"
];

export default function AdminBlogWrite() {
  const { toast } = useToast();
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "최신 AI소식",
    coverImage: "",
    slug: "",
    tags: "",
    author: {
      name: "알파GOGOGO",
      avatar: "https://i.pravatar.cc/150?img=10"
    }
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // 제목이 변경되면 자동으로 slug 생성
    if (field === "title" && !formData.slug) {
      const autoSlug = value
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-가-힣]/g, '');
      setFormData(prev => ({ ...prev, slug: autoSlug }));
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      toast({
        title: "필수 항목 누락",
        description: "제목과 본문은 필수 입력 항목입니다.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch('http://localhost:3001/api/blog/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "저장 완료!",
          description: `블로그 글이 성공적으로 저장되었습니다. ${data.gitError ? '(Git 커밋 실패)' : ''}`,
        });

        // 푸시 여부 확인
        const shouldPush = confirm("GitHub에 푸시하시겠습니까?");
        if (shouldPush) {
          const pushResponse = await fetch('http://localhost:3001/api/git/push', {
            method: 'POST'
          });
          const pushData = await pushResponse.json();

          if (pushData.success) {
            toast({
              title: "배포 완료!",
              description: "GitHub에 푸시되었습니다. Netlify가 자동으로 배포합니다.",
            });
          }
        }

        // 폼 초기화
        setFormData({
          title: "",
          excerpt: "",
          content: "",
          category: "최신 AI소식",
          coverImage: "",
          slug: "",
          tags: "",
          author: {
            name: "알파GOGOGO",
            avatar: "https://i.pravatar.cc/150?img=10"
          }
        });

      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: "저장 실패",
        description: error instanceof Error ? error.message : "서버 연결을 확인해주세요.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <SEO
        title="블로그 글 작성 - 관리자"
        description="블로그 글 작성"
        noIndex
      />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" size="sm" asChild className="mb-2">
              <Link to="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                대시보드로 돌아가기
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">블로그 글 작성</h1>
            <p className="text-muted-foreground">마크다운 형식으로 작성하세요</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsPreview(!isPreview)}
            >
              {isPreview ? <Code className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
              {isPreview ? "편집" : "미리보기"}
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "저장 중..." : "저장하기"}
            </Button>
          </div>
        </div>

        {/* 메타데이터 */}
        <Card>
          <CardHeader>
            <CardTitle>글 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">제목 *</Label>
                <Input
                  id="title"
                  placeholder="블로그 글 제목"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="category">카테고리 *</Label>
                <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="excerpt">요약</Label>
              <Textarea
                id="excerpt"
                placeholder="글의 간단한 요약 (150자 이내)"
                value={formData.excerpt}
                onChange={(e) => handleChange("excerpt", e.target.value)}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="slug">슬러그 (URL)</Label>
                <Input
                  id="slug"
                  placeholder="url-friendly-slug"
                  value={formData.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  비워두면 제목에서 자동 생성됩니다
                </p>
              </div>
              <div>
                <Label htmlFor="coverImage">커버 이미지 URL</Label>
                <Input
                  id="coverImage"
                  placeholder="https://..."
                  value={formData.coverImage}
                  onChange={(e) => handleChange("coverImage", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tags">태그 (쉼표로 구분)</Label>
              <Input
                id="tags"
                placeholder="AI, 기술, 뉴스"
                value={formData.tags}
                onChange={(e) => handleChange("tags", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 본문 에디터/미리보기 */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>{isPreview ? "미리보기" : "본문 (마크다운)"}</CardTitle>
          </CardHeader>
          <CardContent>
            {isPreview ? (
              <div className="prose max-w-none p-4 bg-white rounded border min-h-[500px]">
                <h1>{formData.title || "제목 없음"}</h1>
                {formData.excerpt && (
                  <p className="text-lg text-gray-600 italic">{formData.excerpt}</p>
                )}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {formData.content || "*내용이 없습니다*"}
                </ReactMarkdown>
              </div>
            ) : (
              <Textarea
                placeholder="마크다운으로 작성하세요...

# 제목 1
## 제목 2
### 제목 3

**굵게** *기울임* `코드`

- 목록 1
- 목록 2

[링크](https://example.com)

![이미지](https://example.com/image.jpg)"
                value={formData.content}
                onChange={(e) => handleChange("content", e.target.value)}
                className="min-h-[500px] font-mono"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
