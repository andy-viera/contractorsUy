import { ReactNode } from "react";
import { BackLightButton } from "./BacklightButton";
import { CircleAlert } from "lucide-react";

export default function ProductHeading({
  productName,
  productDescription,
  productStatus = "stable",
  addDisclaimer,
}: {
  productName: string;
  productDescription: string | ReactNode;
  productStatus?: "alfa" | "beta" | "stable";
  addDisclaimer?: boolean;
}) {
  return (
    <section className="mb-10">
      <div className="flex items-center px-5 py-4 mb-3.5 space-x-3 font-bold border rounded-full border-neutral-300 bg-neutral-50 dark:bg-black dark:border-white/[0.2] w-fit">
        <h2 className="text-2xl dark:text-neutral-300">{productName}</h2>
        {productStatus !== "stable" && (
          <BackLightButton
            text={productStatus === "beta" ? "β" : "α"}
            hoverText={
              productStatus === "beta"
                ? "This is a beta release and may have defects"
                : "This is an alpha release and may have defects"
            }
          />
        )}
      </div>
      <p className="text-[0.97rem] text-neutral-600 dark:text-neutral-400 mb-2.5 md:mb-1.5">
        {productDescription}
      </p>
      {addDisclaimer && (
        <div className="flex items-center space-x-1.5 md:space-x-0 text-neutral-400 dark:text-neutral-500">
          <CircleAlert className="inline-block w-5 h-5 md:w-3.5 md:h-3.5 mr-2" />
          <small>
            ¿Empezando desde cero? Lee la{" "}
            <a href="/guide" className="text-sky-400 dark:text-sky-600">
              {" "}
              Contractor´s Guide
            </a>{" "}
            primero.
          </small>
        </div>
      )}
    </section>
  );
}
