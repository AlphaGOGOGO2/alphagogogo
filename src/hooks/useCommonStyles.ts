/**
 * Common Styles Hook - 공통 스타일 훅
 * 
 * 반복되는 스타일 패턴을 재사용 가능한 훅으로 제공
 */

import { useMemo } from 'react';
import { NavigationStyles, NavLinkStyleOptions, DropdownStyleOptions } from '@/utils/navigationStyles';
import { cn } from '@/lib/utils';

/**
 * 네비게이션 스타일 훅
 */
export function useNavigationStyles(options: NavLinkStyleOptions) {
  return useMemo(() => ({
    linkStyles: NavigationStyles.getLinkStyles(options),
    underlineStyles: NavigationStyles.getUnderlineStyles(options),
    activeIndicatorStyles: NavigationStyles.getActiveIndicatorStyles(),
  }), [options.isScrolled, options.isActive, options.isMobile, options.size]);
}

/**
 * 드롭다운 스타일 훅
 */
export function useDropdownStyles(options: DropdownStyleOptions) {
  return useMemo(() => ({
    buttonStyles: NavigationStyles.getDropdownButtonStyles(options),
    arrowStyles: NavigationStyles.getDropdownArrowStyles(options),
    menuStyles: NavigationStyles.getDropdownMenuStyles(options.isScrolled),
    itemStyles: NavigationStyles.getDropdownItemStyles(options.isScrolled),
  }), [options.isScrolled, options.isOpen]);
}

/**
 * 카드 스타일 훅
 */
export function useCardStyles(variant: 'default' | 'elevated' | 'outlined' = 'default') {
  return useMemo(() => {
    const baseStyles = "bg-card text-card-foreground rounded-lg transition-all duration-300";
    
    const variants = {
      default: "border border-border shadow-sm",
      elevated: "border-none shadow-lg hover:shadow-xl",
      outlined: "border-2 border-border shadow-none hover:shadow-md"
    };

    return cn(baseStyles, variants[variant]);
  }, [variant]);
}

/**
 * 버튼 스타일 훅
 */
export function useButtonStyles(
  variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' = 'default',
  size: 'default' | 'sm' | 'lg' | 'icon' = 'default'
) {
  return useMemo(() => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
      outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline"
    };

    const sizes = {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-md px-8",
      icon: "h-9 w-9"
    };

    return cn(baseStyles, variants[variant], sizes[size]);
  }, [variant, size]);
}

/**
 * 입력 필드 스타일 훅
 */
export function useInputStyles(variant: 'default' | 'error' | 'success' = 'default') {
  return useMemo(() => {
    const baseStyles = "flex h-9 w-full rounded-md border bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50";
    
    const variants = {
      default: "border-input focus-visible:ring-ring",
      error: "border-destructive focus-visible:ring-destructive",
      success: "border-green-500 focus-visible:ring-green-500"
    };

    return cn(baseStyles, variants[variant]);
  }, [variant]);
}

/**
 * 텍스트 스타일 훅
 */
export function useTextStyles(
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'blockquote' | 'code' | 'lead' | 'large' | 'small' | 'muted' = 'p'
) {
  return useMemo(() => {
    const variants = {
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      p: "leading-7 [&:not(:first-child)]:mt-6",
      blockquote: "mt-6 border-l-2 pl-6 italic",
      code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted-foreground"
    };

    return variants[variant];
  }, [variant]);
}

/**
 * 애니메이션 스타일 훅
 */
export function useAnimationStyles(animation: 'fade-in' | 'fade-in-right' | 'fade-in-left' | 'pulse-slow' | 'float' = 'fade-in') {
  return useMemo(() => {
    const animations = {
      'fade-in': "animate-fade-in",
      'fade-in-right': "animate-fade-in-right",
      'fade-in-left': "animate-fade-in-left",
      'pulse-slow': "animate-pulse-slow",
      'float': "animate-float"
    };

    return animations[animation];
  }, [animation]);
}

/**
 * 반응형 스타일 훅
 */
export function useResponsiveStyles() {
  return {
    container: "container mx-auto px-4 sm:px-6 lg:px-8",
    grid: {
      cols1: "grid grid-cols-1",
      cols2: "grid grid-cols-1 md:grid-cols-2",
      cols3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      cols4: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
    },
    spacing: {
      section: "py-12 md:py-16 lg:py-20",
      content: "space-y-6 md:space-y-8 lg:space-y-12"
    },
    text: {
      responsive: "text-sm md:text-base lg:text-lg",
      heading: "text-2xl md:text-3xl lg:text-4xl"
    }
  };
}

/**
 * 상태별 스타일 훅
 */
export function useStateStyles(state: 'loading' | 'success' | 'error' | 'idle' = 'idle') {
  return useMemo(() => {
    const states = {
      loading: "opacity-50 pointer-events-none animate-pulse",
      success: "border-green-500 bg-green-50 text-green-700",
      error: "border-red-500 bg-red-50 text-red-700",
      idle: ""
    };

    return states[state];
  }, [state]);
}