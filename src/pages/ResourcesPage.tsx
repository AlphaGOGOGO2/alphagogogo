import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Search, Star, LayoutGrid, LayoutList } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { ResourceTable } from "@/components/resources/ResourceTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { resourceService } from "@/services/resourceService";
import { Resource } from "@/types/resources";

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['resources'],
    queryFn: resourceService.getAllResources
  });

  const { data: featuredResources = [] } = useQuery({
    queryKey: ['featured-resources'],
    queryFn: resourceService.getFeaturedResources
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['resource-categories'],
    queryFn: resourceService.getCategories
  });

  useEffect(() => {
    let filtered = resources;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredResources(filtered);
  }, [resources, selectedCategory, searchQuery]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
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

  return (
    <>
      <Helmet>
        <title>자료실 - 알파고고고</title>
        <meta name="description" content="AI 관련 자료를 다운로드하고 활용하세요. 이미지, 문서, 템플릿 등 다양한 자료를 제공합니다." />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-6 md:px-8">
            {/* 헤더 섹션 */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                자료실
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                AI 관련 자료를 다운로드하고 활용하세요
              </p>
            </div>

            {/* 추천 자료 섹션 */}
            {featuredResources.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <Star className="w-6 h-6 text-yellow-500 fill-current" />
                  <h2 className="text-2xl font-bold text-gray-900">추천 자료</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredResources.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </section>
            )}

            {/* 검색 및 보기 모드 */}
            <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="자료 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">보기:</span>
                <div className="flex border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                    className="rounded-none"
                  >
                    <LayoutList className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'card' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('card')}
                    className="rounded-none"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* 카테고리 탭과 자료 목록 */}
            <Tabs value={selectedCategory} onValueChange={handleCategoryChange} className="w-full">
              <TabsList className="grid w-full max-w-2xl mx-auto mb-8" style={{ gridTemplateColumns: `repeat(${categories.length + 1}, 1fr)` }}>
                <TabsTrigger value="all">전체</TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.name}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={selectedCategory} className="mt-0">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedCategory === "all" ? "모든 자료" : `${selectedCategory} 자료`}
                  </h2>
                  <span className="text-gray-600">
                    {filteredResources.length}개의 자료
                  </span>
                </div>

                {filteredResources.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                      {searchQuery ? "검색 결과가 없습니다." : "등록된 자료가 없습니다."}
                    </p>
                  </div>
                ) : (
                  viewMode === 'table' ? (
                    <ResourceTable resources={filteredResources} />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredResources.map((resource) => (
                        <ResourceCard key={resource.id} resource={resource} />
                      ))}
                    </div>
                  )
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
