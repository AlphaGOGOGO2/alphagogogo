
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

interface MobileNavLinkProps {
  name: string;
  path: string;
  isActive: boolean;
  onClick?: () => void;
  iconRight?: React.ReactNode;
  isExternal?: boolean;
}

export function MobileNavLink({ name, path, isActive, onClick, iconRight, isExternal }: MobileNavLinkProps) {
  if (isExternal) {
    return (
      <a
        href={path}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xl font-medium text-blue-800 p-2 rounded-md transition-all duration-300 relative flex items-center hover:bg-blue-50/50 hover:pl-4"
        onClick={onClick}
      >
        <span>{name}</span>
        <ExternalLink size={14} className="ml-1 opacity-70" />
      </a>
    );
  }
  
  return (
    <Link
      to={path}
      className={cn(
        "text-xl font-medium text-blue-800 p-2 rounded-md transition-all duration-300 relative flex items-center",
        isActive 
          ? "bg-blue-50 pl-4" 
          : "hover:bg-blue-50/50 hover:pl-4"
      )}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
    >
      <span>{name}</span>
      {iconRight && <span className="ml-1">{iconRight}</span>}
      {isActive && (
        <span 
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-600 rounded-r-full" 
          aria-hidden="true" 
        />
      )}
    </Link>
  );
}
