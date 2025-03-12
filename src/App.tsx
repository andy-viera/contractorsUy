import { useForm, SubmitHandler } from "react-hook-form";
import "./App.css";
import { INITIAL_INPUTS } from "./lib/constants";
import { useState, useEffect } from "react";
import { areAllQuestionsAnswered, calculateSalaryForPath } from "./lib/utils";
import { motion } from "framer-motion";
import Layout from "./components/Layout";
import SimulatorResult, { ResultType } from "./components/SimulatorResult";
import SimulatorForm from "./components/SimulatorForm";
import { FormData } from "./lib/types";

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
          <SimulatorResult result={result} />
        </motion.div>
      </main>
    </Layout>
  );
}

export default App;
