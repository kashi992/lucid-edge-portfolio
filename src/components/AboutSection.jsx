import { useRef, useEffect } from "react";

/* ─── data ─────────────────────────────────────────────────────────────── */
const BIO = [
  {
    label: "Who We Are",
    body: "Lucid Edge is a design studio led by Juan Mora — a Design Director focused on Web, Branding, and Product for the last 16 years.\n\nSince the beginning, we've been passionate about learning and refining the craft — exploring different styles, techniques, and ways to apply them depending on what each brand actually needs.\n\nNow we're building Lucid Edge — a studio focused on helping brands create work that feels more artistic, human, and intentional.",
  },
  {
    label: "Approach",
    body: "We start with little context. We look at your brand through the user's eyes first, then from the inside out — focusing on understanding the product, the audience, and the real problem behind the brief.\n\nFrom there, we help define the direction and bring ideas — not just to make things look better, but to make them work better.\n\nWe work closely across departments to align on goals. Our role is not just execution — it's bringing clarity, perspective, and elevating the outcome.",
  },
  {
    label: "Philosophy",
    body: "We don't follow trends blindly — we use them when they make sense. Our goal is always to create something distinctive, something people actually remember.\n\nEvery project, no matter the size, deserves the same level of care — something that feels thoughtful, well-crafted, and built to last.\n\nAnd yes, we believe humor is a design tool.",
  },
  {
    label: "Awards &\nRecognitions",
    body: "2x Webby Awards\n7x Awwwards\n5x FWA\n4x CSS Design Awards\n6x Behance Featured",
  },
];

const NEWS = [
  {
    num: "1",
    headline: "Running our\nown Studio",
    body: "Lucid Edge is a Design Studio with an artistic approach to brand building, using technology to push boundaries. We work with a network of the most talented freelancers to tackle ambitious projects.",
    href: "#",
    images: [],
  },
  {
    num: "2",
    headline: "Enjoy the\nonline course",
    body: "We partnered with Domestika to teach designers and marketers how to create landing pages that stand out through storytelling.",
    href: "https://www.domestika.org/en/courses/4542-ux-ui-design-for-landing-pages-tell-an-original-story/juanmora_mdg",
    images: ["/images/domestika-juan-mora-1.png", "/images/domestika-juan-mora-3.png"],
  },
  {
    num: "3",
    headline: "Don't\nScroll Down",
    body: "An award-winning reverse-psychology experience created to play with humor and share a deep reflection learned during the darkest days.",
    href: "#",
    images: ["/images/dont-scroll-down-juanmora1.png", "/images/dont-scroll-down-juanmora2.png"],
  },
];

/* ─── Learn More button (matches initCtaHovers pattern) ────────────────── */
function LearnMoreBtn({ href }) {
  const firstRef = useRef(null);
  const lastRef  = useRef(null);
  const gsapRef  = useRef(null);

  useEffect(() => {
    (async () => {
      const { default: gsap } = await import("gsap");
      gsapRef.current = gsap;
      gsap.set(firstRef.current, { width: 0, rotation: -90, opacity: 0 });
    })();
  }, []);

  const onEnter = () => {
    const g = gsapRef.current; if (!g) return;
    g.to(firstRef.current, { width: "1.4rem", rotation: 0, opacity: 1, duration: 0.8, ease: "elastic.out(0.5,0.3)", overwrite: true });
    g.to(lastRef.current,  { width: 0, rotation: -90, opacity: 0, duration: 0.2, ease: "power2.out", overwrite: true });
  };
  const onLeave = () => {
    const g = gsapRef.current; if (!g) return;
    g.to(firstRef.current, { width: 0, rotation: -90, opacity: 0, duration: 0.3, ease: "power2.inOut", overwrite: true });
    g.to(lastRef.current,  { width: "1.4rem", rotation: 0, opacity: 1, duration: 0.8, ease: "elastic.out(0.6,0.3)", overwrite: true });
  };

  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="no-underline inline-flex items-center gap-[0.5rem] cursor-pointer mt-[1vw]"
      style={{
        border: "1px solid rgba(212,255,0,0.25)",
        borderRadius: "100px",
        padding: "10px 18px 10px 10px",
        background: "rgba(212,255,0,0.05)",
        width: "fit-content",
      }}
    >
      <div ref={firstRef} style={{ overflow: "hidden", height: "1rem", display: "flex", alignItems: "center" }}>
        <img src="/images/arrow-grey-out.svg" alt="" style={{ width: "1rem", flexShrink: 0 }} />
      </div>
      <span style={{ color: "var(--orange1)", fontFamily: "var(--font)", fontSize: "0.8rem", fontWeight: 600 }}>
        Learn more
      </span>
      <div ref={lastRef} style={{ overflow: "hidden", height: "1rem", display: "flex", alignItems: "center", width: "1.4rem" }}>
        <img src="/images/arrow-grey-out.svg" alt="" style={{ width: "1rem", flexShrink: 0 }} />
      </div>
    </a>
  );
}

