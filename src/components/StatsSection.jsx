import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 16,  suffix: "+", label: "Years"       },
  { value: 120, suffix: "+", label: "Projects"    },
  { value: 40,  suffix: "+", label: "Clients"     },
  { value: 98,  suffix: "%", label: "Satisfaction" },
];

const RIGHT_IMAGES = [
  { src: "/images/alena-app-design-juan-mora-1.webp" },
  { src: "/images/ampli-juan-mora-cover.jpg" },
  { src: "/images/apechain-apeportal-juan-mora-1.jpg" },
  { src: "/images/best-things-for-everything-google-shopping-juan-mora1.jpg" },
  { src: "/images/cryptopunks-mosh-juan-mora-1.jpg" },
  { src: "/images/alena-app-design-juan-mora-3.webp" },
];

// CountUp: fires when the number enters the viewport, cubic ease over 1800ms
function CountUp({ target, suffix, delay = 0 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          obs.disconnect();
          setTimeout(() => {
            const duration = 1800;
            const startTime = performance.now();
            const tick = (now) => {
              const elapsed = now - startTime;
              const t = Math.min(elapsed / duration, 1);
              const ease = 1 - Math.pow(1 - t, 3);
              setCount(Math.round(ease * target));
              if (t < 1) requestAnimationFrame(tick);
              else setCount(target);
            };
            requestAnimationFrame(tick);
          }, delay);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, delay]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const sectionRef   = useRef(null);
  const lineRef      = useRef(null);
  const headlineRef  = useRef(null);
  const wordsRef     = useRef([]);
  const pillRef      = useRef(null);
  const hoverPillRef = useRef(null);
  const imageRefs    = useRef([]);
  const path1Ref     = useRef(null);
  const path2Ref     = useRef(null);

  const [hovered, setHovered] = useState(false);

  // ── Main GSAP animations ──────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const headline = headlineRef.current;

      // 1. Line scaleX 0 → 1
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            ease: "power3.inOut",
            scrollTrigger: { trigger: headline, start: "top 80%", once: true },
          }
        );
      }

      // 2. Words stagger y:80→0, opacity:0→1
      const words = wordsRef.current.filter(Boolean);
      if (words.length) {
        gsap.fromTo(
          words,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.065,
            ease: "power4.out",
            scrollTrigger: { trigger: headline, start: "top 75%", once: true },
          }
        );
      }

      // 3. Pill scale:0→1 opacity:0→1 back.out(2)
      if (pillRef.current) {
        gsap.fromTo(
          pillRef.current,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.7,
            ease: "back.out(2)",
            scrollTrigger: { trigger: headline, start: "top 70%", once: true },
          }
        );
      }

      // 5. SVG paths draw on scroll
      [path2Ref.current].forEach((path) => {
        if (!path) return;
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1.5,
          },
        });
      });

      // 4. Image cards: entrance + parallax
      imageRefs.current.forEach((card, i) => {
        if (!card) return;

        // Entrance
        gsap.fromTo(
          card,
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              once: true,
            },
          }
        );

        // Independent parallax
        gsap.to(card, {
          y: -(30 + i * 15),
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2 + i * 0.1,
          },
        });
      });
    })();
  }, []);

  // ── Hover pill slide ──────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const { default: gsap } = await import("gsap");
      if (!hoverPillRef.current) return;
      gsap.to(hoverPillRef.current, {
        top: hovered ? "0" : "9vw",
        duration: 0.4,
        ease: hovered ? "back.out(1.4)" : "power3.in",
      });
    })();
  }, [hovered]);

  const words = [
    "16", "years", "making", "users", "click", "and", "scroll", "my", "designs",
  ];

  return (
    <section
      data-nav="grey"
      ref={sectionRef}
      className="w-screen relative z-[5] grid grid-cols-2"
      style={{ background: "var(--bg-warm)" }}
    >
      {/* ── Two growing SVG lines ── */}
      <svg
        className="absolute top-0 left-0 w-full h-full overflow-visible z-0 pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 1000 2000"
      >
        <path
          ref={path2Ref}
          d="M 920 0 C 780 150, 980 320, 820 500 C 660 680, 900 820, 740 1020 C 580 1220, 860 1380, 680 1560 C 500 1740, 820 1860, 900 2000"
          fill="none"
          stroke="var(--blue)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* ══════════════════════════════════════════════
          LEFT STICKY COLUMN
      ══════════════════════════════════════════════ */}
      <div className="sticky top-0 h-screen flex flex-col justify-center z-[1] box-border pt-[6vw] pr-[4vw] pb-[6vw] pl-[6vw] gap-[3vw]">
        {/* ── Label row ── */}
        <div className="flex items-center gap-4">
          <div
            ref={lineRef}
            className="w-12 flex-shrink-0 h-[2px] [transform-origin:left_center] scale-x-0"
            style={{ background: "var(--lime, #c8f135)" }}
          />
          <span
            className="whitespace-nowrap uppercase text-[0.7rem] font-bold tracking-[0.16em]"
            style={{ fontFamily: "var(--font)", color: "var(--grey)" }}
          >
            About the Studio
          </span>
        </div>

        {/* ── Headline ── */}
        <h2
          ref={headlineRef}
          className="m-0 font-extrabold leading-[130%] tracking-[-0.03em]"
          style={{
            fontSize: "clamp(1.8rem, 4vw, 4.5rem)",
            color: "var(--blue)",
            fontFamily: "var(--font)",
          }}
        >
          {words.map((word, i) => (
            <span
              key={i}
              ref={(r) => (wordsRef.current[i] = r)}
              className="inline-block mr-[0.18em]"
            >
              {word === "click" ? (
                <span
                  ref={pillRef}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  className="inline-flex items-center justify-center relative overflow-hidden cursor-pointer align-baseline rounded-[100vw] px-[0.45em] py-[0.05em] [transition:transform_0.3s_cubic-bezier(0.165,0.84,0.44,1)]"
                  style={{
                    background: "var(--orange1)",
                    transform: hovered ? "scale(0.93)" : "scale(1)",
                  }}
                >
                  {/* "click" slides up and fades out */}
                  <span
                    className="block [transition:opacity_0.25s,transform_0.3s_cubic-bezier(0.165,0.84,0.44,1)]"
                    style={{
                      color: "var(--blue)",
                      opacity: hovered ? 0 : 1,
                      transform: hovered ? "translateY(-60%)" : "translateY(0)",
                    }}
                  >
                    click
                  </span>
                  {/* "let's go" slides up from below */}
                  <span
                    className="absolute inset-0 flex items-center justify-center whitespace-nowrap rounded-[100vw] text-[0.8em] [transition:transform_0.3s_cubic-bezier(0.165,0.84,0.44,1)]"
                    style={{
                      background: "var(--blue)",
                      color: "var(--orange1)",
                      transform: hovered ? "translateY(0)" : "translateY(110%)",
                    }}
                  >
                    let&apos;s go
                  </span>
                </span>
              ) : (
                <span style={{ color: word === "scroll" ? "var(--orange1)" : "var(--blue)" }}>
                  {word}
                </span>
              )}
            </span>
          ))}
        </h2>

        {/* ── Stats 2×2 grid ── */}
        <div
          className="grid grid-cols-2 overflow-hidden rounded-[0.6vw] mt-[1vw] gap-[2px]"
          style={{ background: "var(--bg-grey)" }}
        >
          {STATS.map((s, i) => (
            <div
              key={i}
              className="flex flex-col gap-[0.4rem]"
              style={{
                background: "var(--bg-warm)",
                padding: "clamp(1.2rem, 2.5vw, 2.5rem) clamp(1rem, 2vw, 2rem)",
              }}
            >
              {/* Big number */}
              <div
                className="font-extrabold leading-none tracking-[-0.03em]"
                style={{
                  fontFamily: "var(--font)",
                  fontSize: "clamp(2rem, 4.5vw, 5rem)",
                  color: "var(--blue)",
                }}
              >
                <CountUp target={s.value} suffix={s.suffix} delay={i * 200} />
              </div>
              {/* Label */}
              <p
                className="m-0 uppercase text-[0.8rem] font-medium tracking-[0.04em]"
                style={{ fontFamily: "var(--font)", color: "var(--grey)" }}
              >
                {s.label}
              </p>
              {/* Lime accent bar */}
              <div
                className="w-8 rounded-sm h-[2px] mt-[0.3rem]"
                style={{ background: "var(--lime, #c8f135)" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          RIGHT SCROLLING COLUMN
      ══════════════════════════════════════════════ */}
      <div className="flex flex-col relative z-[1] box-border gap-[3vw] pt-[10vw] pr-[5vw] pb-[10vw] pl-[4vw]">
        {RIGHT_IMAGES.map((img, i) => {
          const isEvery3rd = (i + 1) % 3 === 0;
          const rotation   = i % 2 === 0 ? "0.6deg" : "-0.6deg";
          const aspect     = i % 2 === 0 ? "4/3" : "16/9";

          return (
            <div
              key={i}
              ref={(r) => (imageRefs.current[i] = r)}
              className="overflow-hidden will-change-transform rounded-[0.8vw]"
              style={{
                aspectRatio: aspect,
                transform: `rotate(${rotation})`,
                boxShadow: isEvery3rd
                  ? "0 12px 48px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1)"
                  : "0 6px 24px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.06)",
                border: isEvery3rd
                  ? "3px solid var(--orange1)"
                  : "1px solid rgba(0,0,0,0.07)",
                opacity: 0, // GSAP animates in
              }}
            >
              <img
                src={img.src}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover block"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
