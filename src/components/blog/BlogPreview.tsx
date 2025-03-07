
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BlogPreviewProps {
  title: string;
  content: string;
  category: string;
  tags: string;
}

export function BlogPreview({ title, content, category, tags }: BlogPreviewProps) {
  const [parsedTags, setParsedTags] = useState<string[]>([]);

  // Parse tags whenever the tags string changes
  useEffect(() => {
    const tagArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== "");
    setParsedTags(tagArray);
  }, [tags]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-purple-800 mb-4">미리보기</h2>
      <Card className="overflow-hidden">
        {category && (
          <div className="p-4 pb-0">
            <span className="blog-category">{category}</span>
          </div>
        )}
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-2xl">
            {title || "제목을 입력하세요"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {content ? (
            <div 
              className="prose prose-purple max-w-none" 
              dangerouslySetInnerHTML={{ __html: content }} 
            />
          ) : (
            <p className="text-gray-400 italic">내용을 입력하세요...</p>
          )}
          
          {parsedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {parsedTags.map((tag, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
