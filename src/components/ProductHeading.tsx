import { ReactNode } from "react";
import { BackLightButton } from "./BacklightButton";

export default function ProductHeading({
  productName,
  productDescription,
  productStatus = "stable",
}: {
  productName: string;
  productDescription: string | ReactNode;
  productStatus?: "alfa" | "beta" | "stable";
}) {
  return (
    <section className="mb-10">
      <div className="flex items-center px-5 py-4 mb-3.5 space-x-3 font-bold border rounded-full border-neutral-300 bg-neutral-50 w-fit">
        <h2 className="text-2xl">{productName}</h2>
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
      <p className="text-[0.97rem] text-neutral-600">{productDescription}</p>
    </section>
  );
}
