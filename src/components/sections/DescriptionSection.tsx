import { useFadeInOnScroll } from "@/hooks/useScrollAnimations";
import { useLanguage } from "@/hooks/useLanguage";

const DescriptionSection = () => {
  const ref = useFadeInOnScroll();
  const { t } = useLanguage();

  return (
    <section className="bg-navbar-scroll py-12 md:py-16 text-center px-6">
      <div ref={ref} className="fade-section">
        <p className="font-display text-2xl md:text-3xl text-white mb-2">
          {t("desc.title")}
        </p>
        <h2 className="font-serif-custom text-2xl md:text-4xl mb-3 italic text-gold">
          {t("desc.subtitle")}
        </h2>
        <p className="font-display text-lg md:text-xl text-white/80 max-w-lg mx-auto">
          {t("desc.text")}
        </p>
      </div>
    </section>
  );
};

export default DescriptionSection;
