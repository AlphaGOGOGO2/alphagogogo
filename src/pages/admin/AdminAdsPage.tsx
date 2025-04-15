
import { useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { AdBanner } from "@/components/ads/AdBanner";

export default function AdminAdsPage() {
  // 광고 슬롯 설정 (실제로는 DB에서 가져와야 할 내용)
  const [adSlots, setAdSlots] = useState({
    siteHeader: { id: "1234567890", enabled: true },
    siteFooter: { id: "9876543210", enabled: true },
    blogPostTop: { id: "3456789012", enabled: true },
    blogPostMiddle: { id: "5678901234", enabled: true }
  });
  
  // 광고 슬롯 업데이트 처리
  const handleSlotUpdate = (slotKey: keyof typeof adSlots, id: string) => {
    setAdSlots({
      ...adSlots,
      [slotKey]: { ...adSlots[slotKey], id }
    });
  };
  
  // 광고 슬롯 활성화/비활성화 처리
  const handleSlotToggle = (slotKey: keyof typeof adSlots) => {
    setAdSlots({
      ...adSlots,
      [slotKey]: { ...adSlots[slotKey], enabled: !adSlots[slotKey].enabled }
    });
  };
  
  // 설정 저장 처리 (실제로는 DB에 저장해야 함)
  const handleSaveSettings = () => {
    // 설정 저장 로직 (실제로는 DB에 저장)
    toast.success("광고 설정이 저장되었습니다.");
  };
  
  return (
    <AdminLayout title="광고 관리">
      <SEO 
        title="광고 관리 | 관리자 대시보드" 
        description="AdSense 광고 관리" 
      />
      
      <Tabs defaultValue="slots">
        <TabsList className="mb-6">
          <TabsTrigger value="slots">광고 슬롯</TabsTrigger>
          <TabsTrigger value="preview">광고 미리보기</TabsTrigger>
          <TabsTrigger value="settings">설정</TabsTrigger>
        </TabsList>
        
        <TabsContent value="slots">
          <Card>
            <CardHeader>
              <CardTitle>광고 슬롯 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-6">
                AdSense 광고 슬롯 ID를 입력하고 각 영역의 광고 표시 여부를 설정합니다.
              </p>
              
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="site-header">사이트 헤더 광고</Label>
                      <Switch 
                        id="site-header-toggle"
                        checked={adSlots.siteHeader.enabled}
                        onCheckedChange={() => handleSlotToggle("siteHeader")}
                      />
                    </div>
                    <Input
                      id="site-header"
                      placeholder="광고 슬롯 ID"
                      value={adSlots.siteHeader.id}
                      onChange={(e) => handleSlotUpdate("siteHeader", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="site-footer">사이트 푸터 광고</Label>
                      <Switch 
                        id="site-footer-toggle"
                        checked={adSlots.siteFooter.enabled}
                        onCheckedChange={() => handleSlotToggle("siteFooter")}
                      />
                    </div>
                    <Input
                      id="site-footer"
                      placeholder="광고 슬롯 ID"
                      value={adSlots.siteFooter.id}
                      onChange={(e) => handleSlotUpdate("siteFooter", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="blog-post-top">블로그 포스트 상단 광고</Label>
                      <Switch 
                        id="blog-post-top-toggle"
                        checked={adSlots.blogPostTop.enabled}
                        onCheckedChange={() => handleSlotToggle("blogPostTop")}
                      />
                    </div>
                    <Input
                      id="blog-post-top"
                      placeholder="광고 슬롯 ID"
                      value={adSlots.blogPostTop.id}
                      onChange={(e) => handleSlotUpdate("blogPostTop", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="blog-post-middle">블로그 포스트 중간 광고</Label>
                      <Switch 
                        id="blog-post-middle-toggle"
                        checked={adSlots.blogPostMiddle.enabled}
                        onCheckedChange={() => handleSlotToggle("blogPostMiddle")}
                      />
                    </div>
                    <Input
                      id="blog-post-middle"
                      placeholder="광고 슬롯 ID"
                      value={adSlots.blogPostMiddle.id}
                      onChange={(e) => handleSlotUpdate("blogPostMiddle", e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button onClick={handleSaveSettings}>설정 저장</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>광고 미리보기</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-6">
                사이트에 표시될 광고의 미리보기입니다. 실제 광고는 AdSense 승인 후 표시됩니다.
              </p>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-medium mb-2">사이트 헤더 광고</h3>
                  {adSlots.siteHeader.enabled ? (
                    <AdBanner 
                      slot={adSlots.siteHeader.id} 
                      format="auto" 
                      className="border border-dashed border-gray-300" 
                    />
                  ) : (
                    <div className="p-4 bg-gray-100 text-center text-gray-500 rounded-md">
                      광고가 비활성화되었습니다
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">블로그 포스트 상단 광고</h3>
                  {adSlots.blogPostTop.enabled ? (
                    <AdBanner 
                      slot={adSlots.blogPostTop.id} 
                      format="rectangle"
                      className="border border-dashed border-gray-300" 
                    />
                  ) : (
                    <div className="p-4 bg-gray-100 text-center text-gray-500 rounded-md">
                      광고가 비활성화되었습니다
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">블로그 포스트 중간 광고</h3>
                  {adSlots.blogPostMiddle.enabled ? (
                    <AdBanner 
                      slot={adSlots.blogPostMiddle.id} 
                      format="rectangle" 
                      className="border border-dashed border-gray-300" 
                    />
                  ) : (
                    <div className="p-4 bg-gray-100 text-center text-gray-500 rounded-md">
                      광고가 비활성화되었습니다
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>광고 설정</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-medium">자동 광고 활성화</h3>
                    <p className="text-sm text-gray-500">AdSense 자동 광고를 활성화합니다.</p>
                  </div>
                  <Switch id="auto-ads-toggle" />
                </div>
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-medium">모바일 광고 표시</h3>
                    <p className="text-sm text-gray-500">모바일 기기에서 광고를 표시합니다.</p>
                  </div>
                  <Switch id="mobile-ads-toggle" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-medium">기사 내 광고 표시</h3>
                    <p className="text-sm text-gray-500">블로그 포스트 내용 중간에 광고를 표시합니다.</p>
                  </div>
                  <Switch id="in-article-ads-toggle" defaultChecked />
                </div>
                
                <div className="pt-4">
                  <Button onClick={handleSaveSettings}>설정 저장</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
