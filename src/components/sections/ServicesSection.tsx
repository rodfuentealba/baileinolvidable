import { useFadeInOnScroll } from "@/hooks/useScrollAnimations";
import { Tent, AlertTriangle, Bath, ShowerHead, Home } from "lucide-react";

const ServicesSection = () => {
  const ref = useFadeInOnScroll();
  const staggerRef = useFadeInOnScroll(0.1);
  const facilityRef = useFadeInOnScroll(0.1);

  return (
    <section className="bg-program-bg py-16 px-6">
      <div ref={ref} className="fade-section max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl text-counter-bg">Servicios</h2>
        </div>

        <div ref={staggerRef} className="stagger-children grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-xl p-6 border border-counter-bg">
            <Tent className="w-8 h-8 text-counter-bg mb-3" />
            <h3 className="font-serif-custom text-xl text-foreground mb-2">Con carpa</h3>
            <p className="text-sm text-muted-foreground font-body">
              Existe la posibilidad de dormir con tu propia carpa en el jardín de Casa Galzi, donde se realizará la fiesta.
            </p>
            <p className="text-sm text-primary font-body mt-2 font-semibold">
              Avísanos para reservarte un espacio.
            </p>
          </div>
          <div className="rounded-xl p-6 border border-counter-bg">
            <AlertTriangle className="w-8 h-8 text-counter-bg mb-3" />
            <h3 className="font-serif-custom text-xl text-counter-bg mb-2">Si no tienes</h3>
            <p className="text-sm text-muted-foreground font-body">
              <span className="text-counter-bg font-semibold">Avísanos y encontraremos una solución.</span>
            </p>
          </div>
        </div>

        <div ref={facilityRef} className="stagger-children grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Bath, label: "Baño Seco" },
            { icon: ShowerHead, label: "Duchas Exteriores" },
            { icon: Home, label: "No ingresar al interior de la casa" },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-xl p-6 border border-counter-bg flex flex-col items-start"
            >
              <item.icon className="w-8 h-8 text-counter-bg mb-3" />
              <span className="font-serif-custom text-xl text-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
