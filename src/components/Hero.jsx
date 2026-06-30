import { useEffect, useRef } from "react";

export default function Hero({ visible }) {
  const sectionRef = useRef(null);
  const photoRef   = useRef(null);
  const lottieRef  = useRef(null);
  const animRef    = useRef(null);

  const tgtProgress = useRef(0.5);
  const curProgress = useRef(0.5);
  const rafRef      = useRef(null);

  useEffect(() => {
    if (!visible) return;

    (async () => {
      const { gsap }          = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const lottie            = (await import("lottie-web")).default;
      gsap.registerPlugin(ScrollTrigger);

      gsap.from(".hero-top-label",    { opacity: 0, y: 14, duration: 0.8, delay: 0.2,  ease: "power2.out" });
      gsap.from(".hero-bottom-label", { opacity: 0, y: 10, duration: 0.7, delay: 0.45, ease: "power2.out" });

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
      cancelAnimationFrame(rafRef.current);
      if (animRef.current) { animRef.current.destroy(); animRef.current = null; }
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
      {/* Background photo with parallax */}
      <div
        ref={photoRef}
        className="absolute top-0 left-0 w-full z-[1] h-[120%] bg-cover"
        style={{ backgroundImage: `url('/images/hero-photo-test2.jpg')`, backgroundPosition: "50% 30%" }}
      />
      <div className="absolute inset-0 z-[2]" style={{ opacity: 0.82, backgroundImage: "linear-gradient(5deg, transparent 81%, #000)" }} />
      <div className="absolute inset-0 z-[2]" style={{ opacity: 0.56, backgroundImage: "linear-gradient(190deg, transparent 54%, #000)" }} />

      {/* ── Desktop layout: column (top label / bottom lottie+subtitle) ── */}
      {/* ── Mobile layout:  row   (left heading / right subtitle)       ── */}
      <div className="relative z-[3] w-full h-full flex flex-row xl:items-center justify-between md:flex-col md:justify-between p-[4vw]">

        {/* Top label — left on mobile, top on desktop */}
        <div className="hero-top-label w-[50%] md:w-auto" style={{ marginTop: "0", paddingTop: "clamp(0px, 7vw, 7vw)" }}>
          <h1 className="xl:m-0 md:mt-[18vh] font-semibold leading-[110%]" style={{ fontSize: "clamp(1rem, 3.5vw, 2.5rem)", color: "var(--orange1)", fontFamily: "var(--font)" }}>
            Animation &amp; Film<br />Production Studio
          </h1>
        </div>

        {/* Bottom — right on mobile (no Lottie), bottom on desktop (with Lottie) */}
        <div className="hero-bottom-label flex flex-col items-end justify-center w-[35%] md:w-full">

          {/* Lottie — hidden on mobile */}
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
        </div>

      </div>
    </section>
  );
}
