
import { useState, useEffect } from "react";
import { GensparkInvite } from "@/types/genspark";
import { InviteCard } from "./InviteCard";
import { EmptyInviteState } from "./EmptyInviteState";
import { supabase } from "@/integrations/supabase/client";

interface InviteGridProps {
  invites: GensparkInvite[];
  onInviteUpdate: () => void;
}

export function InviteGrid({ invites, onInviteUpdate }: InviteGridProps) {
  // Track which invites are currently being processed
  const [processingIds, setProcessingIds] = useState<Record<string, boolean>>({});
  // Local copy of invites to update in real-time
  const [localInvites, setLocalInvites] = useState<GensparkInvite[]>(invites);

  // Update local invites when prop invites change
  useEffect(() => {
    setLocalInvites(invites);
  }, [invites]);

  // Set up real-time subscription to updates
  useEffect(() => {
    // Enable realtime for this table
    const enableRealtimeQuery = async () => {
      try {
        await supabase.rpc('supabase_realtime', {
          table: 'genspark_invites',
          insert: true,
          update: true,
          delete: true
        } as Record<string, unknown>);
        console.log('Realtime enabled for genspark_invites table in InviteGrid');
      } catch (error) {
        console.error('Error enabling realtime:', error);
      }
    };
    enableRealtimeQuery();

    // Subscribe to changes on the genspark_invites table
    const channel = supabase
      .channel('genspark_invites_changes')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'genspark_invites' }, 
        (payload) => {
          console.log('실시간 데이터 업데이트:', payload);
          
          // Update the local invites with the new data
          setLocalInvites(current => 
            current.map(invite => 
              invite.id === payload.new.id 
                ? { ...invite, clicks: payload.new.clicks } 
                : invite
            )
          );
        }
      )
      .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'genspark_invites' },
        (payload) => {
          console.log('초대장 삭제됨:', payload);
          // Remove the deleted invite from the local state
          setLocalInvites(current => 
            current.filter(invite => invite.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    // Cleanup subscription when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleProcessingChange = (id: string, isProcessing: boolean) => {
    setProcessingIds(prev => ({
      ...prev,
      [id]: isProcessing
    }));
  };

  if (localInvites.length === 0) {
    return <EmptyInviteState />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {localInvites.map((invite) => (
        <InviteCard
          key={invite.id}
          invite={invite}
          onInviteUpdate={onInviteUpdate}
          processing={!!processingIds[invite.id]}
          onProcessingChange={handleProcessingChange}
        />
      ))}
    </div>
  );
}
