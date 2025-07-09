
import { FormEvent } from "react";
import { BlogTitleInput } from "./BlogTitleInput";
import { BlogContentInput } from "./BlogContentInput";
import { BlogCategorySelect } from "./BlogCategorySelect";
import { BlogSubmitButton } from "./BlogSubmitButton";
import { BlogTagsInput } from "./BlogTagsInput";
import { BlogCategory } from "@/types/supabase";
import { CalendarIcon, Clock } from "lucide-react"; // lucide-react 아이콘 활용
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

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
  isEditMode?: boolean;

  // 예약발행 관련
  scheduled: boolean;
  setScheduled: (val: boolean) => void;
  scheduledDate: Date | null;
  setScheduledDate: (val: Date | null) => void;
  scheduledTime: string;
  setScheduledTime: (val: string) => void;
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
  onSubmit,
  isEditMode = false,
  // 예약발행 관련 prop
  scheduled,
  setScheduled,
  scheduledDate,
  setScheduledDate,
  scheduledTime,
  setScheduledTime
}: BlogFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-sm border border-gray-100 h-full flex flex-col relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-purple-800">
          {isEditMode ? "글 수정" : "글 작성"}
        </h2>
        {/* 예약발행 UI */}
        <div className="flex items-center gap-3">
          <Checkbox 
            id="scheduled-checkbox"
            checked={scheduled}
            onCheckedChange={val => setScheduled(!!val)}
          />
          <label htmlFor="scheduled-checkbox" className="text-base text-purple-700 select-none cursor-pointer">
            예약
          </label>
          {scheduled && (
            <div className="flex items-center gap-2 ml-3 animate-fade-in">
              {/* 날짜 선택 */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 min-w-[120px] px-2 text-xs"
                  >
                    <CalendarIcon className="w-4 h-4 text-purple-600" />
                    {scheduledDate ? (
                      scheduledDate.toLocaleDateString()
                    ) : (
                      <span className="text-gray-400">날짜 선택</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50">
                  <Calendar
                    mode="single"
                    selected={scheduledDate ?? undefined}
                    onSelect={setScheduledDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
              {/* 시간 선택 */}
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-purple-600" />
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={e => setScheduledTime(e.target.value)}
                  className="border text-xs rounded px-1 py-1 h-8 w-20 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  step={60}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 저장 버튼을 상단으로 이동 */}
      <div className="mb-6 flex justify-end">
        <BlogSubmitButton isSubmitting={isSubmitting} isEditMode={isEditMode} />
      </div>
      <div className="space-y-6 flex-grow overflow-auto">
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
    </form>
  );
}
