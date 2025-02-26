import { ChevronRight } from "lucide-react";
import { HoverBorderGradient } from "./ui/hover-border-gradient";

export default function FancyButton() {
  return (
    <div className="flex justify-center text-center">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="flex items-center space-x-2 text-white bg-black"
      >
        <div className="flex space-x-1">
          <p>Calcular Sueldo De Contractor</p>
          <span className="flex items-center">
            <ChevronRight className="w-[1.2rem]" />
            <ChevronRight className="w-[1.2rem] -ml-3" />
          </span>
        </div>
      </HoverBorderGradient>
    </div>
  );
}
