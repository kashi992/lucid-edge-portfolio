import { useRef, useEffect } from "react";
import CTAButton from "./CTAButton";

/* ─── data ─────────────────────────────────────────────────────────────── */
const BIO = [
  {
    label: "Who We Are",
    body: "Malcolm Beddows is a multi-award-winning Animation and Film Production studio based in Paddington, Sydney — founded by Malcolm Beddows in 2005.\n\nWith over 18 years of experience, we've built a long-standing reputation in Construction Bid Submission and Large Project Delivery, partnering with Australia's leading construction and infrastructure firms.\n\nWe create the digital content teams need to win and deliver major projects — combining animation, film, and creative direction with a captivating narrative.",
  },
  {
    label: "Our Approach",
    body: "We work alongside Communications and Marketing teams to understand your visual requirements and deliver content that engages stakeholders at every level.\n\nFrom 3D animation to live-action film, VFX, and TimeLapse — we bring a full production capability to every project, no matter the scale.\n\nOur goal is always the same: the highest quality production, delivered with clarity and impact.",
  },
  {
    label: "Background",
    body: "Malcolm Beddows brings two decades of experience across interactive design, 3D animation, film, and music — working across three continents.\n\nHis background spans aerospace engineering, early work at London engineering firms and Pinewood Studios, and creative leadership across Hong Kong, the Middle East, and Australia.\n\nFounding Malcolm Beddows in 2005, he established the studio as one of Sydney's leading creative production companies.",
  },
  {
    label: "Awards &\nRecognitions",
    body: "Multi-Award-Winning Studio\n18+ Years in Production\n100+ TimeLapse Cameras Deployed\n60+ Major Projects Delivered",
  },
];

const NEWS = [
  {
    num: "1",
    headline: "18 Years\nof Production",
    body: "Malcolm Beddows has been delivering award-winning animation and film production for over 18 years, partnering with Australia's leading construction and infrastructure firms to help them win major project bids.",
    href: "#",
    images: [],
  },
  {
    num: "2",
    headline: "Australia's\nTop TimeLapse",
    body: "We are one of Australia's leading TimeLapse Camera providers for construction projects, operating over 100 cameras with a seamless pipeline for projects of any scale.",
    href: "#",
    images: [
      "https://lucidedge.com.au/wp-content/uploads/2020/07/line-wide-works.png",
      "https://lucidedge.com.au/wp-content/uploads/2020/07/SSC_Works_Final_2.png",
    ],
  },
  {
    num: "3",
    headline: "Award-Winning\nBid Videos",
    body: "From the Sydney Metro to Northern Beaches Hospital and major PPP bid submissions — our animation and film productions have helped teams across Australia secure landmark projects.",
    href: "#",
    images: [
      "https://lucidedge.com.au/wp-content/uploads/2020/07/Westmead_construction_sequence.png",
      "https://lucidedge.com.au/wp-content/uploads/2020/07/sydney-metro-central-station.png",
    ],
  },
];

/* ─── Morable canvas — UnicornStudio v2.1.6 addScene per element ────────── */
function StudioPanel() {
  const contRef = useRef(null);

  useEffect(() => {
    const el = contRef.current;
    if (!el) return;
    let cancelled = false;

    const loadAndRun = async () => {
      if (!window.UnicornStudio) {
        await new Promise(resolve => {
          if (document.querySelector("script[data-us-v2]")) {
            const t = setInterval(() => { if (window.UnicornStudio) { clearInterval(t); resolve(); } }, 40);
            return;
          }
          const s = document.createElement("script");
          s.src = "/unicornStudio.umd.js";
          s.setAttribute("data-us-v2", "1");
          s.onload = resolve;
          document.head.appendChild(s);
        });
      }
      if (cancelled) return;
      const scene = await window.UnicornStudio.addScene({
        element: el,
        filePath: "/morable-lucid.json",
        fps: 60,
        scale: 1,
        altText: "Malcolm Beddows Studio",
      });
      if (cancelled) { scene?.destroy?.(); return; }
      el.__usScene = scene;
    };

    loadAndRun().catch(console.error);

    return () => {
      cancelled = true;
      el.__usScene?.destroy?.();
      el.__usScene = null;
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={contRef} className="w-full h-full" style={{ overflow: "hidden" }} />
      <p
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: "'Caveat', cursive",
          fontSize: "7vw",
          fontWeight: 700,
          color: "#1a1a1a",
          letterSpacing: "0",
          margin: 0,
          pointerEvents: "none",
          whiteSpace: "nowrap",
          zIndex: 10,
        }}
      >
        Malcolm Beddows
      </p>
    </div>
  );
}


