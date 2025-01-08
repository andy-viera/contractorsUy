export default function Navbar() {
  return (
    <header className="min-w-full text-center mb-20 shadow-md">
      <nav className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <h1 className="text-xl font-bold text-slate-800">ContractorsUy</h1>
        <button className="text-slate-700 hover:underline">
          Calcular tu sueldo de contractor
        </button>
        <button className="text-slate-700 hover:underline">
          Información general
        </button>
      </nav>
    </header>
  );
}
