import bgHero from "@/assets/bgHero.png";
import humanLeft from "@/assets/humanLeft.png";
import humanRight from "@/assets/humanRight.png";
import palmerLeft from "@/assets/palmerLeft.png";
import palmerRight from "@/assets/palmerRight.png";
import maskLeft from "@/assets/maskLeft.png";
import maskRight from "@/assets/maskRight.png";
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
    <section className="relative w-full h-screen bg-hero-navy">

      {/* 1. Palmera izquierda */}
      <ParallaxElement
        src={palmerLeft}
        alt="Palmera izquierda"
        className="left-0 bottom-[-20%] w-[20%] z-[60]"
        speed={0.04}
      />
      {/* 2. Palmera derecha */}
      <ParallaxElement
        src={palmerRight}
        alt="Palmera derecha"
        className="right-0 bottom-[-20%] w-[20%] z-[60]"
        speed={0.04}
      />
      {/* 3. Persona izquierda */}
      <ParallaxElement
        src={humanLeft}
        alt="Persona izquierda"
        className="left-[15%] bottom-[-30%] w-[10%] z-20"
        speed={0.06}
      />
      {/* 4. Persona derecha */}
      <ParallaxElement
        src={humanRight}
        alt="Persona derecha"
        className="right-[15%] bottom-[-30%] w-[10%] z-20"
        speed={0.06}
      />
      {/* 5. Máscara izquierda */}
      <ParallaxElement
        src={maskLeft}
        alt="Máscara izquierda"
        className="left-[8%] top-[20%] w-[8%] md:w-[5%] z-10"
        speed={0.05}
      />
      {/* 6. Máscara derecha */}
      <ParallaxElement
        src={maskRight}
        alt="Máscara derecha"
        className="right-[8%] top-[20%] w-[8%] md:w-[5%] z-10"
        speed={0.05}
      />

      {/* Hero illustration */}
      <div ref={ref} className="fade-section relative w-full h-full">
        <img
          src={bgHero}
          alt="Baile Inolvidable - Fiesta en la playa"
          className="w-full h-full object-cover"
        />
      </div>

    </section>
  );
};

export default HeroSection;
