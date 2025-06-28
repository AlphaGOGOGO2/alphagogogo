
import React from 'react';

export interface NavItem {
  name: string;
  path: string;
  icon?: React.ReactNode;
  isExternal?: boolean;
  isComingSoon?: boolean;
}

export interface BlogCategory {
  name: string;
  path: string;
}

export const mainNavItems: NavItem[] = [
  { name: "홈", path: "/" },
  { name: "블로그", path: "/blog" },
  { name: "프리미엄", path: "https://alphademy.co.kr/", isExternal: true },
  { name: "GPTS 이용하기", path: "/gpts" },
  { name: "자료실", path: "/resources" },
  { name: "AI품앗이", path: "/ai-partnership" },
  { name: "유튜브", path: "https://youtube.com/channel/UCH-9UIZghFuwOoCoqVMmuhg?si=FWWmImgwwD9T-oET", isExternal: true },
  { name: "커뮤니티", path: "/community" }
];

export const blogCategories: BlogCategory[] = [
  { name: "전체보기", path: "/blog" },
  { name: "최신 AI소식", path: "/blog/latest-updates" },
  { name: "화제의 이슈", path: "/blog/trending" },
  { name: "라이프스타일", path: "/blog/lifestyle" }
];

export interface GPTSCategory {
  name: string;
  path: string;
}

export const gptsCategories: GPTSCategory[] = [
  { name: "초보자 가이드", path: "/gpts#beginner" },
  { name: "블로그 GPTS", path: "/gpts#blog" },
  { name: "그 외 GPTS", path: "/gpts#other" },
  { name: "다운로드", path: "/gpts#download" }
];

export interface CommunityCategory {
  name: string;
  path: string;
  action?: 'popup' | 'link';
  actionData?: string;
}

export const communityCategories: CommunityCategory[] = [
  { name: "실시간 채팅", path: "/community" },
  { name: "오픈 채팅방", path: "/open-chat-rooms" },
  { 
    name: "비즈니스 문의", 
    path: "/business-inquiry"
  }
];

export interface ServicesCategory {
  name: string;
  path: string;
  description: string;
}

export const servicesCategories: ServicesCategory[] = [
  { 
    name: "전체서비스", 
    path: "/services",
    description: "알파블로그에서 제공하는 모든 서비스를 확인하세요."
  },
  {
    name: "블로그 버튼 생성기",
    path: "/blog-button-creator",
    description: "블로그용 커스텀 HTML 버튼을 쉽게 디자인하고 생성할 수 있습니다."
  }
];

// AI품앗이 서비스 카테고리
export interface AIPartnershipService {
  name: string;
  value: string;
  description: string;
  urlPattern: string;
  benefits: string[];
}

export const aiPartnershipServices: AIPartnershipService[] = [
  {
    name: "러버블",
    value: "lovable",
    description: "웹 애플리케이션 개발 플랫폼",
    urlPattern: "https://lovable.dev/invite/",
    benefits: [
      "초대받은 사람: 추가 10크레딧 획득",
      "초대한 사람: 상대방이 첫 웹사이트 발행 시 10크레딧 획득"
    ]
  },
  {
    name: "젠스파크",
    value: "genspark",
    description: "AI 검색 엔진",
    urlPattern: "https://genspark.ai/invite/",
    benefits: [
      "서로 크레딧 혜택 제공",
      "프리미엄 기능 체험 기회"
    ]
  }
];
