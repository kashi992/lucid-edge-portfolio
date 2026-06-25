import { useEffect, useRef, useState } from "react";

/*
  Shape animation values taken directly from reference site Webflow IX2 data.
  scroll range: "top bottom" → "bottom top", scrub: 0.8
  All translateY values are in vw units (converted to px at runtime).
  Rotation makes the animation feel "playful" — key detail missing before.
*/
const SHAPES = [
  // pill-scroll — moves DOWN + rotates (opposite direction to others)
  { src: "/images/big-pill-scroll1.png",    w: "22vw", top: "30vw", left: "28%",   zIndex: 41, fromY: -5,   toY: 20,   fromR: 30,   toR: 0   },
  // circle-left-scroll — rotation ONLY, no Y
  { src: "/images/big-circle-scroll1.png",  w: "40vw", top: "35vw", left: "-18vw", zIndex: 42, fromY: 0,    toY: 0,    fromR: -160, toR: 60  },
  // hex-scroll — rotation only
  { src: "/images/big-hexagon-scroll1.png", w: "24vw", top: "28vw", right: "-4vw", zIndex: 44, fromY: 0,    toY: 0,    fromR: 0,    toR: 60  },
  // circle-center-scroll — rotation only
  { src: "/images/big-circle-scroll2.png",  w: "44vw", top: "60vw", left: "20%",   zIndex: 43, fromY: 0,    toY: 0,    fromR: -160, toR: 60  },
  // circle-plus-scroll — moves UP + rotates
  { src: "/images/big-circle-scroll3.png",  w: "16vw", top: "80vw", right: "2vw",  zIndex: 49, fromY: 10,   toY: -10,  fromR: 0,    toR: 80  },
  // square-scroll — big upward swing + unspins from 70deg
  { src: "/images/big-square-scroll1.png",  w: "16vw", top: "88vw", left: "2vw",   zIndex: 49, fromY: 10,   toY: -20,  fromR: 70,   toR: 0   },
  // blue-circle — moves up + big rotation
  { src: "/images/blue-circle-scroll.svg",  w: "4vw",  top: "52vw", left: "48vw",  zIndex: 50, fromY: 0,    toY: -10,  fromR: -160, toR: 60  },
  // blue-pill — moves up + big rotation
  { src: "/images/blue-pill-scroll.svg",    w: "6vw",  top: "38vw", right: "28vw", zIndex: 50, fromY: 0,    toY: -10,  fromR: -160, toR: 60  },
  // blue-hex — moves up + big rotation
  { src: "/images/blue-hexagon-scroll.svg", w: "3vw",  top: "75vw", right: "25vw", zIndex: 50, fromY: 0,    toY: -10,  fromR: -160, toR: 60  },
];

const WORDS = ["16", "years", "making", "users", "click", "and", "scroll", "my", "designs"];

export default function StatsSection() {
  const sectionRef       = useRef(null);
  const headlineRef      = useRef(null);
  const headingInnerRef  = useRef(null);
  const wordsRef         = useRef([]);
  const pillRef          = useRef(null);
  const shapeRefs        = useRef([]);
  const line1Ref         = useRef(null);
  const line2Ref         = useRef(null);

  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      // vw → px helper (evaluated at setup time)
      const vw = (val) => (val / 100) * window.innerWidth;

      /* ── Set initial states (opacity only — fromTo owns y + rotation) ── */
      shapeRefs.current.forEach((shape) => {
        if (!shape) return;
        gsap.set(shape, { opacity: 0 });
      });

      /* ── Words entrance ── */
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

      /* ── Title drifts left + fades as shapes take over ── */
      if (headingInnerRef.current) {
        gsap.to(headingInnerRef.current, {
          x: "-6vw", opacity: 0.25, ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "70% top",
            scrub: 1.2,
          },
        });
      }

      /* ── Shapes: opacity entrance ── */
      shapeRefs.current.forEach((shape, i) => {
        if (!shape) return;
        gsap.to(shape, {
          opacity: 1, duration: 1.2, ease: "power3.out", delay: i * 0.07,
          scrollTrigger: { trigger: sectionRef.current, start: "top 60%", once: true },
        });
      });

      /* ── Shapes: scroll-driven Y + rotation — exact reference IX2 values ── */
      shapeRefs.current.forEach((shape, i) => {
        if (!shape) return;
        const s = SHAPES[i];
        gsap.fromTo(shape,
          { y: vw(s.fromY), rotation: s.fromR },
          {
            y: vw(s.toY), rotation: s.toR,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      /* ── Scroll-drawn lines ── */
      [line1Ref.current, line2Ref.current].forEach((path) => {
        if (!path) return;
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, {
          strokeDashoffset: 0, ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 30%",
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
        className="stats-height relative overflow-hidden flex flex-col items-center"
        style={{ height: "117vw", paddingTop: "13vw" }}
      >

        {/* ── Scroll-drawn lines ── */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          preserveAspectRatio="none"
          viewBox="0 0 1000 2000"
          style={{ zIndex: 47 }}
        >
          <path
            ref={line1Ref}
            d="M 820 300 C 850 400, 780 520, 820 650 C 860 780, 720 880, 680 1020 C 640 1160, 750 1280, 680 1420 C 610 1560, 700 1700, 740 2000"
            fill="none" stroke="var(--blue)" strokeWidth="10"
            strokeLinecap="round" strokeLinejoin="round" opacity="0.35"
          />
          <path
            ref={line2Ref}
            d="M 870 300 C 910 420, 830 540, 880 680 C 930 820, 780 920, 740 1060 C 700 1200, 810 1320, 740 1460 C 670 1600, 760 1740, 800 2000"
            fill="none" stroke="var(--blue)" strokeWidth="10"
            strokeLinecap="round" strokeLinejoin="round" opacity="0.35"
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
            }}
          />
        ))}

        {/* ── Sticky heading ── */}
        <div className="stats-sticky sticky top-0 mb-[10vw]" style={{ width: "65%", zIndex: 55 }}>
          <div ref={headingInnerRef} className="will-change-transform">
            <h2
              ref={headlineRef}
              className="stats-heading m-0 font-semibold"
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
                        Let&apos;s go
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
