import { useState } from "react";
import { useLenis }     from "../hooks/useLenis";
import CustomCursor     from "../components/CustomCursor";
import Loader           from "../components/Loader";
import Navbar           from "../components/Navbar";
import WorkSection      from "../components/WorkSection";
import ContactCTA       from "../components/ContactCTA";
import Footer           from "../components/Footer";

export default function Work() {
  const [loaded, setLoaded] = useState(false);
  useLenis();

  return (
    <>
      <CustomCursor />
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      <Navbar visible={loaded} />
      <main>
        <WorkSection />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
