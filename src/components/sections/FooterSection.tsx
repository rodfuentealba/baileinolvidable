import titleDB from "@/assets/titleDB.svg";
import { Heart } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="bg-footer-red py-12 px-6 text-center">
      <Heart className="w-10 h-10 text-hero-navy-foreground mx-auto mb-4 fill-hero-navy-foreground" />
      <img src={titleDB} alt="Damiam & Benedetta" className="h-6 mx-auto opacity-90" />
      <p className="text-hero-navy-foreground/60 text-sm font-body mt-4">
        05 Settembre 2026 · Galzignano Terme, Italia
      </p>
    </footer>
  );
};

export default FooterSection;
