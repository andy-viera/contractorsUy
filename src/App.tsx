import { useForm, SubmitHandler } from "react-hook-form";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Question from "./components/Question";
import { companyType, INITIAL_INPUTS } from "./lib/constants";
import { useState, useEffect } from "react";
import { calculateSalaryForPath } from "./lib/utils";

export interface FormData {
  originCompanyType: companyType;
  targetCompanyType: "foreign" | "national";
  isProfessional: boolean;
  currentSalary: number;
  combinesCapitalAndWork?: boolean;
  professionalCategory?: number;
  hasChildsInCharge?: boolean;
  hasPartnerInCharge?: boolean;
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

  const areAllRequiredFieldsFilled = (
    inputs: typeof INITIAL_INPUTS,
    values: FormData
  ): boolean => {
    for (const input of inputs) {
      const value = values[input.question.value];

      if (!value) {
        return false;
      }

      if (input.followups && value) {
        for (const followup of input.followups) {
          const followupValue = values[followup.question.value];

          if (
            followup.condition !== undefined &&
            followup.condition !== value
          ) {
            continue;
          }

          if (!followupValue) {
            return false;
          }

          if (followup.followups) {
            const isNestedFilled = areAllRequiredFieldsFilled(
              [{ ...followup }],
              values
            );
            if (!isNestedFilled) {
              return false;
            }
          }
        }
      }
    }

    return true;
  };

  useEffect(() => {
    const allFilled = areAllRequiredFieldsFilled(INITIAL_INPUTS, formValues);
    setIsDisabledBtn(!allFilled);
  }, [formValues]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="w-full p-4 bg-white">
        {result !== undefined && (
          <div className="max-w-xl p-6 mx-auto border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold">Resultado</h2>
            <p className="mt-2 text-lg">
              El sueldo de contractor que deberías pedir es de{" "}
              <span className="font-semibold">${result}</span>
            </p>
          </div>
        )}
        <div className="max-w-xl p-6 mx-auto border rounded-lg shadow-sm">
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
            <button
              type="submit"
              className={`w-full px-4 py-2 text-white ${
                isDisabledBtn
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } rounded-md`}
              disabled={isDisabledBtn}
            >
              Calcular sueldo de contractor
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
