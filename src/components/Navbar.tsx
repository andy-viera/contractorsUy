import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full mb-20 shadow-md">
      <nav className="flex items-center justify-between max-w-screen-xl px-4 py-4 mx-auto">
        {/* Logo */}
        <h1 className="text-xl font-bold text-slate-800">ContractorsUy</h1>

        {/* Mobile Menu Button */}
        <button
          className="text-slate-800 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden space-x-8 md:flex">
          <button className="text-slate-700">
            Calcular tu sueldo de contractor
          </button>
          <button className="text-slate-700">Guía</button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute left-0 w-full bg-white shadow-md top-16 md:hidden">
            <div className="flex flex-col items-start p-4 space-y-4">
              <button className="w-full text-left text-slate-700">
                Calcular tu sueldo de contractor
              </button>
              <button className="w-full text-left text-slate-700">Guía</button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
