
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { getAllBlogPosts } from "@/services/blogService";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { formatDate } from "@/lib/utils";
import { Edit, Plus, Search, ExternalLink, SortDesc, SortAsc } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export default function AdminPostsPage() {
  // 검색어 및 정렬 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // 블로그 포스트 데이터 가져오기
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["all-blog-posts"],
    queryFn: getAllBlogPosts
  });
  
  // 검색 및 정렬 적용
  const filteredPosts = posts
    .filter(post => 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  
  return (
    <AdminLayout title="블로그 포스트 관리">
      <SEO 
        title="블로그 포스트 관리 | 관리자 대시보드" 
        description="블로그 포스트 관리" 
      />
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 w-full max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="포스트 검색..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            title={sortOrder === "asc" ? "오래된 순으로 정렬" : "최신 순으로 정렬"}
          >
            {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </Button>
        </div>
        
        <Button asChild>
          <Link to="/blog/write">
            <Plus className="h-4 w-4 mr-2" />
            새 포스트 작성
          </Link>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-10">데이터를 불러오는 중...</div>
      ) : filteredPosts.length > 0 ? (
        <div className="bg-white rounded-md shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[400px]">제목</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead>발행일</TableHead>
                <TableHead>업데이트</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>{formatDate(post.publishedAt)}</TableCell>
                  <TableCell>{post.updatedAt ? formatDate(post.updatedAt) : "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/blog/edit/${post.slug}`} title="포스트 편집">
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" title="포스트 보기">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-10">
          {searchTerm ? "검색 결과가 없습니다." : "등록된 포스트가 없습니다."}
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-500">
        총 {filteredPosts.length}개의 포스트
      </div>
    </AdminLayout>
  );
}
