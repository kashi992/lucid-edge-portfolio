import { useState } from "react";
import { useLenis }  from "../hooks/useLenis";
import CustomCursor  from "../components/CustomCursor";
import Loader        from "../components/Loader";
import Navbar        from "../components/Navbar";
import ContactBanner from "../components/ContactBanner";
import ContactForm   from "../components/ContactForm";
import ContactCTA    from "../components/ContactCTA";
import Footer        from "../components/Footer";

export default function Contact() {
  const [loaded, setLoaded] = useState(false);
  useLenis();

  return (
    <>
      <CustomCursor />
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      <Navbar visible={loaded} />
      <main>
        <ContactBanner />
        <ContactForm />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
