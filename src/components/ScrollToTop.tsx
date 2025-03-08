
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Force scroll to top when pathname changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" // Changed from "smooth" to "instant" for more consistent behavior
    });
  }, [pathname]);

  return null;
}
