
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { InviteLinkCard } from "./InviteLinkCard";
import { Skeleton } from "@/components/ui/skeleton";
import { getClientId } from "@/utils/clientIdUtils";

interface InviteLink {
  id: string;
  service_name: string;
  user_nickname: string; // anonymized in public view
  description: string | null;
  click_count: number;
  created_at: string;
  updated_at: string;
  // invite_url removed from public interface
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
      // Use secure edge function to get public invite link data
      const response = await fetch(
        `https://plimzlmmftdbpipbnhsy.supabase.co/functions/v1/get-invite-links?service=${encodeURIComponent(selectedService)}`
      );

      if (!response.ok) {
        console.error('Fetch error:', response.status);
        return;
      }

      const result = await response.json();
      if (result.success) {
        setLinks(result.data || []);
      } else {
        console.error('API error:', result.error);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkClick = async (linkId: string) => {
    try {
      // Get actual invite URL via secure function
      const urlResponse = await fetch(
        `https://plimzlmmftdbpipbnhsy.supabase.co/functions/v1/get-invite-link-url?id=${linkId}`
      );
      
      if (!urlResponse.ok) {
        console.error('URL fetch error:', urlResponse.status);
        return;
      }
      
      const urlResult = await urlResponse.json();
      if (!urlResult.success) {
        console.error('URL fetch failed:', urlResult.error);
        return;
      }
      
      // Track click with RPC
      const clientId = getClientId();
      console.log('클라이언트 ID로 클릭 추적:', clientId);
      
      await supabase.rpc('increment_invite_click_count', { 
        link_id: linkId,
        client_id: clientId
      });
      
      // Open the actual invite URL
      window.open(urlResult.invite_url, '_blank', 'noopener,noreferrer');
      
      // Refresh links (click count may have changed, link may be deleted at 100 clicks)
      fetchLinks();
    } catch (error) {
      console.error('Click handling error:', error);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {links.map((link) => (
            <InviteLinkCard
              key={link.id}
              link={link}
              onLinkClick={handleLinkClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
