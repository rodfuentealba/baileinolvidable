import { useEffect, useState } from "react";
import titleDB from "@/assets/titleDB.svg";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-counter-bg" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-center py-4 px-6">
        <img src={titleDB} alt="Damiam & Benedetta" className="h-6 md:h-8" />
      </div>
    </nav>
  );
};

export default Navbar;
