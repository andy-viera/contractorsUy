import { useForm, SubmitHandler } from "react-hook-form";
import "./App.css";
import Navbar from "./components/Navbar";

interface FormData {
  targetCompanyType: "foreign" | "national";
  isProfessional: boolean;
  currentSalary: number;
}

function App() {
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
    // Add your logic to calculate contractor salary here
  };

  return (
    <>
      <Navbar />
      <main className="bg-white p-4 min-h-screen w-full">
        <div className="max-w-xl mx-auto border rounded-lg p-6 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                ¿Facturás al exterior o a una empresa nacional?
              </label>
              <div className="space-y-1">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="foreign"
                    {...register("targetCompanyType", { required: true })}
                    className="form-radio"
                  />
                  <span>Empresa extranjera</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="national"
                    {...register("targetCompanyType", { required: true })}
                    className="form-radio"
                  />
                  <span>Empresa nacional</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                ¿Sos profesional?
              </label>
              <div className="space-y-1">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="true"
                    {...register("isProfessional", { required: true })}
                    className="form-radio"
                  />
                  <span>Sí</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="false"
                    {...register("isProfessional", { required: true })}
                    className="form-radio"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Ingresá tu salario líquido actual
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  $
                </span>
                <input
                  type="number"
                  {...register("currentSalary", { required: true })}
                  className="form-input pl-8 w-full border rounded-md"
                  placeholder="0.00"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Calcular sueldo de contractor
            </button>
          </form>
          <footer className="mt-8 text-center text-gray-500 text-sm">
            Repositorio del proyecto - © Andrés Vera
          </footer>
        </div>
      </main>
    </>
  );
}

export default App;