const HEADLINE_LINES = ["Designer", "based in", "Miami,", "working", "globally"];

/* ─── Main component ────────────────────────────────────────────────────── */
export default function AboutSection() {
  /* refs — hero */
  const heroRef       = useRef(null);
  const heroTagRef    = useRef(null);
  const heroLineRefs  = useRef([]); // one per headline line wrapper
  const heroWordRefs  = useRef([]); // one per headline line inner
  const heroSubRef    = useRef(null);
  const heroPhotoRef  = useRef(null);
  const heroScrollRef = useRef(null);
  const heroYearsRef  = useRef(null);
  const heroDivRef    = useRef(null);

  /* refs — scroll photo */
  const scrollRef = useRef(null);
  const photoRef  = useRef(null);
  const glowRef   = useRef(null);

  /* refs — bio */
  const labelRefs = useRef([]);
  const bodyRefs  = useRef([]);
  const lineRefs  = useRef([]);

  /* refs — news */
  const newsRef      = useRef(null);
  const newsHdrRef   = useRef(null);
  const newsTopLine  = useRef(null);
  const newsItems    = useRef([]);
  const newsLines    = useRef([]);

  useEffect(() => {
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      /* ── HERO entrance ── */
      // set initial hidden states
      gsap.set(heroTagRef.current,    { opacity: 0, y: 18 });
      gsap.set(heroSubRef.current,    { opacity: 0, y: 22 });
      gsap.set(heroPhotoRef.current,  { opacity: 0, scale: 1.06 });
      gsap.set(heroScrollRef.current, { opacity: 0 });
      gsap.set(heroYearsRef.current,  { opacity: 0, y: 10 });
      gsap.set(heroDivRef.current,    { scaleX: 0, transformOrigin: "left center" });
      heroWordRefs.current.forEach(el => { if (el) gsap.set(el, { yPercent: 110 }); });

      const playHero = () => {
        const tl = gsap.timeline();
        // photo scales in
        tl.to(heroPhotoRef.current, { opacity: 1, scale: 1, duration: 1.4, ease: "power3.out" }, 0);
        // tag fades up
        tl.to(heroTagRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0.15);
        // divider line sweeps
        tl.to(heroDivRef.current, { scaleX: 1, duration: 0.6, ease: "power2.inOut" }, 0.3);
        // headline lines clip-reveal stagger
        heroWordRefs.current.forEach((el, i) => {
          if (!el) return;
          tl.to(el, { yPercent: 0, duration: 0.85, ease: "power3.out" }, 0.35 + i * 0.08);
        });
        // subtitle + years
        tl.to(heroSubRef.current,   { opacity: 0.45, y: 0, duration: 0.7, ease: "power3.out" }, 0.7);
        tl.to(heroYearsRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.75);
        tl.to(heroScrollRef.current,{ opacity: 1, duration: 0.5 }, 0.9);
      };

      requestAnimationFrame(() => requestAnimationFrame(playHero));

      /* ── Scroll photo: glow parallax + photo scale in ── */
      gsap.fromTo(photoRef.current,
        { scale: 1.1 },
        { scale: 1, ease: "none",
          scrollTrigger: { trigger: scrollRef.current, start: "top bottom", end: "center center", scrub: true } }
      );
      gsap.to(glowRef.current, {
        yPercent: -40, ease: "none",
        scrollTrigger: { trigger: scrollRef.current, start: "top bottom", end: "bottom top", scrub: true },
      });

      /* ── Bio rows ── */
      BIO.forEach((_, i) => {
        const label = labelRefs.current[i];
        const body  = bodyRefs.current[i];
        const line  = lineRefs.current[i];
        if (!label) return;

        gsap.timeline({
          scrollTrigger: { trigger: label, start: "top 90%", once: true },
        })
          .fromTo(label, { x: -30, opacity: 0 }, { x: 0, opacity: 0.6, duration: 0.7, ease: "power3.out" })
          .fromTo(body,  { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, ease: "power3.out" }, "-=0.5")
          .fromTo(line,
            { scaleX: 0, transformOrigin: "left center" },
            { scaleX: 1, duration: 0.6, ease: "power2.inOut" },
            "-=0.55"
          );
      });

      /* ── News header + items — IntersectionObserver (reliable with Lenis) ── */
      const revealEls = [
        { el: newsHdrRef.current,  vars: { opacity: 0, y: 14 },  anim: { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" } },
        { el: newsTopLine.current, vars: { scaleX: 0, transformOrigin: "left center" }, anim: { scaleX: 1, duration: 0.55, ease: "power2.inOut" } },
        ...newsItems.current.map((el, i) => ({
          el, vars: { opacity: 0, y: 50 },
          anim: { opacity: 1, y: 0, duration: 0.85, ease: "power3.out", delay: i * 0.12 },
        })),
        ...newsLines.current.map(el => ({
          el, vars: { scaleX: 0, transformOrigin: "left center" },
          anim: { scaleX: 1, duration: 0.55, ease: "power2.inOut" },
        })),
      ];

      revealEls.forEach(({ el, vars, anim }) => {
        if (!el) return;
        gsap.set(el, vars);
      });

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const item = revealEls.find(r => r.el === entry.target);
          if (item) gsap.to(entry.target, item.anim);
          observer.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0 });

      revealEls.forEach(({ el }) => { if (el) observer.observe(el); });
    })();
  }, []);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════ HERO */}
      <section
        ref={heroRef}
        data-nav="peach"
        className="relative w-screen h-screen overflow-hidden"
        style={{ background: "var(--blue)" }}
      >
        {/* grid: left text / right photo */}
        <div className="w-full h-full grid" style={{ gridTemplateColumns: "1fr 40vw" }}>

          {/* LEFT */}
          <div className="flex flex-col justify-between" style={{ padding: "7rem 3vw 3.5vw 5vw" }}>

            {/* top: tag + divider */}
            <div>
              <div ref={heroTagRef} className="flex items-center gap-3" style={{ marginBottom: "1.2rem" }}>
                <div style={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%", background: "var(--orange1)", flexShrink: 0 }} />
                <span style={{ color: "var(--orange1)", fontFamily: "var(--font)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Design Director · Miami
                </span>
              </div>
              <div ref={heroDivRef} style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.12)" }} />
            </div>

            {/* headline — word-split clip reveal */}
            <div style={{ margin: "0" }}>
              {HEADLINE_LINES.map((line, i) => {
                const dim = i === 1 || i === 3; // "based in" + "working" dimmed
                return (
                  <div
                    key={i}
                    ref={el => heroLineRefs.current[i] = el}
                    style={{ overflow: "hidden", lineHeight: "97%" }}
                  >
                    <div
                      ref={el => heroWordRefs.current[i] = el}
                      style={{
                        display: "block",
                        fontFamily: "var(--font)",
                        fontWeight: 700,
                        fontSize: "clamp(2.6rem, 5.2vw, 5.8rem)",
                        letterSpacing: "-0.03em",
                        color: dim ? "rgba(240,240,240,0.28)" : "var(--grey)",
                        paddingBottom: "0.05em",
                      }}
                    >
                      {line}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* bottom: sub + years */}
            <div className="flex items-end justify-between">
              <p
                ref={heroSubRef}
                className="m-0"
                style={{
                  color: "var(--grey)",
                  fontFamily: "var(--font)",
                  fontSize: "0.82rem",
                  fontWeight: 500,
                  lineHeight: "158%",
                  maxWidth: "26ch",
                }}
              >
                Web, Branding &amp; Product for global tech companies and growing startups.
              </p>
              <div
                ref={heroYearsRef}
                style={{ textAlign: "right", flexShrink: 0 }}
              >
                <div style={{ color: "var(--orange1)", fontFamily: "var(--font)", fontSize: "2.2rem", fontWeight: 700, lineHeight: 1 }}>16</div>
                <div style={{ color: "var(--grey)", fontFamily: "var(--font)", fontSize: "0.72rem", fontWeight: 600, opacity: 0.4, letterSpacing: "0.08em", textTransform: "uppercase" }}>Years</div>
              </div>
            </div>
          </div>

          {/* RIGHT — photo */}
          <div className="relative h-full overflow-hidden" style={{ borderRadius: "0 0 0 2.5vw" }}>
            <div
              ref={heroPhotoRef}
              className="absolute inset-0"
              style={{
                backgroundImage: "url('/images/about-juan-mora.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "50% 15%",
              }}
            />
            {/* lime gradient overlay bottom */}
            <div className="absolute inset-x-0 bottom-0 pointer-events-none"
              style={{ height: "50%", background: "linear-gradient(to top, rgba(212,255,0,0.1), transparent)" }}
            />
          </div>
        </div>

        {/* scroll cue */}
        <div
          ref={heroScrollRef}
          className="absolute bottom-5 left-1/2 flex flex-col items-center gap-[0.4rem]"
          style={{ transform: "translateX(-50%)" }}
        >
          <span style={{ color: "var(--grey)", fontFamily: "var(--font)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.3 }}>
            Scroll
          </span>
          <div style={{ width: "1px", height: "2.5rem", background: "var(--orange1)", opacity: 0.35 }} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ SCROLL PHOTO */}
      <section
        ref={scrollRef}
        className="relative w-screen flex justify-center items-start overflow-visible"
        style={{ height: "300vh", zIndex: 1 }}
      >
        <div className="sticky top-0 w-screen h-screen overflow-hidden" style={{ zIndex: 5 }}>
          {/* orange glow layer */}
          <div
            className="absolute inset-0 pointer-events-none flex justify-center items-center overflow-hidden"
            style={{ zIndex: 8, top: "-24.2vw", height: "180vw" }}
          >
            <div
              ref={glowRef}
              style={{
                background: "var(--orange1)",
                filter: "blur(6vw)",
                borderRadius: "50vw",
                width: "120%",
                height: "100%",
                position: "absolute",
                top: "15vw",
                opacity: 0.5,
              }}
            />
          </div>

          {/* photo */}
          <div
            ref={photoRef}
            className="w-full h-full"
            style={{
              backgroundImage: "url('/images/about-juan-mora.jpg')",
              backgroundPosition: "50%",
              backgroundSize: "cover",
              position: "relative",
              zIndex: 5,
              willChange: "transform",
            }}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ BIO */}
      <section
        data-nav="grey"
        className="relative w-screen flex flex-col items-center"
        style={{
          background: "var(--bg-warm)",
          paddingTop: "8rem",
          paddingBottom: "15rem",
          zIndex: 10,
        }}
      >
        {BIO.map((item, i) => (
          <div key={i} className="w-[92vw]">
            <div
              className="grid w-full"
              style={{
                gridTemplateColumns: "50% 50%",
                paddingTop: "4rem",
                paddingBottom: "4rem",
                alignItems: "start",
              }}
            >
              {/* left: label */}
              <div style={{ display: "flex", justifyContent: "flex-end", paddingRight: "4rem" }}>
                <h3
                  ref={el => labelRefs.current[i] = el}
                  className="m-0 font-semibold text-right leading-[110%]"
                  style={{
                    color: "var(--orange1)",
                    fontFamily: "var(--font)",
                    fontSize: "2rem",
                    whiteSpace: "pre-line",
                  }}
                >
                  {item.label}
                </h3>
              </div>

              {/* right: body */}
              <div>
                <p
                  ref={el => bodyRefs.current[i] = el}
                  className="m-0 font-semibold leading-[140%] tracking-[0.03rem]"
                  style={{
                    color: "var(--grey)",
                    fontFamily: "var(--font)",
                    fontSize: "0.9rem",
                    whiteSpace: "pre-line",
                  }}
                >
                  {item.body}
                </p>
              </div>
            </div>

            {i < BIO.length - 1 && (
              <div
                ref={el => lineRefs.current[i] = el}
                style={{ width: "100%", height: "1px", background: "var(--grey)", opacity: 0.12 }}
              />
            )}
          </div>
        ))}
      </section>

      {/* ══════════════════════════════════════════════ NEWS & UPDATES */}
      <section
        ref={newsRef}
        data-nav="peach"
        className="relative w-screen flex flex-col items-start overflow-hidden"
        style={{
          background: "#77726f",
          borderRadius: "4vw 4vw 0 0",
          paddingBottom: "10vw",
          zIndex: 9,
        }}
      >
        {/* header row */}
        <div
          ref={newsHdrRef}
          className="flex items-center gap-4"
          style={{ width: "100%", padding: "4vw 4vw 0" }}
        >
          <div style={{ width: "0.5rem", height: "0.5rem", background: "var(--orange1)", flexShrink: 0 }} />
          <p
            className="m-0 font-semibold"
            style={{ color: "var(--orange1)", fontFamily: "var(--font)", fontSize: "0.9rem" }}
          >
            News &amp; Updates
          </p>
        </div>

        {/* top divider */}
        <div
          ref={newsTopLine}
          style={{
            width: "100%", height: "1px",
            background: "var(--orange1)", opacity: 0.15,
            marginTop: "4vw",
          }}
        />

        {NEWS.map((item, i) => (
          <div key={i} className="w-full">
            <div
              ref={el => newsItems.current[i] = el}
              className="relative w-full flex flex-col"
              style={{ padding: "6vw 4vw 5vw" }}
            >
              {/* background number */}
              <span
                className="absolute font-semibold pointer-events-none"
                style={{
                  fontSize: "4vw",
                  letterSpacing: "-0.2vw",
                  lineHeight: "95%",
                  color: "#000",
                  opacity: 0.11,
                  fontFamily: "var(--font)",
                  top: "-4vw",
                  right: "0",
                }}
              >
                {item.num}
              </span>

              {/* 3-col grid: headline / body / button */}
              <div
                className="grid w-full"
                style={{
                  gridTemplateColumns: "1fr 0.5fr 0.5fr",
                  gap: "1rem",
                  alignItems: "end",
                  marginTop: "2vw",
                  marginBottom: "4vw",
                }}
              >
                <h3
                  className="m-0 font-semibold leading-[100%]"
                  style={{
                    color: "var(--orange1)",
                    fontFamily: "var(--font)",
                    fontSize: "4vw",
                    letterSpacing: "-0.12vw",
                    whiteSpace: "pre-line",
                  }}
                >
                  {item.headline}
                </h3>
                <p
                  className="m-0 font-semibold leading-[140%]"
                  style={{
                    color: "var(--orange1)",
                    fontFamily: "var(--font)",
                    fontSize: "0.9rem",
                    opacity: 0.75,
                  }}
                >
                  {item.body}
                </p>
                <div className="flex justify-end items-end">
                  <LearnMoreBtn href={item.href} />
                </div>
              </div>

              {/* images grid */}
              {item.images.length > 0 && (
                <div
                  className="grid w-full"
                  style={{ gridTemplateColumns: "1fr 1fr", gap: "0.5rem 0.25rem" }}
                >
                  {item.images.map((src, j) => (
                    <img
                      key={j}
                      src={src}
                      loading="lazy"
                      alt=""
                      className="w-full block"
                      style={{ borderRadius: "0.5rem", objectFit: "cover" }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* item divider */}
            <div
              ref={el => newsLines.current[i] = el}
              style={{
                width: "100%", height: "1px",
                background: "var(--orange1)", opacity: 0.15,
              }}
            />
          </div>
        ))}
      </section>
    </>
  );
}
