
import { FormEvent } from "react";
import { BlogTitleInput } from "./BlogTitleInput";
import { BlogContentInput } from "./BlogContentInput";
import { BlogCategorySelect } from "./BlogCategorySelect";
import { BlogSubmitButton } from "./BlogSubmitButton";
import { BlogCategory } from "@/types/supabase";

interface BlogFormProps {
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  category: string;
  setCategory: (category: string) => void;
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
  categories,
  isCategoriesLoading,
  isSubmitting,
  onSubmit
}: BlogFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div className="space-y-4">
        <BlogTitleInput title={title} setTitle={setTitle} />
        <BlogContentInput content={content} setContent={setContent} />
        <BlogCategorySelect
          category={category}
          setCategory={setCategory}
          categories={categories}
          isLoading={isCategoriesLoading}
        />
      </div>
      <BlogSubmitButton isSubmitting={isSubmitting} />
    </form>
  );
}
