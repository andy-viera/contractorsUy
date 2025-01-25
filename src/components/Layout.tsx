import Footer from "./Footer";
import MainNavbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen mx-8 sm:mx-28">
      <MainNavbar />
      {children}
      <Footer />
    </div>
  );
}
