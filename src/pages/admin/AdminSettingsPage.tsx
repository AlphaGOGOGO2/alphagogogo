
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
  // 시스템 설정 상태 (실제로는 DB에서 가져와야 할 내용)
  const [settings, setSettings] = useState({
    siteName: "알파GOGOGO",
    siteDescription: "본질을 찾아서",
    adminEmail: "admin@alphagogogo.com",
    enableComments: true,
    metaKeywords: "알파고고고,알파고,인공지능,AI,블로그",
    customCss: "",
    customJs: ""
  });
  
  // 설정 변경 처리
  const handleSettingChange = (key: keyof typeof settings, value: string | boolean) => {
    setSettings({
      ...settings,
      [key]: value
    });
  };
  
  // 설정 저장 처리 (실제로는 DB에 저장)
  const handleSaveSettings = () => {
    // 설정 저장 로직 (실제로는 DB에 저장)
    toast.success("설정이 저장되었습니다.");
  };
  
  // 캐시 삭제 처리
  const handleClearCache = () => {
    // 캐시 삭제 로직
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
                  <Label htmlFor="site-description">사이트 설명</Label>
                  <Textarea
                    id="site-description"
                    value={settings.siteDescription}
                    onChange={(e) => handleSettingChange("siteDescription", e.target.value)}
                    rows={3}
                  />
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
                  <Label htmlFor="meta-keywords">메타 키워드</Label>
                  <Textarea
                    id="meta-keywords"
                    value={settings.metaKeywords}
                    onChange={(e) => handleSettingChange("metaKeywords", e.target.value)}
                    placeholder="키워드를 쉼표(,)로 구분하여 입력하세요"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">
                    콤마(,)로 구분된 키워드를 입력하세요. 사이트 전체에 적용됩니다.
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
