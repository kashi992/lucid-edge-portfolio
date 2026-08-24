import { useRef, useEffect, useState } from "react";
import { TOOLS, SOCIALS } from "../data/services";


const isIOS = () =>
  typeof navigator !== "undefined" && /iP(hone|ad|od)/.test(navigator.userAgent);

export default function Footer() {
  const [ios] = useState(isIOS);
  const footerRef = useRef(null);
  const videoRef = useRef(null);
  const logoRef = useRef(null);
  const toolsLabelRef = useRef(null);
  const socialsLabelRef = useRef(null);
  const toolsDividerRef = useRef(null);
  const socialsDividerRef = useRef(null);
  const toolsRef = useRef([]);
  const socialsRef = useRef([]);
  const bottomLeftRef = useRef(null);
  const bottomRightRef = useRef(null);
  const gsapRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      gsapRef.current = gsap;

      /* ── initial states ── */
      gsap.set(videoRef.current, { scale: 1.06, opacity: 0 });
      gsap.set(logoRef.current, { scale: 0.85, opacity: 0, y: 20 });
      gsap.set(toolsLabelRef.current, { opacity: 0, y: 10 });
      gsap.set(socialsLabelRef.current, { opacity: 0, y: 10 });
      gsap.set(toolsDividerRef.current, { scaleX: 0, transformOrigin: "right center" });
      gsap.set(socialsDividerRef.current, { scaleX: 0, transformOrigin: "right center" });
      gsap.set(toolsRef.current, { opacity: 0, yPercent: 60 });
      gsap.set(socialsRef.current, { opacity: 0, yPercent: 60 });
      gsap.set(bottomLeftRef.current, { opacity: 0, y: 14 });
      gsap.set(bottomRightRef.current, { opacity: 0, y: 14 });

      /* ── entrance timeline ── */
      const tl = gsap.timeline({
        scrollTrigger: { trigger: footerRef.current, start: "top 85%", once: true },
      });

      tl
        /* video breathes in */
        .to(videoRef.current, {
          scale: 1, opacity: 1, duration: 1.4, ease: "power2.out",
        })
        /* logo fades up */
        .to(logoRef.current, {
          scale: 1, opacity: 1, y: 0,
          duration: 0.9, ease: "power3.out",
        }, "-=1.0")
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


      /* ── video slow zoom-out on scroll ── */
      gsap.to(videoRef.current, {
        scale: 1.08, ease: "none",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom", end: "bottom top", scrub: true,
        },
      });

      /* ── logo: continuous float after entry ── */
      let floatTween;
      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          floatTween = gsap.to(logoRef.current, {
            y: -14, duration: 2.2, ease: "sine.inOut",
            repeat: -1, yoyo: true,
          });
        },
      });

      /* ── logo: mouse parallax — follows cursor within footer ── */
      const footer = footerRef.current;
      const logo   = logoRef.current;
      const onMouseMove = (e) => {
        const rect   = footer.getBoundingClientRect();
        const cx     = rect.left + rect.width  / 2;
        const cy     = rect.top  + rect.height / 2;
        const dx     = (e.clientX - cx) / rect.width;   // -0.5 → 0.5
        const dy     = (e.clientY - cy) / rect.height;  // -0.5 → 0.5
        gsap.to(logo, {
          x: dx * 28, y: dy * 18,
          duration: 0.8, ease: "power2.out", overwrite: "auto",
        });
      };
      const onMouseLeave = () => {
        gsap.to(logo, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.5)", overwrite: "auto" });
        // restart float
        if (floatTween) floatTween.restart();
      };
      footer.addEventListener("mousemove",  onMouseMove);
      footer.addEventListener("mouseleave", onMouseLeave);

      /* ── logo: hover scale + glow ── */
      logo.addEventListener("mouseenter", () => {
        gsap.to(logo, { scale: 1.06, filter: "brightness(1.2)", duration: 0.35, ease: "power2.out", overwrite: "auto" });
      });
      logo.addEventListener("mouseleave", () => {
        gsap.to(logo, { scale: 1, filter: "brightness(1)", duration: 0.5, ease: "elastic.out(1, 0.5)", overwrite: "auto" });
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
    })();
  }, []);

  return (
    <footer
      ref={footerRef}
      data-nav="peach"
      className="relative w-screen h-screen flex justify-center items-center overflow-hidden z-[4]"
    >
      {/* Background video */}
      <div
        ref={videoRef}
        className="absolute inset-0 z-10 pointer-events-none w-screen h-screen overflow-hidden flex justify-center items-center"
        style={{ willChange: "transform" }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{ position: "absolute", top: "50%", left: "50%", width: "100vw", minHeight: "100%", transform: "translate(-50%, -50%)", objectFit: "cover" }}
        >
          <source src="https://lucid-edge-assets.s3.ap-southeast-2.amazonaws.com/showreel.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)" }} />
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-end items-center w-[90vw] md:w-[92vw] h-full pb-[22vw] md:pb-[4vw]">

        {/* Top row */}
        {/* <div className="grid grid-cols-2 gap-4 pt-[55vh] md:pt-0 mb-0 md:mb-[4vw] w-full">
          <div className="flex flex-col gap-8 md:gap-10">
            <div
              ref={socialsDividerRef}
              className="w-full h-[1px] mb-2 md:block hidden"
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
                    className="block no-underline cursor-pointer font-semibold leading-[100%] text-start text-[2.5vw] md:text-[0.8rem]"
                    style={{ color: "var(--orange1)", fontFamily: "var(--font)", opacity: 0.65 }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-8 md:gap-10">
            <div
              ref={toolsDividerRef}
              className="w-full h-[1px] mb-2 md:block hidden"
              style={{ background: "var(--orange1)", opacity: 0.25 }}
            />
            <p
              ref={toolsLabelRef}
              className="m-0 text-[0.8rem] font-normal leading-[100%] text-end"
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


        </div> */}

        {/* Site logo — large, centered */}
        <div className="hidden md:flex justify-center items-center mb-[0.5vw] w-[85vw]">
          <img
            ref={logoRef}
            src="/images/LE_logotype_lime.png"
            loading="lazy"
            alt="Lucid Edge"
            className="block object-contain cursor-pointer"
            style={{ width: "55vw", willChange: "transform" }}
          />
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom-bar flex justify-between items-center w-full">
          <h3
            ref={bottomLeftRef}
            className="hidden md:block m-0 text-[1.2rem] font-semibold leading-[100%]"
            style={{ color: "var(--orange1)", fontFamily: "var(--font)" }}
          >
            Animation &amp; Film Production &nbsp;<span className="opacity-50">2026</span>
          </h3>
          <div ref={bottomRightRef} className="hidden md:flex flex-col items-end gap-1">
            <h3
              className="m-0 text-[1.2rem] font-semibold leading-[100%]"
              style={{ color: "var(--orange1)", fontFamily: "var(--font)" }}
            >
              Suite 5.3, 2-4 Hill St, Surry Hills &nbsp;<span className="opacity-50">Sydney NSW 2010</span>
            </h3>
            <p
              className="m-0 text-[0.85rem] font-normal leading-[100%] opacity-60"
              style={{ color: "var(--orange1)", fontFamily: "var(--font)" }}
            >
              +61 (0)414 088 037
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
