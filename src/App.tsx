import { useForm, SubmitHandler } from "react-hook-form";
import "./App.css";
import Footer from "./components/Footer";
import Question, { QuestionType } from "./components/Question";
import { companyType, INITIAL_INPUTS } from "./lib/constants";
import { useState, useEffect } from "react";
import { calculateSalaryForPath } from "./lib/utils";
import { HoverBorderGradient } from "./components/ui/hover-border-gradient";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import MainNavbar from "./components/Navbar";

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
    <div className="flex flex-col min-h-screen">
      <MainNavbar />
      <main className="flex flex-wrap items-center justify-center flex-1 w-full p-4 bg-white gap-x-3">
        <motion.div
          layout
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className="w-2/3 mx-auto border rounded-lg shadow-sm"
        >
          <div className="p-8">
            <section className="mb-10">
              <h2 className="px-5 py-4 mb-4 text-2xl font-bold border rounded-full border-neutral-300 bg-neutral-50 w-fit">
                Simulator
              </h2>
              <p className="text-[0.97rem]">
                Descubrí tu sueldo como contractor en base a tu situación legal
                particular. Nuestro simulador calcula tu salario considerando
                impuestos, aportes y exoneraciones para que tomes decisiones
                informadas y optimices tus ingresos.
              </p>
            </section>
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
              {/* Button */}
              <div
                className={`flex justify-center w-full transition-opacity duration-1000 ${
                  isDisabledBtn
                    ? "opacity-0 invisible absolute"
                    : "opacity-100 visible relative"
                }`}
              >
                <button className="px-0 pt-5 cursor-pointer" type="submit">
                  <HoverBorderGradientDemo />
                </button>
              </div>
            </form>
          </div>
          {result && (
            <div className="w-full px-8 py-4 mx-auto mt-8 text-white rounded-b-lg shadow-sm bg-neutral-500">
              <h2 className="text-xl font-semibold">Resultado</h2>
              <p className="mt-2 text-lg">
                El sueldo de contractor que deberías pedir es de: <br />
                <span className="font-semibold">
                  U$ {Math.round(result)} {`(US$ ${Math.round(result / 45)})`}
                </span>
              </p>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
function HoverBorderGradientDemo() {
  return (
    <div className="flex justify-center text-center">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="flex items-center space-x-2 text-white bg-black"
      >
        <div className="flex space-x-1">
          <span className="flex items-center">
            <ChevronRight className="w-[1.2rem]" />
            <ChevronRight className="w-[1.2rem] -ml-3" />
          </span>
          <p>Calcular Sueldo De Contractor</p>
        </div>
      </HoverBorderGradient>
    </div>
  );
}

export default App;
