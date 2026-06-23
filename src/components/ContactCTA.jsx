import { useRef, useEffect } from "react";

const HEADING_WORDS  = ["Let's", "build", "something", "people", "remember"];
const SUBTITLE_WORDS = ["from", "global", "tech", "companies", "to", "growing", "startups."];
const TALK_WORDS     = ["Let's", "talk"];
const EMAIL_CHARS    = "hello@lucidedge.co".split("");

export default function ContactCTA() {
  const wrapRef         = useRef(null);
  const fillRef         = useRef(null);
  const dividerRef      = useRef(null);
  const arrowRef        = useRef(null);
  const headingWordRefs = useRef([]);
  const subtitleWordRefs= useRef([]);
  const talkWordRefs    = useRef([]);
  const emailCharRefs   = useRef([]);
  const gsapRef         = useRef(null);

  useEffect(() => {
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      gsapRef.current = gsap;

      /* ── initial states ── */
      gsap.set(headingWordRefs.current,  { y: "110%", opacity: 0 });
      gsap.set(subtitleWordRefs.current, { y: "110%", opacity: 0 });
      gsap.set(talkWordRefs.current,     { y: 0, opacity: 1 });
      gsap.set(emailCharRefs.current,    { opacity: 0 });
      gsap.set(dividerRef.current,       { scaleX: 0, transformOrigin: "left center" });
      gsap.set(wrapRef.current,          { y: 80, opacity: 0 });

      /* ── scroll entrance ── */
      const tl = gsap.timeline({
        scrollTrigger: { trigger: wrapRef.current, start: "top 82%", once: true },
      });

      tl
        .to(wrapRef.current, {
          y: 0, opacity: 1,
          duration: 0.9, ease: "power3.out",
        })
        .to(headingWordRefs.current, {
          y: "0%", opacity: 1,
          duration: 0.75, ease: "power3.out",
          stagger: 0.08,
        }, "-=0.5")
        .to(dividerRef.current, {
          scaleX: 1,
          duration: 0.6, ease: "power2.inOut",
        }, "-=0.2")
        .to(subtitleWordRefs.current, {
          y: "0%", opacity: 1,
          duration: 0.6, ease: "power3.out",
          stagger: 0.06,
        }, "-=0.5")
        .to(arrowRef.current, {
          opacity: 1, x: 0,
          duration: 0.4, ease: "back.out(1.8)",
        }, "-=0.3");
    })();
  }, []);

  /* ── hover ── */
  const onEnter = () => {
    const gsap = gsapRef.current;
    if (!gsap) return;

    /* fill rises */
    gsap.to(fillRef.current, { height: "100%", duration: 0.5, ease: "power3.out", overwrite: true });

    /* "Let's talk" words slide up and out */
    gsap.to(talkWordRefs.current, {
      y: "-120%", opacity: 0,
      duration: 0.35, ease: "power2.in",
      stagger: 0.06, overwrite: true,
    });

    /* email letters stagger fade in */
    gsap.to(emailCharRefs.current, {
      opacity: 1,
      duration: 0.04,
      stagger: 0.03,
      ease: "none",
      delay: 0.15,
      overwrite: true,
    });

    /* arrow rotate */
    gsap.to(arrowRef.current, { rotate: 45, scale: 1.15, duration: 0.4, ease: "back.out(1.4)", overwrite: true });
  };

  const onLeave = () => {
    const gsap = gsapRef.current;
    if (!gsap) return;

    /* fill drops */
    gsap.to(fillRef.current, { height: "0%", duration: 0.5, ease: "power3.inOut", overwrite: true });

    /* "Let's talk" words return */
    gsap.to(talkWordRefs.current, {
      y: "0%", opacity: 1,
      duration: 0.45, ease: "power3.out",
      stagger: 0.06, overwrite: true,
    });

    /* email letters fade out */
    gsap.to(emailCharRefs.current, {
      opacity: 0,
      duration: 0.03,
      stagger: { each: 0.02, from: "end" },
      ease: "none",
      overwrite: true,
    });

    /* arrow reset */
    gsap.to(arrowRef.current, { rotate: 0, scale: 1, duration: 0.4, ease: "power2.out", overwrite: true });
  };

  return (
    <section
      data-nav="grey"
      className="w-screen flex flex-col justify-start items-center relative z-[5]"
      style={{ background: "var(--bg-cold)" }}
    >
      <div
        ref={wrapRef}
        className="w-[92vw] rounded-[5vw] overflow-hidden mt-[5vw] mb-[5vw] relative"
        style={{ border: "1px solid rgba(220,255,0,0.18)", background: "var(--blue)" }}
      >
        {/* Text block */}
        <div
          className="flex flex-col justify-center items-start w-full relative gap-[1.5vw]"
          style={{ padding: "9vw 5vw" }}
        >
          {/* heading — word split */}
          <h2
            className="relative w-[60%] m-0 z-[3] text-[6vw] leading-[115%] tracking-[-0.3vw] overflow-hidden"
            style={{ color: "var(--bg-warm)", fontFamily: "var(--font)" }}
            aria-label="Let's build something people remember"
          >
            {HEADING_WORDS.map((word, i) => (
              <span
                key={i}
                ref={el => headingWordRefs.current[i] = el}
                aria-hidden="true"
                style={{ position: "relative", display: "inline-block" }}
              >
                {word}{i < HEADING_WORDS.length - 1 ? "\u00A0" : ""}
              </span>
            ))}
          </h2>

          {/* subtitle — word split */}
          <p
            className="m-0 text-[1.5vw] font-semibold leading-[160%] tracking-[0.03rem] overflow-hidden"
            style={{ color: "rgba(239,239,239,0.5)", fontFamily: "var(--font)" }}
            aria-label="from global tech companies to growing startups."
          >
            {SUBTITLE_WORDS.map((word, i) => (
              <span
                key={i}
                ref={el => subtitleWordRefs.current[i] = el}
                aria-hidden="true"
                style={{ position: "relative", display: "inline-block" }}
              >
                {word}{i < SUBTITLE_WORDS.length - 1 ? "\u00A0" : ""}
              </span>
            ))}
          </p>
        </div>

        {/* animated divider */}
        <div
          ref={dividerRef}
          className="w-full h-[1px]"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />

        {/* CTA button */}
        <a
          href="mailto:hello@lucidedge.co?subject=Hey%20Lucid%20Edge!"
          data-copy-email="hello@lucidedge.co"
          data-cursor-skip
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          className="flex flex-row items-center w-full relative overflow-hidden no-underline cursor-pointer h-[14vw] pl-[5vw] pr-[5vw] gap-[4vw]"
          style={{ background: "var(--orange1)" }}
        >
          {/* fill */}
          <div
            ref={fillRef}
            className="absolute pointer-events-none z-[6] w-full h-[0%] bottom-0 left-0"
            style={{ background: "var(--grey)" }}
          />

          {/* arrow */}
          <div className="z-[6] flex justify-center rounded-full items-center relative w-[6vw] h-[6vw] flex-shrink-0" style={{ background: "var(--orange1)" }}>
            <img
              ref={arrowRef}
              src="/images/arrow-grey.svg"
              alt=""
              className="w-[2.5vw] min-w-[20px]"
              style={{ transformOrigin: "center center" }}
            />
          </div>

          {/* "Let's talk" — word split, slides out on hover */}
          <h2
            className="relative m-0 z-[5] text-[6vw] leading-[93%] tracking-[-0.3vw] flex-1 flex justify-center gap-[1.5vw] overflow-hidden"
            style={{ color: "var(--blue)", fontFamily: "var(--font)" }}
            aria-label="Let's talk"
          >
            {TALK_WORDS.map((word, i) => (
              <span key={i} className="overflow-hidden inline-block" style={{ verticalAlign: "bottom" }}>
                <span
                  ref={el => talkWordRefs.current[i] = el}
                  aria-hidden="true"
                  className="inline-block"
                >
                  {word}
                </span>
              </span>
            ))}
          </h2>

          {/* email — letter split, fades in on hover */}
          <h2
            className="absolute m-0 z-[7] text-[6vw] leading-[93%] tracking-[-0.3vw]"
            style={{
              color: "var(--orange1)",
              fontFamily: "var(--font)",
              left: "50%",
              transform: "translateX(-50%)",
              whiteSpace: "nowrap",
            }}
            aria-label="hello@lucidedge.co"
          >
            <span className="inline-block">
              {EMAIL_CHARS.map((ch, i) => (
                <span
                  key={i}
                  ref={el => emailCharRefs.current[i] = el}
                  aria-hidden="true"
                  className="inline-block"
                  style={{ opacity: 0 }}
                >
                  {ch}
                </span>
              ))}
            </span>
          </h2>
        </a>
      </div>
    </section>
  );
}
