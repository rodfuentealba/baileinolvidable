import { useEffect, useState } from "react";
import titleDB from "@/assets/titleDB.svg";
import { useLanguage } from "@/hooks/useLanguage";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { lang, toggleLang } = useLanguage();

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
      <div className="flex items-center justify-between py-4 px-6">
        <div className="w-16" />
        <img src={titleDB} alt="Damiam & Benedetta" className="h-6 md:h-8" />
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-hero-navy-foreground/10 hover:bg-hero-navy-foreground/20 transition-colors text-hero-navy-foreground text-sm font-body font-semibold backdrop-blur-sm"
          title={lang === "es" ? "Cambiar a Italiano" : "Cambia in Spagnolo"}
        >
          <span className="text-base">{lang === "es" ? "🇨🇱" : "🇮🇹"}</span>
          <span>{lang === "es" ? "ES" : "IT"}</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
