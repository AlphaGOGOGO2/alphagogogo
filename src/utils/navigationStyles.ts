/**
 * Navigation Styles - 네비게이션 공통 스타일 유틸리티
 * 
 * 모든 네비게이션 컴포넌트에서 사용하는 공통 스타일을 중앙화
 */

import { cn } from "@/lib/utils";

/**
 * 네비게이션 링크 스타일 옵션
 */
export interface NavLinkStyleOptions {
  isScrolled: boolean;
  isActive?: boolean;
  isMobile?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * 드롭다운 스타일 옵션
 */
export interface DropdownStyleOptions {
  isScrolled: boolean;
  isOpen?: boolean;
}

/**
 * 네비게이션 스타일 유틸리티 클래스
 */
export class NavigationStyles {
  /**
   * 기본 링크 스타일 생성
   */
  static getLinkStyles(options: NavLinkStyleOptions, additionalClasses?: string): string {
    const { isScrolled, isActive = false, isMobile = false, size = 'md' } = options;
    
    const baseClasses = "font-medium relative transition-all duration-300 rounded-md group flex items-center";
    
    // 크기별 스타일
    const sizeClasses = this.getSizeClasses(size, isMobile);
    
    // 색상 스타일
    const colorClasses = isScrolled 
      ? "text-primary hover:text-primary/80" 
      : "text-white/90 hover:text-white";
      
    // 모바일 전용 스타일
    const mobileClasses = isMobile 
      ? "p-2 w-full text-left hover:bg-primary/10 hover:pl-4" 
      : "px-3 py-2";
    
    // 활성 상태 스타일
    const activeClasses = isActive && isMobile ? "bg-primary/10 pl-4" : "";

    return cn(
      baseClasses,
      sizeClasses,
      colorClasses,
      mobileClasses,
      activeClasses,
      additionalClasses
    );
  }

  /**
   * 크기별 클래스 반환
   */
  private static getSizeClasses(size: 'sm' | 'md' | 'lg', isMobile: boolean): string {
    if (isMobile) return "text-xl";
    
    const sizeMap = {
      sm: "text-sm",
      md: "text-base md:text-lg", 
      lg: "text-lg md:text-xl"
    };
    
    return sizeMap[size];
  }

  /**
   * 언더라인 스타일 생성
   */
  static getUnderlineStyles(options: NavLinkStyleOptions): string {
    const { isScrolled, isActive = false } = options;
    
    return cn(
      "absolute bottom-0 left-0 w-full h-1 transform origin-left transition-transform duration-300",
      isScrolled ? "bg-primary" : "bg-primary/70",
      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
    );
  }

  /**
   * 활성 표시기 스타일 (모바일용)
   */
  static getActiveIndicatorStyles(): string {
    return "absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-r-full";
  }

  /**
   * 드롭다운 버튼 스타일 생성
   */
  static getDropdownButtonStyles(options: DropdownStyleOptions): string {
    const { isScrolled, isOpen = false } = options;
    
    return cn(
      "text-base md:text-lg font-medium relative transition-all duration-300 px-3 py-2 rounded-md group flex items-center",
      isScrolled 
        ? "text-primary hover:text-primary/80" 
        : "text-white/90 hover:text-white"
    );
  }

  /**
   * 드롭다운 화살표 아이콘 스타일
   */
  static getDropdownArrowStyles(options: DropdownStyleOptions): string {
    const { isScrolled, isOpen = false } = options;
    
    return cn(
      "ml-1 transition-transform duration-200",
      isOpen ? "rotate-180" : "rotate-0",
      isScrolled ? "text-primary/70" : "text-white/80"
    );
  }

  /**
   * 드롭다운 메뉴 컨테이너 스타일
   */
  static getDropdownMenuStyles(isScrolled: boolean): string {
    return cn(
      "absolute top-full left-0 mt-2 w-56 rounded-lg shadow-lg z-50 transition-all duration-200",
      isScrolled 
        ? "bg-white border border-gray-200" 
        : "bg-gray-900 border border-white/10"
    );
  }

  /**
   * 드롭다운 메뉴 아이템 스타일
   */
  static getDropdownItemStyles(isScrolled: boolean): string {
    return cn(
      "block w-full text-left px-4 py-3 text-sm transition-colors duration-200 rounded-lg",
      isScrolled 
        ? "text-gray-700 hover:bg-primary/10 hover:text-primary" 
        : "text-white hover:bg-white/20 hover:text-white"
    );
  }

  /**
   * 모바일 네비게이션 오버레이 스타일
   */
  static getMobileOverlayStyles(): string {
    return "fixed inset-0 bg-black/50 backdrop-blur-sm z-40";
  }

  /**
   * 모바일 네비게이션 패널 스타일
   */
  static getMobilePanelStyles(): string {
    return "fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out overflow-y-auto";
  }

  /**
   * 모바일 네비게이션 헤더 스타일
   */
  static getMobileHeaderStyles(): string {
    return "flex items-center justify-between p-6 border-b border-gray-100";
  }

  /**
   * 닫기 버튼 스타일
   */
  static getCloseButtonStyles(): string {
    return "p-2 hover:bg-primary/10 rounded-lg transition-colors duration-200";
  }

  /**
   * 하단 네비게이션 (모바일) 스타일
   */
  static getBottomNavStyles(): string {
    return "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden";
  }

  /**
   * 하단 네비게이션 아이템 스타일
   */
  static getBottomNavItemStyles(isActive: boolean): string {
    return cn(
      "flex-1 flex flex-col items-center justify-center p-2 transition-colors duration-200",
      isActive ? "text-primary" : "text-muted-foreground"
    );
  }

  /**
   * 네비게이션 바 컨테이너 스타일
   */
  static getNavbarContainerStyles(isScrolled: boolean): string {
    return cn(
      "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
      isScrolled 
        ? "bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200" 
        : "bg-gray-900/90 backdrop-blur-lg border-b border-white/10"
    );
  }

  /**
   * 로고 스타일
   */
  static getLogoStyles(isScrolled: boolean): string {
    return cn(
      "transition-colors duration-300",
      isScrolled ? "text-primary" : "text-white"
    );
  }
}