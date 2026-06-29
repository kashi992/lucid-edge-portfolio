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

          {/* ── Webflow card ── */}
          <div
            ref={r => (cardInnerRefs.current[0] = r)}
            className="flex-1 overflow-hidden flex flex-col relative box-border rounded-[1.2vw] min-h-[30vw]"
            style={{
              background: "linear-gradient(145deg, #050d1f 0%, #08204a 55%, #093b8f 100%)",
              border: "1px solid rgba(8,127,241,0.3)",
            }}
          >
            {/* ambient glow */}
            <div className="absolute pointer-events-none rounded-full w-[60%] h-[60%] -top-[20%] right-[5%]"
              style={{ background: "radial-gradient(circle, rgba(8,127,241,0.2) 0%, transparent 70%)" }} />

            {/* browser chrome */}
            <div className="relative z-10 flex items-center gap-[0.45vw] px-[1.4vw] py-[1vw]"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {["rgba(255,90,90,0.5)","rgba(255,200,50,0.5)","rgba(50,200,50,0.5)"].map((c, i) => (
                <div key={i} className="rounded-full flex-shrink-0"
                  style={{ width: "0.55vw", height: "0.55vw", minWidth: 7, minHeight: 7, background: c }} />
              ))}
              <div className="flex-1 mx-[0.8vw] flex items-center gap-[0.35vw] rounded-[0.4vw] px-[0.7vw]"
                style={{ height: "1.5vw", minHeight: 18, background: "rgba(255,255,255,0.05)" }}>
                <div className="rounded-full flex-shrink-0"
                  style={{ width: "0.45vw", height: "0.45vw", minWidth: 6, minHeight: 6, background: "rgba(8,127,241,0.6)" }} />
                <span style={{ fontFamily: "var(--font)", fontSize: "clamp(0.45rem, 0.62vw, 0.7rem)", color: "rgba(255,255,255,0.3)" }}>
                  studio.webflow.io
                </span>
              </div>
              <img src={IMAGES.webflowTag} loading="lazy" alt="Webflow"
                style={{ height: "1.2vw", minHeight: 14, opacity: 0.65, flexShrink: 0 }} />
            </div>

            {/* CMS editor body */}
            <div className="relative z-10 flex flex-1 overflow-hidden">
              {/* sidebar */}
              <div className="flex flex-col gap-[0.5vw] p-[1vw] flex-shrink-0"
                style={{ width: "9vw", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
                {[
                  { w: "55%", active: false },
                  { w: "45%", active: true  },
                  { w: "35%", active: false },
                  { w: "40%", active: false },
                  { w: "30%", active: false },
                  { w: "42%", active: false },
                ].map(({ w, active }, i) => (
                  <div key={i} className="rounded-[0.3vw] flex items-center"
                    style={{ height: "1.3vw", minHeight: 14, padding: "0 0.5vw", background: active ? "rgba(8,127,241,0.2)" : "transparent" }}>
                    <div className="rounded-full"
                      style={{ height: "0.35vw", minHeight: 4, width: w, background: active ? "rgba(8,127,241,0.85)" : "rgba(255,255,255,0.1)" }} />
                  </div>
                ))}
              </div>

              {/* canvas */}
              <div className="flex-1 p-[1.2vw] flex flex-col gap-[0.9vw] min-w-0">
                {/* hero block */}
                <div className="rounded-[0.5vw] relative flex flex-col items-center justify-center gap-[0.5vw] flex-shrink-0"
                  style={{ height: "7vw", minHeight: 56, background: "rgba(8,127,241,0.07)", border: "1px dashed rgba(8,127,241,0.25)" }}>
                  <span style={{ position: "absolute", top: "0.4vw", right: "0.6vw", fontFamily: "var(--font)", fontSize: "clamp(0.38rem, 0.52vw, 0.58rem)", color: "rgba(8,127,241,0.5)", letterSpacing: "0.1em" }}>HERO</span>
                  <div className="rounded-full" style={{ height: "0.8vw", minHeight: 7, width: "55%", background: "rgba(8,127,241,0.4)" }} />
                  <div className="rounded-full" style={{ height: "0.45vw", minHeight: 4, width: "35%", background: "rgba(255,255,255,0.12)" }} />
                  <div className="rounded-full" style={{ height: "1.4vw", minHeight: 11, width: "4.5vw", background: "rgba(8,127,241,0.7)", marginTop: "0.3vw" }} />
                </div>

                {/* CMS collection */}
                <div className="rounded-[0.4vw] overflow-hidden flex-shrink-0"
                  style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex gap-[0.5vw] px-[0.8vw] py-[0.5vw]"
                    style={{ background: "rgba(8,127,241,0.15)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    {[0,1,2].map(ci => (
                      <div key={ci} className="flex-1 rounded-full"
                        style={{ height: "0.45vw", minHeight: 4, background: "rgba(8,127,241,0.6)" }} />
                    ))}
                  </div>
                  {[0.18, 0.12, 0.08].map((op, ri) => (
                    <div key={ri} className="flex gap-[0.5vw] px-[0.8vw] py-[0.55vw]"
                      style={{ borderBottom: ri < 2 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                      {[0.7, 0.5, 0.35].map((w, ci) => (
                        <div key={ci} className="flex-1 rounded-full"
                          style={{ height: "0.4vw", minHeight: 3, background: `rgba(255,255,255,${op})` }} />
                      ))}
                    </div>
                  ))}
                </div>

                {/* publish row */}
                <div className="flex justify-end mt-auto">
                  <div className="flex items-center gap-[0.5vw] rounded-full px-[1.2vw] flex-shrink-0"
                    style={{ height: "2vw", minHeight: 20, background: "rgb(8,127,241)", boxShadow: "0 0 16px rgba(8,127,241,0.55)" }}>
                    <div className="rounded-full bg-white flex-shrink-0" style={{ width: "0.45vw", height: "0.45vw", minWidth: 5, minHeight: 5 }} />
                    <span style={{ fontFamily: "var(--font)", fontSize: "clamp(0.48rem, 0.65vw, 0.72rem)", color: "white", fontWeight: 700 }}>Publish</span>
                  </div>
                </div>
              </div>
            </div>

            {/* tags */}
            <div className="relative z-10 flex flex-wrap gap-[0.6vw] p-[1.5vw]"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              {["CMS Hand-off", "Interactions", "Responsive", "Hosting"].map(tag => (
                <span key={tag} className="uppercase font-bold tracking-[0.1em] rounded-[100vw] px-[1em] py-[0.4em]"
                  style={{ fontFamily: "var(--font)", fontSize: "clamp(0.6rem, 0.75vw, 0.8rem)", color: "rgba(8,127,241,0.9)", background: "rgba(8,127,241,0.12)", border: "1px solid rgba(8,127,241,0.25)" }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ── Framer card ── */}
          <div
            ref={r => (cardInnerRefs.current[1] = r)}
            className="flex-1 overflow-hidden flex flex-col relative box-border rounded-[1.2vw] min-h-[30vw]"
            style={{
              background: "linear-gradient(145deg, #0a0712 0%, #160a2e 55%, #28095e 100%)",
              border: "1px solid rgba(120,60,255,0.3)",
            }}
          >
            {/* ambient glow */}
            <div className="absolute pointer-events-none rounded-full w-[60%] h-[60%] -top-[20%] right-[5%]"
              style={{ background: "radial-gradient(circle, rgba(120,60,255,0.18) 0%, transparent 70%)" }} />

            {/* browser chrome */}
            <div className="relative z-10 flex items-center gap-[0.45vw] px-[1.4vw] py-[1vw]"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {["rgba(255,90,90,0.5)","rgba(255,200,50,0.5)","rgba(50,200,50,0.5)"].map((c, i) => (
                <div key={i} className="rounded-full flex-shrink-0"
                  style={{ width: "0.55vw", height: "0.55vw", minWidth: 7, minHeight: 7, background: c }} />
              ))}
              <div className="flex-1 mx-[0.8vw] flex items-center gap-[0.35vw] rounded-[0.4vw] px-[0.7vw]"
                style={{ height: "1.5vw", minHeight: 18, background: "rgba(255,255,255,0.05)" }}>
                <div className="rounded-full flex-shrink-0"
                  style={{ width: "0.45vw", height: "0.45vw", minWidth: 6, minHeight: 6, background: "rgba(120,60,255,0.7)" }} />
                <span style={{ fontFamily: "var(--font)", fontSize: "clamp(0.45rem, 0.62vw, 0.7rem)", color: "rgba(255,255,255,0.3)" }}>
                  studio.framer.com
                </span>
              </div>
              <img src={IMAGES.framerTag} loading="lazy" alt="Framer"
                style={{ height: "1.2vw", minHeight: 14, opacity: 0.65, flexShrink: 0 }} />
            </div>

            {/* Framer canvas body */}
            <div className="relative z-10 flex flex-1 overflow-hidden">
              {/* layers panel */}
              <div className="flex flex-col gap-[0.4vw] p-[1vw] flex-shrink-0"
                style={{ width: "8vw", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="rounded-full flex-shrink-0"
                  style={{ height: "0.4vw", minHeight: 4, width: "70%", background: "rgba(120,60,255,0.6)", marginBottom: "0.4vw" }} />
                {[
                  { indent: 0, w: "80%", active: false },
                  { indent: 1, w: "65%", active: true  },
                  { indent: 2, w: "55%", active: false },
                  { indent: 2, w: "60%", active: false },
                  { indent: 1, w: "70%", active: false },
                  { indent: 2, w: "45%", active: false },
                ].map(({ indent, w, active }, i) => (
                  <div key={i} className="flex items-center rounded-[0.2vw]"
                    style={{ height: "1.2vw", minHeight: 13, paddingLeft: `${0.3 + indent * 0.6}vw`, background: active ? "rgba(120,60,255,0.2)" : "transparent" }}>
                    <div className="rounded-full"
                      style={{ height: "0.35vw", minHeight: 3, width: w, background: active ? "rgba(150,90,255,0.85)" : "rgba(255,255,255,0.1)" }} />
                  </div>
                ))}
              </div>

              {/* canvas */}
              <div className="flex-1 p-[1.2vw] flex flex-col gap-[1vw] min-w-0">
                {/* interaction state stack */}
                <div className="flex flex-col gap-[0.7vw]">
                  {[
                    { label: "Default", accent: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.12)" },
                    { label: "Hover",   accent: "rgba(120,60,255,0.15)",  border: "rgba(120,60,255,0.45)" },
                    { label: "Active",  accent: "rgba(120,60,255,0.3)",   border: "rgba(150,90,255,0.75)" },
                  ].map(({ label, accent, border }, i) => (
                    <div key={i} className="flex items-center gap-[0.8vw]">
                      <span className="flex-shrink-0"
                        style={{ fontFamily: "var(--font)", fontSize: "clamp(0.42rem, 0.55vw, 0.62rem)", color: "rgba(255,255,255,0.3)", width: "3.5vw", minWidth: 34, letterSpacing: "0.07em" }}>
                        {label}
                      </span>
                      <div className="flex-1 flex items-center justify-between rounded-[0.5vw] px-[0.8vw]"
                        style={{ height: "2.5vw", minHeight: 22, background: accent, border: `1px solid ${border}` }}>
                        <div className="rounded-full" style={{ height: "0.55vw", minHeight: 5, width: "40%", background: border }} />
                        <div className="rounded-[100vw]" style={{ height: "1.5vw", minHeight: 14, width: "22%", background: border }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* easing curve + label */}
                <div className="flex items-end gap-[0.8vw] mt-auto">
                  <svg viewBox="0 0 60 40" style={{ width: "5vw", minWidth: 44, height: "3.5vw", minHeight: 28, flexShrink: 0 }}>
                    <path d="M 5 35 C 15 35, 10 5, 55 5" stroke="rgba(120,60,255,0.7)" strokeWidth="1.5" fill="none" />
                    <circle cx="5"  cy="35" r="2" fill="rgba(120,60,255,0.5)" />
                    <circle cx="55" cy="5"  r="2" fill="rgba(150,90,255,0.9)" />
                  </svg>
                  <span style={{ fontFamily: "var(--font)", fontSize: "clamp(0.4rem, 0.52vw, 0.6rem)", color: "rgba(255,255,255,0.22)", letterSpacing: "0.1em" }}>
                    ease-in-out
                  </span>
                </div>
              </div>

              {/* props panel */}
              <div className="flex flex-col gap-[0.65vw] p-[1vw] flex-shrink-0"
                style={{ width: "7vw", borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
                {["Width","Height","Opacity","Radius"].map((_, i) => (
                  <div key={i} className="flex flex-col gap-[0.2vw]">
                    <div className="rounded-full" style={{ height: "0.3vw", minHeight: 3, width: "50%", background: "rgba(255,255,255,0.15)" }} />
                    <div className="rounded-[0.25vw] flex items-center justify-center"
                      style={{ height: "1.3vw", minHeight: 13, background: "rgba(120,60,255,0.1)", border: "1px solid rgba(120,60,255,0.2)" }}>
                      <div className="rounded-full" style={{ height: "0.35vw", minHeight: 3, width: "55%", background: "rgba(150,90,255,0.5)" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* tags */}
            <div className="relative z-10 flex flex-wrap gap-[0.6vw] p-[1.5vw]"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              {["React Components", "Animations", "Prototyping", "CMS"].map(tag => (
                <span key={tag} className="uppercase font-bold tracking-[0.1em] rounded-[100vw] px-[1em] py-[0.4em]"
                  style={{ fontFamily: "var(--font)", fontSize: "clamp(0.6rem, 0.75vw, 0.8rem)", color: "rgba(130,80,255,0.9)", background: "rgba(100,50,255,0.12)", border: "1px solid rgba(100,50,255,0.25)" }}>
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
