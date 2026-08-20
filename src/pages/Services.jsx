import { useState } from "react";
import { useLenis }      from "../hooks/useLenis";
import CustomCursor      from "../components/CustomCursor";
import Loader            from "../components/Loader";
import Navbar            from "../components/Navbar";
import ServicesBanner    from "../components/ServicesBanner";
import ServicesSection   from "../components/ServicesSection";
import BenefitsSection   from "../components/BenefitsSection";
import ContactCTA        from "../components/ContactCTA";
import Footer            from "../components/Footer";

export default function Services() {
  const [loaded, setLoaded] = useState(false);
  useLenis();

  return (
    <>
      <CustomCursor />
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      <Navbar visible={loaded} />
      <main>
        <ServicesBanner />
        <ServicesSection />
        <BenefitsSection />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
