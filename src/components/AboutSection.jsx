import { useRef, useEffect } from "react";

/* ─── data ─────────────────────────────────────────────────────────────── */
const BIO = [
  {
    label: "Who We Are",
    body: "Lucid Edge is a design studio led by Lucid Edge — a Design Director focused on Web, Branding, and Product for the last 16 years.\n\nSince the beginning, we've been passionate about learning and refining the craft — exploring different styles, techniques, and ways to apply them depending on what each brand actually needs.\n\nNow we're building Lucid Edge — a studio focused on helping brands create work that feels more artistic, human, and intentional.",
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

/* ─── Studio panel — full interactive box ──────────────────────────────── */
const STUDIO_TEXT = "LUCID EDGE";

function StudioPanel() {
  const panelRef   = useRef(null);
  const orb1Ref    = useRef(null);
  const orb2Ref    = useRef(null);
  const orb3Ref    = useRef(null);
  const iconRef    = useRef(null);
  const ringRef    = useRef(null);
  const scanRef    = useRef(null);
  const lettersRef = useRef([]);
  const gsapRef    = useRef(null);
  const rafRef     = useRef(null);
  const mouseRef   = useRef({ x: 0.5, y: 0.5 });
  const curRef     = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    (async () => {
      const { default: gsap } = await import("gsap");
      gsapRef.current = gsap;

      /* ── idle float on orbs ── */
      gsap.to(orb1Ref.current, {
        x: "3vw", y: "-2vw", duration: 6, repeat: -1, yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(orb2Ref.current, {
        x: "-2.5vw", y: "3vw", duration: 7, repeat: -1, yoyo: true,
        ease: "sine.inOut", delay: 1.5,
      });
      gsap.to(orb3Ref.current, {
        x: "2vw", y: "-3vw", duration: 5.5, repeat: -1, yoyo: true,
        ease: "sine.inOut", delay: 0.8,
      });

      /* ── ring slow rotation ── */
      gsap.to(ringRef.current, {
        rotation: 360, duration: 12, repeat: -1, ease: "none",
      });

      /* ── icon gentle pulse ── */
      gsap.to(iconRef.current, {
        scale: 1.06, duration: 2.5, repeat: -1, yoyo: true,
        ease: "sine.inOut",
      });

      /* ── scan line loop ── */
      gsap.fromTo(scanRef.current,
        { top: "-2px", opacity: 0.6 },
        { top: "100%", opacity: 0, duration: 2.8, repeat: -1, ease: "none", delay: 1 }
      );

      /* ── mouse parallax RAF ── */
      const lerp = (a, b, t) => a + (b - a) * t;
      const tick = () => {
        curRef.current.x = lerp(curRef.current.x, mouseRef.current.x, 0.06);
        curRef.current.y = lerp(curRef.current.y, mouseRef.current.y, 0.06);
        const dx = (curRef.current.x - 0.5) * 30;
        const dy = (curRef.current.y - 0.5) * 20;
        if (orb1Ref.current) gsap.set(orb1Ref.current, { x: dx * 0.8,  y: dy * 0.6  });
        if (orb2Ref.current) gsap.set(orb2Ref.current, { x: -dx * 0.5, y: -dy * 0.8 });
        if (orb3Ref.current) gsap.set(orb3Ref.current, { x: dx * 1.2,  y: dy * 1.0  });
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    })();

    const panel = panelRef.current;
    const onMove = (e) => {
      const r = panel.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - r.left) / r.width;
      mouseRef.current.y = (e.clientY - r.top)  / r.height;
    };
    panel.addEventListener("mousemove", onMove);

    return () => {
      panel.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const onEnter = () => {
    const g = gsapRef.current; if (!g) return;
    /* orbs brighten */
    g.to([orb1Ref.current, orb2Ref.current, orb3Ref.current], {
      opacity: 0.55, duration: 0.6, ease: "power2.out", overwrite: "auto",
    });
    /* icon scale up */
    g.to(iconRef.current, {
      scale: 1.15, duration: 0.5, ease: "back.out(2)", overwrite: "auto",
    });
    /* ring speed up */
    g.to(ringRef.current, {
      duration: 3, ease: "power2.inOut", overwrite: "auto",
    });
    /* letters morph bold */
    g.to(lettersRef.current, {
      fontWeight: 800, letterSpacing: "-0.04em", opacity: 1,
      duration: 0.5, ease: "power3.out",
      stagger: { each: 0.03, from: "center" },
      overwrite: true,
    });
  };

  const onLeave = () => {
    const g = gsapRef.current; if (!g) return;
    mouseRef.current = { x: 0.5, y: 0.5 };
    g.to([orb1Ref.current, orb2Ref.current, orb3Ref.current], {
      opacity: 0.28, duration: 0.9, ease: "power2.inOut", overwrite: "auto",
    });
    g.to(iconRef.current, {
      scale: 1, duration: 0.6, ease: "power2.inOut", overwrite: "auto",
    });
    g.to(lettersRef.current, {
      fontWeight: 200, letterSpacing: "0.12em", opacity: 0.22,
      duration: 0.6, ease: "power3.inOut",
      stagger: { each: 0.025, from: "center" },
      overwrite: true,
    });
  };

  return (
    <div
      ref={panelRef}
      className="w-full h-full relative overflow-hidden cursor-default select-none"
      style={{ background: "linear-gradient(135deg, #1a1a18 0%, #222220 45%, #2a2a22 100%)" }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* orb 1 — top-left lime */}
      <div
        ref={orb1Ref}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "32vw", height: "32vw", opacity: 0.28,
          background: "radial-gradient(circle, var(--orange1) 0%, transparent 65%)",
          top: "5%", left: "5%", filter: "blur(5vw)",
        }}
      />
      {/* orb 2 — bottom-right lime */}
      <div
        ref={orb2Ref}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "22vw", height: "22vw", opacity: 0.28,
          background: "radial-gradient(circle, var(--orange1) 0%, transparent 65%)",
          bottom: "10%", right: "8%", filter: "blur(3.5vw)",
        }}
      />
      {/* orb 3 — center accent */}
      <div
        ref={orb3Ref}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "14vw", height: "14vw", opacity: 0.15,
          background: "radial-gradient(circle, #fff 0%, transparent 70%)",
          top: "40%", left: "55%", filter: "blur(2vw)",
        }}
      />

      {/* scan line */}
      <div
        ref={scanRef}
        className="absolute left-0 w-full pointer-events-none"
        style={{
          height: "1px",
          background: "linear-gradient(90deg, transparent 0%, var(--orange1) 40%, var(--orange1) 60%, transparent 100%)",
          opacity: 0.6,
          top: 0,
        }}
      />

      {/* center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-[1.2vw]">
        {/* spinning ring + icon */}
        <div className="relative flex items-center justify-center" style={{ width: "9vw", height: "9vw" }}>
          {/* dashed orbit ring */}
          <div
            ref={ringRef}
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              border: "1px dashed rgba(212,255,0,0.35)",
              borderRadius: "50%",
            }}
          />
          {/* dot on the ring — top center */}
          <div
            className="absolute pointer-events-none rounded-full"
            style={{
              width: "0.5vw", height: "0.5vw",
              background: "var(--orange1)",
              top: 0, left: "50%", transform: "translateX(-50%)",
            }}
          />
          <img
            ref={iconRef}
            src="/images/le-icon-dark.jpg"
            alt="Lucid Edge"
            className="rounded-full object-cover relative z-10"
            style={{ width: "6vw", height: "6vw" }}
          />
        </div>

        <span
          className="font-semibold tracking-[0.25em] uppercase"
          style={{
            color: "var(--orange1)", fontFamily: "var(--font)",
            fontSize: "0.8vw", opacity: 0.5,
          }}
        >
          Lucid Edge Studio
        </span>

        {/* tag line */}
        <span
          className="font-medium tracking-[0.08em]"
          style={{
            color: "rgba(255,255,255,0.25)", fontFamily: "var(--font)",
            fontSize: "0.65vw",
          }}
        >
          Brand &amp; Web Design Studio
        </span>
      </div>

      {/* big morph text — bottom center */}
      <div className="absolute bottom-0 left-0 w-full flex items-end justify-center pb-[3vw] z-10">
        <div className="flex items-end" style={{ gap: 0 }}>
          {STUDIO_TEXT.split("").map((ch, i) => (
            <span
              key={i}
              ref={el => lettersRef.current[i] = el}
              className="inline-block leading-[0.85]"
              style={{
                fontFamily: "var(--font)",
                fontSize: "clamp(3rem, 9vw, 9vw)",
                fontWeight: 200,
                letterSpacing: "0.12em",
                color: "var(--orange1)",
                opacity: 0.22,
                whiteSpace: "pre",
              }}
            >
              {ch}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Learn More button — exact match to reference main-cont-button ─────── */
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
    g.to(firstRef.current, { width: "2.8rem", rotation: 0, opacity: 1, duration: 0.8, ease: "elastic.out(0.5,0.3)", overwrite: true });
    g.to(lastRef.current,  { width: 0, rotation: -90, opacity: 0, duration: 0.2, ease: "power2.out", overwrite: true });
  };
  const onLeave = () => {
    const g = gsapRef.current; if (!g) return;
    g.to(firstRef.current, { width: 0, rotation: -90, opacity: 0, duration: 0.3, ease: "power2.inOut", overwrite: true });
    g.to(lastRef.current,  { width: "2.8rem", rotation: 0, opacity: 1, duration: 0.8, ease: "elastic.out(0.6,0.3)", overwrite: true });
  };

  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="no-underline inline-flex items-center justify-center cursor-pointer"
      style={{ color: "var(--orange1)" }}
    >
      {/* first icon — hidden, appears on hover */}
      <div
        ref={firstRef}
        className="inline-flex items-center justify-center shrink-0 relative overflow-hidden"
        style={{ width: 0, height: "2.8rem", borderRadius: "5rem", background: "var(--orange1)" }}
      >
        <img src="/images/arrow-grey-out.svg" alt="" style={{ height: "0.8rem", position: "absolute" }} />
      </div>

      {/* text pill — dark glass */}
      <div
        className="shrink-0"
        style={{
          backdropFilter: "blur(9px)",
          WebkitBackdropFilter: "blur(9px)",
          background: "#25252557",
          borderRadius: "5rem",
          padding: "1rem 1.5rem",
          fontFamily: "var(--font)",
          fontSize: "0.9rem",
          fontWeight: 600,
          lineHeight: "100%",
          color: "var(--orange1)",
          whiteSpace: "nowrap",
        }}
      >
        Learn more
      </div>

      {/* last icon — lime circle, visible by default */}
      <div
        ref={lastRef}
        className="inline-flex items-center justify-center shrink-0 relative overflow-hidden"
        style={{ width: "2.8rem", height: "2.8rem", borderRadius: "5rem", background: "var(--orange1)" }}
      >
        <img src="/images/arrow-grey-out.svg" alt="" style={{ height: "0.8rem", position: "absolute" }} />
      </div>
    </a>
  );
}

