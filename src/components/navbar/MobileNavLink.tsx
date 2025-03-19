
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MobileNavLinkProps {
  name: string;
  path: string;
  isActive: boolean;
  onClick?: () => boolean | void;
  iconRight?: React.ReactNode;
  isExternal?: boolean;
}

export function MobileNavLink({ name, path, isActive, onClick, iconRight, isExternal }: MobileNavLinkProps) {
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
        className="text-xl font-medium text-purple-800 p-2 rounded-md transition-all duration-300 relative flex items-center hover:bg-purple-50/50 hover:pl-4"
        onClick={handleClick}
      >
        <span>{name}</span>
      </a>
    );
  }
  
  return (
    <Link
      to={path}
      className={cn(
        "text-xl font-medium text-purple-800 p-2 rounded-md transition-all duration-300 relative flex items-center",
        isActive 
          ? "bg-purple-50 pl-4" 
          : "hover:bg-purple-50/50 hover:pl-4"
      )}
      onClick={handleClick}
      aria-current={isActive ? "page" : undefined}
    >
      <span>{name}</span>
      {iconRight && <span className="ml-1">{iconRight}</span>}
      {isActive && (
        <span 
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-purple-600 rounded-r-full" 
          aria-hidden="true" 
        />
      )}
    </Link>
  );
}
