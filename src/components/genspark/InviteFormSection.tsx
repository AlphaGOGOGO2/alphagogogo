
import React from "react";
import { InviteForm } from "./InviteForm";

interface InviteFormSectionProps {
  onSuccess: () => void;
}

export function InviteFormSection({ onSuccess }: InviteFormSectionProps) {
  return (
    <section className="mb-16 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md border border-purple-200 hover:border-purple-300 transition-all">
        <h2 className="text-2xl font-semibold mb-6 text-purple-800">초대 링크 등록하기</h2>
        <InviteForm onSuccess={onSuccess} />
      </div>
    </section>
  );
}
