import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const CAROUSEL_IMAGES = [
  "/images/PORTAL_HR_SOUTH_v03.jpg",
  "/images/PORTAL_HR_SOUTH2_v02.jpg",
  "/images/DUSK-SHOT-HR_v02.webp",
  "/images/Hoteo_v02.webp",
  "/images/PORTAL_HR_NORTH_v02.webp",
  "/images/Te_Hana View_v001.webp",
  "/images/Warkworth_v02.webp",
  "/images/Wellsford_v02.webp",
];

export default function Hero({ visible }) {
  const sectionRef   = useRef(null);
  const photoRef     = useRef(null);
  const trackRef     = useRef(null);
  const lottieRef    = useRef(null);
  const animRef      = useRef(null);
  const currentSlide = useRef(0);
  const intervalRef  = useRef(null);
  const isAnimating  = useRef(false);

  const tgtProgress      = useRef(0.5);
  const curProgress      = useRef(0.5);
  const rafRef           = useRef(null);
  const visibilityRef    = useRef(null);

  useEffect(() => {
    if (!visible) return;

    (async () => {
      const { gsap }          = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const lottie            = (await import("lottie-web")).default;
      gsap.registerPlugin(ScrollTrigger);

      gsap.from(".hero-top-label",    { opacity: 0, y: 14, duration: 0.8, delay: 0.2,  ease: "power2.out" });
      gsap.from(".hero-bottom-label", { opacity: 0, y: 10, duration: 0.7, delay: 0.45, ease: "power2.out" });

      // Decode all carousel images fully before starting — eliminates first-slide stutter
      await Promise.all(
        CAROUSEL_IMAGES.map((src) => {
          const img = new Image();
          img.src = src;
          return img.decode().catch(() => {});
        })
      );

      // Carousel — infinite one-direction loop using clone-first-slide trick
      // Track has N real slides + 1 clone of slide[0] at the end.
      // When we land on the clone (index N), we instantly snap back to real index 0.
      const slideWidth = sectionRef.current.offsetWidth;
      const total      = CAROUSEL_IMAGES.length; // real slides count

      const advanceSlide = () => {
        if (isAnimating.current) return;
        isAnimating.current = true;

        const next = currentSlide.current + 1; // always go forward, never wrap with %

        gsap.to(trackRef.current, {
          x: -(next * slideWidth),
          duration: 1.4,
          ease: "power2.inOut",
          force3D: true,
          onComplete: () => {
            if (next === total) {
              // We just slid to the clone — instantly snap back to real slide 0
              gsap.set(trackRef.current, { x: 0 });
              currentSlide.current = 0;
            } else {
              currentSlide.current = next;
            }
            isAnimating.current = false;
          },
        });
      };

      // Pause carousel when tab is hidden, resume when visible
      visibilityRef.current = () => {
        if (document.hidden) {
          clearInterval(intervalRef.current);
        } else {
          clearInterval(intervalRef.current);
          intervalRef.current = setInterval(advanceSlide, 5000);
        }
      };
      document.addEventListener("visibilitychange", visibilityRef.current);

      intervalRef.current = setInterval(advanceSlide, 5000);

      gsap.to(photoRef.current, {
        y: "-18%", ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
      });

      // Load Lottie with autoplay:false — we scrub it with mouse X
      const anim = lottie.loadAnimation({
        container: lottieRef.current,
        renderer:  "svg",
        loop:      false,
        autoplay:  false,
        path:      "/documents/lucid-edge-mouse.json",
        rendererSettings: {
          preserveAspectRatio: "xMidYMid meet",
          progressiveLoad: true,
        },
      });
      animRef.current = anim;
    })();

    // RAF — IX2 exponential smoothing matching webflow.js (smoothness = 50ms)
    let lastTime = performance.now();
    const tick = () => {
      const now = performance.now();
      const dt  = now - lastTime;
      lastTime  = now;

      const t = 1 - Math.exp(-dt / 150);
      curProgress.current += (tgtProgress.current - curProgress.current) * t;

      const anim = animRef.current;
      if (anim && anim.isLoaded) {
        anim.goToAndStop(curProgress.current * anim.totalFrames, true);
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const onMove = (e) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      tgtProgress.current = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    };
    const onLeave = () => { tgtProgress.current = 0.5; };

    const el = sectionRef.current;
    el.addEventListener("mousemove",  onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mousemove",  onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (visibilityRef.current) document.removeEventListener("visibilitychange", visibilityRef.current);
      cancelAnimationFrame(rafRef.current);
      if (animRef.current) { animRef.current.destroy(); animRef.current = null; }
      clearInterval(intervalRef.current);
    };
  }, [visible]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-nav="peach"
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "var(--blue)" }}
    >
      {/* Background carousel with parallax */}
      <div ref={photoRef} className="absolute top-0 left-0 w-full z-[1] h-[120%] overflow-hidden">
        {/* Single sliding track */}
        <div
          ref={trackRef}
          className="absolute top-0 left-0 h-full flex"
          style={{ width: `${(CAROUSEL_IMAGES.length + 1) * 100}vw`, willChange: "transform", transform: "translateZ(0)" }}
        >
          {/* Real slides + clone of first slide at the end for seamless infinite loop */}
          {[...CAROUSEL_IMAGES, CAROUSEL_IMAGES[0]].map((src, i) => (
            <div
              key={i}
              className="relative h-full flex-shrink-0 overflow-hidden"
              style={{ width: "100vw", willChange: "transform", transform: "translateZ(0)" }}
            >
              <img
                src={src}
                alt=""
                className="absolute inset-0 w-full h-full"
                style={{ objectFit: "cover", objectPosition: "50% 30%", pointerEvents: "none", display: "block" }}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Base dark overlay */}
      <div className="absolute inset-0 z-[2]" style={{ background: "#0d1f2d", opacity: 0.15 }} />
      {/* Bottom-to-top gradient for text legibility */}
      <div className="absolute inset-0 z-[2]" style={{ background: "linear-gradient(to top, rgba(13,31,45,0.5) 0%, rgba(13,31,45,0.1) 40%, transparent 100%)" }} />
      {/* Top fade for navbar legibility */}
      <div className="absolute inset-0 z-[2]" style={{ background: "linear-gradient(to bottom, rgba(13,31,45,0.2) 0%, transparent 25%)" }} />

      {/* ── Desktop layout: column (top label / bottom lottie+subtitle) ── */}
      {/* ── Mobile layout:  row   (left heading / right subtitle)       ── */}
      <div className="relative z-[3] w-full h-full flex flex-row xl:items-center justify-center md:flex-col md:justify-center p-[4vw]">

        {/* Top label — left on mobile, top on desktop */}
        <div className="hero-top-label w-[50%] md:w-auto flex flex-col items-center" style={{ marginTop: "0", gap: "1rem", maxWidth: "55vw" }}>
          <h1 className="xl:m-0 md:mt-[18vh] font-semibold leading-[115%] text-center" style={{ fontSize: "clamp(0.9rem, 2.4vw, 2rem)", color: "var(--orange1)", fontFamily: "var(--font)" }}>
            Bringing Projects to Life.<br />From Bid to Delivery.
          </h1>
          <p className="my-0 text-center font-normal leading-[150%] max-w-[600px] w-full mx-auto" style={{ fontSize: "clamp(0.7rem, 1.1vw, 1rem)", color: "var(--orange1)", fontFamily: "var(--font)", opacity: 0.8 }}>
            A world-class animation and film studio partnering with project teams to win major projects, communicate complexity and deliver with confidence.
          </p>
        </div>

        {/* Bottom — right on mobile (no Lottie), bottom on desktop (with Lottie) */}
        {/* <div className="hero-bottom-label flex flex-col items-end justify-center w-[35%] md:w-full">

          <div className="hidden md:block w-full" style={{ height: "12.16vw" }}>
            <div
              ref={lottieRef}
              className="w-full h-full [&_svg]:overflow-visible"
              style={{ pointerEvents: "none" }}
            />
          </div>

          <p className="md:m-[1vw] text-end font-semibold leading-[110%]" style={{ fontSize: "clamp(0.75rem, 3.5vw, 2.5rem)", color: "var(--orange1)", fontFamily: "var(--font)" }}>
            Co-Founder &amp; Creative Director
          </p>
        </div> */}

      </div>

      {/* Bottom-left — featured project tag */}
      <div className="absolute bottom-[2vw] left-[4vw] z-[4] hidden md:block">
        <p className="nav-social-link text-base is-peach" style={{ margin: 0, fontFamily: "var(--font)", letterSpacing: "0.03em", cursor: "default", backdropFilter: "none" }}>
          Project: Northland Corridor PPP. for more{" "}
          <Link
            to="/work"
            style={{ textDecoration: "underline", textUnderlineOffset: "3px", color: "inherit" }}
          >
            click here
          </Link>
        </p>
      </div>
    </section>
  );
}
