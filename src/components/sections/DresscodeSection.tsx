import { useFadeInOnScroll } from "@/hooks/useScrollAnimations";
import { TreePine, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type WeatherCondition = "sunny" | "cloudy" | "rainy" | "snowy" | "stormy" | "drizzle";

const weatherIcons: Record<WeatherCondition, React.ComponentType<{ className?: string }>> = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: CloudSnow,
  stormy: CloudLightning,
  drizzle: CloudDrizzle,
};

const WeatherCard = ({ temp, label, condition, variant = "teal", loading }: { temp: number; label: string; condition: WeatherCondition; variant?: "teal" | "gold"; loading?: boolean }) => {
  const Icon = weatherIcons[condition] || Sun;
  const bgClass = variant === "gold" ? "bg-gold text-foreground" : "bg-teal text-hero-navy-foreground";
  return (
    <div className={`${bgClass} rounded-xl p-6`}>
      <p className="text-sm opacity-80 font-body">Galzignano Terme, Italia</p>
      <div className="flex items-center justify-between mt-2">
        <span className="font-body font-black text-7xl">
          {loading ? "—" : `${temp}°`}
        </span>
        <div className="relative">
          <Icon className="w-12 h-12 opacity-70 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
        </div>
      </div>
      <p className="text-sm mt-2 opacity-80 font-body">{label}</p>
    </div>
  );
};

const DresscodeSection = () => {
  const ref = useFadeInOnScroll();
  const [weather, setWeather] = useState<{
    current: { temp: number; condition: WeatherCondition };
    forecast: { temp: number; condition: WeatherCondition };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-weather');
        if (!error && data) {
          setWeather(data);
        }
      } catch (e) {
        console.error('Error fetching weather:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh every 15 minutes
    const interval = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const currentTemp = weather?.current.temp ?? 0;
  const currentCondition = weather?.current.condition ?? "cloudy";
  const forecastTemp = weather?.forecast.temp ?? 0;
  const forecastCondition = weather?.forecast.condition ?? "sunny";

  return (
    <section className="py-16 px-6 bg-black">
      <div ref={ref} className="fade-section max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl text-gold">Dresscode</h2>
        </div>

        {/* Tips cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-xl p-6 border border-hero-navy-foreground/20">
            <TreePine className="w-8 h-8 text-teal-light mb-3" />
            <h3 className="font-serif-custom text-2xl text-teal-light mb-2">
              Medio de la naturaleza
            </h3>
            <p className="text-hero-navy-foreground/70 text-sm font-body">
              Toda la fiesta será sobre el pasto, por eso recomendamos no usar zapatos con taco o ropa delicada que pueda dañarse.
            </p>
          </div>
          <div className="rounded-xl p-6 border border-hero-navy-foreground/20">
            <Sun className="w-8 h-8 text-gold mb-3" />
            <h3 className="font-serif-custom text-2xl text-gold mb-2">
              Siempre al aire libre
            </h3>
            <p className="text-hero-navy-foreground/70 text-sm font-body">
              Durante el día hará calor, pero en la noche la temperatura baja, así que recomendamos llevar algo de abrigo por si acaso.
            </p>
          </div>
        </div>

        {/* Weather cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WeatherCard
            temp={currentTemp}
            label="Temperatura Actual"
            condition={currentCondition as WeatherCondition}
            loading={loading}
          />
          <WeatherCard
            temp={forecastTemp}
            label="Temperatura Pronosticada"
            condition={forecastCondition as WeatherCondition}
            variant="gold"
            loading={loading}
          />
        </div>
      </div>
    </section>
  );
};

export default DresscodeSection;
