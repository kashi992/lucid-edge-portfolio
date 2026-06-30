import { useEffect, useRef } from "react";

const TICKER_ITEMS = [
  "3D Animation", "Film Production", "Creative Direction", "Visual Effects",
  "TimeLapse", "Motion Graphics", "Arch Viz", "Corporate Video",
];

const BENEFITS_LIST = [
  "We bring 18+ years of multi-award-winning animation and film production experience.",
  "We specialise in helping construction teams win major project bids with compelling visuals.",
  "We create captivating narratives that engage stakeholders and deliver results.",
  "We deliver the highest quality animation, design, and film production on every project.",
];

/* ── split text into .sw word spans ─────────────────────────────────────── */
function Words({ text, style, className }) {
  return (
    <span className={className} style={style}>
      {text.split(" ").map((word, i, arr) => (
        <span key={i} className="sw inline-block">
          {word}{i < arr.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}

/* ── CTA button ─────────────────────────────────────────────────────────── */
function LearnMoreBtn() {
  const firstRef = useRef(null);
  const lastRef  = useRef(null);
  const g        = useRef(null);

  useEffect(() => {
    (async () => {
      const { default: gsap } = await import("gsap");
      g.current = gsap;
      gsap.set(firstRef.current, { width: 0, rotation: -90, opacity: 0 });
    })();
  }, []);

  const onEnter = () => {
    if (!g.current) return;
    g.current.to(firstRef.current, { width: "2.8rem", rotation: 0, opacity: 1, duration: 0.8, ease: "elastic.out(0.5,0.3)", overwrite: true });
    g.current.to(lastRef.current,  { width: 0, rotation: -90, opacity: 0, duration: 0.2, ease: "power2.out", overwrite: true });
  };
  const onLeave = () => {
    if (!g.current) return;
    g.current.to(firstRef.current, { width: 0, rotation: -90, opacity: 0, duration: 0.3, ease: "power2.inOut", overwrite: true });
    g.current.to(lastRef.current,  { width: "2.8rem", rotation: 0, opacity: 1, duration: 0.8, ease: "elastic.out(0.6,0.3)", overwrite: true });
  };

  return (
    <a
      href="/about"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="no-underline inline-flex items-center justify-center cursor-pointer gap-2"
      style={{ color: "var(--bg-warm)" }}
    >
      <div
        ref={firstRef}
        className="inline-flex items-center justify-center shrink-0 relative overflow-hidden h-[2.8rem] rounded-[5rem]"
        style={{ width: 0, background: "var(--orange1)" }}
      >
        <img src="/images/arrow-grey.svg" alt="" className="h-[0.8rem] absolute" />
      </div>
      <div
        className="rounded-[5rem] px-6 py-4 text-[0.9rem] font-semibold leading-none whitespace-nowrap"
        style={{
          background: "var(--bg-warm)",
          fontFamily: "var(--font)",
          color: "var(--blue)",
        }}
      >
        Learn more about me
      </div>
      <div
        ref={lastRef}
        className="inline-flex items-center justify-center shrink-0 relative overflow-hidden w-[2.8rem] h-[2.8rem] rounded-[5rem]"
        style={{ background: "var(--orange1)" }}
      >
        <img src="/images/arrow-grey.svg" alt="" className="h-[0.8rem] absolute" />
      </div>
    </a>
  );
}

/* ── Main ───────────────────────────────────────────────────────────────── */
export default function BenefitsSection() {
  const outerRef        = useRef(null);
  const wrapperRef      = useRef(null);
  const step1SpacerRef  = useRef(null);
  const step2SpacerRef  = useRef(null);

  const h1LeftWrapRef   = useRef(null);
  const h1RightWrapRef  = useRef(null);
  const lineRef         = useRef(null);
  const taglineRef      = useRef(null);

  const step2HdrRef     = useRef(null);
  const listRef         = useRef(null);
  const ctaRef          = useRef(null);

  const darkImgRef      = useRef(null);
  const lightImgRef     = useRef(null);

  const tickerRef       = useRef(null);

  useEffect(() => {
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      /* ─ Ticker ─ */
      gsap.fromTo(tickerRef.current,
        { x: 0 },
        { x: "-50%", duration: 24, repeat: -1, ease: "none" }
      );

      /* ─ Collect step1 word spans ─ */
      const leftWords    = h1LeftWrapRef.current  ? [...h1LeftWrapRef.current.querySelectorAll(".sw")]  : [];
      const rightWords   = h1RightWrapRef.current ? [...h1RightWrapRef.current.querySelectorAll(".sw")] : [];
      const taglineWords = taglineRef.current     ? [...taglineRef.current.querySelectorAll(".sw")]     : [];

      /* ─ Collect step2 word spans ─ */
      const hdrWords   = step2HdrRef.current ? [...step2HdrRef.current.querySelectorAll(".sw")]     : [];
      const listItems  = listRef.current     ? [...listRef.current.querySelectorAll("li")]          : [];
      const listWords  = listRef.current     ? [...listRef.current.querySelectorAll(".sw")]         : [];
      const checkIcons = listRef.current     ? [...listRef.current.querySelectorAll(".check-icon")] : [];

      /* ─ Initial states ─ */
      gsap.set([...hdrWords, ...listWords, ...checkIcons], { opacity: 0 });
      gsap.set(ctaRef.current, { opacity: 0, y: 16 });
      gsap.set(lightImgRef.current, { opacity: 0 });

      /* ══ TIMELINE 2 — scrub entrance animations ══ */
      const tl2 = gsap.timeline({ paused: true });

      tl2
        .fromTo(h1LeftWrapRef.current,
          { x: "18%" },
          { x: "-22%", ease: "none", duration: 9.97 },
          0
        )
        .fromTo(h1RightWrapRef.current,
          { x: "-33%" },
          { x: "0%", ease: "none", duration: 9.97 },
          0
        )
        .fromTo(lineRef.current,
          { width: "0%" },
          { width: "100%", ease: "power2.out", duration: 5.43 },
          6.57
        )
        .fromTo(taglineWords,
          { opacity: 0 },
          { opacity: 1, ease: "none", duration: 1.05, stagger: { each: 0.3, from: "start" } },
          8.81
        );

      ScrollTrigger.create({
        trigger: outerRef.current,
        start: "top 71%",
        end: "top -40%",
        scrub: 0.76,
        animation: tl2,
      });

      /* ══ TIMELINE 1 — scrub step1 exit + light photo enter ══ */
      const step1ExitTargets = [
        ...leftWords,
        ...rightWords,
        ...taglineWords,
        lineRef.current,
      ].filter(Boolean);

      const tl1 = gsap.timeline({ paused: true });

      tl1
        .fromTo(step1ExitTargets,
          { opacity: 1 },
          { opacity: 0, ease: "power1.inOut", duration: 0.2,
            stagger: { amount: 0.8, from: "start" } },
          0
        )
        .fromTo(lightImgRef.current,
          { opacity: 0 },
          { opacity: 1, ease: "power1.inOut", duration: 0.83 },
          0.17
        );

      ScrollTrigger.create({
        trigger: step1SpacerRef.current,
        start: "top bottom",
        end: "bottom bottom",
        scrub: 0.76,
        animation: tl1,
      });

      /* ══ TIMELINE 3 — scrub step2 enter ══ */
      const tl3 = gsap.timeline({ paused: true });

      // Header words first
      tl3.fromTo(
        hdrWords,
        { opacity: 0 },
        { opacity: 1, ease: "none", duration: 0.2, stagger: { each: 0.2, from: "start" } },
        0
      );

      // Per list item: tick icon → its words
      listItems.forEach((li) => {
        const icon  = li.querySelector(".check-icon");
        const words = [...li.querySelectorAll(".sw")];
        if (icon)        tl3.fromTo(icon,  { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.2 }, ">");
        if (words.length) tl3.fromTo(words, { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.2, stagger: { each: 0.15, from: "start" } }, ">");
      });

      tl3.fromTo(
        ctaRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.5 },
        ">"
      );

      ScrollTrigger.create({
        trigger: step2SpacerRef.current,
        start: "top 125%",
        end: "bottom 110%",
        scrub: 0.8,
        animation: tl3,
      });

    })();
  }, []);

  const TICKER_ALL = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <section
      data-nav="peach"
      className="relative"
      style={{ background: "var(--bg-warm)" }}
    >

      {/* ══════════════════════════════════════════ TICKER */}
      <div
        className="w-screen overflow-hidden py-[0.85rem]"
        style={{
          borderTop:    "1px solid rgba(105,105,90,0.1)",
          borderBottom: "1px solid rgba(105,105,90,0.1)",
        }}
      >
        <div
          ref={tickerRef}
          className="flex items-center whitespace-nowrap will-change-transform w-[200%]"
        >
          {TICKER_ALL.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center shrink-0 uppercase font-semibold tracking-[0.12em] px-[1.4rem]"
              style={{
                fontFamily: "var(--font)",
                fontSize: "clamp(0.6rem, 0.82vw, 0.78rem)",
                color: "var(--grey)",
              }}
            >
              {item}
              <span className="ml-[1.4rem] font-black" style={{ color: "var(--orange1)" }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════ BENEFITS MAIN WRAPPER */}
      <div ref={outerRef}>

        {/* ── sticky 100vh container ── */}
        <div
          ref={wrapperRef}
          className="sticky top-0 w-screen h-screen overflow-hidden"
          style={{ background: "var(--bg-warm)" }}
        >

          {/* dark-jm-img — full bleed background */}
          <img
            ref={darkImgRef}
            src="/images/home-about-jm-1.jpg"
            loading="lazy"
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
            style={{ objectPosition: "center 20%" }}
          />

          {/* light-jm-img — full bleed, fades in on top */}
          <img
            ref={lightImgRef}
            src="/images/home-about-jm-3.jpg"
            loading="lazy"
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none z-[1]"
            style={{ objectPosition: "center 20%", opacity: 0 }}
          />

          {/* ── step1 — text overlaid on dark photo ── */}
          <div className="absolute inset-0 flex flex-col xl:justify-end z-[2] px-[6vw] pb-[8vw] xl:pt-0 pt-[8vw]">

            <div ref={h1LeftWrapRef} className="will-change-transform">
              <h2
                className="m-0 font-black tracking-[-0.04em] leading-[88%] xl:text-[150px] text-[110px]"
                style={{
                  fontFamily: "var(--font)",
                  color: "var(--bg-warm)",
                }}
              >
                <Words text="Good design" />
              </h2>
            </div>

            <div ref={h1RightWrapRef} className="will-change-transform flex justify-end">
              <h2
                className="m-0 font-black tracking-[-0.04em] leading-[88%] xl:text-[150px] text-[110px]"
                style={{
                  fontFamily: "var(--font)",
                  color: "var(--orange1)",
                }}
              >
                <Words text="takes time." />
              </h2>
            </div>

            {/* line.step1 — GSAP animates width, keep inline */}
            <div
              ref={lineRef}
              className="h-[1px]"
              style={{
                background: "rgba(255,255,255,0.25)",
                margin: "3vw 0 2vw",
                width: "0%",
              }}
            />

            <h2
              ref={taglineRef}
              className="m-0 font-semibold tracking-[-0.02em] leading-[115%]"
              style={{
                fontFamily: "var(--font)",
                fontSize: "clamp(1rem, 2vw, 2.5rem)",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              <Words text="and working with me saves it" />
            </h2>
          </div>

          {/* ── step2 — no overlay, all dark text ── */}
          <div className="absolute inset-0 flex flex-col justify-center z-[3]" style={{ padding: "0 8vw" }}>

            <div ref={step2HdrRef} className="md:max-w-[50vw]">
              <h2
                className="m-0 mb-[0.25em] font-semibold tracking-[-0.01em] leading-[130%]"
                style={{
                  fontFamily: "var(--font)",
                  fontSize: "clamp(0.85rem, 1.5vw, 1.7rem)",
                  color: "var(--bg-warm)",
                }}
              >
                <Words text="Companies partner with me because of my" />
              </h2>
              <h2
                className="m-0 font-black tracking-[-0.04em] leading-[88%]"
                style={{
                  fontFamily: "var(--font)",
                  fontSize: "clamp(2rem, 4.6vw, 6rem)",
                  color: "var(--white)",
                }}
              >
                <Words text="perspective + sharp instincts" />
              </h2>
            </div>

            {/* line-step2 */}
            <div
              className="w-full h-[1px] opacity-[0.12] md:max-w-[50vw]"
              style={{
                background: "var(--bg-warm)",
                margin: "3vw 0 2.5vw",
              }}
            />

            {/* list-benefits */}
            <ul
              ref={listRef}
              className="list-none p-0 m-0 flex flex-col md:max-w-[50vw]"
            >
              {BENEFITS_LIST.map((item, i) => (
                <li key={i}>
                  <div className="flex items-start gap-4" style={{ padding: "1vw 0" }}>
                    <img
                      src="/images/check-mark-icon.svg"
                      loading="lazy"
                      alt=""
                      className="check-icon w-4 h-4 shrink-0 mt-[0.2em]"
                      style={{ opacity: 0 }}
                    />
                    <h3
                      className="m-0 font-semibold leading-[155%]"
                      style={{
                        fontFamily: "var(--font)",
                        fontSize: "clamp(0.8rem, 1vw, 1rem)",
                        color: "var(--bg-warm)",
                      }}
                    >
                      <Words text={item} />
                    </h3>
                  </div>
                  <div className="w-full h-[1px] opacity-[0.15]" style={{ background: "var(--grey)" }} />
                </li>
              ))}
            </ul>

            <div ref={ctaRef} style={{ marginTop: "2.5vw" }}>
              <LearnMoreBtn />
            </div>
          </div>

        </div>{/* end wrapperRef (sticky) */}

        {/* ── benefits-height-1step ── */}
        <div ref={step1SpacerRef} className="benefits-step1 h-[250vh]" />

        {/* ── benefits-height-2step ── */}
        <div ref={step2SpacerRef} className="h-[250vh]" />

      </div>{/* end outerRef */}
    </section>
  );
}
