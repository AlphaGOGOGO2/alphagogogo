
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  name: string;
  path: string;
  isScrolled: boolean;
  isActive: boolean;
  onClick?: () => boolean | void;
  iconRight?: React.ReactNode;
  isExternal?: boolean;
  className?: string;
  isSparkle?: boolean;
}

export function NavLink({ name, path, isScrolled, isActive, onClick, iconRight, isExternal, className, isSparkle }: NavLinkProps) {
  const linkClasses = cn(
    "text-base md:text-lg font-medium relative transition-all duration-300 px-3 py-2 rounded-md group flex items-center",
    isScrolled
      ? "text-purple-900 hover:text-purple-800"
      : "text-white/90 hover:text-white",
    className
  );

  const textClasses = cn(
    isSparkle && "sparkle-text"
  );

  const underlineClasses = cn(
    "absolute bottom-0 left-0 w-full h-1 transform origin-left transition-transform duration-300",
    isScrolled ? "bg-purple-600" : "bg-purple-400",
    isActive 
      ? "scale-x-100" 
      : "scale-x-0 group-hover:scale-x-100"
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
        className={linkClasses}
        onClick={handleClick}
      >
        <div className="relative z-10 flex items-center">
          <span className={textClasses}>{name}</span>
          {iconRight && <span className="ml-1">{iconRight}</span>}
        </div>
        <span
          className={underlineClasses}
          aria-hidden="true"
        />
      </a>
    );
  }

  return (
    <Link
      to={path}
      className={linkClasses}
      onClick={handleClick}
      aria-current={isActive ? "page" : undefined}
    >
      <div className="relative z-10 flex items-center">
        <span className={textClasses}>{name}</span>
        {iconRight && <span className="ml-1">{iconRight}</span>}
      </div>
      <span
        className={underlineClasses}
        aria-hidden="true"
      />
    </Link>
  );
}
