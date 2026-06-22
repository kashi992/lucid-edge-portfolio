import { useEffect, useRef } from "react";
import { SERVICES, IMAGES } from "../data/services";

function ServiceRow({ service, index }) {
  const wrapRef       = useRef(null);
  const numRef        = useRef(null);
  const titleEl       = useRef(null);
  const descRef       = useRef(null);
  const lineRef       = useRef(null);
  const stripRef      = useRef(null);
  const cardInnerRefs = useRef([]);

  const num       = String(index + 1).padStart(2, "0");
  const isWebflow = service.isWebflow;

  const mediaItems = [];
  if (!isWebflow) {
    const imgs = service.images || [];
    const vids = service.videos  || [];
    if (imgs[0]) mediaItems.push({ type: "img", src: imgs[0] });
    if (vids[0]) mediaItems.push({ type: "vid", src: vids[0] });
    if (imgs[1]) mediaItems.push({ type: "img", src: imgs[1] });
    if (vids[1]) mediaItems.push({ type: "vid", src: vids[1] });
    if (imgs[2]) mediaItems.push({ type: "img", src: imgs[2] });
  }

  const webflowCards = isWebflow
    ? [
        { bg: "var(--bg-warm)", border: "rgb(8,127,241)", src: IMAGES.webflowTag },
        { bg: "var(--bg-cold)", border: "rgb(0,153,255)",  src: IMAGES.framerTag  },
      ]
    : [];

  const allCards = isWebflow ? webflowCards : mediaItems;

  useEffect(() => {
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const st = { trigger: wrapRef.current, start: "top 78%", once: true };

      if (numRef.current) {
        gsap.set(numRef.current, { y: 30, opacity: 0 });
        gsap.to(numRef.current, { y: 0, opacity: 1, duration: 0.6, ease: "power4.out", scrollTrigger: st });
      }

      if (titleEl.current) {
        gsap.set(titleEl.current, { yPercent: 110 });
        gsap.to(titleEl.current, { yPercent: 0, duration: 1.0, ease: "power4.out", scrollTrigger: st });
      }

      if (descRef.current) {
        gsap.set(descRef.current, { y: 20, opacity: 0 });
        gsap.to(descRef.current, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2, scrollTrigger: st });
      }

      if (lineRef.current) {
        gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left center" });
        gsap.to(lineRef.current, { scaleX: 1, duration: 1.4, ease: "power3.inOut", scrollTrigger: st });
      }

      const INIT_ROTX = [48, 64, 80, 64, 48];
      const vw = window.innerWidth / 100;

      const cards = cardInnerRefs.current.filter(Boolean);
      if (cards.length) {
        cards.forEach((card, i) => {
          const initRotX = INIT_ROTX[i] ?? 60;
          const distFromCenter = Math.abs(i - Math.floor(cards.length / 2));
          const endShift = distFromCenter * 6;

          gsap.set(card, { transformOrigin: "bottom center", transformPerspective: 900 });
          gsap.fromTo(card,
            { rotateX: initRotX },
            {
              rotateX: 0,
              ease: "none",
              scrollTrigger: {
                trigger: wrapRef.current,
                start: "top 90%",
                end: `bottom ${68 + endShift}%`,
                scrub: true,
              },
            }
          );
        });
      }
    })();
  }, []);

  return (
    <li
      ref={wrapRef}
      className="list-none w-full flex flex-col box-border pt-[5vw] px-[5vw] pb-0 gap-[2.5vw]"
    >
      {/* Separator line */}
      <div ref={lineRef} className="w-full h-[1px]" style={{ background: "var(--bg-grey)" }} />

      {/* Number + title */}
      <div className="flex items-start gap-[3vw]">
        <span
          ref={numRef}
          className="flex-shrink-0 text-[0.75rem] font-bold tracking-[0.12em] pt-[0.6em]"
          style={{ fontFamily: "var(--font)", color: "var(--grey)" }}
        >
          {num}
        </span>

        <div className="overflow-hidden flex-1 pb-[0.06em]">
          <div ref={titleEl} className="flex items-center gap-[1.5vw]">
            <h2
              className="m-0 font-bold tracking-[-0.03em] leading-[100%]"
              style={{
                fontFamily: "var(--font)",
                fontSize: "clamp(1.8rem, 3.8vw, 4.5rem)",
                color: "var(--blue)",
              }}
            >
              {service.title}
            </h2>
            {isWebflow && (
              <>
                <img src={IMAGES.webflowFrame} loading="lazy" alt="" className="h-[3.5vw]" />
                <img src={IMAGES.framerFrame}  loading="lazy" alt="" className="h-[3.5vw]" />
              </>
            )}
          </div>
        </div>

        <div
          className="flex-shrink-0 rounded-full w-[0.65vw] h-[0.65vw] min-w-[9px] min-h-[9px] mt-[0.9em]"
          style={{ background: "var(--orange1)" }}
        />
      </div>

      {/* Description */}
      <p
        ref={descRef}
        className="m-0 font-medium leading-[160%] max-w-[38vw] pl-[3.8vw]"
        style={{
          fontFamily: "var(--font)",
          fontSize: "clamp(0.85rem, 1vw, 1rem)",
          color: "var(--grey)",
        }}
      >
        {service.description}
      </p>

      {/* ── Media cards ── */}
      {!isWebflow && (
        <div className="w-full overflow-hidden pb-[6vw] pt-[1vw] [perspective:1200px]">
          <div ref={stripRef} className="flex gap-[1vw]">
            {mediaItems.map((item, i) => (
              <div
                key={i}
                ref={r => (cardInnerRefs.current[i] = r)}
                className="flex-1 min-w-0 rounded-[10px] overflow-hidden will-change-transform h-[20vw]"
                style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.12)" }}
              >
                {item.type === "img"
                  ? <img src={item.src} alt="" loading="lazy" className="w-full h-full object-cover block" />
                  : <video autoPlay loop muted playsInline className="w-full h-full object-cover block"><source src={item.src} type="video/mp4" /></video>
                }
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Webflow / Framer cards ── */}
      {isWebflow && (
        <div className="flex box-border gap-[2vw] px-[3.8vw] pb-[5vw]">

          {/* Webflow card */}
          <div
            ref={r => (cardInnerRefs.current[0] = r)}
            className="flex-1 overflow-hidden flex flex-col justify-between relative box-border rounded-[1.2vw] p-[3vw] min-h-[22vw]"
            style={{
              background: "linear-gradient(135deg, #0a0a2e 0%, #0b2a6b 60%, #0a3fa8 100%)",
              border: "1px solid rgba(8,127,241,0.35)",
            }}
          >
            {/* Glow */}
            <div
              className="absolute rounded-full pointer-events-none -top-[20%] -right-[10%] w-[50%] h-[50%]"
              style={{ background: "radial-gradient(circle, rgba(8,127,241,0.25) 0%, transparent 70%)" }}
            />

            <div>
              <img src={IMAGES.webflowTag} loading="lazy" alt="Webflow" className="block h-[2.2vw] mb-[2.5vw]" />
              <p
                className="leading-[170%] mb-[2vw] mt-0 max-w-[36ch]"
                style={{
                  fontFamily: "var(--font)",
                  fontSize: "clamp(0.75rem, 1vw, 1rem)",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                Visual-first development with pixel-perfect CMS integration and seamless client hand-off.
              </p>
            </div>

            <div className="flex flex-wrap gap-[0.6vw]">
              {["CMS Hand-off", "Interactions", "Responsive", "Hosting"].map(tag => (
                <span
                  key={tag}
                  className="uppercase font-bold tracking-[0.1em] text-[rgba(8,127,241,0.9)] bg-[rgba(8,127,241,0.12)] border border-[rgba(8,127,241,0.25)] rounded-[100vw] px-[1em] py-[0.4em]"
                  style={{ fontFamily: "var(--font)", fontSize: "clamp(0.6rem, 0.75vw, 0.8rem)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Framer card */}
          <div
            ref={r => (cardInnerRefs.current[1] = r)}
            className="flex-1 overflow-hidden flex flex-col justify-between relative box-border rounded-[1.2vw] p-[3vw] min-h-[22vw]"
            style={{
              background: "linear-gradient(135deg, #0d0d0d 0%, #1a0a2e 60%, #2d0a5e 100%)",
              border: "1px solid rgba(100,50,255,0.35)",
            }}
          >
            {/* Glow */}
            <div
              className="absolute rounded-full pointer-events-none -top-[20%] -right-[10%] w-[50%] h-[50%]"
              style={{ background: "radial-gradient(circle, rgba(100,50,255,0.2) 0%, transparent 70%)" }}
            />

            <div>
              <img src={IMAGES.framerTag} loading="lazy" alt="Framer" className="block h-[2.2vw] mb-[2.5vw]" />
              <p
                className="leading-[170%] mb-[2vw] mt-0 max-w-[36ch]"
                style={{
                  fontFamily: "var(--font)",
                  fontSize: "clamp(0.75rem, 1vw, 1rem)",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                Motion-rich sites powered by React components, advanced animations and live prototyping.
              </p>
            </div>

            <div className="flex flex-wrap gap-[0.6vw]">
              {["React Components", "Animations", "Prototyping", "CMS"].map(tag => (
                <span
                  key={tag}
                  className="uppercase font-bold tracking-[0.1em] text-[rgba(130,80,255,0.9)] bg-[rgba(100,50,255,0.12)] border border-[rgba(100,50,255,0.25)] rounded-[100vw] px-[1em] py-[0.4em]"
                  style={{ fontFamily: "var(--font)", fontSize: "clamp(0.6rem, 0.75vw, 0.8rem)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>
      )}
    </li>
  );
}

// ── Section heading: per-word clip reveal ─────────────────────────────────────
function SectionHeading() {
  const wrapRef  = useRef(null);
  const labelRef = useRef(null);
  const wordRefs = useRef([]);

  const words = ["I", "help", "companies", "to", "succeed", "on", "projects", "like:"];

  useEffect(() => {
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      gsap.set(labelRef.current, { opacity: 0, x: -16 });
      gsap.to(labelRef.current, {
        opacity: 1, x: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: wrapRef.current, start: "top 85%", once: true },
      });

      const inners = wordRefs.current.filter(Boolean).map(w => w.querySelector(".inner"));
      gsap.set(inners, { yPercent: 115 });
      gsap.to(inners, {
        yPercent: 0, duration: 0.85, ease: "power4.out", stagger: 0.06,
        scrollTrigger: { trigger: wrapRef.current, start: "top 82%", once: true },
      });
    })();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="flex flex-col w-[92vw] gap-[2vw] pt-[10vw] pb-[2vw]"
    >
      <p
        ref={labelRef}
        className="m-0 uppercase text-[0.72rem] font-bold tracking-[0.14em]"
        style={{ color: "var(--grey)", fontFamily: "var(--font)" }}
      >
        Design Expert
      </p>

      <h2
        className="m-0 flex flex-wrap font-extrabold tracking-[-0.04em] leading-[95%] gap-[0_0.25em]"
        style={{
          fontFamily: "var(--font)",
          fontSize: "clamp(2rem, 7vw, 7.5rem)",
          color: "var(--blue)",
        }}
      >
        {words.map((word, i) => (
          <span
            key={i}
            ref={r => (wordRefs.current[i] = r)}
            className="overflow-hidden inline-block pb-[0.06em]"
          >
            <span className="inner block">
              {word === "like:" ? <>like<span style={{ color: "var(--orange1)" }}>:</span></> : word}
            </span>
          </span>
        ))}
      </h2>
    </div>
  );
}

export default function ServicesSection() {
  return (
    <section
      data-nav="grey"
      className="flex flex-col items-center relative z-[5] pb-[6vw]"
      style={{ background: "var(--bg-warm)" }}
    >
      <SectionHeading />
      <ul className="w-screen m-0 p-0 list-none">
        {SERVICES.map((s, i) => <ServiceRow key={s.id} service={s} index={i} />)}
      </ul>
    </section>
  );
}
