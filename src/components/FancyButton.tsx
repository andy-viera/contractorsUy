import { ChevronRight } from "lucide-react";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import posthog from "posthog-js";

export default function FancyButton() {
  return (
    <div
      onClick={() =>
        posthog.capture("Button click", {
          btn: "Calcular Sueldo De Contractor",
        })
      }
      className="flex justify-center text-center"
    >
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="flex items-center space-x-2 text-black bg-white dark:bg-black dark:text-white"
      >
        <div className="flex space-x-1 dark:text-neutral-300">
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
