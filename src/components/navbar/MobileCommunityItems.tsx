
import { useNavigate } from "react-router-dom";
import { MobileNavLink } from "./MobileNavLink";
import { communityCategories } from "@/config/navigation";
import { openInfoPopup } from "@/utils/popupUtils";

interface MobileCommunityItemsProps {
  onClose: () => void;
  locationPathname: string;
}

export function MobileCommunityItems({ onClose, locationPathname }: MobileCommunityItemsProps) {
  const navigate = useNavigate();
  
  const handleCommunityItemClick = (category: typeof communityCategories[0], event: React.MouseEvent) => {
    event.stopPropagation(); // 이벤트 버블링 방지
    onClose();
    
    // 일반 링크 클릭은 기본 동작 그대로 유지
    if (!category.action) {
      navigate(category.path);
      return;
    }
    
    // 팝업 액션이 있는 경우 기본 동작 중단
    event.preventDefault();
    
    if (category.action === 'popup' && category.actionData) {
      const title = category.name === "비즈니스 문의 안내" ? "비즈니스 문의 안내" : "비즈니스 문의 안내";
      const action = category.name === "비즈니스 문의" ? 'email' : 'email';
      
      // 팝업 열기 시도
      const isPopupOpened = openInfoPopup({
        title,
        message: category.actionData,
        action,
        actionData: category.path
      });
      
      // 팝업이 차단된 경우 직접 이동
      if (!isPopupOpened) {
        window.location.href = category.path;
      }
    }
  };
  
  return (
    <div className="pl-6 space-y-2">
      {communityCategories.map((category) => (
        category.action === 'popup' ? (
          <button
            key={category.path}
            className="text-xl font-medium text-purple-800 p-2 rounded-md transition-all duration-300 relative flex items-center hover:bg-purple-50/50 hover:pl-4 w-full text-left"
            onClick={(e) => handleCommunityItemClick(category, e)}
            type="button"
          >
            - {category.name}
          </button>
        ) : (
          <MobileNavLink
            key={category.path}
            name={`- ${category.name}`}
            path={category.path}
            isActive={locationPathname === category.path}
            onClick={() => {
              onClose();
              navigate(category.path);
            }}
          />
        )
      ))}
    </div>
  );
}
