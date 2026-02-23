import { useFadeInOnScroll } from "@/hooks/useScrollAnimations";
import { TreePine, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, Snowflake } from "lucide-react";

type WeatherCondition = "sunny" | "cloudy" | "rainy" | "snowy" | "stormy" | "drizzle";

const weatherIcons: Record<WeatherCondition, React.ComponentType<{ className?: string }>> = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: CloudSnow,
  stormy: CloudLightning,
  drizzle: CloudDrizzle,
};

const WeatherCard = ({ temp, label, condition, variant = "teal" }: { temp: number; label: string; condition: WeatherCondition; variant?: "teal" | "gold" }) => {
  const Icon = weatherIcons[condition] || Sun;
  const bgClass = variant === "gold" ? "bg-gold text-foreground" : "bg-teal text-hero-navy-foreground";
  return (
    <div className={`${bgClass} rounded-xl p-6`}>
      <p className="text-sm opacity-80 font-body">Galzignano, Italia</p>
      <div className="flex items-center justify-between mt-2">
        <span className="font-display text-5xl">{temp}°</span>
        <Icon className="w-10 h-10 opacity-70" />
      </div>
      <p className="text-sm mt-2 opacity-80 font-body">{label}</p>
    </div>
  );
};

const DresscodeSection = () => {
  const ref = useFadeInOnScroll();

  return (
    <section className="py-16 px-6" style={{ backgroundColor: "#1d2030" }}>
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
