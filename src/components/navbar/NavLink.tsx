
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

interface NavLinkProps {
  name: string;
  path: string;
  isScrolled: boolean;
  isActive: boolean;
  onClick?: () => void;
  iconRight?: React.ReactNode;
  isExternal?: boolean;
}

export function NavLink({ name, path, isScrolled, isActive, onClick, iconRight, isExternal }: NavLinkProps) {
  if (isExternal) {
    return (
      <a
        href={path}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "text-base md:text-lg font-medium relative transition-all duration-300 px-2 py-1 rounded-md group flex items-center",
          isScrolled 
            ? "text-purple-900 hover:text-purple-800" 
            : "text-white/90 hover:text-white"
        )}
        onClick={onClick}
      >
        <span className="relative z-10">{name}</span>
        <ExternalLink size={14} className="ml-1 opacity-70" />
      </a>
    );
  }

  return (
    <Link
      to={path}
      className={cn(
        "text-base md:text-lg font-medium relative transition-all duration-300 px-2 py-1 rounded-md group flex items-center",
        isScrolled 
          ? "text-purple-900 hover:text-purple-800" 
          : "text-white/90 hover:text-white",
        isActive && "nav-active"
      )}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="relative z-10">{name}</span>
      {iconRight && <span className="ml-1">{iconRight}</span>}
      <span 
        className={cn(
          "absolute bottom-0 left-0 w-full h-1 transform origin-left transition-transform duration-300",
          isScrolled ? "bg-purple-600" : "bg-purple-400",
          isActive 
            ? "scale-x-100" 
            : "scale-x-0 group-hover:scale-x-100"
        )}
        aria-hidden="true"
      ></span>
    </Link>
  );
}
