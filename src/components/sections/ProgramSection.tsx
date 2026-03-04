import { useFadeInOnScroll } from "@/hooks/useScrollAnimations";
import { Users, Church, Wine, UtensilsCrossed, Music, Disc3 } from "lucide-react";

const programs = [
  {
    time: "16:00",
    description: "Llegada de invitados",
    icon: Users,
  },
  {
    time: "17:00",
    description: "Ceremonia",
    icon: Church,
  },
  {
    time: "18:00",
    description: "Aperitivo/Previa",
    icon: Wine,
  },
  {
    time: "19:30",
    description: "Cena",
    icon: UtensilsCrossed,
  },
  {
    time: "21:00",
    description: "Banda",
    icon: Music,
  },
  {
    time: "22:30",
    description: "DJ Set",
    icon: Disc3,
  },
];

const ProgramSection = () => {
  const ref = useFadeInOnScroll();

  return (
    <section className="bg-program-bg py-16 px-6">
      <div ref={ref} className="fade-section max-w-4xl mx-auto">
        <h2 className="font-serif-custom text-3xl md:text-4xl text-center text-counter-bg mb-10">
          Programa
        </h2>
        <div className="stagger-children visible grid grid-cols-1 md:grid-cols-3 gap-6">
          {programs.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="bg-program-card rounded-lg p-6 text-white"
              >
                <Icon className="w-6 h-6 mb-3 text-white/80" />
                <h3 className="font-display text-2xl mb-2">{p.time}</h3>
                <p className="text-sm text-white/80 font-body">
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProgramSection;
