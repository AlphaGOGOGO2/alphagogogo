
import React from "react";
import { GensparkInvite } from "@/types/genspark";
import { InviteCard } from "./InviteCard";
import { EmptyInviteState } from "./EmptyInviteState";

interface InviteGridProps {
  invites: GensparkInvite[];
}

export function InviteGrid({ invites }: InviteGridProps) {
  if (invites.length === 0) {
    return <EmptyInviteState />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {invites.map((invite) => (
        <InviteCard
          key={invite.id}
          invite={invite}
        />
      ))}
    </div>
  );
}
