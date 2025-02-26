import { useLocation } from "react-router-dom";
import { GithubIcon } from "./icons/GithubIcon";
import { Logo } from "./icons/Logo";
import { cn } from "@/lib/utils";
import { LAST_UPDATE } from "@/lib/constants";

export default function Footer() {
  const location = useLocation();
  const { pathname } = location;
  const updatedYearsAgo = new Date().getFullYear() - LAST_UPDATE;
  return (
    <footer className="w-full py-20 mt-24 text-sm bg-white border-t border-neutral-100 text-neutral-600">
      <div className="flex flex-col justify-between max-w-screen-xl px-8 mx-auto space-y-8 md:flex-row md:space-y-0">
        <div className="space-y-2">
          <div className="flex items-center mb-4 space-x-2">
            <Logo width={32} height={32} />
            <h1 className="text-2xl font-bold text-black">contractorsUy</h1>
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
                  updatedYearsAgo === 0 ? "bg-green-400" : "bg-yellow-400",
                  "absolute inline-flex w-full h-full rounded-full opacity-75 animate-[ping_2s_ease-in-out_infinite]"
                )}
              ></span>
              <span
                className={cn(
                  updatedYearsAgo === 0
                    ? "bg-green-600/60"
                    : "bg-yellow-600/60",
                  "relative inline-flex rounded-full size-2.5"
                )}
              ></span>
            </span>
            <p className="text-neutral-500">
              {updatedYearsAgo === 0
                ? "updated for the current year"
                : `updated ${updatedYearsAgo} ${
                    updatedYearsAgo > 1 ? "years" : "year"
                  }  ago`}
            </p>
          </div>
        </div>

        {/* Center Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-black">Related tools </h2>
          <ul className="space-y-2">
            <li>
              <a
                href={pathname === "/guide" ? "/" : "/guide"}
                className="text-neutral-600 hover:text-neutral-800"
              >
                {pathname === "/guide" ? "Simulator" : "Contractor's Guide"}
              </a>
            </li>
            <li>
              <a
                href="https://salarioliquidouruguay.com"
                className="text-neutral-600 hover:text-neutral-800"
              >
                Salario Líquido Uruguay
              </a>
            </li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-black">
            Other relevant links{" "}
          </h2>
          <ul className="space-y-2">
            <li>
              <a
                href="https://github.com/andy-viera/contractorsUy"
                className="flex items-center space-x-2 "
              >
                <p className="text-neutral-500">Contribute on</p>
                <GithubIcon width="18px" height="18px" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
