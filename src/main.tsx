import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Guide from "./pages/guide/page.tsx";
import { DarkModeContext } from "./components/DarkModeContext";

function Main() {
  const [darkMode, setDarkMode] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    setDarkMode(storedDarkMode === "true");
  }, []);

  useEffect(() => {
    if (darkMode === undefined) return;
    localStorage.setItem("darkMode", darkMode.toString());
    document.body.classList.toggle("bg-black", darkMode);
  }, [darkMode]);

  if (darkMode === undefined) return null; // Avoid rendering before darkMode is set

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/guide" element={<Guide />} />
        </Routes>
      </Router>
    </DarkModeContext.Provider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Main />
  </StrictMode>
);
