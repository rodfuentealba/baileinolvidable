import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useFadeInOnScroll } from "@/hooks/useScrollAnimations";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";

interface DestinationItem {
  id: string;
  name: string;
  image_url: string;
  price: string;
  distance: string;
  category: string;
  category_color: string;
  link: string;
  tag: { es: string; it: string };
}


const DEFAULT_DESTINATIONS: DestinationItem[] = [
  { id: "1", name: "Venezia", image_url: "/src/assets/dest-venezia.jpg", price: "30-40 USD", distance: "50 KM", category: "🚣 Paseos en góndola", category_color: "hsl(145 60% 42%)", link: "https://www.tripadvisor.com/Tourism-g187870-Venice_Veneto-Vacations.html", tag: { es: "🚣 Paseos en góndola", it: "🚣 Giri in gondola" } },
  { id: "2", name: "Napoli", image_url: "/src/assets/dest-napoli.jpg", price: "30-40 USD", distance: "500 KM", category: "⚽ Fútbol & Pizza", category_color: "hsl(200 70% 45%)", link: "https://www.tripadvisor.com/Tourism-g187785-Naples_Province_of_Naples_Campania-Vacations.html", tag: { es: "⚽ Fútbol & Pizza", it: "⚽ Calcio & Pizza" } },
  { id: "3", name: "Dolomiti", image_url: "/src/assets/dest-dolomiti.jpg", price: "20-30 USD", distance: "150 KM", category: "🧗 Escalada & Trekking", category_color: "hsl(42 95% 63%)", link: "https://www.tripadvisor.com/Tourism-g187849-Dolomites_Trentino_Alto_Adige-Vacations.html", tag: { es: "🧗 Escalada & Trekking", it: "🧗 Arrampicata & Trekking" } },
  { id: "4", name: "Bologna", image_url: "/src/assets/dest-bologna.jpg", price: "15-25 USD", distance: "120 KM", category: "🍝 Gastronomía", category_color: "hsl(280 60% 55%)", link: "https://www.tripadvisor.com/Tourism-g187801-Bologna_Province_of_Bologna_Emilia_Romagna-Vacations.html", tag: { es: "🍝 Gastronomía", it: "🍝 Gastronomia" } },
];

const DestinationSection = () => {
  const ref = useFadeInOnScroll();
  const staggerRef = useFadeInOnScroll(0.1);
  const { t, lang } = useLanguage();
  const [destinations, setDestinations] = useState<DestinationItem[]>(DEFAULT_DESTINATIONS);

useEffect(() => {
    supabase
      .from("site_content")
      .select("content")
      .eq("section_key", "destinations_list")
      .single()
      .then(({ data, error }) => {
        console.log('data:', data);
        console.log('error:', error);
        if (data?.content && Array.isArray(data.content)) {
          setDestinations(data.content as unknown as DestinationItem[]);
        }
      });
  }, []);

  return (
    <section className="bg-program-bg py-16 px-6">
      <div ref={ref} className="fade-section max-w-4xl mx-auto">
        <h2 className="font-serif-custom text-3xl md:text-4xl text-center text-foreground mb-10">
          {t("dest.title")}
        </h2>
        <div ref={staggerRef} className="stagger-children grid grid-cols-1 md:grid-cols-2 gap-6">
          {destinations.map((d) => (
            <a
              key={d.id}
              href={d.link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden rounded-xl h-64 group block cursor-pointer"
            >
              <img
                src={d.image_url}
                alt={d.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div
                className="absolute top-3 left-3 text-hero-navy-foreground text-xs font-body font-semibold px-3 py-1 rounded-full"
                style={{ backgroundColor: "hsl(145 60% 42%)" }}
              >
                {t("dest.flights")} {d.price}
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-hero-navy-foreground/80 text-xs font-body mb-1">
                  {t("dest.about")} {d.distance} · {d.tag[lang]}
                </p>
                <h3 className="font-display text-4xl text-hero-navy-foreground">
                  {d.name}
                </h3>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="font-body text-muted-foreground mb-4">
            {t("dest.tips")}
          </p>
          <a
            href="https://docs.google.com/document/d/13r_8mthVRrCcTuPGgKmg8awUEKaWoFlS_YVjMlr-P_M/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-counter-bg hover:bg-counter-bg/90 text-hero-navy-foreground font-body font-semibold px-8">
              {t("dest.cta")}
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default DestinationSection;
