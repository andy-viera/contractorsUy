// useIsSmallScreen.ts
import { useEffect, useState } from "react";

export function useIsSmallScreen(breakpoint = 768) {
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    function checkSize() {
      setIsSmall(window.innerWidth < breakpoint);
    }
    // Check on mount
    checkSize();

    // Listen for resize
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, [breakpoint]);

  return isSmall;
}
