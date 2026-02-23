import { useFadeInOnScroll } from "@/hooks/useScrollAnimations";
import { Flag } from "lucide-react";

const programs = [
  {
    title: "Programa 01",
    description: "Recepción y bienvenida con aperitivos y música en vivo al atardecer.",
  },
  {
    title: "Programa 02",
    description: "Cena bajo las estrellas con platos típicos de la región italiana.",
  },
  {
    title: "Programa 03",
    description: "Baile y fiesta libre hasta el amanecer con DJ y sorpresas.",
  },
];

const ProgramSection = () => {
  const ref = useFadeInOnScroll();

  return (
    <section className="bg-sand-light py-16 px-6">
      <div ref={ref} className="fade-section max-w-4xl mx-auto">
        <h2 className="font-serif-custom text-3xl md:text-4xl text-center text-foreground mb-10">
          Programa
        </h2>
        <div className="stagger-children visible grid grid-cols-1 md:grid-cols-3 gap-6">
          {programs.map((p, i) => (
            <div
              key={i}
              className="bg-muted-foreground/80 rounded-lg p-6 text-primary-foreground"
            >
              <Flag className="w-6 h-6 mb-3 text-primary-foreground/80" />
              <h3 className="font-display text-2xl mb-2">{p.title}</h3>
              <p className="text-sm text-primary-foreground/80 font-body">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramSection;
