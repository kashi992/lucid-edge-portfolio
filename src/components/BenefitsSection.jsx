import { useEffect, useRef, useState } from "react";
import { BENEFITS, IMAGES } from "../data/services";

function Counter({ target, suffix }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true; obs.disconnect();
        const dur = 1600, t0 = performance.now();
        const tick = now => {
          const p = Math.min((now - t0) / dur, 1);
          setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
          if (p < 1) requestAnimationFrame(tick);
          else setVal(target);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

const STATS = [
  { value: 16,  suffix: "+", label: "Years of craft"      },
  { value: 120, suffix: "+", label: "Projects shipped"    },
  { value: 40,  suffix: "+", label: "Brands elevated"     },
  { value: 98,  suffix: "%", label: "Client satisfaction" },
];

export default function BenefitsSection() {
  const sectionRef  = useRef(null);
  const phase1Ref   = useRef(null);
  const phase2Ref   = useRef(null);
  const h1Ref       = useRef(null);
  const h2Ref       = useRef(null);
  const panel1Ref     = useRef(null);
  const panel2Ref     = useRef(null);
  const panel3Ref     = useRef(null);
  const benefitRefs   = useRef([]);
  const titleRefs     = useRef([]);

  useEffect(() => {
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      gsap.set(h1Ref.current, { xPercent: -115 });
      gsap.to(h1Ref.current, {
        xPercent: 115, ease: "none",
        scrollTrigger: {
          trigger: phase1Ref.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.set(h2Ref.current, { xPercent: 115 });
      gsap.to(h2Ref.current, {
        xPercent: -115, ease: "none",
        scrollTrigger: {
          trigger: phase2Ref.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.fromTo(titleRefs.current.filter(Boolean),
        { yPercent: 110 },
        {
          yPercent: 0, duration: 1.0, ease: "power4.out", stagger: 0.12,
          scrollTrigger: { trigger: panel1Ref.current, start: "top 70%", once: true },
        }
      );

      gsap.fromTo(benefitRefs.current.filter(Boolean),
        { x: 60, opacity: 0 },
        {
          x: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: panel2Ref.current, start: "top 70%", once: true },
        }
      );

      gsap.fromTo(panel3Ref.current?.querySelectorAll(".stat-cell") ?? [],
        { y: 40, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 0.7, ease: "back.out(1.4)",
          scrollTrigger: { trigger: panel3Ref.current, start: "top 70%", once: true },
        }
      );
    })();
  }, []);

  return (
    <section
      data-nav="peach"
      ref={sectionRef}
      className="relative z-[5]"
    >

      {/* ══════════════════════════════════════════════
          STICKY FULL-BLEED PHOTO
      ══════════════════════════════════════════════ */}
      <div className="sticky top-0 w-screen h-screen overflow-hidden z-[1]">
        <img
          src={IMAGES.aboutDark}
          alt="" aria-hidden="true"
          className="w-full h-full object-cover object-top block"
        />
        <div className="absolute inset-0 pointer-events-none bg-[rgba(0,0,0,0.5)]" />

        {/* Studio badge */}
        <div className="absolute z-[2] top-[4vh] left-[5vw]">
          <p
            className="m-0 uppercase text-[0.62rem] font-bold tracking-[0.2em] text-[rgba(255,255,255,0.35)]"
            style={{ fontFamily: "var(--font)" }}
          >
            Lucid Edge · Est. 2008
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          SCROLLING LAYER — pulled over the photo
      ══════════════════════════════════════════════ */}
      <div className="relative z-[2] -mt-[100vh]">

        {/* ── PHASE 1 (300vh) ── */}
        <div ref={phase1Ref} className="h-[300vh]">
          <div className="sticky top-0 h-screen">
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
              <div
                ref={h1Ref}
                className="absolute inset-0 flex items-center will-change-transform whitespace-nowrap pl-[4vw] font-black leading-[1] tracking-[-0.05em] text-white"
                style={{ fontSize: "clamp(4rem, 13vw, 17rem)", fontFamily: "var(--font)" }}
              >
                Good design
              </div>
            </div>
          </div>
        </div>

        {/* ── PHASE 2 (300vh) ── */}
        <div ref={phase2Ref} className="h-[300vh]">
          <div className="sticky top-0 h-screen">
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
              <div
                ref={h2Ref}
                className="absolute inset-0 flex items-center justify-end will-change-transform whitespace-nowrap pr-[4vw] font-black leading-[1] tracking-[-0.05em]"
                style={{
                  fontSize: "clamp(4rem, 13vw, 17rem)",
                  color: "var(--orange1)",
                  fontFamily: "var(--font)",
                }}
              >
                takes time.
              </div>
            </div>
          </div>
        </div>

        {/* ── GAP ── */}
        <div className="h-[40vh]" />

        {/* ── PANEL 1 ── */}
        <div
          ref={panel1Ref}
          className="min-h-screen flex flex-col justify-center backdrop-blur-[3px] rounded-[2vw_2vw_0_0] pt-[8vw] px-[8vw] pb-[7vw]"
          style={{
            background: "rgba(10,10,10,0.82)",
            WebkitBackdropFilter: "blur(3px)",
          }}
        >
          <span
            className="block uppercase text-[0.62rem] font-bold tracking-[0.2em] text-[rgba(255,255,255,0.2)] mb-[4vw]"
            style={{ fontFamily: "var(--font)" }}
          >
            01 — About the Studio
          </span>

          {["perspective", "+ sharp instincts"].map((line, i) => (
            <div key={i} className="overflow-hidden pb-[0.05em]">
              <div
                ref={r => (titleRefs.current[i] = r)}
                className="block font-black leading-[90%] tracking-[-0.04em]"
                style={{
                  fontFamily: "var(--font)",
                  fontSize: "clamp(3rem, 6.5vw, 8rem)",
                  color: i === 0 ? "var(--bg-warm)" : "var(--orange1)",
                }}
              >
                {line}
              </div>
            </div>
          ))}

          <p
            className="leading-[170%] mt-[4vw] max-w-[52ch]"
            style={{
              fontFamily: "var(--font)",
              fontSize: "clamp(0.9rem, 1.2vw, 1.1rem)",
              color: "rgba(255,255,255,0.4)",
              margin: "4vw 0 0",
            }}
          >
            Companies partner with me because of a unique combination of premium visual direction,
            sharp instincts, and meticulous craft — from concept through final delivery.
          </p>
        </div>

        {/* ── PANEL 2 ── */}
        <div
          ref={panel2Ref}
          className="min-h-screen flex flex-col justify-center backdrop-blur-[3px] py-[7vw] px-[8vw]"
          style={{
            background: "rgba(6,6,6,0.85)",
            WebkitBackdropFilter: "blur(3px)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span
            className="block uppercase text-[0.62rem] font-bold tracking-[0.2em] text-[rgba(255,255,255,0.2)] mb-[4vw]"
            style={{ fontFamily: "var(--font)" }}
          >
            02 — Why partner with us
          </span>

          <h2
            className="font-black tracking-[-0.03em] leading-[92%] mb-[5vw] mt-0"
            style={{
              fontFamily: "var(--font)",
              fontSize: "clamp(2.2rem, 4.5vw, 5.5rem)",
              color: "var(--bg-warm)",
            }}
          >
            What I bring<br /><span style={{ color: "var(--orange1)" }}>to the table</span>
          </h2>

          {BENEFITS.map((item, i) => (
            <div
              key={i}
              ref={r => (benefitRefs.current[i] = r)}
              className="flex items-start opacity-0 gap-8 py-[2vw]"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0 rounded-full w-9 h-9"
                style={{ border: "1.5px solid var(--orange1)" }}
              >
                <span
                  className="text-[0.6rem] font-extrabold"
                  style={{ fontFamily: "var(--font)", color: "var(--orange1)" }}
                >
                  0{i + 1}
                </span>
              </div>
              <p
                className="m-0 leading-[158%]"
                style={{
                  fontFamily: "var(--font)",
                  fontSize: "clamp(0.88rem, 1.1vw, 1.05rem)",
                  color: "rgba(255,255,255,0.58)",
                }}
              >
                {item}
              </p>
            </div>
          ))}
        </div>

        {/* ── PANEL 3 ── */}
        <div
          ref={panel3Ref}
          className="min-h-screen flex flex-col justify-center backdrop-blur-[3px] pt-[7vw] px-[8vw] pb-[10vw]"
          style={{
            background: "rgba(10,10,10,0.88)",
            WebkitBackdropFilter: "blur(3px)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span
            className="block uppercase text-[0.62rem] font-bold tracking-[0.2em] text-[rgba(255,255,255,0.2)] mb-[4vw]"
            style={{ fontFamily: "var(--font)" }}
          >
            03 — By the numbers
          </span>

          <div
            className="grid grid-cols-2 overflow-hidden rounded-[1.2vw] mb-[6vw] gap-[2px]"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            {STATS.map((s, i) => (
              <div key={i} className="stat-cell py-[3.5vw] px-[3vw] bg-[#0d0d0d]">
                <div
                  className="leading-none font-black tracking-[-0.04em] mb-2"
                  style={{
                    fontFamily: "var(--font)",
                    fontSize: "clamp(2.5rem, 5vw, 6rem)",
                    color: "var(--orange1)",
                  }}
                >
                  <Counter target={s.value} suffix={s.suffix} />
                </div>
                <p
                  className="uppercase text-[0.68rem] font-bold tracking-[0.14em] text-[rgba(255,255,255,0.28)] mb-4 mt-0"
                  style={{ fontFamily: "var(--font)" }}
                >
                  {s.label}
                </p>
                <div
                  className="rounded-sm w-[1.8rem] h-[2px]"
                  style={{ background: "var(--orange1)" }}
                />
              </div>
            ))}
          </div>

          <a
            href="#contact"
            className="inline-flex items-center self-start no-underline uppercase gap-4 text-[#0d0d0d] text-[0.8rem] font-extrabold tracking-[0.1em] rounded-[100vw] px-[2.6em] py-[1.1em] [transition:transform_0.2s,box-shadow_0.2s]"
            style={{
              background: "var(--orange1)",
              boxShadow: "0 0 60px rgba(212,255,0,0.18)",
              fontFamily: "var(--font)",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(0.96)"; e.currentTarget.style.boxShadow = "none"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 0 60px rgba(212,255,0,0.18)"; }}
          >
            Let&apos;s work together →
          </a>
        </div>

      </div>
    </section>
  );
}
