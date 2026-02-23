import bgHero from "@/assets/bgHero.png";
import titleDB from "@/assets/titleDB.svg";
import { useFadeInOnScroll } from "@/hooks/useScrollAnimations";

const HeroSection = () => {
  const ref = useFadeInOnScroll();

  return (
    <section className="relative w-full overflow-hidden bg-hero-navy">
      {/* Title bar */}
      <div className="relative z-10 flex items-center justify-center pt-6 pb-2">
        <img src={titleDB} alt="Damiam & Benedetta" className="h-6 md:h-8" />
      </div>

      {/* Hero illustration */}
      <div ref={ref} className="fade-section relative w-full">
        <img
          src={bgHero}
          alt="Baile Inolvidable - Fiesta en la playa"
          className="w-full h-auto"
        />
      </div>

      {/* Description overlay */}
      <div className="bg-navbar-scroll py-12 md:py-16 text-center px-6">
        <p className="font-display text-2xl md:text-3xl text-muted-foreground mb-2">
          Casa Galzi en Galzignano Terme
        </p>
        <h2 className="font-serif-custom text-2xl md:text-4xl text-foreground mb-3 italic">
          Fiesta para celebrar nuestra unión
        </h2>
        <p className="font-display text-lg md:text-xl text-muted-foreground max-w-lg mx-auto">
          con nuestros amigos que son parte importante de nuestras vidas!
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
