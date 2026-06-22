import { useEffect } from "react";

export function useLenis() {
  useEffect(() => {
    let lenis;
    (async () => {
      try {
        const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
          import("@studio-freight/lenis"),
          import("gsap"),
          import("gsap/ScrollTrigger").then(m => ({ ScrollTrigger: m.ScrollTrigger })),
        ]);
        gsap.registerPlugin(ScrollTrigger);
        lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((t) => lenis.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
        window.__lenis = lenis;
      } catch (e) {
        console.warn("Lenis/GSAP init failed:", e);
      }
    })();
    return () => { lenis?.destroy(); window.__lenis = null; };
  }, []);
}
