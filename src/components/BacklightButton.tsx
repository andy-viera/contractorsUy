import { useState, useEffect } from "react";
import { hover, motion } from "framer-motion";
import { BackgroundGradient } from "./ui/background-gradient";

export function BackLightButton({
  text,
  hoverText,
}: {
  text: string;
  hoverText?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsHovered(false);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <BackgroundGradient className="rounded-[22px] max-w-sm py-1 px-2 bg-transparent">
        <p className="text-xs font-semibold text-white">{text}</p>
      </BackgroundGradient>

      {isHovered && hoverText && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="top-[-7rem] right-[-6rem] break-words max-w-24 sm:max-w-fit absolute z-50 p-3 text-xs sm:text-sm text-black transform -translate-x-1/2 bg-transparent backdrop-blur-sm rounded-lg shadow-lg sm:top-[-2.7rem] sm:right-[-23.7rem]"
        >
          <p className="break-words">{hoverText}</p>
        </motion.div>
      )}
    </div>
  );
}
