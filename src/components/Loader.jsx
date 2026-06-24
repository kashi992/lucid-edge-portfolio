import { useEffect, useRef } from "react";

export default function Loader({ onComplete }) {
  const containerRef = useRef(null);
  const lineRef      = useRef(null);
  const nameRef      = useRef(null);

  useEffect(() => {
    let tl;
    (async () => {
      const { gsap } = await import("gsap");

      // Brief pause so user sees the centered text, then animate
      tl = gsap.timeline({ delay: 0.6, onComplete });

      tl.to(lineRef.current, {
        width: "100%", height: "100%",
        duration: 0.85, ease: "power3.inOut",
      })
      .to(nameRef.current, {
        opacity: 0, duration: 0.25, ease: "power2.in",
      }, "-=0.3")
      .to({}, { duration: 0.2 })
      .to(containerRef.current, {
        y: "-100vh", duration: 0.8, ease: "power3.inOut",
      });
    })();
    return () => tl?.kill();
  }, [onComplete]);

  return (
    <div ref={containerRef} className="container-loader">
      <div className="orange-intro">
        <div ref={nameRef} className="cont-juan-intro">
          <span className="nav-name-jm" style={{ color: "#D4FF00" }}>LUCID</span>
          <div className="dot-jm" style={{ backgroundColor: "#D4FF00" }} />
          <span className="nav-name-jm" style={{ color: "#D4FF00" }}>EDGE</span>
        </div>
      </div>
      <div ref={lineRef} className="grow-line" />
    </div>
  );
}
