import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useFadeInOnScroll } from "@/hooks/useScrollAnimations";
import { useLanguage } from "@/hooks/useLanguage";
import DynamicIcon from "@/components/admin/DynamicIcon";

interface ProgramItem {
  id: string;
  icon: string;
  time: string;
  title: { es: string; it: string };
}

const DEFAULT_PROGRAMS: ProgramItem[] = [
  { id: "1", icon: "users", time: "16:00", title: { es: "Llegada de invitados", it: "Arrivo degli ospiti" } },
  { id: "2", icon: "church", time: "17:00", title: { es: "Ceremonia", it: "Cerimonia" } },
  { id: "3", icon: "wine", time: "18:00", title: { es: "Aperitivo/Previa", it: "Aperitivo" } },
  { id: "4", icon: "utensils-crossed", time: "19:30", title: { es: "Cena", it: "Cena" } },
  { id: "5", icon: "music", time: "21:00", title: { es: "Banda", it: "Banda" } },
  { id: "6", icon: "disc-3", time: "22:30", title: { es: "DJ Set", it: "DJ Set" } },
];

const ProgramSection = () => {
  const ref = useFadeInOnScroll();
  const staggerRef = useFadeInOnScroll(0.1);
  const { t, lang } = useLanguage();
  const [programs, setPrograms] = useState<ProgramItem[]>(DEFAULT_PROGRAMS);

  useEffect(() => {
    supabase
      .from("site_content")
      .select("content")
      .eq("section_key", "programs_list")
      .single()
      .then(({ data }) => {
        if (data?.content && Array.isArray(data.content)) {
          setPrograms(data.content as unknown as ProgramItem[]);
        }
      });
  }, []);

  return (
    <section className="bg-program-bg py-16 px-6">
      <div ref={ref} className="fade-section max-w-4xl mx-auto">
        <h2 className="font-serif-custom text-3xl md:text-4xl text-center text-counter-bg mb-10">
          {t("program.title")}
        </h2>
        <div ref={staggerRef} className="stagger-children grid grid-cols-1 md:grid-cols-3 gap-6">
          {programs.map((p) => (
            <div key={p.id} className="bg-program-card rounded-lg p-6 text-white">
              <DynamicIcon name={p.icon} className="w-6 h-6 mb-3 text-white/80" />
              <h3 className="font-display text-2xl mb-2">{p.time}</h3>
              <p className="text-sm text-white/80 font-body">{p.title[lang]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramSection;
