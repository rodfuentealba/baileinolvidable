import { useFadeInOnScroll } from "@/hooks/useScrollAnimations";
import { Tent, AlertTriangle, Bath, ShowerHead, Home } from "lucide-react";

const ServicesSection = () => {
  const ref = useFadeInOnScroll();

  return (
    <section className="bg-services-bg py-16 px-6">
      <div ref={ref} className="fade-section max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl text-primary">Servicios</h2>
        </div>

        {/* Accommodation cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-xl p-6 border border-primary/40">
            <Tent className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-serif-custom text-xl text-foreground mb-2">Con carpa</h3>
            <p className="text-sm text-muted-foreground font-body">
              Existe la posibilidad de dormir con tu propia carpa en el jardín de Casa Galzi, donde se realizará la fiesta.
            </p>
            <p className="text-sm text-primary font-body mt-2 font-semibold">
              Avísanos para reservarte un espacio.
            </p>
          </div>
          <div className="rounded-xl p-6 border border-coral/30">
            <AlertTriangle className="w-8 h-8 text-coral mb-3" />
            <h3 className="font-serif-custom text-xl text-coral mb-2">Si no tienes</h3>
            <p className="text-sm text-muted-foreground font-body">
              <span className="text-coral font-semibold">Avísanos y encontraremos una solución.</span>
            </p>
          </div>
        </div>

        {/* Facility cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Bath, label: "Baño Seco" },
            { icon: ShowerHead, label: "Duchas Exteriores" },
            { icon: Home, label: "No ingresar al interior de la casa" },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-xl p-6 border border-primary/40 flex flex-col items-center text-center"
            >
              <item.icon className="w-8 h-8 text-primary mb-3" />
              <span className="font-serif-custom text-lg text-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
