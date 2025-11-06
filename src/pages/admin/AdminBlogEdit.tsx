/**
 * 블로그 글 수정 페이지 - Markdown 에디터
 * 기존 포스트를 불러와서 수정하고 Git 커밋까지 자동 처리
 */

import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useToast } from "@/hooks/use-toast";
import * as localBlogService from "@/services/localBlogService";

// API 키 헤더 생성 함수
const getAPIHeaders = () => ({
  'x-api-key': import.meta.env.VITE_API_KEY || 'alphagogo-admin-2024-secure-key',
  'Content-Type': 'application/json'
});

const CATEGORIES = [
  "최신 AI소식",
  "화제의 이슈",
  "라이프스타일"
];

export default function AdminBlogEdit() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
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
    tags: "",
    author: {
      name: "알파GOGOGO",
      avatar: "https://i.pravatar.cc/150?img=10"
    }
  });

  // 기존 포스트 데이터 로드
  useEffect(() => {
    const loadPost = async () => {
      if (!slug) {
        toast({
          title: "오류",
          description: "포스트 슬러그가 없습니다.",
          variant: "destructive"
        });
        navigate("/admin/blog");
        return;
      }

      setIsLoading(true);
      try {
        const post = await localBlogService.getBlogPostBySlug(slug);

        if (!post) {
          toast({
            title: "포스트를 찾을 수 없습니다",
            description: `슬러그: ${slug}`,
            variant: "destructive"
          });
          navigate("/admin/blog");
          return;
        }

        setFormData({
          title: post.title,
          excerpt: post.excerpt || "",
          content: post.content,
          category: post.category,
          coverImage: post.coverImage || "",
          tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
          author: post.author || {
            name: "알파GOGOGO",
            avatar: "https://i.pravatar.cc/150?img=10"
          }
        });

        toast({
          title: "포스트 로드 완료",
          description: `"${post.title}" 수정 준비 완료`
        });
      } catch (error) {
        console.error("Error loading post:", error);
        toast({
          title: "로드 실패",
          description: "포스트를 불러오는 중 오류가 발생했습니다.",
          variant: "destructive"
        });
        navigate("/admin/blog");
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [slug, navigate, toast]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        headers: {
          'x-api-key': import.meta.env.VITE_API_KEY || 'alphagogo-admin-2024-secure-key'
        },
        body: formDataObj,
      });

      const data = await response.json();

      if (data.success) {
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

          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + imageMarkdown.length, start + imageMarkdown.length);
          }, 0);
        }

        toast({
          title: "이미지 업로드 성공",
          description: `${file.name}이(가) 업로드되었습니다.`
        });
      } else {
        throw new Error(data.error || "업로드 실패");
      }
    } catch (error: any) {
      console.error("Image upload error:", error);
      toast({
        title: "이미지 업로드 실패",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUploadingImage(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
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
        headers: {
          'x-api-key': import.meta.env.VITE_API_KEY || 'alphagogo-admin-2024-secure-key'
        },
        body: formDataObj,
      });

      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({ ...prev, coverImage: data.url }));
        toast({
          title: "썸네일 업로드 성공",
          description: `${file.name}이(가) 썸네일로 설정되었습니다.`
        });
      } else {
        throw new Error(data.error || "업로드 실패");
      }
    } catch (error: any) {
      console.error("Thumbnail upload error:", error);
      toast({
        title: "썸네일 업로드 실패",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUploadingThumbnail(false);
      if (thumbnailInputRef.current) {
        thumbnailInputRef.current.value = "";
      }
    }
  };

  // 저장 핸들러
  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "제목을 입력하세요",
        variant: "destructive"
      });
      return;
    }

    if (!formData.content.trim()) {
      toast({
        title: "내용을 입력하세요",
        variant: "destructive"
      });
      return;
    }

    if (!slug) {
      toast({
        title: "슬러그 정보가 없습니다",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);

    try {
      const tags = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t);

      const response = await fetch(`http://localhost:3001/api/blog/posts/${slug}`, {
        method: 'PUT',
        headers: getAPIHeaders(),
        body: JSON.stringify({
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
          category: formData.category,
          author: formData.author,
          coverImage: formData.coverImage,
          tags,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "저장 완료",
          description: data.message || "블로그 포스트가 수정되고 Git 커밋되었습니다.",
        });

        // 3초 후 목록 페이지로 이동
        setTimeout(() => {
          navigate("/admin/blog");
        }, 3000);
      } else {
        throw new Error(data.error || "저장 실패");
      }
    } catch (error: any) {
      console.error("Save error:", error);
      toast({
        title: "저장 실패",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">포스트 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <SEO
        title={`블로그 수정: ${formData.title || slug}`}
        description="블로그 포스트 수정"
        noIndex
      />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" size="sm" asChild className="mb-2">
              <Link to="/admin/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                목록으로 돌아가기
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">블로그 포스트 수정</h1>
            <p className="text-muted-foreground">Slug: {slug}</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving} size="lg">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                저장 중...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                저장하기 (Git 커밋)
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 왼쪽: 편집 폼 */}
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
                    placeholder="블로그 포스트 제목"
                  />
                </div>

                <div>
                  <Label htmlFor="category">카테고리 *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleChange("category", value)}
                  >
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
                  <Label htmlFor="excerpt">요약 (선택사항)</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleChange("excerpt", e.target.value)}
                    placeholder="포스트 요약 (미리보기에 표시됩니다)"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="tags">태그 (쉼표로 구분)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleChange("tags", e.target.value)}
                    placeholder="예: AI, 블로그, 자동화"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>썸네일 이미지</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.coverImage && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                    <img
                      src={formData.coverImage}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="coverImage">썸네일 URL</Label>
                  <Input
                    id="coverImage"
                    value={formData.coverImage}
                    onChange={(e) => handleChange("coverImage", e.target.value)}
                    placeholder="/images/blog/example.png"
                  />
                </div>
                <div>
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => thumbnailInputRef.current?.click()}
                    disabled={isUploadingThumbnail}
                    className="w-full"
                  >
                    {isUploadingThumbnail ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        업로드 중...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        썸네일 업로드
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>본문 작성</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="content">마크다운 본문 *</Label>
                    <div>
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={isUploadingImage}
                      >
                        {isUploadingImage ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            업로드 중...
                          </>
                        ) : (
                          <>
                            <ImageIcon className="mr-2 h-4 w-4" />
                            이미지 삽입
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    ref={contentTextareaRef}
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleChange("content", e.target.value)}
                    placeholder="# 제목&#10;&#10;마크다운 문법을 사용하세요..."
                    className="font-mono min-h-[600px]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 오른쪽: 미리보기 */}
          <div className="lg:sticky lg:top-6 h-fit">
            <Card>
              <CardHeader>
                <CardTitle>미리보기</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <h1>{formData.title || "제목 없음"}</h1>
                  {formData.excerpt && (
                    <p className="text-muted-foreground italic">{formData.excerpt}</p>
                  )}
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {formData.content || "*본문을 입력하세요...*"}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
