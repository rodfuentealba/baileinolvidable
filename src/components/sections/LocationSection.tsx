import bgLocation from "@/assets/bgLocation.png";
import { useFadeInOnScroll } from "@/hooks/useScrollAnimations";

const LocationSection = () => {
  const ref = useFadeInOnScroll();

  return (
    <section className="relative w-full bg-peach">
      <div
        ref={ref}
        className="fade-section relative w-full h-[400px] md:h-[500px] bg-cover bg-center flex items-end justify-center"
        style={{ backgroundImage: `url(${bgLocation})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-location-dark/90 to-transparent" />
        <div className="relative z-10 text-center pb-12 px-6">
          <p className="font-display text-xl md:text-2xl text-hero-navy-foreground/80 mb-2">
            La fiesta se realizará en el jardín de
          </p>
          <h2 className="font-serif-custom text-3xl md:text-5xl text-hero-navy-foreground font-bold">
            Casa Galzi en Galzignano Terme
          </h2>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
