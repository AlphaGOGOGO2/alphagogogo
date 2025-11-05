/**
 * 블로그 글 작성 페이지 - 노션 스타일 마크다운 에디터
 * 로컬 환경에서만 사용 가능
 */

import { useState, useRef } from "react";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Upload, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  "최신 AI소식",
  "화제의 이슈",
  "라이프스타일"
];

export default function AdminBlogWrite() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

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

  // 이미지 업로드 핸들러 (본문 이미지)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append('image', file);

      const response = await fetch('http://localhost:3001/api/images/upload', {
        method: 'POST',
        body: formDataObj,
      });

      const data = await response.json();

      if (data.success) {
        // 커서 위치에 마크다운 이미지 구문 삽입
        const imageMarkdown = `![${file.name}](${data.url})`;
        const textarea = contentTextareaRef.current;

        if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const currentContent = formData.content;
          const newContent =
            currentContent.substring(0, start) +
            imageMarkdown +
            currentContent.substring(end);

          setFormData(prev => ({ ...prev, content: newContent }));

          // 커서 위치를 삽입된 이미지 마크다운 뒤로 이동
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + imageMarkdown.length;
            textarea.focus();
          }, 0);
        }

        toast({
          title: "이미지 업로드 성공!",
          description: `${file.name}이(가) 본문에 삽입되었습니다.`,
        });
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast({
        title: "이미지 업로드 실패",
        description: "이미지 업로드 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsUploadingImage(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    }
  };

  // 썸네일 업로드 핸들러
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingThumbnail(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append('image', file);

      const response = await fetch('http://localhost:3001/api/images/upload', {
        method: 'POST',
        body: formDataObj,
      });

      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({ ...prev, coverImage: data.url }));
        toast({
          title: "썸네일 업로드 성공!",
          description: `${file.name}이(가) 썸네일로 설정되었습니다.`,
        });
      }
    } catch (error) {
      console.error('Thumbnail upload error:', error);
      toast({
        title: "썸네일 업로드 실패",
        description: "썸네일 업로드 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsUploadingThumbnail(false);
      if (thumbnailInputRef.current) {
        thumbnailInputRef.current.value = '';
      }
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
              title: "푸시 완료!",
              description: "변경사항이 GitHub에 푸시되었습니다.",
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
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "저장 실패",
        description: "블로그 글 저장 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <SEO
        title="새 글 작성 - 관리자"
        description="블로그 글 작성"
        noIndex
      />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link to="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                대시보드로
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">새 글 작성</h1>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "저장 중..." : "저장하기"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 왼쪽: 입력 폼 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>기본 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">제목 *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="블로그 글 제목"
                  />
                </div>

                <div>
                  <Label htmlFor="category">카테고리 *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="excerpt">요약</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleChange("excerpt", e.target.value)}
                    placeholder="글 요약 (선택사항)"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="slug">슬러그 (URL)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleChange("slug", e.target.value)}
                    placeholder="자동 생성됨"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    비워두면 제목에서 자동 생성됩니다
                  </p>
                </div>

                <div>
                  <Label htmlFor="coverImage">썸네일 이미지</Label>
                  <div className="flex gap-2">
                    <Input
                      id="coverImage"
                      value={formData.coverImage}
                      onChange={(e) => handleChange("coverImage", e.target.value)}
                      placeholder="/images/blog/썸네일.jpg"
                      className="flex-1"
                    />
                    <input
                      type="file"
                      ref={thumbnailInputRef}
                      onChange={handleThumbnailUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => thumbnailInputRef.current?.click()}
                      disabled={isUploadingThumbnail}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {isUploadingThumbnail ? "업로드 중..." : "업로드"}
                    </Button>
                  </div>
                  {formData.coverImage && (
                    <img
                      src={formData.coverImage}
                      alt="Thumbnail preview"
                      className="mt-2 w-full h-32 object-cover rounded-md"
                    />
                  )}
                </div>

                <div>
                  <Label htmlFor="tags">태그</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleChange("tags", e.target.value)}
                    placeholder="AI, 튜토리얼, ChatGPT (쉼표로 구분)"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>본문 작성 (마크다운)</CardTitle>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      ref={imageInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={isUploadingImage}
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      {isUploadingImage ? "업로드 중..." : "이미지 삽입"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  ref={contentTextareaRef}
                  value={formData.content}
                  onChange={(e) => handleChange("content", e.target.value)}
                  placeholder="마크다운으로 작성하세요...&#10;&#10;# 제목&#10;## 소제목&#10;**굵게** *기울임*&#10;&#10;![이미지](URL)&#10;[링크](URL)"
                  className="min-h-[500px] font-mono"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  💡 이미지 삽입: 위 버튼으로 이미지 업로드 → 자동으로 마크다운 삽입
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 오른쪽: 실시간 미리보기 */}
          <div className="lg:sticky lg:top-6 h-fit">
            <Card>
              <CardHeader>
                <CardTitle>실시간 미리보기</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none bg-white p-6 rounded-md border min-h-[500px]">
                  {formData.title && (
                    <h1 className="text-3xl font-bold mb-4">{formData.title}</h1>
                  )}
                  {formData.coverImage && (
                    <img
                      src={formData.coverImage}
                      alt="Cover"
                      className="w-full h-64 object-cover rounded-md mb-4"
                    />
                  )}
                  {formData.excerpt && (
                    <p className="text-gray-600 italic mb-4">{formData.excerpt}</p>
                  )}
                  {formData.content ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {formData.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-gray-400">본문을 입력하면 여기에 미리보기가 표시됩니다.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
