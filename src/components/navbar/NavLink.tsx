
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  name: string;
  path: string;
  isScrolled: boolean;
  isActive: boolean;
  onClick?: () => void;
  iconRight?: React.ReactNode;
}

export function NavLink({ name, path, isScrolled, isActive, onClick, iconRight }: NavLinkProps) {
  return (
    <Link
      to={path}
      className={cn(
        "text-base md:text-lg font-medium relative transition-all duration-300 px-2 py-1 rounded-md group",
        isScrolled 
          ? "text-purple-900 hover:text-purple-800" 
          : "text-white/90 hover:text-white",
        isActive && "nav-active"
      )}
      onClick={onClick}
    >
      <span className="relative z-10">{name}</span>
      {iconRight}
      <span className={cn(
        "absolute bottom-0 left-0 w-full h-1 transform origin-left transition-transform duration-300",
        isScrolled ? "bg-purple-600" : "bg-red-300",
        isActive 
          ? "scale-x-100" 
          : "scale-x-0 group-hover:scale-x-100"
      )}></span>
    </Link>
  );
}
