
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Image, File, Star } from "lucide-react";
import { Resource } from "@/types/resources";
import { incrementDownloadCountSafely, buildDownloadFilename, buildDownloadUrl } from "@/utils/downloadPrivacy";

interface ResourceCardProps {
  resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return <Image className="w-5 h-5 text-blue-500" />;
      case 'document':
        return <FileText className="w-5 h-5 text-green-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownload = async () => {
    if (!resource.file_url) return;

    try {
      // 개인정보 보호를 적용한 안전한 다운로드 로깅
      await incrementDownloadCountSafely(resource.id);

      // 보기 좋은 파일명으로 다운로드 강제
      const filename = buildDownloadFilename(resource.title, resource.file_url || '');
      const finalUrl = buildDownloadUrl(resource.file_url, filename);
      window.open(finalUrl, '_blank');
    } catch (error) {
      console.error('Download error:', error);
      // 에러가 발생해도 다운로드는 진행 (동일한 파일명 적용)
      const filename = buildDownloadFilename(resource.title, resource.file_url || '');
      const finalUrl = buildDownloadUrl(resource.file_url!, filename);
      window.open(finalUrl, '_blank');
    }
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow group">
      {resource.is_featured && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="flex items-center gap-1 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            <Star size={12} className="fill-current" />
            추천
          </div>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {getFileIcon(resource.file_type)}
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-purple-600 transition-colors">
              {resource.title}
            </h3>
          </div>
        </div>
        <Badge variant="secondary" className="w-fit">
          {resource.category}
        </Badge>
      </CardHeader>
      
      <CardContent className="flex-grow pb-3">
        {resource.description && (
          <p className="text-gray-600 text-sm line-clamp-3 mb-3">
            {resource.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-1 mb-3">
          {resource.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{resource.author_name}</span>
          {resource.file_size && (
            <span>{formatFileSize(resource.file_size)}</span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-3">
        <div className="w-full flex items-center justify-between">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Download size={12} />
            {resource.download_count}회 다운로드
          </span>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            <Download size={16} />
            다운로드
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}
