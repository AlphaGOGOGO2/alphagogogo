
import { Link } from "react-router-dom";
import { NavigationStyles, NavLinkStyleOptions } from "@/utils/navigationStyles";
import { useNavigationStyles } from "@/hooks/useCommonStyles";
import { cn } from "@/lib/utils";

interface MobileNavLinkProps {
  name: string;
  path: string;
  isActive: boolean;
  onClick?: () => boolean | void;
  iconRight?: React.ReactNode;
  isExternal?: boolean;
  isSparkle?: boolean;
}

export function MobileNavLink({ name, path, isActive, onClick, iconRight, isExternal, isSparkle }: MobileNavLinkProps) {
  // 공통 네비게이션 스타일 사용
  const styleOptions: NavLinkStyleOptions = {
    isScrolled: true, // 모바일은 항상 스크롤된 상태로 간주
    isActive,
    isMobile: true,
    size: 'lg'
  };

  const { linkStyles, activeIndicatorStyles } = useNavigationStyles(styleOptions);

  const textClasses = cn(
    isSparkle && "sparkle-text"
  );
  
  const handleClick = (e) => {
    if (onClick) {
      const shouldProceed = onClick();
      if (shouldProceed === false) {
        e.preventDefault();
      }
    }
  };

  if (isExternal) {
    return (
      <a
        href={path}
        target="_blank"
        rel="noopener noreferrer"
        className={linkStyles}
        onClick={handleClick}
      >
        <span className={textClasses}>{name}</span>
      </a>
    );
  }

  return (
    <Link
      to={path}
      className={linkStyles}
      onClick={handleClick}
      aria-current={isActive ? "page" : undefined}
    >
      <span className={textClasses}>{name}</span>
      {iconRight && <span className="ml-1">{iconRight}</span>}
      {isActive && (
        <span
          className={activeIndicatorStyles}
          aria-hidden="true"
        />
      )}
    </Link>
  );
}
