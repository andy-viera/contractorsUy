import { useForm, SubmitHandler } from "react-hook-form";
import "./App.css";
import Question, { QuestionType } from "./components/Question";
import { companyType, INITIAL_INPUTS } from "./lib/constants";
import { useState, useEffect } from "react";
import { calculateSalaryForPath, parseWithDots } from "./lib/utils";
import { motion } from "framer-motion";
import Layout from "./components/Layout";
import ProductHeading from "./components/ProductHeading";
import FancyButton from "./components/FancyButton";

export interface FormData {
  originCompanyType: companyType;
  targetCompanyType: "foreign" | "national";
  isProfessional: "true" | "false";
  currentSalary: number;
  combinesCapitalAndWork?: "true" | "false";
  professionalCategory?: number;
  hasChildsInCharge?: "true" | "false";
  hasPartnerInCharge?: "true" | "false";
  socialSecurityCategory?: number;
}

function App() {
  const { register, handleSubmit, watch, setValue } = useForm<FormData>();
  const [isDisabledBtn, setIsDisabledBtn] = useState(true);
  const [result, setResult] = useState<number | undefined>(undefined);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    setResult(calculateSalaryForPath(data));
  };

  const formValues = watch();

  const areAllQuestionsAnswered = (
    questions: QuestionType[],
    formValues: FormData
  ): boolean => {
    for (const question of questions) {
      const answer = formValues[question.question.value];

      if (answer === undefined || answer === null) {
        return false;
      }

      if (question.followups) {
        for (const followup of question.followups) {
          const shouldDisplay =
            (followup.condition === undefined ||
              String(followup.condition) === answer) &&
            (!followup.companyType ||
              followup.companyType === formValues.originCompanyType);

          if (shouldDisplay) {
            const followupAnswered = areAllQuestionsAnswered(
              [followup],
              formValues
            );
            if (!followupAnswered) {
              return false;
            }
          }
        }
      }
    }

    return true;
  };

  useEffect(() => {
    const allFilled = areAllQuestionsAnswered(INITIAL_INPUTS, formValues);
    setIsDisabledBtn(!allFilled);
  }, [formValues]);

  return (
    <Layout>
      <main className="flex flex-wrap items-center justify-center flex-1 w-full bg-white gap-x-3">
        <motion.div
          layout
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 40,
          }}
          className="w-full mx-auto border rounded-lg shadow-lg sm:w-2/3"
        >
          <div className="p-8 sm:p-12">
            <ProductHeading
              productName="Simulator"
              productDescription="Descubrí tu sueldo como contractor en base a tu situación legal
                particular. Nuestro simulador calcula tu salario considerando
                impuestos, aportes y exoneraciones para que tomes decisiones
                informadas y optimices tus ingresos."
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
                className={`flex justify-center w-full transition-opacity duration-1000 ${
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
          {result && (
            <div className="w-full px-8 py-4 mx-auto mt-8 text-white rounded-b-lg shadow-sm bg-neutral-500">
              <h2 className="text-xl font-semibold">Resultado</h2>
              <p className="mt-2 text-lg">
                El sueldo de contractor que deberías pedir es de: <br />
                <span className="font-semibold">
                  U$ {parseWithDots(Math.round(result))}{" "}
                  {`(US$ ${parseWithDots(Math.round(result / 45))})`}
                </span>
              </p>
              <p className="mt-2 text-xs text-neutral-300">
                * Las estimaciones proporcionadas por éste simulador no
                incluyen: IVA, contribución a fondo de solidaridad, honorarios
                de contador, facturación electrónica.
              </p>
            </div>
          )}
        </motion.div>
      </main>
    </Layout>
  );
}

export default App;
