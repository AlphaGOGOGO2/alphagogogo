
import { FormEvent } from "react";
import { BlogTitleInput } from "./BlogTitleInput";
import { BlogContentInput } from "./BlogContentInput";
import { BlogCategorySelect } from "./BlogCategorySelect";
import { BlogSubmitButton } from "./BlogSubmitButton";
import { BlogTagsInput } from "./BlogTagsInput";
import { BlogCategory } from "@/types/supabase";

interface BlogFormProps {
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  category: string;
  setCategory: (category: string) => void;
  tags: string;
  setTags: (tags: string) => void;
  categories: BlogCategory[];
  isCategoriesLoading: boolean;
  isSubmitting: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

export function BlogForm({
  title,
  setTitle,
  content,
  setContent,
  category,
  setCategory,
  tags,
  setTags,
  categories,
  isCategoriesLoading,
  isSubmitting,
  onSubmit
}: BlogFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-purple-800 mb-4">글 작성</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BlogCategorySelect
            category={category}
            setCategory={setCategory}
            categories={categories}
            isLoading={isCategoriesLoading}
          />
          <BlogTagsInput tags={tags} setTags={setTags} />
        </div>
        <BlogTitleInput title={title} setTitle={setTitle} />
        <BlogContentInput content={content} setContent={setContent} />
      </div>
      <div className="flex justify-end">
        <BlogSubmitButton isSubmitting={isSubmitting} />
      </div>
    </form>
  );
}
