import { useDarkMode } from "./DarkModeContext";
import Footer from "./Footer";
import MainNavbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { darkMode } = useDarkMode();

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col min-h-screen dark:bg-black">
        <div className="px-8 my-auto mb-24">
          <MainNavbar />
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
}
