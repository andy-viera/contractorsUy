import {
  useForm,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import "./App.css";
import Question from "./components/Question";
import { companyType, DOLAR_UYU_RATE, INITIAL_INPUTS } from "./lib/constants";
import { useState, useEffect } from "react";
import {
  areAllQuestionsAnswered,
  calculateSalaryForPath,
  parseWithDots,
} from "./lib/utils";
import { motion } from "framer-motion";
import Layout from "./components/Layout";
import ProductHeading from "./components/ProductHeading";
import FancyButton from "./components/FancyButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/ui/accordion";

export interface FormData {
  originCompanyType: companyType;
  targetCompanyType: "foreign" | "national";
  isProfessional: "true" | "false";
  currentSalary: number;
  combinesCapitalAndWork?: "true" | "false";
  professionalCategory?: number;
  hasChildsInCharge?: "true" | "false";
  childsInChargeCount?: number;
  disabledChildsInChargeCount?: number;
  dependentsDeductionFactor?: number;
  hasPartnerInCharge?: "true" | "false";
  socialSecurityCategory?: number;
  solidarityFundContribution?: number;
  appliesSolidarityFundAditional?: "true" | "false";
}

export enum TaxDetail {
  retirementTax = "Aportes jubilatorios",
  fonasaTax = "Aportes a FONASA",
  frlTax = "Aportes a FRL",
  irpfTax = "IRPF",
  professionalCategory = "Aporte a caja de profesionales",
  solidarityFundContribution = "Aporte a fondo de solidaridad",
  additionalSolidarityFundAmount = "Aporte adicional al fondo de solidaridad",
}

type ResultType = {
  contractorSalary: number;
  taxDetail: Partial<Record<keyof typeof TaxDetail, number>>;
};

function App() {
  const { register, handleSubmit, watch, setValue } = useForm<FormData>();
  const [isDisabledBtn, setIsDisabledBtn] = useState(true);
  const [result, setResult] = useState<ResultType | undefined>(undefined);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    setResult(calculateSalaryForPath(data));
  };

  const formValues = watch();

  useEffect(() => {
    const allFilled = areAllQuestionsAnswered(INITIAL_INPUTS, formValues);
    setIsDisabledBtn(!allFilled);
  }, [formValues]);

  return (
    <Layout>
      <main className="flex items-center justify-center flex-1 max-w-6xl mx-auto gap-x-3">
        <motion.div
          layout
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 40,
          }}
          className="w-full mx-auto border dark:border-white/[0.2] rounded-lg shadow-lg sm:w-2/3"
        >
          <SimulatorForm
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            register={register}
            watch={watch}
            setValue={setValue}
            isDisabledBtn={isDisabledBtn}
          />
          <Result result={result} />
        </motion.div>
      </main>
    </Layout>
  );
}

function SimulatorForm({
  handleSubmit,
  onSubmit,
  register,
  watch,
  setValue,
  isDisabledBtn,
}: {
  handleSubmit: UseFormHandleSubmit<FormData, undefined>;
  onSubmit: SubmitHandler<FormData>;
  register: UseFormRegister<FormData>;
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
  isDisabledBtn: boolean;
}) {
  return (
    <div className="p-8 sm:p-12">
      <ProductHeading
        productName="Simulator"
        productDescription="Descubrí tu sueldo como contractor en base a tu situación legal
                particular. Nuestro simulador calcula tu salario considerando
                impuestos, aportes y exoneraciones para que tomes decisiones
                informadas y optimices tus ingresos."
        addDisclaimer
        productStatus="beta"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {INITIAL_INPUTS.map((input, i) => (
          <Question
            key={i}
            register={register}
            watch={watch}
            setValue={setValue}
            question={input.question}
            options={input.options}
            type={input.type}
            followups={input.followups}
          />
        ))}
        <div
          className={`flex justify-center transition-opacity duration-1000 ${
            isDisabledBtn
              ? "opacity-0 invisible absolute"
              : "opacity-100 visible relative"
          }`}
        >
          <div className="px-0 pt-5">
            <FancyButton />
          </div>
        </div>
      </form>
    </div>
  );
}

function Result({ result }: { result: ResultType | undefined }) {
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

export default App;
