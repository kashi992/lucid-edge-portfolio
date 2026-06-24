import { useEffect, useRef, useState } from "react";

/* ── Floating shapes ─────────────────────────────────────────────────────── */
const SHAPES = [
  { src: "/images/big-circle-scroll1.png",  w: "55vw", top: "35vw", left: "-18vw", zIndex: 42, py: -80 },
  { src: "/images/big-pill-scroll1.png",    w: "30vw", top: "30vw", left: "28%",   zIndex: 41, py: -60 },
  { src: "/images/big-hexagon-scroll1.png", w: "32vw", top: "28vw", right: "-4vw", zIndex: 44, py: -70 },
  { src: "/images/big-circle-scroll2.png",  w: "60vw", top: "60vw", left: "20%",   zIndex: 43, py: -50 },
  { src: "/images/big-circle-scroll3.png",  w: "22vw", top: "80vw", right: "2vw",  zIndex: 49, py: -40 },
  { src: "/images/big-square-scroll1.png",  w: "22vw", top: "88vw", left: "2vw",   zIndex: 49, py: -30 },
  { src: "/images/blue-circle-scroll.svg",  w: "4vw",  top: "52vw", left: "48vw",  zIndex: 50, py: -20 },
  { src: "/images/blue-pill-scroll.svg",    w: "6vw",  top: "38vw", right: "28vw", zIndex: 50, py: -35 },
  { src: "/images/blue-hexagon-scroll.svg", w: "3vw",  top: "75vw", right: "25vw", zIndex: 50, py: -25 },
];

const WORDS = ["16", "years", "making", "users", "click", "and", "scroll", "my", "designs"];

export default function StatsSection() {
  const sectionRef  = useRef(null);
  const headlineRef = useRef(null);
  const headingInnerRef = useRef(null);
  const wordsRef    = useRef([]);
  const pillRef     = useRef(null);
  const shapeRefs   = useRef([]);
  const line1Ref    = useRef(null);
  const line2Ref    = useRef(null);

  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      /* ── Words stagger entrance ── */
      const words = wordsRef.current.filter(Boolean);
      if (words.length) {
        gsap.fromTo(words,
          { y: 80, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.75, stagger: 0.065, ease: "power4.out",
            scrollTrigger: { trigger: headlineRef.current, start: "top 75%", once: true },
          }
        );
      }

      /* ── Click pill pop-in ── */
      if (pillRef.current) {
        gsap.fromTo(pillRef.current,
          { scale: 0, opacity: 0 },
          {
            scale: 1, opacity: 1, duration: 0.7, ease: "back.out(2)",
            scrollTrigger: { trigger: headlineRef.current, start: "top 70%", once: true },
          }
        );
      }

      /* ── Title scroll animation — drifts left + fades gently as shapes take over ── */
      if (headingInnerRef.current) {
        gsap.to(headingInnerRef.current, {
          x: "-6vw",
          opacity: 0.25,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "70% top",
            scrub: 1.2,
          },
        });
      }

      /* ── Lines draw on scroll — dark blue, contrast against warm shapes ── */
      [line1Ref.current, line2Ref.current].forEach((path) => {
        if (!path) return;
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 30%",
            scrub: 1.5,
          },
        });
      });

      /* ── Shapes: entrance + parallax ── */
      shapeRefs.current.forEach((shape, i) => {
        if (!shape) return;

        gsap.fromTo(shape,
          { opacity: 0, y: 60 },
          {
            opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
            delay: i * 0.07,
            scrollTrigger: { trigger: sectionRef.current, start: "top 60%", once: true },
          }
        );

        gsap.to(shape, {
          y: SHAPES[i].py,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      });
    })();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-nav="grey"
      className="w-screen relative"
      style={{ background: "var(--bg-warm)" }}
    >
      <div
        className="relative overflow-hidden flex flex-col items-center"
        style={{ height: "117vw", paddingTop: "13vw" }}
      >

        {/* ── Scroll-drawn lines — --blue so they contrast warmly against the peach shapes ── */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          preserveAspectRatio="none"
          viewBox="0 0 1000 2000"
          style={{ zIndex: 47 }}
        >
          <path
            ref={line1Ref}
            d="M 820 300 C 850 400, 780 520, 820 650 C 860 780, 720 880, 680 1020 C 640 1160, 750 1280, 680 1420 C 610 1560, 700 1700, 740 2000"
            fill="none"
            stroke="var(--blue)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.35"
          />
          <path
            ref={line2Ref}
            d="M 870 300 C 910 420, 830 540, 880 680 C 930 820, 780 920, 740 1060 C 700 1200, 810 1320, 740 1460 C 670 1600, 760 1740, 800 2000"
            fill="none"
            stroke="var(--blue)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.35"
          />
        </svg>

        {/* ── Floating shapes ── */}
        {SHAPES.map((shape, i) => (
          <img
            key={i}
            ref={el => shapeRefs.current[i] = el}
            src={shape.src}
            alt=""
            loading="lazy"
            className="absolute pointer-events-none will-change-transform"
            style={{
              width: shape.w,
              top: shape.top,
              left: shape.left,
              right: shape.right,
              zIndex: shape.zIndex,
              opacity: 0,
            }}
          />
        ))}

        {/* ── Sticky heading wrapper ── */}
        <div
          className="sticky top-0 mb-[10vw]"
          style={{ width: "65%", zIndex: 55 }}
        >
          {/* Inner div is what GSAP animates (drift + fade on scroll) */}
          <div ref={headingInnerRef} className="will-change-transform">
            <h2
              ref={headlineRef}
              className="m-0 font-semibold"
              style={{
                fontSize: "7.82vw",
                letterSpacing: "-0.35vw",
                lineHeight: "105%",
                color: "var(--grey)",
                fontFamily: "var(--font)",
              }}
            >
              {WORDS.map((word, i) => (
                <span
                  key={i}
                  ref={r => wordsRef.current[i] = r}
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
                        transform: hovered ? "scale(0.95)" : "scale(1)",
                      }}
                    >
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
                      <span
                        className="absolute inset-0 flex items-center justify-center whitespace-nowrap rounded-[100vw] text-[0.45em] font-semibold [transition:transform_0.3s_cubic-bezier(0.165,0.84,0.44,1)]"
                        style={{
                          background: "var(--blue)",
                          color: "var(--orange1)",
                          transform: hovered ? "translateY(0)" : "translateY(110%)",
                        }}
                      >
                       Let's go
                      </span>
                    </span>
                  ) : (
                    <span style={{ color: word === "scroll" ? "var(--blue)" : "var(--grey)" }}>
                      {word}
                    </span>
                  )}
                </span>
              ))}
            </h2>
          </div>
        </div>

      </div>
    </section>
  );
}
