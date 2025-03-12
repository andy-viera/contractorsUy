import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { Logo } from "./icons/Logo";
import { DarkModeSwitch } from "./DarkModeSwitch";
import { useDarkMode } from "../contexts/DarkModeContext";

let scrollTimeout: number | null = null;

export default function MainNavbar() {
  const { darkMode, setDarkMode } = useDarkMode();
  return (
    <div className="relative flex items-center justify-center w-full pb-36 sm:pb-52">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
    </div>
  );
}

function Navbar({
  darkMode,
  setDarkMode,
}: {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}) {
  const [active, setActive] = useState<string | null>(null);

  const [scrolled, setScrolled] = useState(false);
  const [fadeSwitch, setFadeSwitch] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      scrollTimeout = window.setTimeout(() => {
        const beyondThreshold = window.scrollY > 50;

        if (beyondThreshold) {
          if (!scrolled) {
            setFadeSwitch(true);
          }
        } else {
          setFadeSwitch(false);
          setScrolled(false);
        }
      }, 50);
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [scrolled]);

  useEffect(() => {
    if (fadeSwitch) {
      const timer = setTimeout(() => {
        setScrolled(true);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [fadeSwitch]);

  return (
    <div className="fixed z-50 grid items-center w-full grid-cols-12 px-8 top-8">
      <div className="hidden md:block md:col-span-2"></div>

      <motion.div
        layout
        transition={{
          type: "tween",
          duration: 0.3,
          ease: "easeInOut",
        }}
        className={cn(
          scrolled ? "col-span-12" : "col-span-10",
          "md:col-span-8 inset-x-0 w-full max-w-2xl sm:mx-auto"
        )}
      >
        <Menu setActive={setActive}>
          <MenuItem
            setActive={setActive}
            active={active}
            item=""
            icon={
              <Logo
                width={35}
                height={35}
                fill={darkMode ? "#ffffff" : "#737373"}
              />
            }
            isInitialArragement={!fadeSwitch}
          >
            <div className="grid grid-cols-1 gap-10 text-sm md:p-4 md:grid-cols-2">
              <ProductItem
                title="Simulator"
                href="/"
                src={darkMode ? "/simulator-dark.gif" : "/simulator-light.gif"}
                description="Calcula tu salario de contractor en base a tu situación legal particular y tu sueldo como dependiente."
                isInitialArragement={!fadeSwitch}
              />
              <ProductItem
                title="Contractor's Guide"
                href="/guide"
                src={darkMode ? "/guide-dark.gif" : "/guide-light.gif"}
                description="Entendé las básicas de ser contractor en Uruguay y cómo optimizar tu pago de impuestos."
                isInitialArragement={!fadeSwitch}
              />
            </div>
          </MenuItem>
        </Menu>
      </motion.div>

      <div
        className={cn(
          fadeSwitch ? "opacity-0" : "opacity-100",
          "col-span-2 flex justify-end md:justify-center md:ml-4 transition-opacity duration-200"
        )}
      >
        <DarkModeSwitch
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          disabled={fadeSwitch}
        />
      </div>
    </div>
  );
}
