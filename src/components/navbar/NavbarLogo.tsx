
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavbarLogoProps {
  isScrolled: boolean;
  onClick?: () => void;
}

export function NavbarLogo({ isScrolled, onClick }: NavbarLogoProps) {
  return (
    <Link 
      to="/" 
      className="flex items-center gap-2 font-heading text-xl md:text-2xl font-semibold group"
      onClick={onClick}
    >
      <div className="relative w-8 h-8 md:w-10 md:h-10 overflow-hidden rounded-lg group-hover:scale-105 transition-transform duration-300">
        <img 
          src="https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png" 
          alt="알파블로그 로고" 
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <span className={cn(
        "bg-clip-text text-transparent bg-gradient-to-r transition-all duration-300",
        isScrolled 
          ? "from-purple-800 to-purple-600" 
          : "from-white to-red-200"
      )}>알파블로그</span>
    </Link>
  );
}
