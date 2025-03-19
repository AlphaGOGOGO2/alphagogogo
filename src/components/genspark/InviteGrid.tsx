
import { useState } from "react";
import { GensparkInvite } from "@/types/genspark";
import { InviteCard } from "./InviteCard";
import { EmptyInviteState } from "./EmptyInviteState";

interface InviteGridProps {
  invites: GensparkInvite[];
  onInviteUpdate: () => void;
}

export function InviteGrid({ invites, onInviteUpdate }: InviteGridProps) {
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [localClickCounts, setLocalClickCounts] = useState<Record<string, number>>({});

  const handleProcessingChange = (id: string, isProcessing: boolean) => {
    setProcessingIds(prev => {
      const newSet = new Set(prev);
      if (isProcessing) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const handleClickCountChange = (id: string, count: number) => {
    setLocalClickCounts(prev => ({
      ...prev,
      [id]: count
    }));
  };

  if (invites.length === 0) {
    return <EmptyInviteState />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {invites.map((invite) => (
        <InviteCard
          key={invite.id}
          invite={invite}
          onInviteUpdate={onInviteUpdate}
          processing={processingIds.has(invite.id)}
          onProcessingChange={handleProcessingChange}
          localClickCount={localClickCounts[invite.id]}
          onClickCountChange={handleClickCountChange}
        />
      ))}
    </div>
  );
}
