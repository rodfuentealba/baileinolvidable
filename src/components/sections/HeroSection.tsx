import bgHero from "@/assets/bgHero.png";
import humanLeft from "@/assets/humanLeft.png";
import humanRight from "@/assets/humanRight.png";
import palmerLeft from "@/assets/palmerLeft.png";
import palmerRight from "@/assets/palmerRight.png";
import maskLeft from "@/assets/maskLeft.png";
import maskRight from "@/assets/maskRight.png";
import partyLeft from "@/assets/partyLeft.png";
import partyRight from "@/assets/partyRight.png";
import { useFadeInOnScroll, useParallax } from "@/hooks/useScrollAnimations";

interface ParallaxElementProps {
  src: string;
  alt: string;
  className: string;
  speed?: number;
}

const ParallaxElement = ({ src, alt, className, speed = 0.05 }: ParallaxElementProps) => {
  const { ref, offset } = useParallax(speed);
  return (
    <div
      ref={ref}
      className={`absolute parallax-float pointer-events-none ${className}`}
      style={{ transform: `translateY(${offset}px)` }}
    >
      <img src={src} alt={alt} className="w-full h-full object-contain" />
    </div>
  );
};

const HeroSection = () => {
  const ref = useFadeInOnScroll();

  return (
    <section className="relative w-full bg-hero-navy">

      {/* Decorative parallax elements */}
      <ParallaxElement
        src={palmerLeft}
        alt="Palmera izquierda"
        className="left-0 -bottom-[20%] w-[36%] md:w-[28%] z-[60]"
        speed={0.04}
      />
      <ParallaxElement
        src={palmerRight}
        alt="Palmera derecha"
        className="right-0 -bottom-[20%] w-[32%] md:w-[24%] z-[60]"
        speed={0.04}
      />
      <ParallaxElement
        src={humanLeft}
        alt="Persona izquierda"
        className="left-[15%] bottom-[8%] w-[12%] md:w-[8%] z-20"
        speed={0.06}
      />
      <ParallaxElement
        src={humanRight}
        alt="Persona derecha"
        className="right-[15%] bottom-[8%] w-[10%] md:w-[7%] z-20"
        speed={0.06}
      />
      <ParallaxElement
        src={maskLeft}
        alt="Máscara izquierda"
        className="left-[8%] top-[20%] w-[8%] md:w-[5%] z-10"
        speed={0.05}
      />
      <ParallaxElement
        src={maskRight}
        alt="Máscara derecha"
        className="right-[8%] top-[20%] w-[8%] md:w-[5%] z-10"
        speed={0.05}
      />
      <ParallaxElement
        src={partyLeft}
        alt="Persona fiesta izquierda"
        className="left-[15%] bottom-[5%] w-[10%] md:w-[7%] z-20"
        speed={0.07}
      />
      <ParallaxElement
        src={partyRight}
        alt="Persona fiesta derecha"
        className="right-[15%] bottom-[5%] w-[10%] md:w-[7%] z-20"
        speed={0.07}
      />

      {/* Hero illustration */}
      <div ref={ref} className="fade-section relative w-full h-[700px]">
        <img
          src={bgHero}
          alt="Baile Inolvidable - Fiesta en la playa"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Description overlay */}
      <div className="bg-navbar-scroll py-12 md:py-16 text-center px-6">
        <p className="font-display text-2xl md:text-3xl text-white mb-2">
          Fiesta para celebrar nuestra unión
        </p>
        <h2 className="font-serif-custom text-2xl md:text-4xl mb-3 italic" style={{ color: '#FBB104' }}>
          Casa Galzi en Galzignano Terme
        </h2>
        <p className="font-display text-lg md:text-xl text-white/80 max-w-lg mx-auto">
          con nuestros amigos que son parte importante de nuestras vidas!
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
