import { useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { Logo } from "./icons/Logo";

export default function MainNavbar() {
  return (
    <div className="relative flex items-center justify-center w-full pb-36 sm:pb-48">
      <Navbar />
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn(
        "fixed top-8 inset-x-0 max-w-2xl mx-8 sm:mx-auto z-50",
        className
      )}
    >
      <Menu setActive={setActive}>
        <MenuItem
          setActive={setActive}
          active={active}
          item=""
          icon={<Logo width={35} height={35} fill="#737373" />}
        >
          <div className="grid grid-cols-2 gap-10 p-4 text-sm ">
            <ProductItem
              title="Simulator"
              href="/"
              src="/simulator.gif"
              description="Calcula tu salario de contractor en base a tu situación legal particular y tu sueldo como dependiente."
            />
            <ProductItem
              title="Contractor's Guide"
              href="/guide"
              src="https://assets.aceternity.com/demos/tailwindmasterkit.webp"
              description="Entendé las básicas de ser contractor en Uruguay y cómo optimizar tu pago de impuestos."
            />
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}
