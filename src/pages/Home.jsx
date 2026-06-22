import { useState } from "react";
import { useLenis } from "../hooks/useLenis";
import CustomCursor    from "../components/CustomCursor";
import Loader          from "../components/Loader";
import Navbar          from "../components/Navbar";
import Hero            from "../components/Hero";
import StatsSection    from "../components/StatsSection";
import ServicesSection from "../components/ServicesSection";
import WorkCTA         from "../components/WorkCTA";
import BenefitsSection from "../components/BenefitsSection";
import ContactCTA      from "../components/ContactCTA";
import Footer          from "../components/Footer";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  useLenis();

  return (
    <>
      <CustomCursor />
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      <Navbar visible={loaded} />
      <main>
        <Hero            visible={loaded} />
        <StatsSection />
        <ServicesSection />
        <WorkCTA />
        <BenefitsSection />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
