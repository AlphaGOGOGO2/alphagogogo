
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Download, Calendar, User, Tag, Eye, Star } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeHTML } from "@/components/SafeHTML";
import { resourceService } from "@/services/resourceService";
import { incrementDownloadCountSafely, buildDownloadFilename, buildDownloadUrl } from "@/utils/downloadPrivacy";

export default function ResourceDetailPage() {
  const { id } = useParams<{ id: string }>();
  
  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['resources'],
    queryFn: resourceService.getAllResources
  });

  const resource = resources.find(r => r.id === id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatFileSize = (bytes: number | null) => {
    if (bytes === null || bytes === undefined) return '';
    if (bytes === 0) return '0.0KB';
    
    const kb = bytes / 1024;
    const mb = kb / 1024;
    if (mb >= 1) return `${mb.toFixed(1)}MB`;
    return `${kb.toFixed(1)}KB`;
  };

  const handleDownload = async () => {
    console.log('다운로드 버튼 클릭됨', { resourceId: resource?.id, fileUrl: resource?.file_url });
    
    if (!resource?.file_url) {
      console.log('파일 URL이 없습니다');
      return;
    }

    try {
      console.log('다운로드 카운트 증가 시작');
      // 개인정보 보호를 적용한 안전한 다운로드 로깅
      await incrementDownloadCountSafely(resource.id);
      console.log('다운로드 카운트 증가 완료');
      
      const filename = buildDownloadFilename(resource.title, resource.file_url || '');
      const finalUrl = buildDownloadUrl(resource.file_url, filename);
      window.open(finalUrl, '_blank');
    } catch (error) {
      console.error('Download error:', error);
      console.log('오류 발생, 직접 다운로드 시도');
      if (resource.file_url) {
        const filename = buildDownloadFilename(resource.title, resource.file_url || '');
        const finalUrl = buildDownloadUrl(resource.file_url, filename);
        window.open(finalUrl, '_blank');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">자료를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">자료를 찾을 수 없습니다</h1>
              <Link to="/resources">
                <Button>자료실로 돌아가기</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{resource.title} - 자료실 - 알파고고고</title>
        <meta name="description" content={resource.description?.replace(/<[^>]*>/g, '').substring(0, 160)} />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-6">
            {/* 뒤로가기 버튼 */}
            <div className="mb-6">
              <Link to="/resources" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700">
                <ArrowLeft className="w-4 h-4" />
                자료실로 돌아가기
              </Link>
            </div>

            {/* 자료 정보 */}
            <div className="bg-white rounded-lg shadow-sm border p-8 overflow-hidden">
              {/* 헤더 */}
              <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h1 className="text-3xl font-bold text-gray-900 break-words">{resource.title}</h1>
                    {resource.is_featured && (
                      <Star className="w-6 h-6 text-yellow-500 fill-current flex-shrink-0" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 flex-wrap">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4 flex-shrink-0" />
                      <span className="break-words">{resource.author_name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>{formatDate(resource.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4 flex-shrink-0" />
                      <span>{resource.download_count.toLocaleString()} 다운로드</span>
                    </div>
                  </div>

                  {resource.file_size && (
                    <div className="mb-4">
                      <Badge variant="outline">{formatFileSize(resource.file_size)}</Badge>
                    </div>
                  )}

                  {resource.tags.length > 0 && (
                    <div className="flex items-start gap-2 mb-4">
                      <Tag className="w-4 h-4 text-gray-500 flex-shrink-0 mt-1" />
                      <div className="flex flex-wrap gap-1">
                        {resource.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={handleDownload}
                  className="bg-purple-600 hover:bg-purple-700 text-white flex-shrink-0"
                  size="lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  다운로드
                </Button>
              </div>

              {/* 내용 */}
              {resource.description && (
                <div className="border-t pt-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">자료 설명</h2>
                  <SafeHTML 
                    content={resource.description}
                    className="prose max-w-none text-gray-700 break-words overflow-hidden"
                  />
                </div>
              )}
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
