import { useRef, useEffect } from "react";
import { TOOLS, SOCIALS } from "../data/services";

export default function Footer() {
  const footerRef       = useRef(null);
  const videoRef        = useRef(null);
  const lucidRef        = useRef(null);
  const edgeRef         = useRef(null);
  const logoRef         = useRef(null);
  const toolsLabelRef   = useRef(null);
  const socialsLabelRef = useRef(null);
  const toolsDividerRef = useRef(null);
  const socialsDividerRef = useRef(null);
  const toolsRef        = useRef([]);
  const socialsRef      = useRef([]);
  const bottomLeftRef   = useRef(null);
  const bottomRightRef  = useRef(null);
  const gsapRef         = useRef(null);

  useEffect(() => {
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      gsapRef.current = gsap;

      /* ── initial states ── */
      gsap.set(videoRef.current,          { scale: 1.06, opacity: 0 });
      gsap.set(lucidRef.current,          { xPercent: -18, opacity: 0 });
      gsap.set(edgeRef.current,           { xPercent:  18, opacity: 0 });
      gsap.set(logoRef.current,           { scale: 0.5, opacity: 0, rotate: -30 });
      gsap.set(toolsLabelRef.current,     { opacity: 0, y: 10 });
      gsap.set(socialsLabelRef.current,   { opacity: 0, y: 10 });
      gsap.set(toolsDividerRef.current,   { scaleX: 0, transformOrigin: "right center" });
      gsap.set(socialsDividerRef.current, { scaleX: 0, transformOrigin: "right center" });
      gsap.set(toolsRef.current,          { opacity: 0, yPercent: 60 });
      gsap.set(socialsRef.current,        { opacity: 0, yPercent: 60 });
      gsap.set(bottomLeftRef.current,     { opacity: 0, y: 14 });
      gsap.set(bottomRightRef.current,    { opacity: 0, y: 14 });

      /* ── entrance timeline ── */
      const tl = gsap.timeline({
        scrollTrigger: { trigger: footerRef.current, start: "top 85%", once: true },
      });

      tl
        /* video breathes in */
        .to(videoRef.current, {
          scale: 1, opacity: 1, duration: 1.4, ease: "power2.out",
        })
        /* LUCID + EDGE slide from sides simultaneously */
        .to([lucidRef.current, edgeRef.current], {
          xPercent: 0, opacity: 1,
          duration: 1.1, ease: "power3.out", stagger: 0,
        }, "-=1.0")
        /* logo flips in */
        .to(logoRef.current, {
          scale: 1, opacity: 1, rotate: 0,
          duration: 0.75, ease: "back.out(2)",
        }, "-=0.7")
        /* divider lines sweep */
        .to([toolsDividerRef.current, socialsDividerRef.current], {
          scaleX: 1, duration: 0.55, ease: "power2.inOut", stagger: 0.08,
        }, "-=0.5")
        /* column labels fade up */
        .to([toolsLabelRef.current, socialsLabelRef.current], {
          opacity: 0.54, y: 0,
          duration: 0.5, ease: "power2.out", stagger: 0.08,
        }, "-=0.3")
        /* list items clip up from bottom */
        .to([...toolsRef.current, ...socialsRef.current], {
          opacity: 1, yPercent: 0,
          duration: 0.5, ease: "power3.out", stagger: 0.055,
        }, "-=0.35")
        /* bottom bar */
        .to([bottomLeftRef.current, bottomRightRef.current], {
          opacity: 1, y: 0,
          duration: 0.55, ease: "power3.out", stagger: 0.12,
        }, "-=0.2");

      /* ── LUCID drifts left, EDGE drifts right on scroll ── */
      gsap.to(lucidRef.current, {
        x: "-8vw", ease: "none",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom", end: "bottom top", scrub: 1.2,
        },
      });
      gsap.to(edgeRef.current, {
        x: "8vw", ease: "none",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom", end: "bottom top", scrub: 1.2,
        },
      });

      /* ── video slow zoom-out on scroll ── */
      gsap.to(videoRef.current, {
        scale: 1.08, ease: "none",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom", end: "bottom top", scrub: true,
        },
      });

      /* ── logo spins on scroll ── */
      gsap.to(logoRef.current, {
        rotate: 360, ease: "none",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom", end: "bottom top", scrub: 2,
        },
      });

      /* ── social links hover ── */
      socialsRef.current.forEach(el => {
        if (!el) return;
        el.addEventListener("mouseenter", () => {
          gsap.to(el, { x: -7, opacity: 1, duration: 0.25, ease: "power2.out", overwrite: true });
        });
        el.addEventListener("mouseleave", () => {
          gsap.to(el, { x: 0, opacity: 0.65, duration: 0.3, ease: "power2.inOut", overwrite: true });
        });
      });

      /* ── logo hover scale ── */
      const logo = logoRef.current;
      logo.addEventListener("mouseenter", () => {
        gsap.to(logo, { scale: 1.12, duration: 0.35, ease: "power2.out", overwrite: true });
      });
      logo.addEventListener("mouseleave", () => {
        gsap.to(logo, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)", overwrite: true });
      });
    })();
  }, []);

  return (
    <footer
      ref={footerRef}
      data-nav="peach"
      className="relative w-screen h-screen flex justify-center items-center overflow-hidden z-[4]"
    >
      {/* Background video */}
      <div className="absolute inset-0 z-10 pointer-events-none w-screen h-screen overflow-hidden flex justify-center items-center">
        <video
          ref={videoRef}
          className="object-cover w-full h-full"
          style={{ willChange: "transform" }}
          muted autoPlay loop playsInline
        >
          <source src="/videos-work/desk_jm3.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-end items-center w-[92vw] h-full pb-[4vw]">

        {/* Top row */}
        <div className="flex flex-row-reverse justify-between items-start w-full mb-[4vw] flex-wrap">

          {/* Tools column */}
          <div className="flex flex-col gap-10 justify-end items-end w-[30%]">
            {/* divider line */}
            <div
              ref={toolsDividerRef}
              className="w-full h-[1px] mb-2"
              style={{ background: "var(--orange1)", opacity: 0.25 }}
            />
            <p
              ref={toolsLabelRef}
              className="m-0 text-[0.8rem] font-normal leading-[100%]"
              style={{ color: "var(--orange1)", fontFamily: "var(--font)" }}
            >
              Website made using:
            </p>
            <ul className="list-none p-0 m-0">
              {TOOLS.map((t, i) => (
                <li key={t} className="mb-4 overflow-hidden">
                  <p
                    ref={el => toolsRef.current[i] = el}
                    className="m-0 text-[0.8rem] font-semibold leading-[100%] text-right"
                    style={{ color: "var(--orange1)", fontFamily: "var(--font)" }}
                  >
                    {t}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials column */}
          <div className="flex flex-col gap-10 justify-end items-end w-[30%]">
            <div
              ref={socialsDividerRef}
              className="w-full h-[1px] mb-2"
              style={{ background: "var(--orange1)", opacity: 0.25 }}
            />
            <p
              ref={socialsLabelRef}
              className="m-0 text-[0.8rem] font-normal leading-[100%]"
              style={{ color: "var(--orange1)", fontFamily: "var(--font)" }}
            >
              Contact:
            </p>
            <ul className="list-none p-0 m-0">
              {SOCIALS.map(({ label, href }, i) => (
                <li key={label} className="mb-4 overflow-hidden">
                  <a
                    ref={el => socialsRef.current[i] = el}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="block no-underline cursor-pointer text-[0.8rem] font-semibold leading-[100%] text-right"
                    style={{ color: "var(--orange1)", fontFamily: "var(--font)", opacity: 0.65 }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Giant name */}
        <div className="flex justify-center gap-5 items-center mb-[0.5vw] w-[85vw]">
          <h2
            ref={lucidRef}
            className="m-0 text-[15vw] font-semibold leading-[75%] tracking-[-0.7vw]"
            style={{ color: "var(--orange1)", fontFamily: "var(--font)", willChange: "transform" }}
          >
            LUCID
          </h2>
          <img
            ref={logoRef}
            src="/images/le-mark-lime.jpeg"
            loading="lazy"
            alt="LE"
            className="block rounded-full object-contain w-[8vw] h-[8vw] cursor-pointer flex-shrink-0"
            style={{ willChange: "transform" }}
          />
          <h2
            ref={edgeRef}
            className="m-0 text-right text-[15vw] font-semibold leading-[75%] tracking-[-0.7vw]"
            style={{ color: "var(--orange1)", fontFamily: "var(--font)", willChange: "transform" }}
          >
            EDGE
          </h2>
        </div>

        {/* Bottom bar */}
        <div className="flex justify-between items-center w-full">
          <h3
            ref={bottomLeftRef}
            className="m-0 text-[1.2rem] font-semibold leading-[100%]"
            style={{ color: "var(--orange1)", fontFamily: "var(--font)" }}
          >
            Brand &amp; Web Design Studio &nbsp;<span className="opacity-50">2026</span>
          </h3>
          <h3
            ref={bottomRightRef}
            className="m-0 text-[1.2rem] font-semibold leading-[100%]"
            style={{ color: "var(--orange1)", fontFamily: "var(--font)" }}
          >
            Lucid Edge Studio &nbsp;<span className="opacity-50">[Coming Soon]</span>
          </h3>
        </div>
      </div>
    </footer>
  );
}
