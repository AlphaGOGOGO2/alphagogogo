
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MobileNavLinkProps {
  name: string;
  path: string;
  isActive: boolean;
  onClick?: () => void;
  iconRight?: React.ReactNode;
}

export function MobileNavLink({ name, path, isActive, onClick, iconRight }: MobileNavLinkProps) {
  return (
    <Link
      to={path}
      className={cn(
        "text-xl font-medium text-purple-800 p-2 rounded-md transition-all duration-300 relative",
        isActive 
          ? "bg-purple-50 pl-4" 
          : "hover:bg-purple-50/50 hover:pl-4"
      )}
      onClick={onClick}
    >
      {name}
      {iconRight}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-purple-600 rounded-r-full" />
      )}
    </Link>
  );
}
