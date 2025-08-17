
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Users, MousePointer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AIService {
  id: string;
  name: string;
  display_name: string;
  url_pattern: string;
  description: string;
  benefits: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ServiceStats {
  service_id: string;
  service_name: string;
  total_links: number;
  total_clicks: number;
}

export default function AdminAiServicesPage() {
  const [services, setServices] = useState<AIService[]>([]);
  const [stats, setStats] = useState<ServiceStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<AIService | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    display_name: "",
    url_pattern: "",
    description: "",
    benefits: "",
    is_active: true
  });

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('원본 데이터:', data);
      
      // JSONB 타입 데이터를 안전하게 변환
      const transformedData = data?.map(service => {
        let benefitsArray: string[] = [];
        
        // benefits가 이미 배열인지 확인
        if (Array.isArray(service.benefits)) {
          benefitsArray = service.benefits.map(benefit => String(benefit));
        } 
        // benefits가 문자열인 경우 JSON 파싱 시도
        else if (typeof service.benefits === 'string') {
          try {
            const parsed = JSON.parse(service.benefits);
            benefitsArray = Array.isArray(parsed) ? parsed.map(benefit => String(benefit)) : [];
          } catch {
            benefitsArray = [];
          }
        }
        // benefits가 null 또는 undefined인 경우
        else {
          benefitsArray = [];
        }
        
        console.log(`서비스 ${service.name}의 benefits:`, {
          original: service.benefits,
          transformed: benefitsArray
        });
        
        return {
          ...service,
          benefits: benefitsArray
        };
      }) || [];
      
      console.log('변환된 데이터:', transformedData);
      setServices(transformedData);
    } catch (error) {
      console.error('서비스 조회 오류:', error);
      toast.error("서비스 조회 중 오류가 발생했습니다.");
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('invite_links')
        .select(`
          service_id,
          service_name,
          click_count
        `);

      if (error) throw error;

      const statsMap = new Map<string, ServiceStats>();
      
      data?.forEach(link => {
        const key = link.service_id || link.service_name;
        if (!statsMap.has(key)) {
          statsMap.set(key, {
            service_id: link.service_id || '',
            service_name: link.service_name,
            total_links: 0,
            total_clicks: 0
          });
        }
        const stat = statsMap.get(key)!;
        stat.total_links += 1;
        stat.total_clicks += link.click_count;
      });

      setStats(Array.from(statsMap.values()));
    } catch (error) {
      console.error('통계 조회 오류:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchServices(), fetchStats()]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // benefits를 배열로 변환 (빈 줄과 공백 제거)
      const benefits = formData.benefits
        .split('\n')
        .map(b => b.trim())
        .filter(b => b.length > 0);
      
      console.log('저장할 benefits:', benefits);
      
      const serviceData = {
        name: formData.name.trim(),
        display_name: formData.display_name.trim(),
        url_pattern: formData.url_pattern.trim(),
        description: formData.description.trim(),
        benefits: benefits,
        is_active: formData.is_active
      };

      console.log('전체 저장 데이터:', serviceData);

      const action = editingService ? 'update' : 'create';
      const requestData = {
        action,
        ...(editingService && { service_id: editingService.id }),
        service_data: serviceData
      };

      const { data, error } = await supabase.functions.invoke('manage-ai-services', {
        body: requestData
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      toast.success(editingService ? "서비스가 수정되었습니다." : "서비스가 추가되었습니다.");
      setIsDialogOpen(false);
      resetForm();
      fetchServices();
    } catch (error: any) {
      console.error('서비스 저장 오류:', error);
      if (error.message?.includes('23505') || error.message?.includes('이미 존재')) {
        toast.error("이미 존재하는 서비스명입니다.");
      } else {
        toast.error("서비스 저장 중 오류가 발생했습니다.");
      }
    }
  };

  const handleEdit = (service: AIService) => {
    console.log('편집할 서비스:', service);
    setEditingService(service);
    setFormData({
      name: service.name,
      display_name: service.display_name,
      url_pattern: service.url_pattern,
      description: service.description,
      benefits: service.benefits.join('\n'), // 배열을 줄바꿈으로 구분된 문자열로 변환
      is_active: service.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (service: AIService) => {
    if (!confirm(`"${service.display_name}" 서비스를 삭제하시겠습니까?`)) return;

    try {
      const { data, error } = await supabase.functions.invoke('manage-ai-services', {
        body: {
          action: 'delete',
          service_id: service.id
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      toast.success("서비스가 삭제되었습니다.");
      fetchServices();
    } catch (error: any) {
      console.error('서비스 삭제 오류:', error);
      if (error.message?.includes('existing invite links')) {
        toast.error("연결된 초대링크가 있어 삭제할 수 없습니다. 먼저 모든 초대링크를 삭제해주세요.");
      } else {
        toast.error("서비스 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const toggleActive = async (service: AIService) => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-ai-services', {
        body: {
          action: 'toggle_active',
          service_id: service.id
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      toast.success(`서비스가 ${!service.is_active ? '활성화' : '비활성화'}되었습니다.`);
      fetchServices();
    } catch (error: any) {
      console.error('서비스 상태 변경 오류:', error);
      toast.error("서비스 상태 변경 중 오류가 발생했습니다.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      display_name: "",
      url_pattern: "",
      description: "",
      benefits: "",
      is_active: true
    });
    setEditingService(null);
  };

  const getServiceStats = (serviceId: string, serviceName: string) => {
    return stats.find(s => s.service_id === serviceId || s.service_name === serviceName) || {
      total_links: 0,
      total_clicks: 0
    };
  };

  if (isLoading) {
    return (
      <AdminLayout title="AI 품앗이 서비스 관리">
        <div>로딩 중...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="AI 품앗이 서비스 관리">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">AI 서비스 관리</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                새 서비스 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingService ? '서비스 수정' : '새 서비스 추가'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">서비스 코드명 *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="lovable, manus 등"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="display_name">표시명 *</Label>
                    <Input
                      id="display_name"
                      value={formData.display_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                      placeholder="러버블, 마누스 등"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="url_pattern">URL 패턴 *</Label>
                  <Input
                    id="url_pattern"
                    value={formData.url_pattern}
                    onChange={(e) => setFormData(prev => ({ ...prev, url_pattern: e.target.value }))}
                    placeholder="https://example.com/invite/"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">설명 *</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="서비스 설명"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="benefits">혜택 (한 줄에 하나씩) *</Label>
                  <Textarea
                    id="benefits"
                    value={formData.benefits}
                    onChange={(e) => setFormData(prev => ({ ...prev, benefits: e.target.value }))}
                    placeholder="초대받은 사람: 10크레딧 획득&#10;초대한 사람: 5크레딧 획득"
                    rows={4}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">서비스 활성화</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    취소
                  </Button>
                  <Button type="submit">
                    {editingService ? '수정' : '추가'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {services.map((service) => {
            const serviceStats = getServiceStats(service.id, service.name);
            return (
              <Card key={service.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {service.display_name}
                        <Badge variant={service.is_active ? "default" : "secondary"}>
                          {service.is_active ? "활성" : "비활성"}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {service.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActive(service)}
                      >
                        {service.is_active ? "비활성화" : "활성화"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(service)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(service)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">URL 패턴:</p>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {service.url_pattern}
                      </code>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">혜택:</p>
                      <ul className="text-sm space-y-1">
                        {service.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      {service.benefits.length === 0 && (
                        <p className="text-sm text-gray-500 italic">혜택 정보가 없습니다.</p>
                      )}
                    </div>

                    <div className="flex gap-4 pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span>등록된 링크: {serviceStats.total_links}개</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MousePointer className="h-4 w-4 text-green-500" />
                        <span>총 클릭수: {serviceStats.total_clicks}회</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {services.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">등록된 AI 서비스가 없습니다.</p>
              <p className="text-sm text-gray-400 mt-1">새 서비스를 추가해보세요!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
