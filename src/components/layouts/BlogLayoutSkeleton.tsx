
import { Skeleton } from "@/components/ui/skeleton";

export function BlogLayoutSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 네비게이션 스켈레톤 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b h-20 px-6 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
          <Skeleton className="h-8 w-32" />
          <div className="hidden md:flex items-center gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-6 w-16" />
            ))}
          </div>
          <Skeleton className="md:hidden h-6 w-6" />
        </div>
      </div>
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 배너 스켈레톤 */}
          <div className="mb-8">
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
          
          {/* 제목 스켈레톤 */}
          <div className="py-8">
            <Skeleton className="h-10 w-64 mb-6" />
            
            {/* 카테고리 탭 스켈레톤 */}
            <div className="flex flex-wrap gap-2 md:gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))}
            </div>
          </div>
          
          {/* 콘텐츠 스켈레톤 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      {/* 푸터 스켈레톤 */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-5 w-24 bg-gray-700" />
                <Skeleton className="h-4 w-full bg-gray-700" />
                <Skeleton className="h-4 w-3/4 bg-gray-700" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
