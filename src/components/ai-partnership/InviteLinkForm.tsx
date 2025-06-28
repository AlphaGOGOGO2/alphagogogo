
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AIPartnershipService } from "@/config/navigation";

interface InviteLinkFormProps {
  selectedService: string;
  serviceConfig?: AIPartnershipService;
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
    return url.startsWith(serviceConfig.urlPattern) && url.length > serviceConfig.urlPattern.length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nickname.trim() || !formData.inviteUrl.trim()) {
      toast.error("닉네임과 초대링크를 모두 입력해주세요.");
      return;
    }

    if (!validateUrl(formData.inviteUrl)) {
      toast.error(`올바른 ${serviceConfig?.name} 초대링크 형식이 아닙니다.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('invite_links')
        .insert({
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">초대링크 등록</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nickname">닉네임 *</Label>
            <Input
              id="nickname"
              value={formData.nickname}
              onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
              placeholder="본인을 나타낼 닉네임"
              maxLength={50}
            />
          </div>

          <div>
            <Label htmlFor="inviteUrl">초대링크 *</Label>
            <Input
              id="inviteUrl"
              value={formData.inviteUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, inviteUrl: e.target.value }))}
              placeholder={serviceConfig?.urlPattern + "여기에-초대코드"}
              type="url"
            />
            {serviceConfig && (
              <p className="text-xs text-gray-500 mt-1">
                {serviceConfig.urlPattern}로 시작하는 링크만 등록 가능합니다.
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">설명 (선택)</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="추가 설명이나 메모"
              maxLength={200}
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "등록 중..." : "초대링크 등록"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
