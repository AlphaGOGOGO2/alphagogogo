
import React from "react";
import { GensparkInvite } from "@/types/genspark";
import { InviteCard } from "./InviteCard";

interface InviteGridProps {
  invites: GensparkInvite[];
  isLoading: boolean;
  error: Error | null;
  onUpdateClick: (updatedInvite: Partial<GensparkInvite>) => void;
}

export function InviteGrid({ invites, isLoading, error, onUpdateClick }: InviteGridProps) {
  if (isLoading && invites.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-500">초대 링크를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-red-500">초대 링크를 불러오는 중 오류가 발생했습니다.</p>
      </div>
    );
  }

  if (invites.length === 0) {
    return (
      <div className="text-center py-16 bg-purple-50 rounded-lg border border-purple-200">
        <h3 className="text-xl font-semibold text-purple-900 mb-2">아직 등록된 초대 링크가 없습니다</h3>
        <p className="text-purple-700 mb-6">첫 번째로 초대 링크를 등록해 보세요!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {invites.map((invite) => (
        <InviteCard
          key={invite.id}
          invite={invite}
          onUpdateClick={onUpdateClick}
        />
      ))}
    </div>
  );
}
