import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Guide from "./pages/guide/page.tsx";
import { DarkModeContext } from "./contexts/DarkModeContext.tsx";
import { PostHogProvider } from "posthog-js/react";

function Main() {
  const [darkMode, setDarkMode] = useState<boolean | undefined>(undefined);
  const [configLoaded, setConfigLoaded] = useState(false);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    setDarkMode(storedDarkMode === "true");

    setConfigLoaded(true);
  }, []);

  useEffect(() => {
    if (darkMode === undefined) return;

    localStorage.setItem("darkMode", darkMode.toString());
    document.body.classList.toggle("bg-black", darkMode);
  }, [darkMode]);

  const PUBLIC_POSTHOG_HOST: string = import.meta.env
    .VITE_REACT_APP_PUBLIC_POSTHOG_HOST;
  const PUBLIC_POSTHOG_API_KEY: string = import.meta.env
    .VITE_REACT_APP_PUBLIC_POSTHOG_KEY;

  const options = {
    api_host: PUBLIC_POSTHOG_HOST,
  };

  if (!configLoaded) return null;

  return (
    <PostHogProvider apiKey={PUBLIC_POSTHOG_API_KEY} options={options}>
      <DarkModeContext.Provider value={{ darkMode: darkMode!, setDarkMode }}>
        <Router>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/guide" element={<Guide />} />
          </Routes>
        </Router>
      </DarkModeContext.Provider>
    </PostHogProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Main />
  </StrictMode>
);
