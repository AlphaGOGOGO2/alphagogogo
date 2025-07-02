import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, ExternalLink, CheckCircle, XCircle, AlertCircle, Eye, Download, Globe } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SEOManagementProps {}

export function SEOManagement({}: SEOManagementProps) {
  const [loading, setLoading] = useState(false);
  const [sitemapStatus, setSitemapStatus] = useState<'unknown' | 'success' | 'error'>('unknown');
  const [rssStatus, setRssStatus] = useState<'unknown' | 'success' | 'error'>('unknown');
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const checkSitemapStatus = async () => {
    try {
      const response = await fetch('/sitemap.xml');
      if (response.ok) {
        setSitemapStatus('success');
        return true;
      } else {
        setSitemapStatus('error');
        return false;
      }
    } catch (error) {
      setSitemapStatus('error');
      return false;
    }
  };

  const checkRSSStatus = async () => {
    try {
      const response = await fetch('/rss.xml');
      if (response.ok) {
        setRssStatus('success');
        return true;
      } else {
        setRssStatus('error');
        return false;
      }
    } catch (error) {
      setRssStatus('error');
      return false;
    }
  };

  const regenerateSitemap = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('update-static-seo');
      if (error) throw error;
      
      setSitemapStatus('success');
      setLastUpdate(new Date().toLocaleString('ko-KR'));
      toast.success('정적 사이트맵이 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('정적 사이트맵 업데이트 오류:', error);
      setSitemapStatus('error');
      toast.error('정적 사이트맵 업데이트에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const regenerateRSS = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('update-static-seo');
      if (error) throw error;
      
      setRssStatus('success');
      setLastUpdate(new Date().toLocaleString('ko-KR'));
      toast.success('정적 RSS 피드가 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('정적 RSS 피드 업데이트 오류:', error);
      setRssStatus('error');
      toast.error('정적 RSS 피드 업데이트에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const refreshAllSEO = async () => {
    setLoading(true);
    try {
      toast.info('정적 SEO 파일 업데이트를 시작합니다...');
      
      // 정적 SEO 파일 업데이트 실행
      console.log('정적 SEO 파일 업데이트 시작');
      const { data, error } = await supabase.functions.invoke('update-static-seo');

      if (error) {
        console.error('정적 SEO 파일 업데이트 실패:', error);
        setSitemapStatus('error');
        setRssStatus('error');
        toast.error('정적 SEO 파일 업데이트에 실패했습니다.');
        return;
      }

      console.log('정적 SEO 파일 업데이트 성공:', data);
      
      // 성공적으로 업데이트됨
      setSitemapStatus('success');
      setRssStatus('success');
      setLastUpdate(new Date().toLocaleString('ko-KR'));

      toast.success('🎉 정적 SEO 파일이 성공적으로 업데이트되었습니다! Google과 Bing에 알림을 보냈습니다.');
      
    } catch (error) {
      console.error('정적 SEO 파일 업데이트 오류:', error);
      setSitemapStatus('error');
      setRssStatus('error');
      toast.error('정적 SEO 파일 업데이트 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: 'unknown' | 'success' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusText = (status: 'unknown' | 'success' | 'error') => {
    switch (status) {
      case 'success':
        return '정상';
      case 'error':
        return '오류';
      default:
        return '확인 필요';
    }
  };

  const getStatusVariant = (status: 'unknown' | 'success' | 'error') => {
    switch (status) {
      case 'success':
        return 'default' as const;
      case 'error':
        return 'destructive' as const;
      default:
        return 'secondary' as const;
    }
  };

  return (
    <div className="space-y-6">
      {/* 전체 SEO 상태 카드 */}
      <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                정적 SEO 파일 관리
              </CardTitle>
              <Button 
                onClick={refreshAllSEO} 
                disabled={loading}
                variant="default"
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                정적 파일 업데이트
              </Button>
            </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(sitemapStatus)}
                <div>
                  <h3 className="font-medium">사이트맵</h3>
                  <p className="text-sm text-gray-500">XML 사이트맵 상태</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusVariant(sitemapStatus)}>
                  {getStatusText(sitemapStatus)}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('/sitemap.xml', '_blank')}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(rssStatus)}
                <div>
                  <h3 className="font-medium">RSS 피드</h3>
                  <p className="text-sm text-gray-500">RSS XML 피드 상태</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusVariant(rssStatus)}>
                  {getStatusText(rssStatus)}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('/rss.xml', '_blank')}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {lastUpdate && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                마지막 업데이트: {lastUpdate}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 상세 관리 탭 */}
      <Tabs defaultValue="sitemap">
        <TabsList>
          <TabsTrigger value="sitemap">사이트맵 관리</TabsTrigger>
          <TabsTrigger value="rss">RSS 피드 관리</TabsTrigger>
          <TabsTrigger value="monitoring">SEO 모니터링</TabsTrigger>
        </TabsList>

        <TabsContent value="sitemap">
          <Card>
            <CardHeader>
              <CardTitle>사이트맵 관리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">XML 사이트맵</h3>
                  <p className="text-sm text-gray-500">
                    검색엔진이 사이트 구조를 이해할 수 있도록 도와주는 XML 파일입니다.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={checkSitemapStatus}
                    disabled={loading}
                  >
                    상태 확인
                  </Button>
                  <Button
                    onClick={regenerateSitemap}
                    disabled={loading}
                  >
                    재생성
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">포함된 페이지 유형:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Badge variant="outline">홈페이지</Badge>
                  <Badge variant="outline">블로그 카테고리</Badge>
                  <Badge variant="outline">블로그 포스트</Badge>
                  <Badge variant="outline">리소스</Badge>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>팁:</strong> 새로운 블로그 포스트를 발행한 후에는 사이트맵을 재생성하여 
                  검색엔진이 빠르게 인덱싱할 수 있도록 하세요. 전체 최적화 버튼을 사용하면 
                  Google과 Bing에 자동으로 업데이트를 알립니다.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">현재 사이트맵 상태:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <Badge variant="outline">총 27개 블로그 포스트</Badge>
                  <Badge variant="outline">2개 리소스</Badge>
                  <Badge variant="outline">16개 정적 페이지</Badge>
                  <Badge variant="outline">예상 총 45개 페이지</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rss">
          <Card>
            <CardHeader>
              <CardTitle>RSS 피드 관리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">RSS XML 피드</h3>
                  <p className="text-sm text-gray-500">
                    블로그 구독자들이 최신 포스트를 받아볼 수 있는 RSS 피드입니다.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={checkRSSStatus}
                    disabled={loading}
                  >
                    상태 확인
                  </Button>
                  <Button
                    onClick={regenerateRSS}
                    disabled={loading}
                  >
                    재생성
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">RSS 피드 정보:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">제목:</p>
                    <p className="text-sm text-gray-600">알파고고고 - 최신 AI 소식 & 인사이트</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">언어:</p>
                    <p className="text-sm text-gray-600">한국어 (ko-KR)</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-700">
                  <strong>RSS 구독 링크:</strong> <br />
                  <code className="bg-white px-2 py-1 rounded text-xs">
                    https://alphagogogo.com/rss.xml
                  </code>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <Card>
            <CardHeader>
              <CardTitle>SEO 모니터링</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  모니터링 기능 준비 중
                </h3>
                <p className="text-gray-500 mb-4">
                  Google Search Console 연동 및 색인 상태 모니터링 기능을 개발 중입니다.
                </p>
                <Button variant="outline" disabled>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Google Search Console 연동
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <h4 className="font-medium mb-2">색인된 페이지</h4>
                  <p className="text-2xl font-bold text-blue-600">-</p>
                  <p className="text-sm text-gray-500">Google 검색 결과</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <h4 className="font-medium mb-2">클릭 수</h4>
                  <p className="text-2xl font-bold text-green-600">-</p>
                  <p className="text-sm text-gray-500">지난 28일</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <h4 className="font-medium mb-2">평균 순위</h4>
                  <p className="text-2xl font-bold text-purple-600">-</p>
                  <p className="text-sm text-gray-500">검색 결과 위치</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}