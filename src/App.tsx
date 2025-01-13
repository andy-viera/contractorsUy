import { useForm, SubmitHandler } from "react-hook-form";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Question from "./components/Question";
import { companyType, INITIAL_INPUTS } from "./lib/constants";

export interface FormData {
  originCompanyType: companyType;
  targetCompanyType: "foreign" | "national";
  isProfessional: boolean;
  currentSalary: number;
  capitalAndWork?: "yes" | "no";
  professionalCategory?: number;
}

function App() {
  const { register, handleSubmit, watch } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
    // Add your logic to calculate contractor salary here
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="w-full p-4 bg-white">
        <div className="max-w-xl p-6 mx-auto border rounded-lg shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {INITIAL_INPUTS.map((input, i) => (
              <Question
                key={i}
                register={register}
                watch={watch}
                question={input.question}
                options={input.options}
                type={input.type}
                followups={input.followups}
              />
            ))}
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
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
