export default function Navbar() {
  return (
    <header className="min-w-full text-center mb-20 shadow-md">
      <nav className="max-w-screen-xl flex flex-wrap items-center justify-start mx-auto p-4 space-x-16">
        <h1 className="text-xl font-bold text-slate-800">ContractorsUy</h1>
        <div>
          <button className="text-slate-700">
            Calcular tu sueldo de contractor
          </button>
          <button className="text-slate-700">Información general</button>
        </div>
      </nav>
    </header>
  );
}
