
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Force scroll to top when pathname changes
    window.scrollTo(0, 0);
    
    // Add a slight delay to ensure DOM has updated
    setTimeout(() => {
      // Trigger scroll event to ensure navbar updates correctly
      window.dispatchEvent(new Event('scroll'));
    }, 100);
  }, [pathname]);

  return null;
}
