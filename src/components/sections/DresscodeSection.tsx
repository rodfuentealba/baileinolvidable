import { useFadeInOnScroll } from "@/hooks/useScrollAnimations";
import { TreePine, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, Snowflake } from "lucide-react";

const DresscodeSection = () => {
  const ref = useFadeInOnScroll();

  return (
    <section className="bg-dresscode-bg py-16 px-6">
      <div ref={ref} className="fade-section max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl text-gold">Dresscode</h2>
        </div>

        {/* Tips cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-hero-navy-foreground/10 backdrop-blur rounded-xl p-6 border border-hero-navy-foreground/10">
            <TreePine className="w-8 h-8 text-teal-light mb-3" />
            <h3 className="font-serif-custom text-xl text-teal-light mb-2">
              Medio de la naturaleza
            </h3>
            <p className="text-hero-navy-foreground/70 text-sm font-body">
              Toda la fiesta será sobre el pasto, por eso recomendamos no usar zapatos con taco o ropa delicada que pueda dañarse.
            </p>
          </div>
          <div className="bg-hero-navy-foreground/10 backdrop-blur rounded-xl p-6 border border-hero-navy-foreground/10">
            <Sun className="w-8 h-8 text-gold mb-3" />
            <h3 className="font-serif-custom text-xl text-gold mb-2">
              Siempre al aire libre
            </h3>
            <p className="text-hero-navy-foreground/70 text-sm font-body">
              Durante el día hará calor, pero en la noche la temperatura baja, así que recomendamos llevar algo de abrigo por si acaso.
            </p>
          </div>
        </div>

        {/* Weather cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WeatherCard temp={8} label="Temperatura Actual" condition="cloudy" />
          <WeatherCard temp={16} label="Temperatura Pronosticada" condition="sunny" variant="gold" />
        </div>
      </div>
    </section>
  );
};

export default DresscodeSection;
