
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Download, Calendar, User, Tag, Eye, Star } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { resourceService } from "@/services/resourceService";

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
    if (!bytes) return '';
    const kb = bytes / 1024;
    const mb = kb / 1024;
    if (mb >= 1) return `${mb.toFixed(1)}MB`;
    return `${kb.toFixed(1)}KB`;
  };

  const handleDownload = async () => {
    if (!resource?.file_url) return;

    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      
      await resourceService.incrementDownloadCount(resource.id, ipData.ip);
      
      window.open(resource.file_url, '_blank');
    } catch (error) {
      console.error('Download error:', error);
      if (resource.file_url) {
        window.open(resource.file_url, '_blank');
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
            <div className="bg-white rounded-lg shadow-sm border p-8">
              {/* 헤더 */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{resource.title}</h1>
                    {resource.is_featured && (
                      <Star className="w-6 h-6 text-yellow-500 fill-current" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{resource.author_name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(resource.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{resource.download_count.toLocaleString()} 다운로드</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary">{resource.category}</Badge>
                    {resource.file_size && (
                      <Badge variant="outline">{formatFileSize(resource.file_size)}</Badge>
                    )}
                  </div>

                  {resource.tags.length > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                      <Tag className="w-4 h-4 text-gray-500" />
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
                  className="bg-purple-600 hover:bg-purple-700 text-white"
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
                  <div 
                    className="prose max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: resource.description }}
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
