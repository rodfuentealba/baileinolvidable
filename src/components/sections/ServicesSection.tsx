import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useFadeInOnScroll } from "@/hooks/useScrollAnimations";
import { useLanguage } from "@/hooks/useLanguage";
import DynamicIcon from "@/components/admin/DynamicIcon";

interface ServiceItem {
  id: string;
  icon: string;
  title: { es: string; it: string };
  text: { es: string; it: string };
  cta: { es: string; it: string };
}

const DEFAULT_SERVICES: ServiceItem[] = [
  { id: "1", icon: "tent", title: { es: "Con carpa", it: "Con tenda" }, text: { es: "Existe la posibilidad de dormir con tu propia carpa en el jardín de Casa Galzi, donde se realizará la fiesta.", it: "C'è la possibilità di dormire con la propria tenda nel giardino di Casa Galzi, dove si terrà la festa." }, cta: { es: "Avísanos para reservarte un espacio.", it: "Avvisaci per riservare uno spazio." } },
  { id: "2", icon: "triangle-alert", title: { es: "Si no tienes", it: "Se non hai" }, text: { es: "Avísanos y encontraremos una solución.", it: "Avvisaci e troveremo una soluzione." }, cta: { es: "", it: "" } },
  { id: "3", icon: "bath", title: { es: "Baño Seco", it: "Bagno Secco" }, text: { es: "", it: "" }, cta: { es: "", it: "" } },
  { id: "4", icon: "shower-head", title: { es: "Duchas Exteriores", it: "Docce Esterne" }, text: { es: "", it: "" }, cta: { es: "", it: "" } },
  { id: "5", icon: "home", title: { es: "No ingresar al interior de la casa", it: "Non entrare all'interno della casa" }, text: { es: "", it: "" }, cta: { es: "", it: "" } },
];

const ServicesSection = () => {
  const ref = useFadeInOnScroll();
  const staggerRef = useFadeInOnScroll(0.1);
  const facilityRef = useFadeInOnScroll(0.1);
  const { t, lang } = useLanguage();
  const [services, setServices] = useState<ServiceItem[]>(DEFAULT_SERVICES);

  useEffect(() => {
    supabase
      .from("site_content")
      .select("content")
      .eq("section_key", "services_list")
      .single()
      .then(({ data }) => {
        if (data?.content && Array.isArray(data.content)) {
          setServices(data.content as unknown as ServiceItem[]);
        }
      });
  }, []);

  // Split: first 2 are main cards, rest are facility items
  const mainCards = services.slice(0, 2);
  const facilities = services.slice(2);

  return (
    <section className="bg-program-bg py-16 px-6">
      <div ref={ref} className="fade-section max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl text-counter-bg">{t("services.title")}</h2>
        </div>

        <div ref={staggerRef} className="stagger-children grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {mainCards.map((item) => (
            <div key={item.id} className="rounded-xl p-6 border border-counter-bg">
              <DynamicIcon name={item.icon} className="w-8 h-8 text-counter-bg mb-3" />
              <h3 className="font-serif-custom text-xl text-foreground mb-2">{item.title[lang]}</h3>
              {item.text[lang] && (
                <p className="text-sm text-muted-foreground font-body">{item.text[lang]}</p>
              )}
              {item.cta[lang] && (
                <p className="text-sm text-primary font-body mt-2 font-semibold">{item.cta[lang]}</p>
              )}
            </div>
          ))}
        </div>

        {facilities.length > 0 && (
          <div ref={facilityRef} className="stagger-children grid grid-cols-1 md:grid-cols-3 gap-6">
            {facilities.map((item) => (
              <div key={item.id} className="rounded-xl p-6 border border-counter-bg flex flex-col items-start">
                <DynamicIcon name={item.icon} className="w-8 h-8 text-counter-bg mb-3" />
                <span className="font-serif-custom text-xl text-foreground">{item.title[lang]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
