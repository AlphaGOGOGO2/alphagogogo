
import React from "react";
import { Info, Shield, Users, Heart } from "lucide-react";

export function InfoCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-7 rounded-xl border border-purple-400 shadow-lg hover:shadow-xl transition-all">
        <div className="flex items-center mb-4">
          <div className="bg-white/20 p-2 rounded-full mr-3">
            <Info className="h-7 w-7 text-white" />
          </div>
          <h3 className="font-bold text-white text-xl">적격 규칙</h3>
        </div>
        <ul className="text-left space-y-2.5 text-white text-sm md:text-base pl-4">
          <li>초대된 친구는 2024년 12월 1일 이후에 등록한 신규 사용자여야 합니다.</li>
          <li>각 사용자는 초대를 통해 최대 20개월의 Plus 플랜 혜택을 받을 수 있습니다.</li>
          <li>클릭수와 가입자수는 비례하지 않습니다.</li>
          <li className="text-yellow-300 font-semibold">해당 이벤트는 3월 31일까지 진행됩니다.</li>
        </ul>
      </div>
      
      <div className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] p-7 rounded-xl border border-purple-400 shadow-lg hover:shadow-xl transition-all">
        <div className="flex items-center mb-4">
          <div className="bg-white/20 p-2 rounded-full mr-3">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <h3 className="font-bold text-white text-xl">등록 규칙</h3>
        </div>
        <ul className="text-left space-y-2.5 text-white text-sm md:text-base pl-4">
          <li>중복된 초대 링크는 등록할 수 없습니다.</li>
          <li>젠스파크 초대 링크만 등록 가능합니다.</li>
          <li>닉네임과 한마디로 관심을 끌어보세요!</li>
          <li className="text-yellow-300 font-semibold text-[#FFD700]">클릭수가 30이 되면 삭제됩니다. 서로 견제하세요!</li>
        </ul>
      </div>
      
      <div className="bg-gradient-to-br from-[#9B87F5] to-[#7E69AB] p-7 rounded-xl border border-purple-400 shadow-lg hover:shadow-xl transition-all">
        <div className="flex items-center mb-4">
          <div className="bg-white/20 p-2 rounded-full mr-3">
            <Users className="h-7 w-7 text-white" />
          </div>
          <h3 className="font-bold text-white text-xl">이용 방법</h3>
        </div>
        <ul className="text-left space-y-2.5 text-white text-sm md:text-base pl-4">
          <li>초대 링크를 클릭하여 젠스파크에 가입하세요.</li>
          <li>친구를 초대하여 무료 이용 기간을 늘려보세요.</li>
          <li>자신의 초대 링크를 등록하고 공유하세요.</li>
          <li>다른 사람의 링크도 클릭해주면 서로 도움이 됩니다.</li>
        </ul>
      </div>
      
      <div className="bg-gradient-to-br from-[#D946EF] to-[#9333EA] p-7 rounded-xl border border-purple-400 shadow-lg hover:shadow-xl transition-all">
        <div className="flex items-center mb-4">
          <div className="bg-white/20 p-2 rounded-full mr-3">
            <Heart className="h-7 w-7 text-white" />
          </div>
          <h3 className="font-bold text-white text-xl">이용 안내</h3>
        </div>
        <ul className="text-left space-y-2.5 text-white text-sm md:text-base pl-4">
          <li>재미로 만들고 편하게 올려두고 하실일 하시라고 만든겁니다.</li>
          <li>너무 민감하게 반응하지 마세요!</li>
          <li>모두가 함께 혜택을 나누는 공간입니다.</li>
          <li>서로 배려하며 이용해주세요.</li>
        </ul>
      </div>
    </div>
  );
}
