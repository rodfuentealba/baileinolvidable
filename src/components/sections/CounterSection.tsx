import { useEffect, useState, useRef } from "react";
import letterCenter from "@/assets/letterCenter.svg";
import palmerLeft from "@/assets/palmerLeft.png";
import palmerRight from "@/assets/palmerRight.png";
import { useFadeInOnScroll, useParallax } from "@/hooks/useScrollAnimations";
import { useLanguage } from "@/hooks/useLanguage";

const TARGET_DATE = new Date("2026-09-05T18:00:00+02:00").getTime();

function calcTimeLeft() {
  const now = Date.now();
  const diff = Math.max(0, TARGET_DATE - now);
  return {
    meses: Math.floor(diff / (1000 * 60 * 60 * 24 * 30)),
    semanas: Math.floor(diff / (1000 * 60 * 60 * 24 * 7)),
    dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
  };
}

const FlipDigit = ({ value, label }: { value: number; label: string }) => {
  const [display, setDisplay] = useState(value);
  const [flipping, setFlipping] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value) {
      setFlipping(true);
      const timeout = setTimeout(() => {
        setDisplay(value);
        setFlipping(false);
        prevValue.current = value;
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [value]);

  return (
    <div className="text-center">
      <div className={`transition-transform duration-300 ${flipping ? 'scale-y-0' : 'scale-y-100'}`}>
        <span className="font-body text-5xl md:text-6xl text-white block font-black italic">
          {display}
        </span>
      </div>
      <span className="font-display text-xl text-white/80">{label}</span>
    </div>
  );
};

const CounterSection = () => {
  const [time, setTime] = useState(calcTimeLeft);
  const ref = useFadeInOnScroll();
  const staggerRef = useFadeInOnScroll(0.1);
  const { ref: palmerLeftRef, offset: palmerLeftOffset } = useParallax(0.04);
  const { ref: palmerRightRef, offset: palmerRightOffset } = useParallax(0.04);
  const { t } = useLanguage();

  useEffect(() => {
    const id = setInterval(() => setTime(calcTimeLeft()), 60000);
    return () => clearInterval(id);
  }, []);

  const items = [
    { value: time.meses, label: t("counter.months") },
    { value: time.semanas, label: t("counter.weeks") },
    { value: time.dias, label: t("counter.days") },
  ];

  return (
    <section className="relative bg-counter-bg py-16 px-6 overflow-hidden">
      <div
        ref={palmerLeftRef}
        className="absolute left-0 bottom-0 w-[36%] md:w-[24%] pointer-events-none parallax-float z-0"
        style={{ transform: `translateY(${palmerLeftOffset}px)` }}
      >
        <img src={palmerLeft} alt="Palmera izquierda" className="w-full h-full object-contain" />
      </div>
      <div
        ref={palmerRightRef}
        className="absolute right-0 bottom-0 w-[36%] md:w-[22%] pointer-events-none parallax-float z-0"
        style={{ transform: `translateY(${palmerRightOffset}px)` }}
      >
        <img src={palmerRight} alt="Palmera derecha" className="w-full h-full object-contain" />
      </div>

      <div ref={ref} className="fade-section max-w-4xl mx-auto text-center relative z-10">
        <img
          src={letterCenter}
          alt="Baile Inolvidable"
          className="mx-auto w-full max-w-xs md:max-w-sm mb-10"
        />
        <div ref={staggerRef} className="stagger-children grid grid-cols-3 gap-6">
          {items.map((item, i) => (
            <FlipDigit key={i} value={item.value} label={item.label} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CounterSection;