const HERO_HEADLINE = "Award-winning animation and film production, based in Sydney";

/* ─── Main component ────────────────────────────────────────────────────── */
export default function AboutSection({ loaded }) {
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

  const heroWrapRef = useRef(null);
  const blueDotRef  = useRef(null);

  /* refs — scroll photo */
  const scrollRef     = useRef(null);
  const photoRef      = useRef(null);
  const glowRef       = useRef(null);
  const wavesRef      = useRef(null);
  const shineMaskRef  = useRef(null);
  const lottieRef     = useRef(null); // lottie-web instance

  /* refs — bio */
  const labelRefs = useRef([]);
  const bodyRefs  = useRef([]);
  const lineRefs  = useRef([]);

  /* refs — news */
  const newsRef          = useRef(null);
  const newsHdrRef       = useRef(null);
  const newsTopLine      = useRef(null);
  const newsItems        = useRef([]);
  const newsLines        = useRef([]);
  const newsHeadlineRefs = useRef([]); // headline h3 per item
  const newsBodyRefs     = useRef([]); // body p per item
  const newsBtnRefs      = useRef([]); // button wrapper per item
  const newsPanelRefs    = useRef([]); // morable/image panel per item

  /* Hero entrance — fires after loader completes */
  useEffect(() => {
    if (!loaded) return;
    const wrapEl  = heroWrapRef.current;
    const h1El    = heroWordRefs.current[0];
    const wordEls = h1El ? [...h1El.querySelectorAll(".hw")] : [];

    // Trigger CSS slide-up
    if (wrapEl) {
      wrapEl.classList.remove("hero-wrap-hidden");
      wrapEl.classList.add("hero-slide-up");
    }

    // Color sweep + dot after slide starts
    (async () => {
      const { default: gsap } = await import("gsap");
      gsap.set(wordEls, { color: "#ffbc95" });
      gsap.to(wordEls, {
        color: "var(--grey)",
        duration: 1, ease: "power3.out",
        stagger: { each: 0.1 },
        delay: 0.35,
      });
      gsap.set(blueDotRef.current, { y: 0 });
      gsap.to(blueDotRef.current, { y: -30, duration: 0.33, ease: "power3.out", delay: 0.22 });
      gsap.to(blueDotRef.current, { y: 0, duration: 1, ease: "elastic.out(0.8, 0.3)", delay: 0.55 });
    })();
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      /* ── Scroll section — exact IX2 t-4b300411 ── */
      gsap.set(photoRef.current, { opacity: 0 });
      gsap.set(wavesRef.current, { opacity: 0 });

      // Load lottie-web
      const lottieWeb = await import("lottie-web");
      const anim = lottieWeb.default.loadAnimation({
        container: wavesRef.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "/circles-about.json",
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
          progressiveLoad: true,
        },
      });
      lottieRef.current = anim;

      const totalFrames = 153;

      anim.addEventListener("DOMLoaded", () => {
        const svg = wavesRef.current?.querySelector("svg");
        if (svg) {
          svg.style.width = "100%";
          svg.style.height = "100%";
          svg.style.position = "absolute";
          svg.style.inset = "0";
        }
        anim.goToAndStop(0, true);

        // Build timeline matching IX2 proportions (total 5.1s)
        const tl = gsap.timeline();

        // lottie opacity 0→1: pos 0, dur 0.43
        tl.fromTo(wavesRef.current, { opacity: 0 }, { opacity: 1, duration: 0.43, ease: "none" }, 0);

        // shine mask y 0→-30vw: pos 0, dur 1.36
        tl.fromTo(shineMaskRef.current, { y: "0vw" }, { y: "-30vw", duration: 1.36, ease: "none" }, 0);

        // photo opacity 0→1: pos 2, dur 1.39
        tl.fromTo(photoRef.current, { opacity: 0 }, { opacity: 1, duration: 1.39, ease: "none" }, 2);

        // shine mask opacity 1→0: pos 3.83, dur 1.04
        tl.to(shineMaskRef.current, { opacity: 0, duration: 1.04, ease: "none" }, 3.83);

        ScrollTrigger.create({
          trigger: scrollRef.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 0.8,
          animation: tl,
          onUpdate: (self) => {
            anim.goToAndStop(self.progress * totalFrames, true);
          },
        });

        ScrollTrigger.refresh();
      });

      /* ── Bio rows ── */
      BIO.forEach((_, i) => {
        const label = labelRefs.current[i];
        const body  = bodyRefs.current[i];
        const line  = lineRefs.current[i];
        if (!label) return;

        // Label slide in
        gsap.fromTo(label, { x: -30, opacity: 0 }, {
          x: 0, opacity: 0.6, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: label, start: "top 88%", once: true },
        });

        // Divider line draw
        if (line) {
          gsap.fromTo(line, { scaleX: 0, transformOrigin: "left center" }, {
            scaleX: 1, duration: 0.6, ease: "power2.inOut",
            scrollTrigger: { trigger: label, start: "top 88%", once: true },
          });
        }

      });

      // Hide all bio chars upfront so paragraphs 2-4 don't show before animation
      BIO.forEach((_, i) => {
        const body = bodyRefs.current[i];
        if (body) gsap.set(body.querySelectorAll(".bio-char"), { opacity: 0 });
      });

      // Sequential body reveal — each paragraph waits for the previous to finish
      const animateBioBody = (index) => {
        if (index >= BIO.length) return;
        const body = bodyRefs.current[index];
        if (!body) { animateBioBody(index + 1); return; }
        const chars = body.querySelectorAll(".bio-char");
        gsap.to(chars, {
          opacity: 1, duration: 0.06, stagger: 0.004, ease: "power2.out",
          onComplete: () => animateBioBody(index + 1),
        });
      };

      const firstBody = bodyRefs.current[0];
      if (firstBody) {
        ScrollTrigger.create({
          trigger: firstBody,
          start: "top 85%",
          once: true,
          onEnter: () => animateBioBody(0),
        });
      }

      /* helper: create a once-only ScrollTrigger that also fires immediately
         if the trigger element is already in the viewport on page load */
      const onceInView = (trigger, start, onEnter) => {
        const rect = trigger.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          onEnter();
        } else {
          ScrollTrigger.create({ trigger, start, once: true, onEnter });
        }
      };

      /* ── News header ── */
      gsap.set(newsHdrRef.current, { opacity: 0, y: 14 });
      gsap.set(newsTopLine.current, { scaleX: 0, transformOrigin: "left center" });
      onceInView(newsHdrRef.current, "top 90%", () => {
        gsap.to(newsHdrRef.current,  { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
        gsap.to(newsTopLine.current, { scaleX: 1, duration: 0.7, ease: "power2.inOut", delay: 0.1 });
      });

      /* ── News items — per-element staggered reveal ── */
      NEWS.forEach((_, i) => {
        const wrapper  = newsItems.current[i];
        const headline = newsHeadlineRefs.current[i];
        const body     = newsBodyRefs.current[i];
        const btn      = newsBtnRefs.current[i];
        const panel    = newsPanelRefs.current[i];
        const divider  = newsLines.current[i];
        if (!wrapper) return;

        // Word-clip reveal on headline
        if (headline) {
          const words = headline.querySelectorAll(".nw");
          gsap.set(words, { yPercent: 110 });
          onceInView(wrapper, "top 88%", () => {
            gsap.to(words, { yPercent: 0, duration: 0.9, ease: "power3.out", stagger: 0.06 });
          });
        }

        // Body — character reveal matching reference
        if (body) {
          const chars = body.querySelectorAll(".news-char");
          gsap.fromTo(chars,
            { opacity: 0 },
            { opacity: 1, duration: 0.3, stagger: 0.018, ease: "power2.out",
              scrollTrigger: { trigger: body, start: "top 85%", once: true } }
          );
        }

        // Button fade
        if (btn) {
          gsap.set(btn, { opacity: 0, y: 10 });
          onceInView(wrapper, "top 85%", () => {
            gsap.to(btn, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.28 });
          });
        }

        // Panel / image grid reveal
        if (panel) {
          if (i !== 0) {
            gsap.set(panel, { opacity: 0, scale: 0.96, transformOrigin: "center bottom" });
          }
          onceInView(panel, "top 90%", () => {
            gsap.to(panel, { opacity: 1, scale: 1, duration: 1, ease: "power3.out", delay: 0.1 });
          });
        }

        // Divider line draw
        if (divider) {
          gsap.set(divider, { scaleX: 0, transformOrigin: "left center" });
          onceInView(wrapper, "top 98%", () => {
            gsap.to(divider, { scaleX: 1, duration: 0.7, ease: "power2.inOut" });
          });
        }
      });
    })();
  }, [loaded]);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════ HERO */}
      {/* .section > .hero-about-wrapper > .wrapper-cont-50._70 */}
      <section
        ref={heroRef}
        data-nav="grey"
        className="relative z-[5] w-screen"
        style={{ background: "var(--bg-warm)" }}
      >
        {/* hero-about-wrapper: full viewport, flex col centered — matches reference exactly */}
        <div className="flex flex-col justify-center items-center w-screen h-screen relative overflow-visible">

          {/* wrapper-cont-50._70: 49% on desktop, 80% on mobile */}
          <div className="relative w-[80%]">

            {/* pill-hero-about-wrapper: absolute, inset .4vw auto auto .7vw */}
            <div
              className="flex items-center absolute"
              style={{ gap: "1.4vw", top: "0.4vw", left: "0.7vw" }}
            >
              <img
                src="/images/le-mark-lime.jpeg"
                alt="Malcolm Beddows"
                style={{ height: "6vw" }}
              />
              <div
                ref={blueDotRef}
                style={{ width: "1vw", height: "1vw", borderRadius: "2vw", background: "var(--blue)" }}
              />
            </div>

            {/* text-headline-about: color var(--grey), 7vw, tracking -0.3vw, lh 101% */}
            <div ref={heroWrapRef} className="hero-wrap-hidden">
              <h1
                ref={el => heroWordRefs.current[0] = el}
                className="m-0 flex flex-wrap font-semibold text-[10vw] lg:text-[7vw] text-center lg:text-left tracking-[-0.35vw] lg:tracking-[-0.3vw]"
                style={{
                  color: "var(--grey)",
                  fontFamily: "var(--font)",
                  lineHeight: "101%",
                }}
              >
                {/* text-span-5: opacity .01, pointer-events none — spacer for pill icon */}
                <span style={{ opacity: 0.01, pointerEvents: "none", color: "var(--bg-warm)" }}>----</span>
                {HERO_HEADLINE.split(" ").map((word, i) => (
                  <span key={i} className="hw" style={{ display: "inline" }}>
                    {word}{i < HERO_HEADLINE.split(" ").length - 1 ? "\u00A0" : ""}
                  </span>
                ))}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ SCROLL PHOTO */}
      {/* .section > .about-scroll-wrapper — 300vh scroll space */}
      <section
        data-nav="peach"
        className="relative z-[5] flex flex-col justify-start items-center w-screen"
        style={{ background: "var(--bg-warm)" }}
      >
        <div
          ref={scrollRef}
          className="about-scroll-section relative flex justify-center items-start w-screen z-[1]"
          style={{ height: "300vh", overflow: "visible" }}
        >
          {/* .sticky-cont-about */}
          <div className="sticky top-0" style={{ width: "100vw", height: "100vh", background: "var(--bg-warm)" }}>

            {/* .circle-lottie-cont — full viewport, z-10 (above glow and photo) */}
            <div
              ref={wavesRef}
              className="pointer-events-none overflow-hidden"
              style={{
                position: "absolute",
                inset: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 10,
              }}
            />

            {/* .cont-shine-mask — position absolute, z-8 */}
            <div
              ref={shineMaskRef}
              className="overflow-hidden flex justify-center items-center w-[100vw] xl:h-[180vw] md:h-[200vw] h-[250vw] absolute top-[-24.2vw] left-0"
              style={{
                zIndex: 8,
              }}
            >
              {/* .glow-orange */}
              <div
                style={{
                  position: "absolute",
                  top: "15vw",
                  width: "120%",
                  height: "100%",
                  background: "var(--orange1)",
                  filter: "blur(6vw)",
                  borderRadius: "50vw",
                }}
              />
            </div>

            {/* .big-about-cont — photo, position relative, z-5 */}
            <div
              ref={photoRef}
              style={{
                position: "relative",
                zIndex: 5,
                width: "100vw",
                height: "100vh",
                backgroundImage: "url('/images/about-juan-mora.jpg')",
                backgroundPosition: "50%",
                backgroundSize: "cover",
                opacity: 0,
              }}
            />

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ BIO */}
      <section
        data-nav="grey"
        className="relative w-screen flex flex-col items-center z-10 md:py-32 md:pt-14 py-12"
        style={{ background: "var(--bg-warm)" }}
      >
        {BIO.map((item, i) => (
          <div key={i} className="w-[92vw]">
            <div
              className="grid w-full grid-cols-1 md:grid-cols-2 pt-[8vw] md:pt-16 pb-[8vw] md:pb-16 items-start md:gap-0 gap-4"
            >
              {/* left: label */}
              <div className="flex justify-start md:justify-end pr-0 md:pr-16">
                <h3
                  ref={el => labelRefs.current[i] = el}
                  className="m-0 font-semibold leading-[110%] whitespace-pre-line text-[6vw] md:text-[2rem] text-left md:text-right"
                  style={{
                    color: "var(--blue)",
                    fontFamily: "var(--font)",
                    opacity: 0.85,
                  }}
                >
                  {item.label}
                </h3>
              </div>

              {/* right: body */}
              <div>
                <p
                  ref={el => bodyRefs.current[i] = el}
                  className="m-0 font-semibold leading-[140%] tracking-[0.03rem] text-[0.9rem] w-full xl:w-[58%]"
                  style={{ color: "var(--grey)", fontFamily: "var(--font)" }}
                >
                  {item.body.split("\n").map((line, li, arr) => (
                    <span key={li}>
                      {line.split("").map((ch, ci) =>
                        ch === " "
                          ? <span key={ci} className="bio-char" style={{ display: "inline-block", width: "0.25em" }}>&nbsp;</span>
                          : <span key={ci} className="bio-char">{ch}</span>
                      )}
                      {li < arr.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            </div>

            {i < BIO.length - 1 && (
              <div
                ref={el => lineRefs.current[i] = el}
                className="w-full h-px opacity-[0.12]"
                style={{ background: "var(--blue)" }}
              />
            )}
          </div>
        ))}
      </section>

      {/* ══════════════════════════════════════════════ NEWS & UPDATES */}
      <section
        ref={newsRef}
        data-nav="peach"
        className="relative w-screen flex flex-col items-start z-[9] rounded-[4vw_4vw_0_0] pb-[10vw]"
        style={{ background: "var(--blue)" }}
      >
        {/* header row */}
        <div
          ref={newsHdrRef}
          className="flex items-center gap-4 w-full p-[4vw] pb-0"
        >
          <div className="w-2 h-2 shrink-0" style={{ background: "var(--orange1)" }} />
          <p
            className="m-0 font-semibold text-[0.9rem]"
            style={{ color: "var(--orange1)", fontFamily: "var(--font)" }}
          >
            News &amp; Updates
          </p>
        </div>

        {/* top divider */}
        <div
          ref={newsTopLine}
          className="w-full h-px opacity-50 mt-[4vw]"
          style={{ background: "var(--orange1)" }}
        />

        {NEWS.map((item, i) => (
          <div key={i} className="relative w-full">

            {/* ── STICKY content row ── */}
            <div
              ref={el => newsItems.current[i] = el}
              className="relative w-full flex flex-col px-[4vw] pt-[6vw] pb-[4vw]"
              style={{ position: "sticky", top: 0, zIndex: 10 + i, background: "var(--blue)" }}
            >
              {/* top divider */}
              <div
                ref={el => newsLines.current[i] = el}
                className="absolute top-0 left-0 w-full h-px opacity-50"
                style={{ background: "var(--orange1)" }}
              />

              {/* background number */}
              <span
                className="absolute font-semibold pointer-events-none text-[4vw] leading-[95%] opacity-[0.12]"
                style={{
                  top: "2vw", right: "4vw",
                  letterSpacing: "-0.2vw",
                  fontFamily: "var(--font)",
                  color: "var(--orange1)"
                }}
              >
                {item.num}
              </span>

              {/* 3-col grid: headline / body / button */}
              <div
                className="grid w-full xl:gap-4 gap-6 place-items-end mt-[2vw] grid-cols-1 xl:grid-cols-[1fr_0.5fr_0.5fr]"
              >
                <h3
                  ref={el => newsHeadlineRefs.current[i] = el}
                  className="m-0 font-semibold leading-[100%] w-full text-[7vw] md:text-[4vw]"
                  style={{
                    color: "var(--orange1)",
                    fontFamily: "var(--font)",
                    letterSpacing: "-0.12vw",
                  }}
                >
                  {item.headline.split("\n").map((line, li) => (
                    <span key={li} className="block">
                      {line.split(" ").map((word, wi) => (
                        <span key={wi} className="inline-block overflow-hidden align-bottom leading-[110%]">
                          <span className="nw inline-block">{word}{wi < line.split(" ").length - 1 ? "\u00A0" : ""}</span>
                        </span>
                      ))}
                    </span>
                  ))}
                </h3>
                <p
                  ref={el => newsBodyRefs.current[i] = el}
                  className="m-0 font-semibold leading-[140%] w-full text-[2.5vw] md:text-[0.9rem]"
                  style={{ color: "var(--bg-warm)", fontFamily: "var(--font)", opacity: 0.75 }}
                >
                  {item.body.split("").map((ch, ci) =>
                    ch === " "
                      ? <span key={ci} className="news-char" style={{ display: "inline-block", width: "0.25em" }}>&nbsp;</span>
                      : <span key={ci} className="news-char">{ch}</span>
                  )}
                </p>
                <div ref={el => newsBtnRefs.current[i] = el} className="flex xl:justify-end items-end w-full">
                  <CTAButton href={item.href} label="Learn more" />
                </div>
              </div>
            </div>

            {/* ── NON-STICKY panel / images — scrolls normally ── */}
            <div className="relative w-full px-[4vw] pb-[5vw]" style={{ zIndex: 10 + i, background: "var(--blue)" }}>
              {i === 0 && (
                <div
                  ref={el => newsPanelRefs.current[i] = el}
                  className="w-full overflow-hidden rounded-lg h-[110vw] md:h-[50vw]"
                >
                  <StudioPanel />
                </div>
              )}

              {i > 0 && item.images.length > 0 && (
                <div ref={el => newsPanelRefs.current[i] = el} className="grid w-full md:grid-cols-2 xl:gap-x-2 xl:gap-y-1 gap-4">
                  {item.images.map((src, j) => (
                    <img key={j} src={src} loading="lazy" alt="" className="w-full block object-cover rounded-lg" />
                  ))}
                </div>
              )}
            </div>

          </div>
        ))}
      </section>
    </>
  );
}
