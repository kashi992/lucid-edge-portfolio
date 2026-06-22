import { useState } from "react";
import { useLenis } from "../hooks/useLenis";
import CustomCursor from "../components/CustomCursor";
import Loader       from "../components/Loader";
import Navbar       from "../components/Navbar";
import AboutSection from "../components/AboutSection";
import ContactCTA   from "../components/ContactCTA";
import Footer       from "../components/Footer";

export default function About() {
  const [loaded, setLoaded] = useState(false);
  useLenis();

  return (
    <>
      <CustomCursor />
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      <Navbar visible={loaded} />
      <main>
        <AboutSection />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
