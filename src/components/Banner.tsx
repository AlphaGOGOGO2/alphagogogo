
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface BannerProps {
  className?: string;
}

export function Banner({ className }: BannerProps) {
  const handleClick = () => {
    window.open("https://lovable.dev/?via=alphagogogo", "_blank");
  };

  return (
    <div 
      onClick={handleClick}
      className={cn(
        "bg-purple-600 text-white px-4 py-3 rounded-lg shadow-md cursor-pointer transition-all",
        "hover:bg-purple-700 hover:shadow-lg mb-6 select-none",
        "flex items-center justify-between",
        className
      )}
      role="button"
      aria-label="노코드 개발 AI, 러버블 DEV 사이트로 이동"
    >
      <div>
        <p className="font-medium text-sm md:text-base">
          이젠 누구나 웹 서비스 개발 가능! 노코드 개발 AI, 러버블 DEV
        </p>
      </div>
      <ExternalLink size={18} className="ml-2 flex-shrink-0" />
    </div>
  );
}
