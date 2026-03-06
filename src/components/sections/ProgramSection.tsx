import { useFadeInOnScroll } from "@/hooks/useScrollAnimations";
import { useLanguage } from "@/hooks/useLanguage";
import { Users, Church, Wine, UtensilsCrossed, Music, Disc3 } from "lucide-react";

const programs = [
  { time: "16:00", key: "program.01", icon: Users },
  { time: "17:00", key: "program.02", icon: Church },
  { time: "18:00", key: "program.03", icon: Wine },
  { time: "19:30", key: "program.04", icon: UtensilsCrossed },
  { time: "21:00", key: "program.05", icon: Music },
  { time: "22:30", key: "program.06", icon: Disc3 },
];

const ProgramSection = () => {
  const ref = useFadeInOnScroll();
  const staggerRef = useFadeInOnScroll(0.1);
  const { t } = useLanguage();

  return (
    <section className="bg-program-bg py-16 px-6">
      <div ref={ref} className="fade-section max-w-4xl mx-auto">
        <h2 className="font-serif-custom text-3xl md:text-4xl text-center text-counter-bg mb-10">
          {t("program.title")}
        </h2>
        <div ref={staggerRef} className="stagger-children grid grid-cols-1 md:grid-cols-3 gap-6">
          {programs.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} className="bg-program-card rounded-lg p-6 text-white">
                <Icon className="w-6 h-6 mb-3 text-white/80" />
                <h3 className="font-display text-2xl mb-2">{p.time}</h3>
                <p className="text-sm text-white/80 font-body">{t(p.key)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProgramSection;
