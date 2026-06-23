import { useEffect, useRef } from "react";

const PROJECTS = [
  { src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80", label: "Alena Branding" },
  { src: "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=800&q=80", label: "App Design" },
  { src: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80", label: "Web Design" },
  { src: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&q=80", label: "TopTrader" },
  { src: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80", label: "Google Project" },
];

// Sizing constants — derived from reference measurements + SVG viewBox ratios
const SVG_H_VW  = 15.5;                       // letter height in vw
const JUAN_VW   = (660 / 233) * SVG_H_VW;     // "Lucid" width
const CARD_VW   = 25;                          // measured from reference frame
const MORA_VW   = (480 / 233) * SVG_H_VW;     // "Edge" width

const JUAN_PATHS = `<text x="0" y="210" font-family="Syne, sans-serif" font-weight="800" font-size="200" fill="#D4FF00" letter-spacing="-8">Lucid</text>`;
const MORA_PATHS = `<text x="0" y="210" font-family="Syne, sans-serif" font-weight="800" font-size="200" fill="#D4FF00" letter-spacing="-8">Edge</text>`;

export default function Hero({ visible }) {
  const sectionRef = useRef(null);
  const photoRef   = useRef(null);
  const rowRef     = useRef(null);
  const juanRef    = useRef(null);
  const moraRef    = useRef(null);
  const cardImgRef = useRef(null);
  const cardLblRef = useRef(null);

  const curFrac  = useRef(0.5);
  const tgtFrac  = useRef(0.5);
  const zoneRef  = useRef(2);
  const swapping = useRef(false);
  const rafRef   = useRef(null);

  useEffect(() => {
    if (!visible) return;

    // Entrance animations
    (async () => {
      const { gsap }          = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      gsap.from(".hero-top-label",    { opacity: 0, y: 10, duration: 0.7, delay: 0.3, ease: "power2.out" });
      gsap.from(".hero-bottom-label", { opacity: 0, y: 8,  duration: 0.6, delay: 0.5, ease: "power2.out" });
      gsap.from(".hero-card",         { opacity: 0, scale: 0.88, duration: 0.75, delay: 0.35, ease: "back.out(1.5)" });
      gsap.from(rowRef.current,       { opacity: 0, duration: 0.5, delay: 0.2 });

      // Scroll parallax on photo
      gsap.to(photoRef.current, {
        y: "-18%", ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top", end: "bottom top", scrub: true,
        },
      });
    })();

    // Mouse tracking
    const onMove = (e) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      tgtFrac.current = Math.max(0.02, Math.min(0.98,
        (e.clientX - rect.left) / rect.width
      ));
    };
    const onLeave = () => { tgtFrac.current = 0.5; };
    const el = sectionRef.current;
    el.addEventListener("mousemove",  onMove);
    el.addEventListener("mouseleave", onLeave);

    // RAF lerp — stretches Juan/Mora SVGs individually, card stays fixed center
    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      curFrac.current = lerp(curFrac.current, tgtFrac.current, 0.08);
      const f = curFrac.current;

      // Cursor left → Juan squeezes + Mora expands; cursor right → opposite
      const juanScale = 1 + (f - 0.5) * 0.6;
      const moraScale = 1 - (f - 0.5) * 0.6;

      if (juanRef.current) juanRef.current.style.transform = `scaleX(${juanScale})`;
      if (moraRef.current) moraRef.current.style.transform = `scaleX(${moraScale})`;

      // Whole row shifts with cursor
      const shift = (f - 0.5) * 12;
      if (rowRef.current) rowRef.current.style.transform = `translateX(${shift}vw)`;

      // Image zone swap as cursor crosses zones
      const zone = Math.min(PROJECTS.length - 1, Math.floor(tgtFrac.current * PROJECTS.length));
      if (zone !== zoneRef.current && !swapping.current) {
        zoneRef.current = zone;
        swapping.current = true;
        const img = cardImgRef.current;
        const lbl = cardLblRef.current;
        if (img && lbl) {
          img.style.opacity = "0";
          lbl.style.opacity = "0";
          setTimeout(() => {
            img.src = PROJECTS[zone].src;
            lbl.textContent = PROJECTS[zone].label;
            img.style.opacity = "1";
            lbl.style.opacity = "1";
            swapping.current = false;
          }, 150);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      el.removeEventListener("mousemove",  onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [visible]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-nav="peach"
      className="relative w-screen min-h-screen overflow-hidden"
      style={{ background: "var(--blue)" }}
    >
      {/* Background photo — 120% tall for parallax */}
      <div
        ref={photoRef}
        className="absolute top-0 left-0 w-full z-[1] h-[120%] bg-cover bg-[50%_30%]"
        style={{ backgroundImage: `url('/images/hero-photo-test2.jpg')` }}
      />

      {/* Top-left gradient overlay */}
      <div
        className="absolute inset-0 z-[2] opacity-[0.82]"
        style={{ backgroundImage: "linear-gradient(5deg, transparent 81%, #000)" }}
      />
      {/* Bottom gradient overlay */}
      <div
        className="absolute inset-0 z-[2] opacity-[0.56]"
        style={{ backgroundImage: "linear-gradient(190deg, transparent 54%, #000)" }}
      />

      {/* Main hero layout container */}
      <div
        className="relative z-[2] w-screen min-h-screen flex flex-col justify-between p-[4vw] gap-[40px]"
      >
        {/* hero-top */}
        <div className="hero-top-label w-1/2 mt-[7vw]">
          <h1
            className="m-0 text-[3.5vw] font-semibold leading-[100%]"
            style={{ color: "var(--orange1)", fontFamily: "var(--font)" }}
          >
            Brand &amp; Web<br />Design Specialist
          </h1>
        </div>

        {/* hero-bottom */}
        <div className="hero-bottom-label flex flex-col items-end w-full relative gap-[2vw]">
          {/* Name row */}
          <div
            ref={rowRef}
            className="w-full flex flex-row items-end justify-center will-change-transform"
          >
            {/* JUAN */}
            <svg
              ref={juanRef}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 660 233"
              preserveAspectRatio="xMinYMax meet"
              className="block will-change-transform [transform-origin:right_center]"
              style={{ height: SVG_H_VW + "vw" }}
              dangerouslySetInnerHTML={{ __html: JUAN_PATHS }}
            />

            {/* CARD */}
            <div
              className="hero-card flex-shrink-0 flex flex-col items-center gap-[0.5vw]"
              style={{ width: CARD_VW + "vw" }}
            >
              <div
                className="w-full overflow-hidden h-[14vw] rounded-[0.6vw] bg-[#111]"
                style={{
                  boxShadow: "0 16px 45px rgba(0,0,0,.55),0 4px 12px rgba(0,0,0,.3)",
                  border: "1px solid rgba(255,255,255,.12)",
                }}
              >
                <img
                  ref={cardImgRef}
                  src={PROJECTS[2].src}
                  alt="Work preview"
                  className="w-full h-full object-cover block [transition:opacity_0.15s_ease]"
                />
              </div>
              <span
                ref={cardLblRef}
                className="inline-block whitespace-nowrap rounded-[100px] font-medium tracking-[.08em] bg-[rgba(212,255,0,0.1)] border border-[rgba(212,255,0,0.2)] px-[0.75vw] py-[0.2vw] [transition:opacity_0.15s_ease]"
                style={{
                  color: "var(--orange1)",
                  fontSize: "clamp(.5rem,.62vw,.65rem)",
                }}
              >
                {PROJECTS[2].label}
              </span>
            </div>

            {/* MORA */}
            <svg
              ref={moraRef}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 480 233"
              preserveAspectRatio="xMinYMax meet"
              className="block will-change-transform [transform-origin:left_center]"
              style={{ height: SVG_H_VW + "vw" }}
              dangerouslySetInnerHTML={{ __html: MORA_PATHS }}
            />
          </div>

          {/* Freelance Design Director */}
          <p
            className="m-0 text-right text-[3.5vw] font-semibold leading-[100%]"
            style={{ color: "var(--orange1)", fontFamily: "var(--font)" }}
          >
            Freelance Design Director
          </p>
        </div>
      </div>
    </section>
  );
}
