import HeroSection from "@/components/sections/HeroSection";
import ProgramSection from "@/components/sections/ProgramSection";
import CounterSection from "@/components/sections/CounterSection";
import LocationSection from "@/components/sections/LocationSection";
import DresscodeSection from "@/components/sections/DresscodeSection";
import ServicesSection from "@/components/sections/ServicesSection";
import DestinationSection from "@/components/sections/DestinationSection";
import FooterSection from "@/components/sections/FooterSection";

const Index = () => {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <HeroSection />
      <ProgramSection />
      <CounterSection />
      <LocationSection />
      <DresscodeSection />
      <ServicesSection />
      <DestinationSection />
      <FooterSection />
    </main>
  );
};

export default Index;
