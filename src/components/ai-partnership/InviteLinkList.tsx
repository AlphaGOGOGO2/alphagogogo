
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { InviteLinkCard } from "./InviteLinkCard";
import { Skeleton } from "@/components/ui/skeleton";

interface InviteLink {
  id: string;
  service_name: string;
  invite_url: string;
  user_nickname: string;
  description: string | null;
  click_count: number;
  created_at: string;
  updated_at: string;
}

interface InviteLinkListProps {
  selectedService: string;
}

export function InviteLinkList({ selectedService }: InviteLinkListProps) {
  const [links, setLinks] = useState<InviteLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLinks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('invite_links')
        .select('*')
        .eq('service_name', selectedService)
        .order('click_count', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Fetch error:', error);
        return;
      }

      setLinks(data || []);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkClick = async (linkId: string) => {
    try {
      // 클릭 수 증가 (IP 기반 중복 방지는 함수에서 처리)
      await supabase.rpc('increment_invite_click_count', { 
        link_id: linkId 
      });
      
      // 로컬 상태 업데이트 (클릭수가 100에 도달하면 서버에서 삭제되므로 refetch)
      fetchLinks();
    } catch (error) {
      console.error('Click tracking error:', error);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [selectedService]);

  // 실시간 업데이트 구독
  useEffect(() => {
    const channel = supabase
      .channel('invite_links_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invite_links',
          filter: `service_name=eq.${selectedService}`
        },
        () => {
          fetchLinks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedService]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">등록된 초대링크</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 border rounded-lg">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-full mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          등록된 초대링크 ({links.length}개)
        </h2>
        <div className="text-sm text-gray-500">
          클릭수 높은 순 정렬
        </div>
      </div>
      
      {links.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>아직 등록된 초대링크가 없습니다.</p>
          <p className="text-sm mt-1">첫 번째 초대링크를 등록해보세요!</p>
        </div>
      ) : (
        <>
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              💡 <strong>자동 정리 시스템:</strong> 클릭수가 100회에 도달한 초대링크는 자동으로 삭제됩니다. 
              클릭수가 높은 링크부터 우선 표시됩니다.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {links.map((link) => (
              <InviteLinkCard
                key={link.id}
                link={link}
                onLinkClick={handleLinkClick}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
