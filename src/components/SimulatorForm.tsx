import { INITIAL_INPUTS } from "@/lib/constants";
import Question from "./Question";
import {
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import ProductHeading from "./ProductHeading";
import FancyButton from "./FancyButton";
import { FormData } from "@/lib/types";

export default function SimulatorForm({
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
