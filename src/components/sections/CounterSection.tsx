import { useEffect, useState } from "react";
import letterCenter from "@/assets/letterCenter.png";
import { useFadeInOnScroll } from "@/hooks/useScrollAnimations";

const TARGET_DATE = new Date("2026-09-05T18:00:00+02:00").getTime();

function calcTimeLeft() {
  const now = Date.now();
  const diff = Math.max(0, TARGET_DATE - now);
  return {
    meses: Math.floor(diff / (1000 * 60 * 60 * 24 * 30)),
    semanas: Math.floor(diff / (1000 * 60 * 60 * 24 * 7)),
    horas: Math.floor(diff / (1000 * 60 * 60)),
    
  };
}

const CounterSection = () => {
  const [time, setTime] = useState(calcTimeLeft);
  const ref = useFadeInOnScroll();

  useEffect(() => {
    const id = setInterval(() => setTime(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const items = [
    { value: time.meses, label: "Meses" },
    { value: time.semanas, label: "Semanas" },
    { value: time.horas, label: "Horas" },
  ];

  return (
    <section className="bg-peach py-16 px-6">
      <div ref={ref} className="fade-section max-w-4xl mx-auto text-center">
        <img
          src={letterCenter}
          alt="Baile Inolvidable"
          className="mx-auto w-full max-w-2xl mb-10"
        />
        <div className="stagger-children visible grid grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div key={i} className="text-center">
              <span className="font-body text-5xl md:text-6xl text-foreground block font-black italic">
                {item.value}
              </span>
              <span className="font-display text-xl text-muted-foreground">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CounterSection;
