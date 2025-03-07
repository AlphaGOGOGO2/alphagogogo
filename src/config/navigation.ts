
export interface NavItem {
  name: string;
  path: string;
  icon?: React.ReactNode;
  isExternal?: boolean;
}

export interface BlogCategory {
  name: string;
  path: string;
}

export const mainNavItems: NavItem[] = [
  { name: "홈", path: "/" },
  { name: "GPTS 이용하기", path: "/gpts" },
  { name: "서비스", path: "/services" },
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
  { 
    name: "오픈 채팅방", 
    path: "https://open.kakao.com/o/gNCJvOeh", 
    action: 'popup',
    actionData: "입장코드는 대문자로 GOGOGO 입니다."
  },
  { 
    name: "비즈니스 문의", 
    path: "mailto:skssk01033@naver.com", 
    action: 'popup',
    actionData: "skssk01033@naver.com"
  }
];

export interface ServicesCategory {
  name: string;
  path: string;
  description: string;
}

export const servicesCategories: ServicesCategory[] = [
  { 
    name: "유튜브 자막 추출", 
    path: "/youtube-transcript",
    description: "YouTube 동영상의 자막을 텍스트로 추출하여 저장하거나 복사할 수 있습니다."
  }
];
