import { useLocation } from "react-router-dom";
import { GithubIcon } from "./icons/GithubIcon";
import { Logo } from "./icons/Logo";
import { cn } from "@/lib/utils";
import { LAST_UPDATE } from "@/lib/constants";
import { InfoIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useDarkMode } from "./DarkModeContext";

export default function Footer() {
  const location = useLocation();
  const { pathname } = location;
  const updatedYearsAgo = new Date().getFullYear() - LAST_UPDATE;
  const [isHovered, setIsHovered] = useState(false);
  const { darkMode } = useDarkMode();

  return (
    <footer className="w-full px-8 py-20 mt-auto text-sm border-t border-neutral-100 dark:border-white/[0.1] text-neutral-600">
      <div className="flex flex-col justify-between max-w-screen-xl mx-auto space-y-8 md:flex-row md:space-y-0">
        <div className="space-y-2">
          <div className="mb-4">
            <a href="/" className="flex items-center space-x-2">
              <Logo
                width={32}
                height={32}
                fill={darkMode ? "#ffffff" : "#000000"}
              />
              <h1 className="text-2xl font-bold text-black dark:text-white">
                contractorsUy
              </h1>
            </a>
          </div>
          <p className="text-neutral-500">
            A project by{" "}
            <a
              href="https://www.linkedin.com/in/andres-viera/"
              className="font-medium text-sky-600 hover:text-neutral-600"
            >
              @andy-viera
            </a>
          </p>
          <div className="flex items-center space-x-2">
            <span className="relative flex size-2.5">
              <span
                className={cn(
                  updatedYearsAgo === 0 ? "bg-blue-400" : "bg-yellow-400",
                  "absolute inline-flex w-full h-full rounded-full opacity-75 animate-[ping_2s_ease-in-out_infinite]"
                )}
              ></span>
              <span
                className={cn(
                  updatedYearsAgo === 0 ? "bg-blue-600/70" : "bg-yellow-600/60",
                  "relative inline-flex rounded-full size-2.5"
                )}
              ></span>
            </span>
            <span className="flex items-center space-x-1">
              <p className="text-neutral-500">
                {updatedYearsAgo === 0
                  ? "updated for the current year"
                  : `updated ${updatedYearsAgo} ${
                      updatedYearsAgo > 1 ? "years" : "year"
                    }  ago`}
              </p>
              <div
                className="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <InfoIcon className="w-4 text-neutral-400" />
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="top-[-5rem] right-[-6rem] break-words max-w-24 sm:max-w-48 absolute z-50 p-3 dark:bg-white/60 text-xs sm:text-sm text-black transform -translate-x-1/2 bg-transparent backdrop-blur-sm rounded-lg shadow-lg sm:top-[-3rem] sm:right-[-12rem]"
                  >
                    <p className="text-xs break-words">
                      Anually updated values{" "}
                      {updatedYearsAgo === 0
                        ? "are up to date"
                        : `were last updated ${updatedYearsAgo} ${
                            updatedYearsAgo > 1 ? "years" : "year"
                          }  ago`}
                      .
                    </p>
                  </motion.div>
                )}
              </div>
            </span>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-black dark:text-neutral-500">
            Related tools{" "}
          </h2>
          <ul className="space-y-2">
            <li>
              <a
                href={pathname === "/guide" ? "/" : "/guide"}
                className="transition-colors text-neutral-600 hover:text-neutral-800"
              >
                {pathname === "/guide" ? "Simulator" : "Contractor's Guide"}
              </a>
            </li>
            <li>
              <a
                href="https://salarioliquidouruguay.com"
                className="transition-colors text-neutral-600 hover:text-neutral-800"
              >
                Salario Líquido Uruguay
              </a>
            </li>
          </ul>
        </div>
        {/* Right Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-black dark:text-neutral-500">
            Other relevant links{" "}
          </h2>
          <ul className="space-y-2">
            <li>
              <a
                href="https://github.com/andy-viera/contractorsUy"
                className="flex items-center space-x-2 transition-colors text-neutral-500 hover:text-neutral-800"
              >
                <p className="">Contribute on</p>
                <GithubIcon
                  width="18px"
                  height="18px"
                  fill={darkMode ? "#525252" : undefined}
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
