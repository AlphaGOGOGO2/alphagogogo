
import { MobileNavLink } from "./MobileNavLink";
import { blogCategories } from "@/config/navigation";

interface MobileBlogItemsProps {
  onClose: () => void;
  locationPathname: string;
  showCategories: boolean;
}

export function MobileBlogItems({ onClose, locationPathname, showCategories }: MobileBlogItemsProps) {
  if (!showCategories) return null;
  
  return (
    <div className="pl-6 space-y-2">
      {blogCategories.map((category) => (
        <MobileNavLink
          key={category.path}
          name={`- ${category.name}`}
          path={category.path}
          isActive={locationPathname === category.path}
          onClick={onClose}
        />
      ))}
    </div>
  );
}

