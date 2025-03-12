import { parseWithDots } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DOLAR_UYU_RATE } from "@/lib/constants";
import { TaxDetail } from "@/lib/types";

export type ResultType = {
  contractorSalary: number;
  taxDetail: Partial<Record<keyof typeof TaxDetail, number>>;
};

export default function SimulatorResult({
  result,
}: {
  result: ResultType | undefined;
}) {
  return (
    result && (
      <div className="w-full px-8 py-4 mx-auto mt-8 text-white rounded-b-lg shadow-sm bg-neutral-500 dark:bg-neutral-950 dark:border-t border-white/[0.2]">
        <h2 className="text-xl font-semibold">Resultado</h2>
        <p className="mt-2 text-lg">
          El sueldo de contractor que deberías pedir es de: <br />
          <span className="font-semibold">
            U$ {parseWithDots(Math.round(result.contractorSalary))}{" "}
            {`(US$ ${parseWithDots(
              Math.round(result.contractorSalary / DOLAR_UYU_RATE)
            )})`}
          </span>
        </p>
        <Accordion type="single" collapsible className="w-full mt-1.5 mb-5">
          <AccordionItem value="item-1" className="border-white/[0.2]">
            <AccordionTrigger className="text-sm font-semibold text-neutral-200 dark:text-neutral-400 hover:no-underline">
              Ver detalle de impuestos
            </AccordionTrigger>
            <AccordionContent>
              <ul>
                {Object.entries(result.taxDetail).map(([key, value]) =>
                  value ? (
                    <li
                      key={key}
                      className="flex items-center mt-0.5 space-x-1"
                    >
                      <p className="font-medium">
                        {TaxDetail[key as keyof typeof TaxDetail]}:
                      </p>
                      <span className="text-xs">{`U$ ${parseWithDots(
                        value
                      )}`}</span>
                    </li>
                  ) : null
                )}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <p className="mt-2 text-xs text-neutral-300 dark:text-neutral-500">
          * Las estimaciones proporcionadas por éste simulador no incluyen: IVA,
          honorarios de contador, facturación electrónica.
        </p>
      </div>
    )
  );
}
