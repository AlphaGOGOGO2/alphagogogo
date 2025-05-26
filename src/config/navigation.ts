
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

export interface ResourcesCategory {
  name: string;
  path: string;
  description: string;
}

export const resourcesCategories: ResourcesCategory[] = [
  { 
    name: "전체자료", 
    path: "/resources",
    description: "모든 자료를 확인하고 다운로드하세요."
  },
  {
    name: "이미지",
    path: "/resources/category/이미지",
    description: "AI 관련 이미지 자료"
  },
  {
    name: "문서",
    path: "/resources/category/문서",
    description: "PDF, 워드 등 문서 자료"
  },
  {
    name: "템플릿",
    path: "/resources/category/템플릿",
    description: "활용 가능한 템플릿"
  },
  {
    name: "가이드",
    path: "/resources/category/가이드",
    description: "사용 가이드 및 매뉴얼"
  }
];
