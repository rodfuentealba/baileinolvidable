import bgLocation from "@/assets/bgLocation.png";
import moonCenter from "@/assets/moonCenter.png";
import devilLeft from "@/assets/devilLeft.png";
import devilRight from "@/assets/devilRight.png";
import { useFadeInOnScroll, useParallax } from "@/hooks/useScrollAnimations";

const LocationSection = () => {
  const ref = useFadeInOnScroll();
  const { ref: moonRef, offset: moonOffset } = useParallax(0.03);
  const { ref: devilLeftRef, offset: devilLeftOffset } = useParallax(0.06);
  const { ref: devilRightRef, offset: devilRightOffset } = useParallax(0.06);

  return (
    <section className="relative w-full bg-counter-bg z-10">
      {/* Moon parallax */}
      <div
        ref={moonRef}
        className="absolute left-1/2 -translate-x-1/2 top-[5%] w-[10%] md:w-[6%] pointer-events-none parallax-float z-20"
        style={{ transform: `translateX(-50%) translateY(${moonOffset}px)` }}
      >
        <img src={moonCenter} alt="Luna" className="w-full h-full object-contain" />
      </div>

      {/* Devil Left parallax */}
      <div
        ref={devilLeftRef}
        className="absolute left-[15%] top-[5%] w-[7%] pointer-events-none parallax-float z-20"
        style={{ transform: `translateY(${devilLeftOffset}px)` }}
      >
        <img src={devilLeft} alt="Diablito izquierdo" className="w-full h-full object-contain" />
      </div>

      {/* Devil Right parallax */}
      <div
        ref={devilRightRef}
        className="absolute right-[15%] top-[5%] w-[15%] pointer-events-none parallax-float z-20"
        style={{ transform: `translateY(${devilRightOffset}px)` }}
      >
        <img src={devilRight} alt="Diablita derecha" className="w-full h-full object-contain" />
      </div>

      <div
        ref={ref}
        className="fade-section relative w-full h-[700px] bg-cover bg-center flex items-end justify-center rounded-t-3xl overflow-hidden"
        style={{ backgroundImage: `url(${bgLocation})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
        <div className="relative z-10 text-center pb-12 px-6">
          <p className="font-display text-xl md:text-2xl text-white/80 mb-2">
            La fiesta se realizará en el jardín de
          </p>
          <h2 className="font-serif-custom text-3xl md:text-5xl text-white font-bold">
            Casa Galzi en Galzignano Terme
          </h2>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
