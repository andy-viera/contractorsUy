import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import { MoonIcon, SunIcon } from "lucide-react";
import { useIsSmallScreen } from "@/hooks/useIsSmallScreen";

export function DarkModeSwitch({
  darkMode,
  setDarkMode,
  disabled,
}: {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  disabled?: boolean;
}) {
  const isSmallScreen = useIsSmallScreen(768);

  const horizontalPos = darkMode ? 40 : 0; // for large screens
  const verticalPos = darkMode ? 16 : -16; // for small screens

  const sunIconClass = isSmallScreen
    ? "text-neutral-500 absolute bottom-[18%] left-[27%]"
    : "text-neutral-500 absolute right-[23%]";

  const moonIconClass = isSmallScreen
    ? "text-neutral-300 absolute top-[18%] left-[27%]"
    : "text-neutral-300 absolute left-[23%]";

  return (
    <form className="antialiased">
      <label
        htmlFor="checkbox"
        className={twMerge(
          disabled ? "cursor-default" : "cursor-pointer",
          "w-7 h-[60px] md:w-[70px] md:h-8 relative px-1 border border-transparent",
          "shadow-[inset_0_0_12px_rgba(0,0,0,0.25),0_4px_6px_rgba(0,0,0,0.2)]",
          "rounded-full flex items-center",
          darkMode
            ? "bg-neutral-950 border-white/[0.1]"
            : "bg-neutral-300 border-neutral-300/[0.8]"
        )}
      >
        <motion.div
          initial={
            isSmallScreen
              ? { x: 0, y: darkMode ? -16 : 16 }
              : { x: darkMode ? 0 : 42, y: 0 }
          }
          animate={
            isSmallScreen
              ? { x: 0, y: verticalPos }
              : { x: horizontalPos, y: 0 }
          }
          transition={{
            duration: 0.3,
            delay: 0.1,
          }}
          key={String(darkMode)}
          className="h-[20px] w-[20px] block rounded-full bg-white dark:bg-white/60 shadow-md z-10"
        />

        {darkMode ? (
          <MoonIcon size={13.5} className={moonIconClass} />
        ) : (
          <SunIcon size={13.5} className={sunIconClass} />
        )}

        <input
          type="checkbox"
          disabled={disabled}
          checked={darkMode}
          onChange={(e) => setDarkMode(e.target.checked)}
          className="hidden"
          id="checkbox"
        />
      </label>
    </form>
  );
}