const HERO_HEADLINE = "Designer based in Miami, working globally";

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
  const scrollRef   = useRef(null);
  const photoRef    = useRef(null);
  const glowRef     = useRef(null);
  const wavesRef    = useRef(null);
  const lottieRef   = useRef(null); // lottie-web instance

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

  useEffect(() => {
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      /* ── HERO entrance ── */
      gsap.set(heroTagRef.current,    { opacity: 0, y: 12 });
      gsap.set(heroScrollRef.current, { opacity: 0 });
      // Split headline into words for staggered reveal
      const headlineEl = heroWordRefs.current[0];
      if (headlineEl) {
        const words = headlineEl.querySelectorAll(".hw");
        gsap.set(words, { yPercent: 110 });
      }

      const playHero = () => {
        const tl = gsap.timeline();
        tl.to(heroTagRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0.2);
        if (headlineEl) {
          const words = headlineEl.querySelectorAll(".hw");
          tl.to(words, { yPercent: 0, duration: 1, ease: "power3.out", stagger: 0.06 }, 0.3);
        }
        tl.to(heroScrollRef.current, { opacity: 1, duration: 0.5 }, 1.0);
      };

      requestAnimationFrame(() => requestAnimationFrame(playHero));

      /* ── Scroll section: Lottie circles driven by scroll → photo ── */
      gsap.set(photoRef.current, { opacity: 0, scale: 0.82 });

      // Load lottie-web and init animation
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

      // Wait for animation data to load before driving with scroll
      anim.addEventListener("DOMLoaded", () => {
        // Make SVG fill container
        const svg = wavesRef.current?.querySelector("svg");
        if (svg) {
          svg.style.width = "100%";
          svg.style.height = "100%";
          svg.style.position = "absolute";
          svg.style.inset = "0";
        }

        anim.goToAndStop(0, true);

        // Lottie plays 0% → 28% of 550vh = 0–154vh
        ScrollTrigger.create({
          trigger: scrollRef.current,
          start: "top top",
          end: "28% top",
          scrub: true,
          onUpdate: (self) => {
            anim.goToAndStop(self.progress * totalFrames, true);
          },
        });

        // Lottie fades out (26% → 36%)
        gsap.to(wavesRef.current, {
          opacity: 0, ease: "none",
          scrollTrigger: { trigger: scrollRef.current, start: "26% top", end: "36% top", scrub: true },
        });

        // Photo zooms in as it appears (32% → 44%): scale 0.82→1, opacity 0→1
        gsap.fromTo(photoRef.current,
          { opacity: 0, scale: 0.82 },
          { opacity: 1, scale: 1, ease: "none",
            scrollTrigger: { trigger: scrollRef.current, start: "32% top", end: "44% top", scrub: true },
          }
        );

        // Continues slow zoom-in while sticky (44% → 100%)
        gsap.fromTo(photoRef.current,
          { scale: 1 },
          { scale: 1.2, ease: "none",
            scrollTrigger: { trigger: scrollRef.current, start: "44% top", end: "100% top", scrub: true },
          }
        );

        ScrollTrigger.refresh();
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

      /* ── News header ── */
      gsap.set(newsHdrRef.current, { opacity: 0, y: 14 });
      gsap.set(newsTopLine.current, { scaleX: 0, transformOrigin: "left center" });
      ScrollTrigger.create({
        trigger: newsHdrRef.current,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.to(newsHdrRef.current,  { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
          gsap.to(newsTopLine.current, { scaleX: 1, duration: 0.7, ease: "power2.inOut", delay: 0.1 });
        },
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
          ScrollTrigger.create({
            trigger: wrapper,
            start: "top 88%",
            once: true,
            onEnter: () => {
              gsap.to(words, {
                yPercent: 0, duration: 0.9, ease: "power3.out",
                stagger: 0.06,
              });
            },
          });
        }

        // Body fade + slide up
        if (body) {
          gsap.set(body, { opacity: 0, y: 22 });
          ScrollTrigger.create({
            trigger: wrapper,
            start: "top 86%",
            once: true,
            onEnter: () => {
              gsap.to(body, { opacity: 1, y: 0, duration: 0.75, ease: "power3.out", delay: 0.15 });
            },
          });
        }

        // Button fade
        if (btn) {
          gsap.set(btn, { opacity: 0, y: 10 });
          ScrollTrigger.create({
            trigger: wrapper,
            start: "top 85%",
            once: true,
            onEnter: () => {
              gsap.to(btn, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.28 });
            },
          });
        }

        // Panel / image grid scale + clip reveal
        if (panel) {
          gsap.set(panel, { opacity: 0, scale: 0.96, transformOrigin: "center bottom" });
          ScrollTrigger.create({
            trigger: panel,
            start: "top 90%",
            once: true,
            onEnter: () => {
              gsap.to(panel, { opacity: 1, scale: 1, duration: 1, ease: "power3.out", delay: 0.1 });
            },
          });
        }

        // Divider line draw — trigger on item since divider is at top of item
        if (divider) {
          gsap.set(divider, { scaleX: 0, transformOrigin: "left center" });
          ScrollTrigger.create({
            trigger: wrapper,
            start: "top 98%",
            once: true,
            onEnter: () => {
              gsap.to(divider, { scaleX: 1, duration: 0.7, ease: "power2.inOut" });
            },
          });
        }
      });
    })();
  }, []);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════ HERO */}
      <section
        ref={heroRef}
        data-nav="peach"
        className="relative w-screen min-h-screen overflow-hidden flex flex-col items-center justify-center pt-24"
        style={{ background: "var(--bg-warm)" }}
      >
        {/* top glow */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none z-[1]">
          <div
            className="absolute left-1/2 -translate-x-1/2 w-[60vw] h-[30vw] rounded-[50%] opacity-[0.07]"
            style={{
              top: "-10vw",
              background: "var(--orange1)",
              filter: "blur(8vw)",
            }}
          />
        </div>

        {/* centered content — 49% wide, matching reference */}
        <div className="relative z-10 w-[49vw] mb-8">

          {/* pill row: LE icon + dot — absolute top-left of container */}
          <div
            ref={heroTagRef}
            className="flex items-center gap-[1.4vw] absolute"
            style={{ top: "0.4vw", left: "0.7vw" }}
          >
            <img
              src="/images/le-icon-dark.jpg"
              alt="Lucid Edge"
              className="rounded-full object-cover"
              style={{ width: "2.8vw", height: "2.8vw", minWidth: "1.8rem", minHeight: "1.8rem" }}
            />
            <div
              className="rounded-full"
              style={{ width: "0.8vw", height: "0.8vw", minWidth: "0.5rem", minHeight: "0.5rem", background: "var(--orange1)" }}
            />
          </div>

          {/* headline */}
          <h1
            ref={el => heroWordRefs.current[0] = el}
            className="m-0 font-semibold pt-[4vw] text-[7vw] leading-none"
            style={{
              color: "var(--blue)",
              fontFamily: "var(--font)",
              letterSpacing: "-0.3vw",
            }}
          >
            {/* decorative dashes */}
            <span style={{ color: "var(--orange1)", marginRight: "0.3em", opacity: 0.7 }}>——</span>
            {HERO_HEADLINE.split(" ").map((word, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <span className="hw inline-block">{word}{i < HERO_HEADLINE.split(" ").length - 1 ? "\u00A0" : ""}</span>
              </span>
            ))}
          </h1>
        </div>

        {/* scroll cue */}
        <div
          ref={heroScrollRef}
          className="flex flex-col items-center gap-[0.4rem] z-10"
        >
          <span
            className="uppercase opacity-30 tracking-[0.15em] text-xs font-bold"
            style={{ color: "var(--blue)", fontFamily: "var(--font)" }}
          >
            Scroll
          </span>
          <div className="w-px h-8 opacity-35" style={{ background: "var(--blue)" }} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ SCROLL PHOTO */}
      <section
        ref={scrollRef}
        className="relative w-screen flex justify-center items-start overflow-visible z-[1]"
        style={{ height: "550vh" }}
      >
        <div className="sticky top-0 w-screen h-screen overflow-hidden z-[5]">

          {/* warm background behind lottie */}
          <div className="absolute inset-0 z-[1]" style={{ background: "var(--bg-warm)" }} />

          {/* clean full-screen photo — no overlay */}
          <div
            ref={photoRef}
            className="absolute inset-0 z-[4]"
            style={{
              backgroundImage: "url('/images/about-juan-mora.jpg')",
              backgroundPosition: "50% 20%",
              backgroundSize: "cover",
              opacity: 0,
            }}
          />

          {/* lottie-web renders the circles SVG into this div */}
          <div
            ref={wavesRef}
            className="absolute inset-0 z-[3] pointer-events-none overflow-hidden"
          />

          <div ref={glowRef} className="hidden" />

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ BIO */}
      <section
        data-nav="grey"
        className="relative w-screen flex flex-col items-center z-10 pt-32 pb-60"
        style={{ background: "var(--bg-cold)" }}
      >
        {BIO.map((item, i) => (
          <div key={i} className="w-[92vw]">
            <div
              className="grid w-full pt-16 pb-16 items-start"
              style={{ gridTemplateColumns: "50% 50%" }}
            >
              {/* left: label */}
              <div className="flex justify-end pr-16">
                <h3
                  ref={el => labelRefs.current[i] = el}
                  className="m-0 font-semibold text-right leading-[110%] text-[2rem] whitespace-pre-line"
                  style={{
                    color: "var(--blue)",
                    fontFamily: "var(--font)",
                  }}
                >
                  {item.label}
                </h3>
              </div>

              {/* right: body */}
              <div>
                <p
                  ref={el => bodyRefs.current[i] = el}
                  className="m-0 font-semibold leading-[140%] tracking-[0.03rem] text-[0.9rem] whitespace-pre-line"
                  style={{
                    color: "var(--grey)",
                    fontFamily: "var(--font)",
                  }}
                >
                  {item.body}
                </p>
              </div>
            </div>

            {i < BIO.length - 1 && (
              <div
                ref={el => lineRefs.current[i] = el}
                className="w-full h-px opacity-[0.12]"
                style={{ background: "var(--grey)" }}
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
        style={{ background: "var(--grey)" }}
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
              style={{ position: "sticky", top: 0, zIndex: 10 + i, background: "var(--grey)" }}
            >
              {/* top divider */}
              <div
                ref={el => newsLines.current[i] = el}
                className="absolute top-0 left-0 w-full h-px opacity-50"
                style={{ background: "var(--orange1)" }}
              />

              {/* background number */}
              <span
                className="absolute font-semibold pointer-events-none text-[4vw] leading-[95%] text-black opacity-[0.11]"
                style={{
                  top: "2vw", right: "4vw",
                  letterSpacing: "-0.2vw",
                  fontFamily: "var(--font)",
                }}
              >
                {item.num}
              </span>

              {/* 3-col grid: headline / body / button */}
              <div
                className="grid w-full gap-4 place-items-end mt-[2vw]"
                style={{ gridTemplateColumns: "1fr 0.5fr 0.5fr" }}
              >
                <h3
                  ref={el => newsHeadlineRefs.current[i] = el}
                  className="m-0 font-semibold leading-[100%] w-full"
                  style={{
                    color: "var(--orange1)",
                    fontFamily: "var(--font)",
                    fontSize: "4vw",
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
                  className="m-0 font-semibold leading-[140%] text-[0.9rem] w-full"
                  style={{ color: "var(--orange1)", fontFamily: "var(--font)" }}
                >
                  {item.body}
                </p>
                <div ref={el => newsBtnRefs.current[i] = el} className="flex justify-end items-end w-full">
                  <LearnMoreBtn href={item.href} />
                </div>
              </div>
            </div>

            {/* ── NON-STICKY panel / images — scrolls normally ── */}
            <div className="relative w-full px-[4vw] pb-[5vw]" style={{ zIndex: 10 + i, background: "var(--grey)" }}>
              {i === 0 && (
                <div
                  ref={el => newsPanelRefs.current[i] = el}
                  className="w-full overflow-hidden rounded-lg"
                  style={{ height: "50vw" }}
                >
                  <StudioPanel />
                </div>
              )}

              {i > 0 && item.images.length > 0 && (
                <div ref={el => newsPanelRefs.current[i] = el} className="grid w-full grid-cols-2 gap-x-2 gap-y-1">
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
