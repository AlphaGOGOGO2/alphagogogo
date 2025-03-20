
import React, { useState } from "react";
import { GensparkInvite } from "@/types/genspark";
import { InviteCard } from "./InviteCard";
import { EmptyInviteState } from "./EmptyInviteState";

interface InviteGridProps {
  invites: GensparkInvite[];
  onUpdateInvite?: (updatedInvite: Partial<GensparkInvite>) => void;
}

export function InviteGrid({ invites, onUpdateInvite }: InviteGridProps) {
  if (invites.length === 0) {
    return <EmptyInviteState />;
  }

  const handleUpdateClick = (updatedInvite: Partial<GensparkInvite>) => {
    if (onUpdateInvite) {
      onUpdateInvite(updatedInvite);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {invites.map((invite) => (
        <InviteCard
          key={invite.id}
          invite={invite}
          onUpdateClick={handleUpdateClick}
        />
      ))}
    </div>
  );
}
