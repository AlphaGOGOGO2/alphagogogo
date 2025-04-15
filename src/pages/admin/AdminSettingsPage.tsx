
import { useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "알파GOGOGO",
    siteDescription: "본질을 찾아서",
    shortDescription: "AI 소식과 인사이트를 공유하는 블로그",
    longDescription: "알파GOGOGO는 최신 AI 기술 동향, 인공지능 관련 뉴스, 그리고 다양한 AI 서비스 리뷰를 제공하는 전문 블로그입니다. 인공지능과 관련된 깊이 있는 인사이트와 실용적인 정보를 제공합니다.",
    adminEmail: "admin@alphagogogo.com",
    enableComments: true,
    seoTitle: "알파GOGOGO - AI 전문 블로그",
    seoDescription: "최신 AI 소식, 인공지능 동향, 그리고 실용적인 AI 서비스 리뷰를 제공하는 전문 블로그입니다.",
    metaKeywords: "알파고고고,알파고,인공지능,AI,블로그,AI 소식,인공지능 뉴스,AI 서비스,AI 리뷰,AI 트렌드,ChatGPT,인공지능 기술",
    ogImage: "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//og%20image.png",
    customCss: "",
    customJs: ""
  });
  
  const handleSettingChange = (key: keyof typeof settings, value: string | boolean) => {
    setSettings({
      ...settings,
      [key]: value
    });
  };
  
  const handleSaveSettings = () => {
    toast.success("설정이 저장되었습니다.");
  };
  
  const handleClearCache = () => {
    toast.success("캐시가 삭제되었습니다.");
  };
  
  return (
    <AdminLayout title="시스템 설정">
      <SEO 
        title="시스템 설정 | 관리자 대시보드" 
        description="사이트 시스템 설정" 
      />
      
      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">일반 설정</TabsTrigger>
          <TabsTrigger value="seo">SEO 설정</TabsTrigger>
          <TabsTrigger value="advanced">고급 설정</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>일반 설정</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="site-name">사이트 이름</Label>
                    <Input
                      id="site-name"
                      value={settings.siteName}
                      onChange={(e) => handleSettingChange("siteName", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">관리자 이메일</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      value={settings.adminEmail}
                      onChange={(e) => handleSettingChange("adminEmail", e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="short-description">짧은 소개글</Label>
                  <Input
                    id="short-description"
                    value={settings.shortDescription}
                    onChange={(e) => handleSettingChange("shortDescription", e.target.value)}
                    placeholder="사이트를 간단히 소개하는 한 줄 설명"
                  />
                  <p className="text-xs text-gray-500">메타 태그와 검색 결과에 표시될 간단한 설명입니다.</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="long-description">상세 소개글</Label>
                  <Textarea
                    id="long-description"
                    value={settings.longDescription}
                    onChange={(e) => handleSettingChange("longDescription", e.target.value)}
                    rows={4}
                    placeholder="사이트의 목적과 제공하는 컨텐츠에 대한 상세한 설명"
                  />
                  <p className="text-xs text-gray-500">사이트의 주요 페이지와 about 페이지에 표시될 상세한 설명입니다.</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="comments-toggle"
                    checked={settings.enableComments}
                    onCheckedChange={(checked) => handleSettingChange("enableComments", checked)}
                  />
                  <Label htmlFor="comments-toggle">댓글 기능 활성화</Label>
                </div>
                
                <div className="pt-4 border-t">
                  <Button onClick={handleSaveSettings}>설정 저장</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO 설정</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="seo-title">기본 SEO 타이틀</Label>
                  <Input
                    id="seo-title"
                    value={settings.seoTitle}
                    onChange={(e) => handleSettingChange("seoTitle", e.target.value)}
                    placeholder="검색 결과에 표시될 기본 타이틀"
                  />
                  <p className="text-xs text-gray-500">
                    검색 엔진과 소셜 미디어에 표시될 기본 타이틀입니다.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seo-description">SEO 설명</Label>
                  <Textarea
                    id="seo-description"
                    value={settings.seoDescription}
                    onChange={(e) => handleSettingChange("seoDescription", e.target.value)}
                    rows={3}
                    placeholder="검색 결과에 표시될 사이트 설명"
                  />
                  <p className="text-xs text-gray-500">
                    150-160자 이내로 작성하시면 검색 결과에 최적화됩니다.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta-keywords">메타 키워드</Label>
                  <Textarea
                    id="meta-keywords"
                    value={settings.metaKeywords}
                    onChange={(e) => handleSettingChange("metaKeywords", e.target.value)}
                    rows={3}
                    placeholder="키워드를 쉼표(,)로 구분하여 입력하세요"
                  />
                  <p className="text-xs text-gray-500">
                    주요 키워드를 쉼표(,)로 구분하여 입력하세요. 10-15개의 키워드가 적당합니다.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="og-image">대표 이미지 URL</Label>
                  <Input
                    id="og-image"
                    value={settings.ogImage}
                    onChange={(e) => handleSettingChange("ogImage", e.target.value)}
                    placeholder="소셜 미디어에 표시될 대표 이미지 URL"
                  />
                  <p className="text-xs text-gray-500">
                    1200 x 630 픽셀 크기의 이미지를 권장합니다.
                  </p>
                </div>
                
                <div className="pt-4 border-t">
                  <Button onClick={handleSaveSettings}>설정 저장</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>고급 설정</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="custom-css">커스텀 CSS</Label>
                  <Textarea
                    id="custom-css"
                    value={settings.customCss}
                    onChange={(e) => handleSettingChange("customCss", e.target.value)}
                    placeholder="사이트에 적용할 추가 CSS를 입력하세요"
                    className="font-mono"
                    rows={5}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="custom-js">커스텀 JavaScript</Label>
                  <Textarea
                    id="custom-js"
                    value={settings.customJs}
                    onChange={(e) => handleSettingChange("customJs", e.target.value)}
                    placeholder="사이트에 적용할 추가 JavaScript를 입력하세요"
                    className="font-mono"
                    rows={5}
                  />
                </div>
                
                <div className="pt-4 border-t">
                  <Button onClick={handleSaveSettings}>설정 저장</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>시스템 유지보수</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b">
                  <div>
                    <h3 className="font-medium">캐시 삭제</h3>
                    <p className="text-sm text-gray-500">사이트 캐시를 비웁니다.</p>
                  </div>
                  <Button variant="outline" onClick={handleClearCache}>캐시 삭제</Button>
                </div>
                
                <div className="flex items-center justify-between pb-2 border-b">
                  <div>
                    <h3 className="font-medium">시스템 로그</h3>
                    <p className="text-sm text-gray-500">시스템 로그를 확인합니다.</p>
                  </div>
                  <Button variant="outline" onClick={() => toast.info("로그 기능이 준비 중입니다.")}>로그 보기</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
