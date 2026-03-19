import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import DescriptionSection from "@/components/sections/DescriptionSection";
import ProgramSection from "@/components/sections/ProgramSection";
import CounterSection from "@/components/sections/CounterSection";
import LocationSection from "@/components/sections/LocationSection";
import DresscodeSection from "@/components/sections/DresscodeSection";
import ServicesSection from "@/components/sections/ServicesSection";
import DestinationSection from "@/components/sections/DestinationSection";
import FooterSection from "@/components/sections/FooterSection";
import LoadingScreen from "@/components/LoadingScreen";
import MusicPlayer from "@/components/MusicPlayer";

const Index = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <LoadingScreen onFinished={() => setLoading(false)} />}
      <main className={`min-h-screen overflow-x-hidden ${loading ? "opacity-0" : "opacity-100 transition-opacity duration-500"}`}>
        <Navbar />
        <HeroSection />
        <DescriptionSection />
        <ProgramSection />
        <CounterSection />
        <LocationSection />
        <DresscodeSection />
        <ServicesSection />
        <DestinationSection />
        <FooterSection />
      </main>
      {!loading && <MusicPlayer />}
    </>
  );
};

export default Index;
