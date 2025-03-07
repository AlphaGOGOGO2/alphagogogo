
export interface NavItem {
  name: string;
  path: string;
  icon?: React.ReactNode;
}

export interface BlogCategory {
  name: string;
  path: string;
}

export const mainNavItems: NavItem[] = [
  { name: "홈", path: "/" },
  { name: "GPTS 이용하기", path: "/gpts" },
  { name: "서비스", path: "/services" },
  { name: "유튜브", path: "/youtube" },
  { name: "커뮤니티", path: "/community" }
];

export const blogCategories: BlogCategory[] = [
  { name: "전체보기", path: "/blog" },
  { name: "최신 AI소식", path: "/blog/latest-updates" },
  { name: "화제의 이슈", path: "/blog/trending" },
  { name: "라이프스타일", path: "/blog/lifestyle" }
];
