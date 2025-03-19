
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const inviteSchema = z.object({
  nickname: z.string().min(2, "닉네임은 최소 2자 이상이어야 합니다."),
  message: z.string().min(3, "한마디를 입력해주세요."),
  invite_url: z.string()
    .min(10, "URL을 입력해주세요.")
    .refine(
      (url) => url.startsWith("https://www.genspark.ai/invite?invite_code="),
      "올바른 젠스파크 초대 URL 형식이 아닙니다."
    )
});

type InviteFormValues = z.infer<typeof inviteSchema>;

interface InviteFormProps {
  onSuccess: () => void;
}

export function InviteForm({ onSuccess }: InviteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      nickname: "",
      message: "",
      invite_url: ""
    }
  });

  const onSubmit = async (data: InviteFormValues) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("genspark_invites")
        .insert(data);  // Pass the data object directly, not as an array
        
      if (error) {
        if (error.code === "23505") {
          toast.error("이미 등록된 초대 URL입니다.");
        } else {
          console.error("Error submitting invite:", error);
          toast.error("초대 링크 등록 중 오류가 발생했습니다.");
        }
        return;
      }
      
      toast.success("초대 링크가 성공적으로 등록되었습니다!");
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error submitting invite:", error);
      toast.error("초대 링크 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>닉네임</FormLabel>
                <FormControl>
                  <Input placeholder="닉네임을 입력하세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>한마디</FormLabel>
                <FormControl>
                  <Input placeholder="간단한 소개나 메시지를 입력하세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="invite_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>초대 링크 URL</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://www.genspark.ai/invite?invite_code=..." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full md:w-auto" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "등록 중..." : "초대 링크 등록하기"}
        </Button>
      </form>
    </Form>
  );
}
