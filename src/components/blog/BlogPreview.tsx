
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
    <div className="p-8 h-full">
      <h2 className="text-xl font-semibold text-purple-800 mb-4">미리보기</h2>
      <Card className="overflow-hidden h-[calc(100%-3rem)] flex flex-col">
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
        <CardContent className="space-y-4 overflow-auto flex-grow">
          {content ? (
            <div className="markdown-purple prose prose-purple max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <h1 className="mt-8 mb-4 text-3xl font-bold text-purple-900 border-b-2 border-purple-300 pb-1" {...props} />,
                  h2: ({node, ...props}) => <h2 className="mt-7 mb-3 text-2xl font-semibold text-purple-800 border-b border-purple-200 pb-1" {...props} />,
                  h3: ({node, ...props}) => <h3 className="mt-6 mb-2 text-xl font-semibold text-purple-700" {...props} />,
                  h4: ({node, ...props}) => <h4 className="mt-5 mb-2 text-lg font-semibold text-purple-600" {...props} />,
                  h5: ({node, ...props}) => <h5 className="mt-4 mb-2 text-base font-semibold text-purple-500" {...props} />,
                  h6: ({node, ...props}) => <h6 className="mt-3 mb-2 text-base font-semibold text-purple-400" {...props} />,
                  p: ({node, ...props}) => <p className="my-3 text-gray-800" {...props} />,
                  a: ({node, ...props}) => <a className="text-purple-600 underline hover:text-purple-800 transition" target="_blank" rel="noopener noreferrer" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 my-3" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-6 my-3" {...props} />,
                  li: ({node, ...props}) => <li className="my-1" {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-purple-300 pl-4 italic text-gray-600 bg-purple-50 py-2 rounded" {...props} />,
                  code: ({inline, ...props}) => inline
                    ? <code className="bg-purple-50 px-1 rounded text-purple-700 text-[0.98em]" {...props} />
                    : <pre className="bg-gray-900 text-gray-100 rounded p-4 my-4 overflow-x-auto"><code {...props} /></pre>,
                  table: ({node, ...props}) => <table className="w-full border-t border-purple-200 my-4" {...props} />,
                  th: ({node, ...props}) => <th className="bg-purple-50 text-purple-700 px-4 py-2 font-medium border-b border-purple-200" {...props} />,
                  td: ({node, ...props}) => <td className="px-4 py-2 border-b border-purple-100" {...props} />,
                  img: ({node, ...props}) => <img className="rounded-lg my-4 max-w-full mx-auto shadow-md border border-purple-100" {...props} />,
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
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
