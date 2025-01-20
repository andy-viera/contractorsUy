import { GithubIcon } from "./icons/GithubIcon";
import { Logo } from "./icons/Logo";

export default function Footer() {
  return (
    <footer className="w-full py-10 mt-8 text-sm bg-white border-t border-neutral-100 text-neutral-600">
      <div className="flex flex-col justify-between max-w-screen-xl px-8 mx-auto space-y-8 md:flex-row md:space-y-0">
        {/* Left Section */}
        <div className="space-y-2">
          <div className="flex items-center mb-4 space-x-2">
            <Logo width={32} height={32} />
            <h1 className="text-2xl font-bold text-black">ContractorsUy</h1>
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
          <a
            href="https://github.com/andy-viera/contractorsUy"
            className="flex items-center space-x-2 "
          >
            <p className="text-neutral-500">Contribute on</p>
            <GithubIcon width="18px" height="18px" />
          </a>
        </div>

        {/* Center Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-black">Otros simuladores</h2>
          <ul className="space-y-2">
            <li>
              <a
                href="https://salarioliquidouruguay.com"
                className="text-neutral-600 hover:text-neutral-800"
              >
                Salario líquido
              </a>
            </li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="space-y-4">
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                href="#"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Components
              </a>
            </li>
            <li>
              <a
                href="#"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Templates
              </a>
            </li>
            <li>
              <a
                href="#"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Blog
              </a>
            </li>
            <li>
              <a
                href="#"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Showcase
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
