import { useRef, useEffect } from "react";

export default function CTAButton({ href, label = "Learn more", target }) {
  const firstRef = useRef(null);
  const lastRef  = useRef(null);
  const gsapRef  = useRef(null);

  useEffect(() => {
    (async () => {
      const { default: gsap } = await import("gsap");
      gsapRef.current = gsap;
      gsap.set(firstRef.current, { width: 0, rotation: -90, opacity: 0 });
    })();
  }, []);

  const onEnter = () => {
    const g = gsapRef.current; if (!g) return;
    g.to(firstRef.current, { width: "2.8rem", rotation: 0, opacity: 1, duration: 0.8, ease: "elastic.out(0.5,0.3)", overwrite: true });
    g.to(lastRef.current,  { width: 0, rotation: -90, opacity: 0, duration: 0.2, ease: "power2.out", overwrite: true });
  };
  const onLeave = () => {
    const g = gsapRef.current; if (!g) return;
    g.to(firstRef.current, { width: 0, rotation: -90, opacity: 0, duration: 0.3, ease: "power2.inOut", overwrite: true });
    g.to(lastRef.current,  { width: "2.8rem", rotation: 0, opacity: 1, duration: 0.8, ease: "elastic.out(0.6,0.3)", overwrite: true });
  };

  return (
    <a
      href={href}
      target={target || (href?.startsWith("http") ? "_blank" : undefined)}
      rel="noreferrer"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="no-underline inline-flex items-center justify-center cursor-pointer"
      style={{ color: "var(--orange1)" }}
    >
      {/* first icon — hidden, appears on hover */}
      <div
        ref={firstRef}
        className="inline-flex items-center justify-center shrink-0 relative overflow-hidden"
        style={{ width: 0, height: "2.8rem", borderRadius: "5rem", background: "var(--orange1)" }}
      >
        <img src="/images/arrow-grey-out.svg" alt="" style={{ height: "0.8rem", position: "absolute" }} />
      </div>

      {/* text pill */}
      <div
        className="shrink-0"
        style={{
          background: "var(--orange1)",
          borderRadius: "5rem",
          padding: "1rem 1.5rem",
          fontFamily: "var(--font)",
          fontSize: "0.9rem",
          fontWeight: 600,
          lineHeight: "100%",
          color: "var(--blue)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>

      {/* last icon — visible by default */}
      <div
        ref={lastRef}
        className="inline-flex items-center justify-center shrink-0 relative overflow-hidden"
        style={{ width: "2.8rem", height: "2.8rem", borderRadius: "5rem", background: "var(--orange1)" }}
      >
        <img src="/images/arrow-grey-out.svg" alt="" style={{ height: "0.8rem", position: "absolute" }} />
      </div>
    </a>
  );
}
