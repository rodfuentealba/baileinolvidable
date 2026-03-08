import { useFadeInOnScroll } from "@/hooks/useScrollAnimations";
import { useLanguage } from "@/hooks/useLanguage";
import destVenezia from "@/assets/dest-venezia.jpg";
import destNapoli from "@/assets/dest-napoli.jpg";
import destDolomiti from "@/assets/dest-dolomiti.jpg";
import destBologna from "@/assets/dest-bologna.jpg";
import { Button } from "@/components/ui/button";

const destinations = [
  { name: "Venezia", image: destVenezia, distance: "50 KM", flightCost: "30-40 USD", tag: "🚣 Paseos en góndola", link: "https://www.tripadvisor.com/Tourism-g187870-Venice_Veneto-Vacations.html" },
  { name: "Napoli", image: destNapoli, distance: "500 KM", flightCost: "30-40 USD", tag: "⚽ Fútbol & Pizza", link: "https://www.tripadvisor.com/Tourism-g187785-Naples_Province_of_Naples_Campania-Vacations.html" },
  { name: "Dolomiti", image: destDolomiti, distance: "150 KM", flightCost: "20-30 USD", tag: "🧗 Escalada & Trekking", link: "https://www.tripadvisor.com/Tourism-g187849-Dolomites_Trentino_Alto_Adige-Vacations.html" },
  { name: "Bologna", image: destBologna, distance: "120 KM", flightCost: "15-25 USD", tag: "🍝 Gastronomía", link: "https://www.tripadvisor.com/Tourism-g187801-Bologna_Province_of_Bologna_Emilia_Romagna-Vacations.html" },
];

const DestinationSection = () => {
  const ref = useFadeInOnScroll();
  const staggerRef = useFadeInOnScroll(0.1);
  const { t } = useLanguage();

  return (
    <section className="bg-program-bg py-16 px-6">
      <div ref={ref} className="fade-section max-w-4xl mx-auto">
        <h2 className="font-serif-custom text-3xl md:text-4xl text-center text-foreground mb-10">
          {t("dest.title")}
        </h2>
        <div ref={staggerRef} className="stagger-children grid grid-cols-1 md:grid-cols-2 gap-6">
          {destinations.map((d, i) => (
            <a
              key={i}
              href={d.link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden rounded-xl h-64 group block cursor-pointer"
            >
              <img
                src={d.image}
                alt={d.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="absolute top-3 left-3 bg-destination-green text-hero-navy-foreground text-xs font-body font-semibold px-3 py-1 rounded-full">
                {t("dest.flights")} {d.flightCost}
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-hero-navy-foreground/80 text-xs font-body mb-1">
                  {t("dest.about")} {d.distance} · {d.tag}
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
