
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { BlogCategory } from "@/types/supabase";

interface CategorySummaryProps {
  categories: BlogCategory[];
  categoryPostCounts: Record<string, number>;
  isLoading: boolean;
}

export function CategorySummary({ categories, categoryPostCounts, isLoading }: CategorySummaryProps) {
  return (
    <Card className="mb-6 mt-6">
      <CardHeader>
        <CardTitle>카테고리 요약</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">데이터 로딩 중...</div>
        ) : categories.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.id} className="shadow-sm">
                <CardContent className="p-4">
                  <div className="font-medium">{category.name}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    포스트: {categoryPostCounts[category.name] || 0}개
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">카테고리가 없습니다.</div>
        )}
      </CardContent>
    </Card>
  );
}
