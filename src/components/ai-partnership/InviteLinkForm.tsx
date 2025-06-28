
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AIService {
  id: string;
  name: string;
  display_name: string;
  url_pattern: string;
  description: string;
  benefits: string[];
  is_active: boolean;
}

interface InviteLinkFormProps {
  selectedService: string;
  serviceConfig?: AIService;
}

export function InviteLinkForm({ selectedService, serviceConfig }: InviteLinkFormProps) {
  const [formData, setFormData] = useState({
    nickname: "",
    inviteUrl: "",
    description: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateUrl = (url: string): boolean => {
    if (!serviceConfig) return false;
    return url.startsWith(serviceConfig.url_pattern) && url.length > serviceConfig.url_pattern.length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nickname.trim() || !formData.inviteUrl.trim()) {
      toast.error("닉네임과 초대링크를 모두 입력해주세요.");
      return;
    }

    if (!validateUrl(formData.inviteUrl)) {
      toast.error(`올바른 ${serviceConfig?.display_name} 초대링크 형식이 아닙니다.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('invite_links')
        .insert({
          service_id: serviceConfig?.id,
          service_name: selectedService,
          invite_url: formData.inviteUrl.trim(),
          user_nickname: formData.nickname.trim(),
          description: formData.description.trim() || null
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error("이미 등록된 초대링크입니다.");
        } else {
          console.error('Insert error:', error);
          toast.error("등록 중 오류가 발생했습니다.");
        }
        return;
      }

      toast.success("초대링크가 성공적으로 등록되었습니다!");
      setFormData({ nickname: "", inviteUrl: "", description: "" });
    } catch (error) {
      console.error('Submission error:', error);
      toast.error("등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!serviceConfig) {
    return (
      <Card className="w-full">
        <CardContent className="text-center py-8">
          <p className="text-gray-500">서비스 정보를 불러오는 중...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">초대링크 등록</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="md:col-span-1 lg:col-span-1">
              <Label htmlFor="nickname">닉네임 *</Label>
              <Input
                id="nickname"
                value={formData.nickname}
                onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
                placeholder="닉네임"
                maxLength={50}
              />
            </div>

            <div className="md:col-span-1 lg:col-span-2">
              <Label htmlFor="inviteUrl">초대링크 *</Label>
              <Input
                id="inviteUrl"
                value={formData.inviteUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, inviteUrl: e.target.value }))}
                placeholder={serviceConfig.url_pattern + "여기에-초대코드"}
                type="url"
              />
            </div>

            <div className="md:col-span-1 lg:col-span-1">
              <Label htmlFor="description">설명 (선택)</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="추가 설명"
                maxLength={200}
              />
            </div>

            <div className="md:col-span-3 lg:col-span-1 flex items-end">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-10"
              >
                {isSubmitting ? "등록 중..." : "등록"}
              </Button>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            {serviceConfig.url_pattern}로 시작하는 링크만 등록 가능합니다.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
