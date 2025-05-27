
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Image, File, Star, Calendar, User } from "lucide-react";
import { Resource } from "@/types/resources";

interface ResourceTableProps {
  resources: Resource[];
}

export function ResourceTable({ resources }: ResourceTableProps) {
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return <Image className="w-4 h-4 text-blue-500" />;
      case 'document':
        return <FileText className="w-4 h-4 text-green-500" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (resources.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">등록된 자료가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-12"></TableHead>
            <TableHead className="font-semibold">제목</TableHead>
            <TableHead className="w-32 text-center font-semibold">작성자</TableHead>
            <TableHead className="w-36 text-center font-semibold">등록일</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map((resource) => (
            <TableRow 
              key={resource.id} 
              className="hover:bg-gray-50 transition-colors"
            >
              <TableCell className="text-center">
                <div className="relative">
                  {getFileIcon(resource.file_type)}
                  {resource.is_featured && (
                    <Star className="w-3 h-3 text-yellow-500 fill-current absolute -top-1 -right-1" />
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <div className="space-y-1">
                  <Link 
                    to={`/resources/${resource.id}`}
                    className="font-medium text-gray-900 hover:text-purple-600 transition-colors cursor-pointer block"
                  >
                    {resource.title}
                  </Link>
                  {resource.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {resource.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{resource.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </TableCell>
              
              <TableCell className="text-center text-sm text-gray-600">
                <div className="flex items-center justify-center gap-1">
                  <User className="w-3 h-3" />
                  <span className="truncate max-w-[100px]" title={resource.author_name}>
                    {resource.author_name}
                  </span>
                </div>
              </TableCell>
              
              <TableCell className="text-center text-sm text-gray-600">
                <div className="flex items-center justify-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(resource.created_at)}</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
